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

    const { documentId } = await req.json();

    console.log('[Correlator] Processing document:', documentId);

    // Get all text content
    const { data: textBlocks, error: textError } = await supabase
      .from('pdf_text_content')
      .select('*')
      .eq('document_id', documentId)
      .order('page_number', { ascending: true })
      .order('block_index', { ascending: true });

    if (textError) throw textError;

    // Get all images
    const { data: images, error: imageError } = await supabase
      .from('pdf_images')
      .select('*')
      .eq('document_id', documentId)
      .order('page_number', { ascending: true })
      .order('image_index', { ascending: true });

    if (imageError) throw imageError;

    console.log('[Correlator] Found', textBlocks?.length, 'text blocks and', images?.length, 'images');

    const correlations = [];

    // Correlate images with nearby text
    for (const image of images || []) {
      // Find text blocks on the same page
      const pageTextBlocks = textBlocks?.filter(tb => tb.page_number === image.page_number) || [];

      for (const textBlock of pageTextBlocks) {
        // Calculate semantic similarity
        const similarity = calculateSemanticSimilarity(textBlock.text_content, image);

        if (similarity > 0.3) {
          const correlationType = determineCorrelationType(textBlock, image);
          
          correlations.push({
            text_content_id: textBlock.id,
            image_id: image.id,
            correlation_type: correlationType,
            confidence_score: similarity,
            semantic_similarity: similarity,
            relative_position: 'adjacent',
            shared_concepts: extractSharedConcepts(textBlock.text_content)
          });
        }
      }

      // Also check adjacent pages
      const adjacentTextBlocks = textBlocks?.filter(tb => 
        Math.abs(tb.page_number - image.page_number) === 1
      ) || [];

      for (const textBlock of adjacentTextBlocks) {
        const similarity = calculateSemanticSimilarity(textBlock.text_content, image);

        if (similarity > 0.5) {
          correlations.push({
            text_content_id: textBlock.id,
            image_id: image.id,
            correlation_type: 'reference',
            confidence_score: similarity * 0.8,
            semantic_similarity: similarity,
            relative_position: 'nearby_page',
            shared_concepts: extractSharedConcepts(textBlock.text_content)
          });
        }
      }
    }

    // Insert correlations
    if (correlations.length > 0) {
      const { error: insertError } = await supabase
        .from('text_image_correlations')
        .insert(correlations);

      if (insertError) {
        console.error('[Correlator] Insert error:', insertError);
        throw insertError;
      }
    }

    console.log('[Correlator] Created', correlations.length, 'correlations');

    return new Response(
      JSON.stringify({
        success: true,
        correlationsCreated: correlations.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('[Correlator] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

function calculateSemanticSimilarity(text: string, image: any): number {
  // Extract keywords from text
  const keywords = text.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 4)
    .slice(0, 20);

  // Look for educational image indicators
  const educationalTerms = ['diagram', 'chart', 'graph', 'map', 'illustration', 'figure', 'photo'];
  const hasEducationalContext = keywords.some(kw => 
    educationalTerms.some(term => kw.includes(term))
  );

  // Check for descriptive language
  const descriptiveTerms = ['see', 'look', 'shown', 'image', 'picture', 'above', 'below'];
  const hasDescriptiveLanguage = keywords.some(kw => 
    descriptiveTerms.some(term => kw.includes(term))
  );

  let score = 0.4; // Base score

  if (hasEducationalContext) score += 0.3;
  if (hasDescriptiveLanguage) score += 0.2;

  // Adjust based on position
  if (image.image_index === 0) score += 0.1; // First image likely correlates

  return Math.min(0.95, score);
}

function determineCorrelationType(textBlock: any, image: any): string {
  const text = textBlock.text_content.toLowerCase();

  if (text.includes('diagram') || text.includes('chart')) return 'diagram';
  if (text.includes('photo') || text.includes('picture')) return 'illustration';
  if (text.includes('map')) return 'illustration';
  if (text.includes('see') || text.includes('shown')) return 'reference';

  // Default
  return 'contextual';
}

function extractSharedConcepts(text: string): string[] {
  // Extract significant words as concepts
  const concepts = text.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 5)
    .filter(word => !/^(the|and|for|with|from|that|this|have|been|were|what|when|where)$/.test(word))
    .slice(0, 10);

  return [...new Set(concepts)];
}
