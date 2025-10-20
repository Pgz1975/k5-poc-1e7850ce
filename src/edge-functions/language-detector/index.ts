/**
 * Language Detector Edge Function
 * Detects Spanish/English with Puerto Rican dialect support
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

interface LanguageDetectionRequest {
  documentId: string;
}

interface DetectionResult {
  language: 'spanish' | 'english';
  confidence: number;
  dialect?: string;
}

// Puerto Rican Spanish indicators
const PR_SPANISH_MARKERS = [
  'boricua', 'chavo', 'guagua', 'gandola', 'china', 'mahones',
  'marquesina', 'tapón', 'zafacón', 'batey', 'jíbaro'
];

// Common Spanish words
const SPANISH_COMMON = [
  'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se',
  'no', 'haber', 'por', 'con', 'su', 'para', 'como', 'estar',
  'tener', 'le', 'lo', 'todo', 'pero', 'más', 'hacer', 'o',
  'poder', 'decir', 'este', 'ir', 'otro', 'ese', 'la', 'si',
  'me', 'ya', 'ver', 'porque', 'dar', 'cuando', 'él', 'muy',
  'sin', 'vez', 'mucho', 'saber', 'qué', 'sobre', 'mi', 'alguno',
  'mismo', 'yo', 'también', 'hasta', 'año', 'dos', 'querer', 'entre'
];

// Common English words
const ENGLISH_COMMON = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have',
  'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you',
  'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we',
  'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all',
  'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if',
  'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make',
  'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take'
];

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { documentId } = await req.json() as LanguageDetectionRequest;

    // Get all text content for this document
    const { data: textBlocks, error: fetchError } = await supabase
      .from('pdf_text_content')
      .select('id, text_content, word_count')
      .eq('pdf_document_id', documentId)
      .order('page_number', { ascending: true })
      .order('section_order', { ascending: true });

    if (fetchError || !textBlocks || textBlocks.length === 0) {
      throw new Error('No text content found for document');
    }

    let spanishBlockCount = 0;
    let englishBlockCount = 0;
    const detectionResults: Map<string, DetectionResult> = new Map();

    // Detect language for each text block
    for (const block of textBlocks) {
      const result = detectLanguage(block.text_content);
      detectionResults.set(block.id, result);

      if (result.language === 'spanish') {
        spanishBlockCount++;
      } else {
        englishBlockCount++;
      }

      // Update text block with language info
      await supabase
        .from('pdf_text_content')
        .update({
          detected_language: result.language,
          language_confidence: result.confidence,
          dialect_variant: result.dialect,
        })
        .eq('id', block.id);
    }

    // Determine document-level primary language
    const totalBlocks = textBlocks.length;
    const spanishRatio = spanishBlockCount / totalBlocks;
    const englishRatio = englishBlockCount / totalBlocks;

    let primaryLanguage: 'spanish' | 'english' | 'bilingual';
    let overallConfidence: number;

    if (spanishRatio > 0.8) {
      primaryLanguage = 'spanish';
      overallConfidence = spanishRatio;
    } else if (englishRatio > 0.8) {
      primaryLanguage = 'english';
      overallConfidence = englishRatio;
    } else {
      primaryLanguage = 'bilingual';
      overallConfidence = Math.max(spanishRatio, englishRatio);
    }

    // Update document metadata
    await supabase
      .from('pdf_documents')
      .update({
        primary_language: primaryLanguage,
        language_detection_confidence: overallConfidence,
      })
      .eq('id', documentId);

    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        primaryLanguage,
        confidence: overallConfidence,
        blocksAnalyzed: totalBlocks,
        languageDistribution: {
          spanish: spanishBlockCount,
          english: englishBlockCount,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Language detection error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function detectLanguage(text: string): DetectionResult {
  const normalizedText = text.toLowerCase();
  const words = normalizedText.split(/\s+/).filter(w => w.length > 2);

  if (words.length < 3) {
    // Too short to detect reliably
    return {
      language: 'english',
      confidence: 0.5,
    };
  }

  // Count Puerto Rican Spanish markers
  const prMarkerCount = PR_SPANISH_MARKERS.filter(marker =>
    normalizedText.includes(marker)
  ).length;

  // Count Spanish common words
  const spanishCount = words.filter(word =>
    SPANISH_COMMON.includes(word)
  ).length;

  // Count English common words
  const englishCount = words.filter(word =>
    ENGLISH_COMMON.includes(word)
  ).length;

  // Character-based detection (Spanish has more accented characters)
  const accentedChars = (text.match(/[áéíóúñüÁÉÍÓÚÑÜ¿¡]/g) || []).length;
  const accentRatio = accentedChars / text.length;

  // Calculate scores
  const spanishScore = (spanishCount / words.length) + (accentRatio * 2) + (prMarkerCount * 0.5);
  const englishScore = englishCount / words.length;

  // Determine language
  if (spanishScore > englishScore) {
    return {
      language: 'spanish',
      confidence: Math.min(spanishScore / (spanishScore + englishScore), 0.99),
      dialect: prMarkerCount > 0 ? 'puerto_rican_spanish' : undefined,
    };
  } else {
    return {
      language: 'english',
      confidence: Math.min(englishScore / (spanishScore + englishScore), 0.99),
      dialect: 'standard_american_english',
    };
  }
}
