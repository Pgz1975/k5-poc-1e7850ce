/**
 * Content Correlator Edge Function
 * Smart text-image correlation based on positioning and context
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

interface CorrelationRequest {
  documentId: string;
}

interface TextBlock {
  id: string;
  page_number: number;
  section_order: number;
  text_content: string;
  content_category: string;
  bbox_x1: number;
  bbox_y1: number;
  bbox_x2: number;
  bbox_y2: number;
}

interface ImageBlock {
  id: string;
  page_number: number;
  image_order: number;
  bbox_x1: number;
  bbox_y1: number;
  bbox_x2: number;
  bbox_y2: number;
  image_type: string;
}

interface Correlation {
  textContentId: string;
  imageId: string;
  correlationType: 'adjacent' | 'caption' | 'reference' | 'contextual' | 'embedded';
  confidenceScore: number;
  distanceScore: number;
  layoutSuggestion: string;
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

    const { documentId } = await req.json() as CorrelationRequest;

    // Fetch all text blocks
    const { data: textBlocks, error: textError } = await supabase
      .from('pdf_text_content')
      .select('*')
      .eq('pdf_document_id', documentId)
      .order('page_number', { ascending: true })
      .order('section_order', { ascending: true });

    if (textError) throw textError;

    // Fetch all images
    const { data: images, error: imageError } = await supabase
      .from('pdf_images')
      .select('*')
      .eq('pdf_document_id', documentId)
      .order('page_number', { ascending: true })
      .order('image_order', { ascending: true });

    if (imageError) throw imageError;

    if (!textBlocks || !images || textBlocks.length === 0 || images.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          documentId,
          message: 'No text or images to correlate',
          correlationsCreated: 0,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Group by page for efficient correlation
    const textByPage = groupByPage(textBlocks);
    const imagesByPage = groupByPage(images);

    const correlations: Correlation[] = [];

    // Process each page
    for (const pageNum of Object.keys(textByPage)) {
      const pageTexts = textByPage[pageNum];
      const pageImages = imagesByPage[pageNum] || [];

      if (pageImages.length === 0) continue;

      // Find correlations for this page
      for (const image of pageImages) {
        const imageCorrelations = findCorrelations(image, pageTexts);
        correlations.push(...imageCorrelations);
      }
    }

    // Insert correlations into database
    if (correlations.length > 0) {
      const records = correlations.map(corr => ({
        text_content_id: corr.textContentId,
        image_id: corr.imageId,
        correlation_type: corr.correlationType,
        confidence_score: corr.confidenceScore,
        distance_score: corr.distanceScore,
        layout_suggestion: corr.layoutSuggestion,
      }));

      const { error: insertError } = await supabase
        .from('text_image_correlations')
        .insert(records);

      if (insertError) {
        console.error('Failed to insert correlations:', insertError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        correlationsCreated: correlations.length,
        pagesProcessed: Object.keys(textByPage).length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Correlation error:', error);
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

function groupByPage<T extends { page_number: number }>(items: T[]): Record<number, T[]> {
  return items.reduce((acc, item) => {
    const page = item.page_number;
    if (!acc[page]) acc[page] = [];
    acc[page].push(item);
    return acc;
  }, {} as Record<number, T[]>);
}

function findCorrelations(image: ImageBlock, textBlocks: TextBlock[]): Correlation[] {
  const correlations: Correlation[] = [];

  for (const text of textBlocks) {
    // Calculate spatial distance
    const distance = calculateDistance(
      { x1: image.bbox_x1, y1: image.bbox_y1, x2: image.bbox_x2, y2: image.bbox_y2 },
      { x1: text.bbox_x1, y1: text.bbox_y1, x2: text.bbox_x2, y2: text.bbox_y2 }
    );

    // Determine correlation type and confidence
    const result = analyzeCorrelation(image, text, distance);

    if (result.confidence > 0.3) { // Only keep correlations with >30% confidence
      correlations.push({
        textContentId: text.id,
        imageId: image.id,
        correlationType: result.type,
        confidenceScore: result.confidence,
        distanceScore: distance,
        layoutSuggestion: result.layout,
      });
    }
  }

  // Sort by confidence and keep top 3 correlations per image
  return correlations
    .sort((a, b) => b.confidenceScore - a.confidenceScore)
    .slice(0, 3);
}

function calculateDistance(
  bbox1: { x1: number; y1: number; x2: number; y2: number },
  bbox2: { x1: number; y1: number; x2: number; y2: number }
): number {
  // Calculate center points
  const center1 = {
    x: (bbox1.x1 + bbox1.x2) / 2,
    y: (bbox1.y1 + bbox1.y2) / 2,
  };
  const center2 = {
    x: (bbox2.x1 + bbox2.x2) / 2,
    y: (bbox2.y1 + bbox2.y2) / 2,
  };

  // Euclidean distance
  return Math.sqrt(
    Math.pow(center2.x - center1.x, 2) + Math.pow(center2.y - center1.y, 2)
  );
}

function analyzeCorrelation(
  image: ImageBlock,
  text: TextBlock,
  distance: number
): { type: Correlation['correlationType']; confidence: number; layout: string } {

  // Caption detection (text directly below image)
  if (text.content_category === 'caption' &&
      text.bbox_y1 < image.bbox_y1 &&
      distance < 50) {
    return {
      type: 'caption',
      confidence: 0.95,
      layout: 'text-below',
    };
  }

  // Reference detection (text mentions figure/image)
  const hasReference = /\b(figure|figura|image|imagen|see|ver|shown|mostrado)\b/i.test(text.text_content);
  if (hasReference) {
    return {
      type: 'reference',
      confidence: 0.85,
      layout: 'side-by-side',
    };
  }

  // Adjacent detection (very close proximity)
  if (distance < 100) {
    // Determine if side-by-side or vertical
    const isHorizontal = Math.abs(image.bbox_y1 - text.bbox_y1) < 50;

    return {
      type: 'adjacent',
      confidence: 0.75,
      layout: isHorizontal ? 'side-by-side' : 'text-below',
    };
  }

  // Embedded detection (image within text flow)
  if (distance < 200 && text.content_category === 'paragraph') {
    return {
      type: 'embedded',
      confidence: 0.65,
      layout: 'text-above',
    };
  }

  // Contextual (same page, related content)
  if (distance < 400) {
    return {
      type: 'contextual',
      confidence: 0.4,
      layout: 'side-by-side',
    };
  }

  return {
    type: 'contextual',
    confidence: 0.2,
    layout: 'side-by-side',
  };
}
