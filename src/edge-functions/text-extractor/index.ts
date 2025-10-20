/**
 * Text Extractor Edge Function
 * Extracts text with positioning, structure detection, and language metadata
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import * as pdfjsLib from 'https://esm.sh/pdfjs-dist@4.0.269';

interface TextExtractionRequest {
  documentId: string;
  pdfBase64: string;
}

interface TextBlock {
  text: string;
  pageNumber: number;
  sectionOrder: number;
  bbox: { x1: number; y1: number; x2: number; y2: number };
  category: 'title' | 'heading' | 'paragraph' | 'question' | 'answer_choice' | 'instruction' | 'caption' | 'footnote';
  wordCount: number;
  sentenceCount: number;
}

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

    const { documentId, pdfBase64 } = await req.json() as TextExtractionRequest;

    // Convert base64 to Uint8Array
    const pdfData = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    const totalPages = pdf.numPages;
    const textBlocks: TextBlock[] = [];
    let totalWordCount = 0;

    // Process each page
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const viewport = page.getViewport({ scale: 1.0 });

      // Group text items into blocks
      const blocks = groupTextIntoBlocks(textContent.items, pageNum);
      textBlocks.push(...blocks);

      // Count words
      blocks.forEach(block => {
        totalWordCount += block.wordCount;
      });

      // Process in chunks to avoid timeout for large PDFs
      if (pageNum % 10 === 0) {
        await insertTextBlocks(supabase, documentId, textBlocks.splice(0));
      }
    }

    // Insert remaining blocks
    if (textBlocks.length > 0) {
      await insertTextBlocks(supabase, documentId, textBlocks);
    }

    // Update document metadata
    await supabase
      .from('pdf_documents')
      .update({
        page_count: totalPages,
        word_count: totalWordCount,
      })
      .eq('id', documentId);

    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        pagesProcessed: totalPages,
        textBlocksExtracted: textBlocks.length,
        totalWordCount,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Text extraction error:', error);
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

function groupTextIntoBlocks(items: any[], pageNumber: number): TextBlock[] {
  const blocks: TextBlock[] = [];
  let currentBlock: any = null;
  let sectionOrder = 0;

  for (const item of items) {
    const text = item.str.trim();
    if (!text) continue;

    const transform = item.transform;
    const x = transform[4];
    const y = transform[5];
    const height = item.height;
    const width = item.width;

    // Detect block type based on font size and position
    const category = detectCategory(item, y);

    // Start new block if category changes or large gap
    if (!currentBlock || currentBlock.category !== category ||
        Math.abs(currentBlock.bbox.y1 - y) > height * 2) {

      if (currentBlock) {
        blocks.push(finalizeBlock(currentBlock, pageNumber, sectionOrder++));
      }

      currentBlock = {
        text: text,
        category,
        bbox: { x1: x, y1: y, x2: x + width, y2: y + height },
        items: [item],
      };
    } else {
      // Append to current block
      currentBlock.text += ' ' + text;
      currentBlock.bbox.x2 = Math.max(currentBlock.bbox.x2, x + width);
      currentBlock.bbox.y2 = Math.max(currentBlock.bbox.y2, y + height);
      currentBlock.items.push(item);
    }
  }

  // Add last block
  if (currentBlock) {
    blocks.push(finalizeBlock(currentBlock, pageNumber, sectionOrder));
  }

  return blocks;
}

function detectCategory(item: any, y: number): TextBlock['category'] {
  const fontSize = item.height;
  const text = item.str.trim();

  // Title detection (large font, top of page)
  if (fontSize > 18 && y > 700) {
    return 'title';
  }

  // Heading detection (medium-large font)
  if (fontSize > 14) {
    return 'heading';
  }

  // Question detection (starts with number or question word)
  if (/^\d+[\.)]\s/.test(text) || /^(¿|What|Which|Who|Where|When|Why|How|Qué|Cuál|Quién|Dónde|Cuándo|Por qué|Cómo)/i.test(text)) {
    return 'question';
  }

  // Answer choice detection
  if (/^[A-D][\.)]\s/.test(text)) {
    return 'answer_choice';
  }

  // Instruction detection
  if (/^(Instructions|Instrucciones|Directions|Indicaciones):/i.test(text)) {
    return 'instruction';
  }

  // Caption detection (small font at bottom)
  if (fontSize < 10 && y < 100) {
    return 'caption';
  }

  // Footnote detection
  if (fontSize < 9) {
    return 'footnote';
  }

  // Default to paragraph
  return 'paragraph';
}

function finalizeBlock(block: any, pageNumber: number, sectionOrder: number): TextBlock {
  const words = block.text.split(/\s+/).filter((w: string) => w.length > 0);
  const sentences = block.text.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);

  return {
    text: block.text,
    pageNumber,
    sectionOrder,
    bbox: block.bbox,
    category: block.category,
    wordCount: words.length,
    sentenceCount: sentences.length,
  };
}

async function insertTextBlocks(supabase: any, documentId: string, blocks: TextBlock[]): Promise<void> {
  if (blocks.length === 0) return;

  const records = blocks.map(block => ({
    pdf_document_id: documentId,
    page_number: block.pageNumber,
    section_order: block.sectionOrder,
    text_content: block.text,
    detected_language: 'pending', // Will be updated by language detector
    language_confidence: 0,
    bbox_x1: block.bbox.x1,
    bbox_y1: block.bbox.y1,
    bbox_x2: block.bbox.x2,
    bbox_y2: block.bbox.y2,
    content_category: block.category,
    word_count: block.wordCount,
    sentence_count: block.sentenceCount,
  }));

  const { error } = await supabase
    .from('pdf_text_content')
    .insert(records);

  if (error) {
    console.error('Failed to insert text blocks:', error);
    throw error;
  }
}
