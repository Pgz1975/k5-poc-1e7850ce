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

    // Get document_id from request body
    const body = await req.json();
    const documentId = body.document_id;

    if (!documentId) {
      throw new Error('document_id is required');
    }

    // Fetch document metadata
    const { data: document, error: docError } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError) throw docError;

    // Fetch text content
    const { data: texts, error: textError } = await supabase
      .from('pdf_text_content')
      .select('*')
      .eq('document_id', documentId)
      .order('page_number', { ascending: true })
      .order('block_index', { ascending: true });

    if (textError) throw textError;

    // Fetch images
    const { data: images, error: imageError } = await supabase
      .from('pdf_images')
      .select('*')
      .eq('document_id', documentId)
      .order('page_number', { ascending: true })
      .order('image_index', { ascending: true });

    if (imageError) throw imageError;

    // Fetch questions
    const { data: questions, error: questionError } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('document_id', documentId)
      .order('source_page', { ascending: true });

    if (questionError) throw questionError;

    // Get public URLs for images
    const imagesWithUrls = images.map(img => ({
      ...img,
      url: supabase.storage.from('pdf-images').getPublicUrl(img.storage_path).data.publicUrl
    }));

    // Combine into content array
    const content: any[] = [];

    // Add texts
    texts.forEach(text => {
      content.push({
        id: text.id,
        type: 'text',
        page_number: text.page_number,
        content: text.text_content,
        language: text.detected_language,
        word_count: text.word_count
      });
    });

    // Add images
    imagesWithUrls.forEach(img => {
      content.push({
        id: img.id,
        type: 'image',
        page_number: img.page_number,
        url: img.url,
        alt_text: img.alt_text,
        caption: img.caption
      });
    });

    // Add questions
    questions.forEach(q => {
      content.push({
        id: q.id,
        type: 'question',
        page_number: q.source_page,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation
      });
    });

    // Sort by page number
    content.sort((a, b) => a.page_number - b.page_number);

    return new Response(
      JSON.stringify({
        document: {
          id: document.id,
          filename: document.filename,
          grade_level: document.grade_level,
          subject_area: document.subject_area,
          page_count: document.page_count
        },
        content
      }),
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
