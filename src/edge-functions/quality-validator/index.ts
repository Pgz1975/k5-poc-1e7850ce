/**
 * Quality Validator Edge Function
 * Validates content quality and extraction accuracy
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

interface QualityValidationRequest {
  documentId: string;
}

interface QualityMetrics {
  textExtractionConfidence: number;
  languageDetectionConfidence: number;
  overallQualityScore: number;
  issues: QualityIssue[];
}

interface QualityIssue {
  severity: 'low' | 'medium' | 'high';
  category: string;
  message: string;
  affectedPages?: number[];
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

    const { documentId } = await req.json() as QualityValidationRequest;

    // Fetch document metadata
    const { data: document, error: docError } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      throw new Error('Document not found');
    }

    // Fetch text content
    const { data: textBlocks, error: textError } = await supabase
      .from('pdf_text_content')
      .select('*')
      .eq('pdf_document_id', documentId);

    if (textError) throw textError;

    // Fetch images
    const { data: images, error: imageError } = await supabase
      .from('pdf_images')
      .select('*')
      .eq('pdf_document_id', documentId);

    if (imageError) throw imageError;

    const issues: QualityIssue[] = [];

    // Validate text extraction
    const textMetrics = validateTextExtraction(document, textBlocks || [], issues);

    // Validate language detection
    const langMetrics = validateLanguageDetection(textBlocks || [], issues);

    // Validate images
    validateImages(document, images || [], issues);

    // Validate correlations
    await validateCorrelations(supabase, documentId, textBlocks || [], images || [], issues);

    // Calculate overall quality score
    const overallScore = calculateOverallScore(textMetrics, langMetrics, issues);

    // Update document with quality metrics
    await supabase
      .from('pdf_documents')
      .update({
        text_extraction_confidence: textMetrics,
        language_detection_confidence: langMetrics,
        quality_score: overallScore,
        processing_status: overallScore >= 0.7 ? 'completed' : 'requires_review',
      })
      .eq('id', documentId);

    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        metrics: {
          textExtractionConfidence: textMetrics,
          languageDetectionConfidence: langMetrics,
          overallQualityScore: overallScore,
        },
        issues,
        requiresReview: overallScore < 0.7,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Quality validation error:', error);
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

function validateTextExtraction(
  document: any,
  textBlocks: any[],
  issues: QualityIssue[]
): number {

  // Check if text was extracted
  if (!textBlocks || textBlocks.length === 0) {
    issues.push({
      severity: 'high',
      category: 'text_extraction',
      message: 'No text content extracted from PDF',
    });
    return 0.0;
  }

  // Check word count consistency
  const totalWordCount = textBlocks.reduce((sum, block) => sum + (block.word_count || 0), 0);
  if (totalWordCount < 10) {
    issues.push({
      severity: 'high',
      category: 'text_extraction',
      message: 'Very low word count, possible extraction failure',
    });
    return 0.3;
  }

  // Check for suspicious patterns (OCR errors)
  const suspiciousBlocks = textBlocks.filter(block => {
    const text = block.text_content || '';
    // Check for excessive special characters
    const specialChars = (text.match(/[^a-zA-Z0-9\s.,;:¿?¡!áéíóúñüÁÉÍÓÚÑÜ]/g) || []).length;
    return specialChars / text.length > 0.3;
  });

  if (suspiciousBlocks.length > textBlocks.length * 0.2) {
    issues.push({
      severity: 'medium',
      category: 'text_extraction',
      message: 'High number of suspicious characters detected, possible OCR errors',
    });
    return 0.6;
  }

  // Check page coverage
  const pagesWithText = new Set(textBlocks.map(b => b.page_number));
  const coverageRatio = pagesWithText.size / (document.page_count || 1);

  if (coverageRatio < 0.8) {
    issues.push({
      severity: 'medium',
      category: 'text_extraction',
      message: `Text extracted from only ${Math.round(coverageRatio * 100)}% of pages`,
    });
    return 0.7;
  }

  return 0.95; // High confidence
}

function validateLanguageDetection(
  textBlocks: any[],
  issues: QualityIssue[]
): number {

  if (!textBlocks || textBlocks.length === 0) {
    return 0.0;
  }

  // Check if language detection was performed
  const blocksWithLanguage = textBlocks.filter(b =>
    b.detected_language && b.detected_language !== 'pending'
  );

  if (blocksWithLanguage.length === 0) {
    issues.push({
      severity: 'high',
      category: 'language_detection',
      message: 'Language detection not performed',
    });
    return 0.0;
  }

  // Check average confidence
  const avgConfidence = blocksWithLanguage.reduce((sum, b) =>
    sum + (b.language_confidence || 0), 0
  ) / blocksWithLanguage.length;

  if (avgConfidence < 0.7) {
    issues.push({
      severity: 'medium',
      category: 'language_detection',
      message: 'Low average language detection confidence',
    });
  }

  return avgConfidence;
}

function validateImages(
  document: any,
  images: any[],
  issues: QualityIssue[]
): void {

  if (!images || images.length === 0) {
    // No images is not necessarily an issue
    return;
  }

  // Check for very small images (likely artifacts)
  const tinyImages = images.filter(img =>
    img.width_pixels < 50 || img.height_pixels < 50
  );

  if (tinyImages.length > images.length * 0.5) {
    issues.push({
      severity: 'low',
      category: 'image_extraction',
      message: 'High number of very small images detected, may be artifacts',
    });
  }

  // Check for missing image files
  const missingStorage = images.filter(img => !img.storage_path);
  if (missingStorage.length > 0) {
    issues.push({
      severity: 'high',
      category: 'image_extraction',
      message: `${missingStorage.length} images missing storage path`,
    });
  }
}

async function validateCorrelations(
  supabase: any,
  documentId: string,
  textBlocks: any[],
  images: any[],
  issues: QualityIssue[]
): Promise<void> {

  if (!images || images.length === 0) {
    return; // No images to correlate
  }

  // Fetch correlations
  const { data: correlations } = await supabase
    .from('text_image_correlations')
    .select('*')
    .in('image_id', images.map(img => img.id));

  const correlatedImages = new Set(
    (correlations || []).map((c: any) => c.image_id)
  );

  const uncorrelatedCount = images.length - correlatedImages.size;

  if (uncorrelatedCount > images.length * 0.3) {
    issues.push({
      severity: 'low',
      category: 'content_correlation',
      message: `${uncorrelatedCount} images have no text correlations`,
    });
  }
}

function calculateOverallScore(
  textConfidence: number,
  langConfidence: number,
  issues: QualityIssue[]
): number {

  // Start with average of confidence scores
  let score = (textConfidence + langConfidence) / 2;

  // Reduce score based on issues
  const highSeverityCount = issues.filter(i => i.severity === 'high').length;
  const mediumSeverityCount = issues.filter(i => i.severity === 'medium').length;

  score -= highSeverityCount * 0.15;
  score -= mediumSeverityCount * 0.08;

  // Ensure score is between 0 and 1
  return Math.max(0, Math.min(1, score));
}
