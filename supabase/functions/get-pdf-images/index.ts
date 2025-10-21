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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const documentId = url.searchParams.get('document_id');

    if (!documentId) {
      throw new Error('document_id is required');
    }

    const { data: images, error } = await supabase
      .from('pdf_images')
      .select('*')
      .eq('document_id', documentId)
      .order('page_number', { ascending: true })
      .order('image_index', { ascending: true });

    if (error) throw error;

    // Get public URLs for images using the correct pdf-images bucket
    const imagesWithUrls = images.map(img => ({
      ...img,
      url: supabase.storage.from('pdf-images').getPublicUrl(img.storage_path).data.publicUrl
    }));

    return new Response(
      JSON.stringify(imagesWithUrls),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
