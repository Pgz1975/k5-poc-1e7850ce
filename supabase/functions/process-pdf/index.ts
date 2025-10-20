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

    const { documentId } = await req.json();

    console.log('[PDF Processor] Processing document:', documentId);

    // Get document details
    const { data: document, error: docError } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      throw new Error(`Document not found: ${documentId}`);
    }

    // Update status to processing
    await supabase
      .from('pdf_documents')
      .update({
        processing_status: 'processing',
        processing_started_at: new Date().toISOString(),
        processing_progress: 10
      })
      .eq('id', documentId);

    console.log('[PDF Processor] Document retrieved:', document.filename);

    // Download PDF from storage
    const { data: pdfData, error: downloadError } = await supabase.storage
      .from(document.storage_bucket)
      .download(document.storage_path);

    if (downloadError || !pdfData) {
      throw new Error(`Failed to download PDF: ${downloadError?.message}`);
    }

    console.log('[PDF Processor] PDF downloaded, size:', pdfData.size);

    // Convert blob to array buffer
    const arrayBuffer = await pdfData.arrayBuffer();

    // Update progress
    await supabase
      .from('pdf_documents')
      .update({ processing_progress: 20 })
      .eq('id', documentId);

    // Step 1: Extract text
    console.log('[PDF Processor] Extracting text...');
    const { error: textError } = await supabase.functions.invoke('pdf-text-extractor', {
      body: { 
        documentId, 
        pdfBuffer: Array.from(new Uint8Array(arrayBuffer))
      }
    });

    if (textError) {
      console.error('[PDF Processor] Text extraction error:', textError);
    }

    // Update progress
    await supabase
      .from('pdf_documents')
      .update({ processing_progress: 40 })
      .eq('id', documentId);

    // Step 2: Extract images
    console.log('[PDF Processor] Extracting images...');
    const { error: imageError } = await supabase.functions.invoke('pdf-image-extractor', {
      body: { documentId, document }
    });

    if (imageError) {
      console.error('[PDF Processor] Image extraction error:', imageError);
    }

    // Update progress
    await supabase
      .from('pdf_documents')
      .update({ processing_progress: 60 })
      .eq('id', documentId);

    // Step 3: Correlate text and images
    console.log('[PDF Processor] Correlating text and images...');
    const { error: correlationError } = await supabase.functions.invoke('text-image-correlator', {
      body: { documentId }
    });

    if (correlationError) {
      console.error('[PDF Processor] Correlation error:', correlationError);
    }

    // Update progress
    await supabase
      .from('pdf_documents')
      .update({ processing_progress: 80 })
      .eq('id', documentId);

    // Step 4: Generate assessments
    console.log('[PDF Processor] Generating assessments...');
    const { error: assessmentError } = await supabase.functions.invoke('assessment-generator', {
      body: { documentId }
    });

    if (assessmentError) {
      console.error('[PDF Processor] Assessment generation error:', assessmentError);
    }

    // Get final document stats
    const { data: finalDoc } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    // Update final document status
    await supabase
      .from('pdf_documents')
      .update({
        processing_status: 'completed',
        processing_completed_at: new Date().toISOString(),
        processing_progress: 100,
        quality_score: 0.90
      })
      .eq('id', documentId);

    console.log('[PDF Processor] Processing completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        pageCount: finalDoc?.page_count || 0,
        totalWords: finalDoc?.total_words || 0,
        totalImages: finalDoc?.total_images || 0,
        status: 'completed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('[PDF Processor] Error:', error);

    // Try to update document status to failed
    if (error.message.includes('Document not found')) {
      return new Response(
        JSON.stringify({ error: 'Document not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      );
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
