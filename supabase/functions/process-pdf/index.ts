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

    // Update progress
    await supabase
      .from('pdf_documents')
      .update({ processing_progress: 30 })
      .eq('id', documentId);

    // For this POC, we'll simulate basic text extraction
    // In production, this would use pdf-parse or similar
    const mockPageCount = Math.floor(Math.random() * 20) + 5;
    const mockTextContent = [
      { 
        text: "Este es un ejemplo de texto extraído del PDF.", 
        language: "es",
        page: 1 
      },
      { 
        text: "This is an example of text extracted from the PDF.", 
        language: "en",
        page: 1 
      }
    ];

    // Insert mock text content
    for (const content of mockTextContent) {
      await supabase.from('pdf_text_content').insert({
        document_id: documentId,
        page_number: content.page,
        block_index: 0,
        text_content: content.text,
        text_length: content.text.length,
        detected_language: content.language,
        language_confidence: 0.95,
        word_count: content.text.split(' ').length
      });
    }

    console.log('[PDF Processor] Text content inserted');

    // Update progress
    await supabase
      .from('pdf_documents')
      .update({ processing_progress: 70 })
      .eq('id', documentId);

    // Update final document status
    await supabase
      .from('pdf_documents')
      .update({
        processing_status: 'completed',
        processing_completed_at: new Date().toISOString(),
        processing_progress: 100,
        page_count: mockPageCount,
        total_words: mockTextContent.reduce((sum, c) => sum + c.text.split(' ').length, 0),
        quality_score: 0.85
      })
      .eq('id', documentId);

    console.log('[PDF Processor] Processing completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        pageCount: mockPageCount,
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
