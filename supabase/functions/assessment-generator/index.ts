import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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

    console.log('[Assessment Generator] Processing document:', documentId);

    // Get document info
    const { data: document, error: docError } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) throw new Error('Document not found');

    // Get text content
    const { data: textBlocks, error: textError } = await supabase
      .from('pdf_text_content')
      .select('*')
      .eq('document_id', documentId)
      .order('page_number', { ascending: true })
      .limit(20); // Focus on first pages

    if (textError) throw textError;

    // Get images for visual questions
    const { data: images, error: imageError } = await supabase
      .from('pdf_images')
      .select('*')
      .eq('document_id', documentId)
      .limit(5);

    if (imageError) throw imageError;

    console.log('[Assessment Generator] Generating questions from', textBlocks?.length, 'text blocks');

    const questions = [];

    // Generate comprehension questions
    for (const textBlock of textBlocks || []) {
      if (textBlock.word_count < 20) continue; // Skip short blocks

      const text = textBlock.text_content;
      const language = textBlock.detected_language;

      // Generate multiple choice question
      const mcQuestion = generateMultipleChoice(text, language, textBlock.page_number, document.grade_level);
      if (mcQuestion) {
        questions.push({
          document_id: documentId,
          ...mcQuestion,
          source_text_ids: [textBlock.id],
          source_page: textBlock.page_number
        });
      }

      // Generate true/false question
      if (text.length > 100 && questions.length < 15) {
        const tfQuestion = generateTrueFalse(text, language, textBlock.page_number, document.grade_level);
        if (tfQuestion) {
          questions.push({
            document_id: documentId,
            ...tfQuestion,
            source_text_ids: [textBlock.id],
            source_page: textBlock.page_number
          });
        }
      }
    }

    // Generate image-based questions
    for (const image of images || []) {
      if (questions.length >= 20) break;

      const imageQuestion = generateImageQuestion(image, document.primary_language, document.grade_level);
      if (imageQuestion) {
        questions.push({
          document_id: documentId,
          ...imageQuestion,
          source_image_ids: [image.id],
          source_page: image.page_number
        });
      }
    }

    // Insert questions
    if (questions.length > 0) {
      const { error: insertError } = await supabase
        .from('assessment_questions')
        .insert(questions.slice(0, 20)); // Limit to 20 questions

      if (insertError) {
        console.error('[Assessment Generator] Insert error:', insertError);
        throw insertError;
      }
    }

    console.log('[Assessment Generator] Generated', questions.length, 'questions');

    return new Response(
      JSON.stringify({
        success: true,
        questionsGenerated: questions.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('[Assessment Generator] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

function generateMultipleChoice(text: string, language: string, pageNumber: number, gradeLevel: number[] | null): any {
  // Extract key sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  if (sentences.length === 0) return null;

  const keySentence = sentences[0].trim();

  // Generate question based on language
  const questionTemplates = language === 'es'
    ? ['¿Qué dice el texto sobre', '¿Según el texto,', '¿Cuál es la idea principal']
    : ['What does the text say about', 'According to the text,', 'What is the main idea'];

  const template = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
  const question = `${template} ${keySentence.toLowerCase().slice(0, 50)}?`;

  // Generate options
  const correctAnswer = extractKeyPhrase(keySentence);
  const distractors = generateDistractors(correctAnswer, language);

  const avgGrade = gradeLevel && gradeLevel.length > 0 ? Math.round(gradeLevel.reduce((a, b) => a + b) / gradeLevel.length) : 3;

  return {
    question_type: 'multiple_choice',
    question_text: question,
    correct_answer: correctAnswer,
    options: shuffleArray([correctAnswer, ...distractors]),
    language,
    grade_level: avgGrade,
    difficulty_level: avgGrade,
    skill_assessed: 'reading_comprehension',
    explanation: language === 'es' 
      ? `La respuesta se encuentra en el texto proporcionado.`
      : `The answer can be found in the provided text.`
  };
}

function generateTrueFalse(text: string, language: string, pageNumber: number, gradeLevel: number[] | null): any {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 15);
  if (sentences.length === 0) return null;

  const sentence = sentences[0].trim();
  const isTrue = Math.random() > 0.5;

  const questionText = isTrue
    ? sentence
    : negateStatement(sentence, language);

  const avgGrade = gradeLevel && gradeLevel.length > 0 ? Math.round(gradeLevel.reduce((a, b) => a + b) / gradeLevel.length) : 3;

  return {
    question_type: 'true_false',
    question_text: questionText,
    correct_answer: isTrue ? 'true' : 'false',
    options: language === 'es' ? ['Verdadero', 'Falso'] : ['True', 'False'],
    language,
    grade_level: avgGrade,
    difficulty_level: avgGrade,
    skill_assessed: 'fact_recognition',
    explanation: language === 'es'
      ? `Esta afirmación es ${isTrue ? 'verdadera' : 'falsa'} según el texto.`
      : `This statement is ${isTrue ? 'true' : 'false'} according to the text.`
  };
}

function generateImageQuestion(image: any, language: string, gradeLevel: number[] | null): any {
  const templates = language === 'es'
    ? [
        '¿Qué muestra la imagen?',
        '¿Qué puedes ver en esta imagen?',
        'Describe lo que observas en la imagen.'
      ]
    : [
        'What does the image show?',
        'What can you see in this image?',
        'Describe what you observe in the image.'
      ];

  const question = templates[Math.floor(Math.random() * templates.length)];
  const avgGrade = gradeLevel && gradeLevel.length > 0 ? Math.round(gradeLevel.reduce((a, b) => a + b) / gradeLevel.length) : 3;

  return {
    question_type: 'short_answer',
    question_text: question,
    correct_answer: language === 'es' ? 'Respuesta abierta' : 'Open answer',
    options: [],
    language,
    grade_level: avgGrade,
    difficulty_level: avgGrade,
    skill_assessed: 'visual_comprehension',
    explanation: language === 'es'
      ? 'Observa cuidadosamente todos los detalles de la imagen.'
      : 'Carefully observe all details in the image.'
  };
}

function extractKeyPhrase(sentence: string): string {
  const words = sentence.split(/\s+/).slice(0, 8);
  return words.join(' ');
}

function generateDistractors(correct: string, language: string): string[] {
  const templates = language === 'es'
    ? ['No se menciona en el texto', 'Algo diferente', 'Información incorrecta']
    : ['Not mentioned in the text', 'Something different', 'Incorrect information'];

  return templates.slice(0, 3);
}

function negateStatement(statement: string, language: string): string {
  if (language === 'es') {
    return statement.replace(/es /i, 'no es ').replace(/son /i, 'no son ');
  } else {
    return statement.replace(/is /i, 'is not ').replace(/are /i, 'are not ');
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
