import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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

    console.log('[Text Extractor] ========== STARTING TEXT EXTRACTION ==========');
    console.log('[Text Extractor] Document ID:', documentId);
    console.log('[Text Extractor] Buffer received:', !!pdfBuffer);
    console.log('[Text Extractor] Buffer type:', typeof pdfBuffer);
    console.log('[Text Extractor] Buffer is array:', Array.isArray(pdfBuffer));

    // Import Deno-compatible PDF parsing (pdf.js)
    console.log('[Text Extractor] Step 1: Importing pdf.js library...');
    const pdfjsModule = await import('https://esm.sh/pdfjs-dist@3.11.174/legacy/build/pdf.mjs');
    const pdfjsLib: any = (pdfjsModule as any).default || pdfjsModule;
    console.log('[Text Extractor] pdf.js loaded:', !!pdfjsLib);
    console.log('[Text Extractor] GlobalWorkerOptions available:', !!pdfjsLib.GlobalWorkerOptions);
    
    // Ensure worker is not required in edge runtime
    if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@3.11.174/legacy/build/pdf.worker.mjs';
      console.log('[Text Extractor] Worker source set:', pdfjsLib.GlobalWorkerOptions.workerSrc);
    }
    
    // Parse PDF using pdf.js (works in Deno)
    console.log('[Text Extractor] Step 2: Normalizing PDF buffer...');
    const pdfData = normalizeToUint8Array(pdfBuffer);
    console.log('[Text Extractor] Normalized buffer size:', pdfData.byteLength, 'bytes');
    
    console.log('[Text Extractor] Step 3: Loading PDF document...');
    const loadingTask = pdfjsLib.getDocument({ 
      data: pdfData, 
      isEvalSupported: false, 
      useWorkerFetch: true, 
      disableFontFace: true 
    });
    console.log('[Text Extractor] Loading task created:', !!loadingTask);
    
    console.log('[Text Extractor] Step 4: Waiting for PDF to load...');
    const pdfDoc = await loadingTask.promise;
    console.log('[Text Extractor] ✓ PDF loaded successfully');
    console.log('[Text Extractor] Total pages:', pdfDoc.numPages);

    // Process each page
    const textBlocks = [];

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items into blocks
      let currentBlock = '';
      let blockIndex = 0;
      
      for (const item of textContent.items) {
        if ('str' in item) {
          const text = item.str.trim();
          if (!text) continue;
          
          // Start new block on significant vertical gap
          if (item.transform && currentBlock && Math.abs(item.transform[5]) > 50) {
            if (currentBlock.trim()) {
              textBlocks.push(createTextBlock(documentId, pageNum, blockIndex++, currentBlock));
              currentBlock = '';
            }
          }
          
          currentBlock += text + ' ';
        }
      }
      
      // Add final block
      if (currentBlock.trim()) {
        textBlocks.push(createTextBlock(documentId, pageNum, blockIndex++, currentBlock));
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
        page_count: pdfDoc.numPages,
        total_words: totalWords,
        has_text_layer: textBlocks.length > 0,
        reading_level: Math.round(avgComplexity)
      })
      .eq('id', documentId);

    console.log('[Text Extractor] Completed. Extracted', textBlocks.length, 'text blocks');

    return new Response(
      JSON.stringify({
        success: true,
        blocksExtracted: textBlocks.length,
        totalWords,
        pageCount: pdfDoc.numPages
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('[Text Extractor] ❌ FATAL ERROR');
    console.error('[Text Extractor] Error type:', error.constructor?.name);
    console.error('[Text Extractor] Error message:', error.message);
    console.error('[Text Extractor] Error stack:', error.stack);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

function createTextBlock(documentId: string, pageNum: number, blockIndex: number, text: string) {
  const trimmedText = text.trim();
  
  // Detect language using simple heuristics
  const spanishIndicators = /\b(el|la|los|las|un|una|de|que|y|en|es|por|para|con|su|al|del)\b/gi;
  const englishIndicators = /\b(the|a|an|and|is|are|was|were|in|on|at|to|for|of|with)\b/gi;

  const spanishMatches = (trimmedText.match(spanishIndicators) || []).length;
  const englishMatches = (trimmedText.match(englishIndicators) || []).length;

  const detectedLanguage = spanishMatches > englishMatches ? 'es' : 'en';
  const confidence = Math.max(spanishMatches, englishMatches) / trimmedText.split(/\s+/).length;

  // Check for Puerto Rican dialect indicators
  const prIndicators = /\b(guagua|zafacón|mahones|chiringa|chavos|carro|nene|china)\b/gi;
  const isPuertoRican = prIndicators.test(trimmedText);

  return {
    document_id: documentId,
    page_number: pageNum,
    block_index: blockIndex,
    text_content: trimmedText,
    text_length: trimmedText.length,
    detected_language: detectedLanguage,
    language_confidence: Math.min(confidence, 0.99),
    is_puerto_rican_dialect: isPuertoRican,
    word_count: trimmedText.split(/\s+/).length,
    reading_complexity: calculateReadingComplexity(trimmedText)
  };
}

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

// Normalize various input formats to Uint8Array without using Node Buffer (Deno-friendly)
function normalizeToUint8Array(input: any): Uint8Array {
  try {
    if (!input) throw new Error('Empty input');

    // Base64 string
    if (typeof input === 'string') {
      const binary = atob(input);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    }

    // Node Buffer-like object { type: 'Buffer', data: [...] }
    if (typeof input === 'object' && input.type === 'Buffer' && Array.isArray(input.data)) {
      return new Uint8Array(input.data);
    }

    // Already Uint8Array
    if (input instanceof Uint8Array) return input;

    // ArrayBuffer
    if (input instanceof ArrayBuffer) return new Uint8Array(input);

    // Plain array of numbers
    if (Array.isArray(input)) return new Uint8Array(input as number[]);

    throw new Error('Unsupported input format for pdfBuffer');
  } catch (e) {
    console.error('[Text Extractor] normalizeToUint8Array error:', e);
    throw e;
  }
}

