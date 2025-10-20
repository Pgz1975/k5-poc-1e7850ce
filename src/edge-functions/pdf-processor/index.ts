/**
 * PDF Processor Edge Function
 * Core processing orchestrator - coordinates all PDF processing steps
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

interface ProcessorRequest {
  documentId: string;
}

interface ProcessingResult {
  success: boolean;
  documentId: string;
  steps: {
    textExtraction?: boolean;
    imageExtraction?: boolean;
    languageDetection?: boolean;
    contentCorrelation?: boolean;
    qualityValidation?: boolean;
    assessmentGeneration?: boolean;
  };
  error?: string;
  processingTime: number;
}

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { documentId } = await req.json() as ProcessorRequest;

    if (!documentId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Document ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update processing status
    await supabase
      .from('pdf_documents')
      .update({
        processing_status: 'processing',
        processing_started_at: new Date().toISOString(),
      })
      .eq('id', documentId);

    // Log processing start
    await logProcessingStep(supabase, documentId, 'processing_started', 'info', {
      timestamp: new Date().toISOString(),
    });

    // Get document details
    const { data: document, error: docError } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      throw new Error('Document not found');
    }

    // Download PDF from storage
    const { data: pdfData, error: downloadError } = await supabase.storage
      .from(document.storage_bucket)
      .download(document.storage_path);

    if (downloadError || !pdfData) {
      throw new Error('Failed to download PDF from storage');
    }

    const pdfBuffer = await pdfData.arrayBuffer();
    const pdfBase64 = arrayBufferToBase64(pdfBuffer);

    const result: ProcessingResult = {
      success: true,
      documentId,
      steps: {},
      processingTime: 0,
    };

    // Step 1: Text Extraction
    try {
      const textResult = await callEdgeFunction(
        supabaseUrl,
        supabaseKey,
        'text-extractor',
        { documentId, pdfBase64 }
      );
      result.steps.textExtraction = textResult.success;
      await logProcessingStep(supabase, documentId, 'text_extraction', 'success', textResult);
    } catch (error) {
      result.steps.textExtraction = false;
      await logProcessingStep(supabase, documentId, 'text_extraction', 'error', { error: String(error) });
    }

    // Step 2: Language Detection (parallel with image extraction)
    const languagePromise = callEdgeFunction(
      supabaseUrl,
      supabaseKey,
      'language-detector',
      { documentId }
    ).then(async (langResult) => {
      result.steps.languageDetection = langResult.success;
      await logProcessingStep(supabase, documentId, 'language_detection', 'success', langResult);
    }).catch(async (error) => {
      result.steps.languageDetection = false;
      await logProcessingStep(supabase, documentId, 'language_detection', 'error', { error: String(error) });
    });

    // Step 3: Image Extraction (parallel with language detection)
    const imagePromise = callEdgeFunction(
      supabaseUrl,
      supabaseKey,
      'image-extractor',
      { documentId, pdfBase64 }
    ).then(async (imgResult) => {
      result.steps.imageExtraction = imgResult.success;
      await logProcessingStep(supabase, documentId, 'image_extraction', 'success', imgResult);
    }).catch(async (error) => {
      result.steps.imageExtraction = false;
      await logProcessingStep(supabase, documentId, 'image_extraction', 'error', { error: String(error) });
    });

    // Wait for parallel operations
    await Promise.all([languagePromise, imagePromise]);

    // Step 4: Content Correlation (requires text and images)
    if (result.steps.textExtraction && result.steps.imageExtraction) {
      try {
        const corrResult = await callEdgeFunction(
          supabaseUrl,
          supabaseKey,
          'content-correlator',
          { documentId }
        );
        result.steps.contentCorrelation = corrResult.success;
        await logProcessingStep(supabase, documentId, 'content_correlation', 'success', corrResult);
      } catch (error) {
        result.steps.contentCorrelation = false;
        await logProcessingStep(supabase, documentId, 'content_correlation', 'error', { error: String(error) });
      }
    }

    // Step 5: Quality Validation
    try {
      const qualityResult = await callEdgeFunction(
        supabaseUrl,
        supabaseKey,
        'quality-validator',
        { documentId }
      );
      result.steps.qualityValidation = qualityResult.success;
      await logProcessingStep(supabase, documentId, 'quality_validation', 'success', qualityResult);
    } catch (error) {
      result.steps.qualityValidation = false;
      await logProcessingStep(supabase, documentId, 'quality_validation', 'error', { error: String(error) });
    }

    // Step 6: Assessment Generation (if content type is assessment)
    if (document.content_type === 'assessment') {
      try {
        const assessResult = await callEdgeFunction(
          supabaseUrl,
          supabaseKey,
          'assessment-generator',
          { documentId }
        );
        result.steps.assessmentGeneration = assessResult.success;
        await logProcessingStep(supabase, documentId, 'assessment_generation', 'success', assessResult);
      } catch (error) {
        result.steps.assessmentGeneration = false;
        await logProcessingStep(supabase, documentId, 'assessment_generation', 'error', { error: String(error) });
      }
    }

    // Calculate processing time
    result.processingTime = Date.now() - startTime;

    // Update final status
    const allStepsSuccessful = Object.values(result.steps).every(step => step === true);
    await supabase
      .from('pdf_documents')
      .update({
        processing_status: allStepsSuccessful ? 'completed' : 'requires_review',
        processing_completed_at: new Date().toISOString(),
      })
      .eq('id', documentId);

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Processing error:', error);

    const errorResponse: ProcessingResult = {
      success: false,
      documentId: '',
      steps: {},
      error: error instanceof Error ? error.message : 'Unknown error',
      processingTime: Date.now() - startTime,
    };

    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function callEdgeFunction(
  baseUrl: string,
  apiKey: string,
  functionName: string,
  payload: any
): Promise<any> {
  const response = await fetch(`${baseUrl}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`${functionName} failed: ${response.statusText}`);
  }

  return response.json();
}

async function logProcessingStep(
  supabase: any,
  documentId: string,
  step: string,
  level: 'info' | 'warning' | 'error' | 'success',
  details: any
): Promise<void> {
  await supabase.from('pdf_processing_logs').insert({
    pdf_document_id: documentId,
    processing_step: step,
    log_level: level,
    log_message: JSON.stringify(details),
    created_at: new Date().toISOString(),
  });
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
