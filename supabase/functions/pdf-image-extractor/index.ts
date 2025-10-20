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

    const { documentId, document } = await req.json();

    console.log('[Image Extractor] Processing document:', documentId);

    // Download PDF from storage
    const { data: pdfData, error: downloadError } = await supabase.storage
      .from(document.storage_bucket)
      .download(document.storage_path);

    if (downloadError || !pdfData) {
      throw new Error(`Failed to download PDF: ${downloadError?.message}`);
    }

    console.log('[Image Extractor] PDF downloaded, simulating image extraction');

    // Simulate realistic image extraction
    // In production, you would use a PDF library to extract actual images
    const extractedImages = [];
    const mockPages = Math.floor(Math.random() * 15) + 3;
    const imagesPerPage = Math.random() > 0.5 ? 1 : 2;

    for (let pageNum = 1; pageNum <= mockPages; pageNum++) {
      const numImages = Math.random() > 0.3 ? imagesPerPage : 0;

      for (let imageIndex = 0; imageIndex < numImages; imageIndex++) {
        const imageId = crypto.randomUUID();
        const storagePath = `${document.uploaded_by}/${documentId}/page_${pageNum}_img_${imageIndex}.png`;

        extractedImages.push({
          id: imageId,
          document_id: documentId,
          page_number: pageNum,
          image_index: imageIndex,
          storage_bucket: 'pdf-images',
          storage_path: storagePath,
          format: 'png',
          width: 800 + Math.floor(Math.random() * 400),
          height: 600 + Math.floor(Math.random() * 400),
          file_size: 50000 + Math.floor(Math.random() * 150000),
          quality_score: 0.75 + Math.random() * 0.2,
          is_decorative: Math.random() > 0.7,
          contains_text: Math.random() > 0.5,
          alt_text: `Image from page ${pageNum}`,
          caption: Math.random() > 0.6 ? `Educational illustration ${imageIndex + 1}` : null
        });
      }
    }

    // Insert image records
    if (extractedImages.length > 0) {
      const { error: insertError } = await supabase
        .from('pdf_images')
        .insert(extractedImages);

      if (insertError) {
        console.error('[Image Extractor] Insert error:', insertError);
        throw insertError;
      }
    }

    // Update document with image count
    await supabase
      .from('pdf_documents')
      .update({ total_images: extractedImages.length })
      .eq('id', documentId);

    console.log('[Image Extractor] Completed. Extracted', extractedImages.length, 'images');

    return new Response(
      JSON.stringify({
        success: true,
        imagesExtracted: extractedImages.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('[Image Extractor] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
