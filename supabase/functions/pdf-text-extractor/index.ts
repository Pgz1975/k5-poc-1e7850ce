import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { documentId, pdfBuffer } = await req.json();

    console.log('[Text Extractor] Processing document:', documentId);

    // Import PDF parsing library
    const pdfParse = (await import('https://esm.sh/pdf-parse@1.1.1')).default;

    // Parse PDF
    const data = await pdfParse(Buffer.from(pdfBuffer));
    
    console.log('[Text Extractor] Extracted', data.numpages, 'pages');

    // Process each page
    const textBlocks = [];
    const pages = data.text.split('\f'); // Form feed character separates pages

    for (let pageNum = 0; pageNum < pages.length; pageNum++) {
      const pageText = pages[pageNum].trim();
      if (!pageText) continue;

      // Split into paragraphs/blocks
      const blocks = pageText.split(/\n\n+/).filter(b => b.trim());

      for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
        const text = blocks[blockIndex].trim();
        if (!text) continue;

        // Detect language using simple heuristics
        const spanishIndicators = /\b(el|la|los|las|un|una|de|que|y|en|es|por|para|con|su|al|del)\b/gi;
        const englishIndicators = /\b(the|a|an|and|is|are|was|were|in|on|at|to|for|of|with)\b/gi;

        const spanishMatches = (text.match(spanishIndicators) || []).length;
        const englishMatches = (text.match(englishIndicators) || []).length;

        const detectedLanguage = spanishMatches > englishMatches ? 'es' : 'en';
        const confidence = Math.max(spanishMatches, englishMatches) / text.split(/\s+/).length;

        // Check for Puerto Rican dialect indicators
        const prIndicators = /\b(guagua|zafacón|mahones|chiringa|chavos|carro|nene|china)\b/gi;
        const isPuertoRican = prIndicators.test(text);

        textBlocks.push({
          document_id: documentId,
          page_number: pageNum + 1,
          block_index: blockIndex,
          text_content: text,
          text_length: text.length,
          detected_language: detectedLanguage,
          language_confidence: Math.min(confidence, 0.99),
          is_puerto_rican_dialect: isPuertoRican,
          word_count: text.split(/\s+/).length,
          reading_complexity: calculateReadingComplexity(text)
        });
      }
    }

    // Insert all text blocks
    if (textBlocks.length > 0) {
      const { error: insertError } = await supabase
        .from('pdf_text_content')
        .insert(textBlocks);

      if (insertError) {
        console.error('[Text Extractor] Insert error:', insertError);
        throw insertError;
      }
    }

    // Update document metadata
    const totalWords = textBlocks.reduce((sum, b) => sum + b.word_count, 0);
    const avgComplexity = textBlocks.reduce((sum, b) => sum + (b.reading_complexity || 0), 0) / textBlocks.length;

    await supabase
      .from('pdf_documents')
      .update({
        page_count: data.numpages,
        total_words: totalWords,
        has_text_layer: data.text.length > 0,
        reading_level: Math.round(avgComplexity)
      })
      .eq('id', documentId);

    console.log('[Text Extractor] Completed. Extracted', textBlocks.length, 'text blocks');

    return new Response(
      JSON.stringify({
        success: true,
        blocksExtracted: textBlocks.length,
        totalWords,
        pageCount: data.numpages
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('[Text Extractor] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

function calculateReadingComplexity(text: string): number {
  // Flesch-Kincaid Grade Level approximation
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length || 1;
  const words = text.split(/\s+/).length;
  const syllables = estimateSyllables(text);

  const avgWordsPerSentence = words / sentences;
  const avgSyllablesPerWord = syllables / words;

  const gradeLevel = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;

  return Math.max(1, Math.min(12, Math.round(gradeLevel)));
}

function estimateSyllables(text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  let totalSyllables = 0;

  for (const word of words) {
    // Simple syllable counting heuristic
    const vowels = word.match(/[aeiouyáéíóúü]/gi);
    const syllableCount = vowels ? Math.max(1, vowels.length) : 1;
    totalSyllables += syllableCount;
  }

  return totalSyllables;
}
