import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PEXELS_API_KEY = Deno.env.get('PEXELS_API_KEY');
    
    if (!PEXELS_API_KEY) {
      throw new Error('PEXELS_API_KEY not configured');
    }

    let query: string;
    let perPage = '15';

    // Support both GET and POST
    if (req.method === 'POST') {
      const body = await req.json();
      query = body.query;
      perPage = body.per_page || perPage;
    } else {
      const url = new URL(req.url);
      query = url.searchParams.get('q') || '';
      perPage = url.searchParams.get('per_page') || perPage;
    }

    if (!query) {
      throw new Error('query parameter is required');
    }

    // Add kid-friendly filters to search only when appropriate
    // For object/item searches, add "toy" prefix instead of generic education terms
    const needsToyPrefix = !query.toLowerCase().includes('classroom') && 
                          !query.toLowerCase().includes('school') && 
                          !query.toLowerCase().includes('teacher');
    
    const kidFriendlyQuery = needsToyPrefix ? `toy ${query} colorful` : `${query} colorful child-friendly`;

    const pexelsResponse = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(kidFriendlyQuery)}&per_page=${perPage}&orientation=landscape`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      }
    );

    if (!pexelsResponse.ok) {
      throw new Error('Pexels API request failed');
    }

    const data = await pexelsResponse.json();

    // Simplify response to essential data
    const images = data.photos.map((photo: any) => ({
      id: photo.id,
      url: photo.src.large,
      thumbnail: photo.src.medium,
      photographer: photo.photographer,
      alt: photo.alt || query
    }));

    return new Response(
      JSON.stringify({ images }),
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
