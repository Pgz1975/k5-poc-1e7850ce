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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    const { selected_items, assessment_type, grade_level, language, source_pdf_id } = body;

    if (!selected_items || !assessment_type) {
      throw new Error('selected_items and assessment_type are required');
    }

    // Fetch selected content
    const selectedTexts = selected_items.texts || [];
    const selectedImages = selected_items.images || [];
    const selectedQuestions = selected_items.questions || [];

    const content: any = {
      pages: []
    };

    // Generate content based on assessment type
    if (assessment_type === 'reading_exercise') {
      // Fetch texts
      if (selectedTexts.length > 0) {
        const { data: texts } = await supabase
          .from('pdf_text_content')
          .select('*')
          .in('id', selectedTexts);

        texts?.forEach((text, index) => {
          content.pages.push({
            type: 'reading_text',
            page_number: index + 1,
            title: `Página ${index + 1}`,
            text: text.text_content,
            language: text.detected_language,
            images: []
          });
        });
      }
    } else if (assessment_type === 'quiz') {
      // Fetch questions
      if (selectedQuestions.length > 0) {
        const { data: questions } = await supabase
          .from('assessment_questions')
          .select('*')
          .in('id', selectedQuestions);

        questions?.forEach((q, index) => {
          content.pages.push({
            type: 'question',
            page_number: index + 1,
            question_text: q.question_text,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            images: []
          });
        });
      }
    }

    // Add selected images to pages
    if (selectedImages.length > 0) {
      const { data: images } = await supabase
        .from('pdf_images')
        .select('*')
        .in('id', selectedImages);

      const imagesWithUrls = images?.map(img => ({
        id: img.id,
        url: supabase.storage.from('pdf-images').getPublicUrl(img.storage_path).data.publicUrl,
        alt_text: img.alt_text,
        caption: img.caption
      })) || [];

      // Distribute images across pages
      content.pages.forEach((page: any, index: number) => {
        if (imagesWithUrls[index]) {
          page.images.push(imagesWithUrls[index]);
        }
      });
    }

    // Save generated assessment
    const { data: assessment, error: insertError } = await supabase
      .from('generated_assessments')
      .insert({
        created_by: user.id,
        source_pdf_id,
        selected_items,
        assessment_type,
        grade_level,
        language,
        content,
        metadata: {
          generated_at: new Date().toISOString(),
          page_count: content.pages.length
        }
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({
        success: true,
        assessment_id: assessment.id,
        url: `/generated/${assessment.id}`
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
