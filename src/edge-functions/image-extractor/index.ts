/**
 * Image Extractor Edge Function
 * Extracts images from PDFs with optimization and metadata
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import * as pdfjsLib from 'https://esm.sh/pdfjs-dist@4.0.269';

interface ImageExtractionRequest {
  documentId: string;
  pdfBase64: string;
}

interface ExtractedImage {
  pageNumber: number;
  imageOrder: number;
  bbox: { x1: number; y1: number; x2: number; y2: number };
  width: number;
  height: number;
  imageData: Uint8Array;
  format: string;
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

    const { documentId, pdfBase64 } = await req.json() as ImageExtractionRequest;

    // Convert base64 to Uint8Array
    const pdfData = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    const totalPages = pdf.numPages;
    let totalImages = 0;

    // Process each page
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const operatorList = await page.getOperatorList();

      let imageOrder = 0;
      const images: ExtractedImage[] = [];

      // Extract images from operator list
      for (let i = 0; i < operatorList.fnArray.length; i++) {
        const fn = operatorList.fnArray[i];

        // Check if operation is image painting
        if (fn === pdfjsLib.OPS.paintImageXObject ||
            fn === pdfjsLib.OPS.paintInlineImageXObject) {

          try {
            const imageName = operatorList.argsArray[i][0];
            const image = await extractImageFromPage(page, imageName);

            if (image) {
              images.push({
                pageNumber: pageNum,
                imageOrder: imageOrder++,
                bbox: image.bbox,
                width: image.width,
                height: image.height,
                imageData: image.data,
                format: image.format,
              });
            }
          } catch (err) {
            console.error(`Failed to extract image on page ${pageNum}:`, err);
          }
        }
      }

      // Store images
      for (const image of images) {
        await storeImage(supabase, documentId, image);
        totalImages++;
      }
    }

    // Update document metadata
    await supabase
      .from('pdf_documents')
      .update({ image_count: totalImages })
      .eq('id', documentId);

    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        pagesProcessed: totalPages,
        imagesExtracted: totalImages,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Image extraction error:', error);
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

async function extractImageFromPage(page: any, imageName: string): Promise<any> {
  try {
    const resources = await page.objs.get(imageName);

    if (!resources) return null;

    const { width, height, data, kind } = resources;

    // Determine format
    const format = kind === 1 ? 'jpeg' : 'png';

    // Get viewport for bbox calculation
    const viewport = page.getViewport({ scale: 1.0 });

    return {
      width,
      height,
      data: new Uint8Array(data),
      format,
      bbox: {
        x1: 0,
        y1: 0,
        x2: width,
        y2: height,
      },
    };
  } catch (error) {
    console.error('Error extracting image:', error);
    return null;
  }
}

async function storeImage(
  supabase: any,
  documentId: string,
  image: ExtractedImage
): Promise<void> {
  try {
    // Generate storage path
    const timestamp = Date.now();
    const storagePath = `${documentId}/page-${image.pageNumber}-img-${image.imageOrder}.${image.format}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('educational-images')
      .upload(storagePath, image.imageData, {
        contentType: `image/${image.format}`,
        cacheControl: '31536000', // 1 year
        upsert: false,
      });

    if (uploadError) {
      console.error('Failed to upload image:', uploadError);
      return;
    }

    // Calculate aspect ratio
    const aspectRatio = image.width / image.height;

    // Determine image type (basic heuristic)
    const imageType = detectImageType(image);

    // Insert metadata into database
    const { error: dbError } = await supabase
      .from('pdf_images')
      .insert({
        pdf_document_id: documentId,
        storage_bucket: 'educational-images',
        storage_path: storagePath,
        original_format: image.format,
        page_number: image.pageNumber,
        image_order: image.imageOrder,
        bbox_x1: image.bbox.x1,
        bbox_y1: image.bbox.y1,
        bbox_x2: image.bbox.x2,
        bbox_y2: image.bbox.y2,
        width_pixels: image.width,
        height_pixels: image.height,
        aspect_ratio: aspectRatio,
        original_size_bytes: image.imageData.length,
        image_type: imageType,
        contains_text: false, // Will be updated if OCR is run
      });

    if (dbError) {
      console.error('Failed to insert image metadata:', dbError);
      // Cleanup uploaded file
      await supabase.storage.from('educational-images').remove([storagePath]);
    }

  } catch (error) {
    console.error('Error storing image:', error);
  }
}

function detectImageType(image: ExtractedImage): string {
  const { width, height } = image;
  const aspectRatio = width / height;

  // Basic heuristics for image classification
  if (width < 100 && height < 100) {
    return 'icon';
  }

  if (aspectRatio > 2 || aspectRatio < 0.5) {
    return 'diagram';
  }

  if (width > 400 && height > 400) {
    return 'illustration';
  }

  return 'illustration'; // Default
}
