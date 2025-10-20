/**
 * Assessment Generator Edge Function
 * Extracts and structures assessment questions from PDFs
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

interface AssessmentGenerationRequest {
  documentId: string;
}

interface Question {
  questionNumber: number;
  pageNumber: number;
  questionText: string;
  questionLanguage: 'spanish' | 'english';
  choiceA: string;
  choiceB: string;
  choiceC?: string;
  choiceD?: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  standardCode?: string;
  skillAssessed?: string;
  difficultyLevel?: 'easy' | 'medium' | 'hard';
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

    const { documentId } = await req.json() as AssessmentGenerationRequest;

    // Fetch document to verify it's an assessment
    const { data: document, error: docError } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      throw new Error('Document not found');
    }

    if (document.content_type !== 'assessment') {
      return new Response(
        JSON.stringify({
          success: true,
          documentId,
          message: 'Document is not an assessment, skipping question extraction',
          questionsExtracted: 0,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch text content
    const { data: textBlocks, error: textError } = await supabase
      .from('pdf_text_content')
      .select('*')
      .eq('pdf_document_id', documentId)
      .order('page_number', { ascending: true })
      .order('section_order', { ascending: true });

    if (textError || !textBlocks || textBlocks.length === 0) {
      throw new Error('No text content found for assessment');
    }

    // Extract questions
    const questions = extractQuestions(textBlocks);

    if (questions.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          documentId,
          message: 'No questions detected in assessment',
          questionsExtracted: 0,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Insert questions into database
    const records = questions.map(q => ({
      pdf_document_id: documentId,
      question_number: q.questionNumber,
      page_number: q.pageNumber,
      question_text: q.questionText,
      question_language: q.questionLanguage,
      choice_a: q.choiceA,
      choice_b: q.choiceB,
      choice_c: q.choiceC || null,
      choice_d: q.choiceD || null,
      correct_answer: q.correctAnswer,
      standard_code: q.standardCode || 'UNKNOWN',
      skill_assessed: q.skillAssessed || 'general',
      difficulty_level: q.difficultyLevel || 'medium',
    }));

    const { error: insertError } = await supabase
      .from('assessment_questions')
      .insert(records);

    if (insertError) {
      console.error('Failed to insert questions:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        questionsExtracted: questions.length,
        questions: questions.map(q => ({
          number: q.questionNumber,
          text: q.questionText.substring(0, 100) + '...',
        })),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Assessment generation error:', error);
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

function extractQuestions(textBlocks: any[]): Question[] {
  const questions: Question[] = [];
  let currentQuestion: Partial<Question> | null = null;
  let currentChoices: { [key: string]: string } = {};

  for (const block of textBlocks) {
    const text = block.text_content.trim();
    const category = block.content_category;

    // Detect question start
    const questionMatch = text.match(/^(\d+)[\.)]\s*(.+)/);
    if (questionMatch && (category === 'question' || text.length > 20)) {
      // Save previous question if exists
      if (currentQuestion && currentQuestion.questionText) {
        const assembled = assembleQuestion(currentQuestion, currentChoices);
        if (assembled) questions.push(assembled);
      }

      // Start new question
      currentQuestion = {
        questionNumber: parseInt(questionMatch[1]),
        pageNumber: block.page_number,
        questionText: questionMatch[2],
        questionLanguage: block.detected_language as 'spanish' | 'english',
      };
      currentChoices = {};
      continue;
    }

    // Detect answer choices
    const choiceMatch = text.match(/^([A-D])[\.)]\s*(.+)/);
    if (choiceMatch && category === 'answer_choice') {
      currentChoices[choiceMatch[1]] = choiceMatch[2];
      continue;
    }

    // Append to current question if continuation
    if (currentQuestion && !choiceMatch && category === 'question') {
      currentQuestion.questionText += ' ' + text;
    }
  }

  // Add last question
  if (currentQuestion && currentQuestion.questionText) {
    const assembled = assembleQuestion(currentQuestion, currentChoices);
    if (assembled) questions.push(assembled);
  }

  return questions;
}

function assembleQuestion(
  partial: Partial<Question>,
  choices: { [key: string]: string }
): Question | null {

  // Validate required fields
  if (!partial.questionNumber || !partial.questionText || !partial.pageNumber) {
    return null;
  }

  // Must have at least 2 choices
  if (!choices.A || !choices.B) {
    return null;
  }

  // Detect correct answer (look for markers or default to A)
  const correctAnswer = detectCorrectAnswer(partial.questionText, choices);

  // Detect skill being assessed
  const skill = detectSkill(partial.questionText!);

  // Detect difficulty
  const difficulty = detectDifficulty(partial.questionText!, choices);

  return {
    questionNumber: partial.questionNumber,
    pageNumber: partial.pageNumber,
    questionText: partial.questionText,
    questionLanguage: partial.questionLanguage || 'english',
    choiceA: choices.A,
    choiceB: choices.B,
    choiceC: choices.C,
    choiceD: choices.D,
    correctAnswer,
    skillAssessed: skill,
    difficultyLevel: difficulty,
  };
}

function detectCorrectAnswer(
  questionText: string,
  choices: { [key: string]: string }
): 'A' | 'B' | 'C' | 'D' {
  // Look for answer key markers in question text
  const answerMatch = questionText.match(/\(Answer:\s*([A-D])\)/i);
  if (answerMatch) {
    return answerMatch[1] as 'A' | 'B' | 'C' | 'D';
  }

  // Check choice text for markers
  for (const [key, text] of Object.entries(choices)) {
    if (text.includes('(correct)') || text.includes('(correcto)')) {
      return key as 'A' | 'B' | 'C' | 'D';
    }
  }

  // Default to A (should be marked for manual review)
  return 'A';
}

function detectSkill(questionText: string): string {
  const text = questionText.toLowerCase();

  if (text.includes('main idea') || text.includes('idea principal')) {
    return 'comprehension';
  }

  if (text.includes('meaning') || text.includes('significado') ||
      text.includes('vocabulary') || text.includes('vocabulario')) {
    return 'vocabulary';
  }

  if (text.includes('infer') || text.includes('inferir') ||
      text.includes('conclude') || text.includes('concluir')) {
    return 'inference';
  }

  if (text.includes('detail') || text.includes('detalle') ||
      text.includes('according to') || text.includes('según')) {
    return 'literal_comprehension';
  }

  if (text.includes('author') || text.includes('autor') ||
      text.includes('purpose') || text.includes('propósito')) {
    return 'analysis';
  }

  return 'general';
}

function detectDifficulty(questionText: string, choices: { [key: string]: string }): 'easy' | 'medium' | 'hard' {
  // Simple heuristic based on question length and choice complexity
  const questionLength = questionText.split(/\s+/).length;
  const avgChoiceLength = Object.values(choices)
    .reduce((sum, c) => sum + c.split(/\s+/).length, 0) / Object.keys(choices).length;

  if (questionLength < 15 && avgChoiceLength < 5) {
    return 'easy';
  }

  if (questionLength > 30 || avgChoiceLength > 10) {
    return 'hard';
  }

  return 'medium';
}
