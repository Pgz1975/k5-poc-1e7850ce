/**
 * Assessment Extraction Edge Function
 *
 * Identifies and extracts questions, answers, and assessments from PDFs
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import {
  AppError,
  errorResponse,
  successResponse,
  Logger,
  retryWithBackoff,
} from '../shared/utils.ts';
import { StorageService, DatabaseService } from '../shared/storage.ts';
import type {
  Assessment,
  K5Standard,
  TextExtractionResult,
  PageTextContent,
} from '../shared/types.ts';

const logger = new Logger('AssessmentExtractor');

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const storageService = new StorageService(SUPABASE_URL, SUPABASE_KEY);
const dbService = new DatabaseService(SUPABASE_URL, SUPABASE_KEY);

// Question pattern matchers
const QUESTION_PATTERNS = [
  /^\d+[\.)]\s+(.+?\?)/gm,  // "1. What is...?"
  /^[A-Z]\.\s+(.+?\?)/gm,    // "A. How does...?"
  /^Question\s+\d+:\s+(.+?\?)/gim,
  /^¿(.+?)\?/gm,             // Spanish questions
  /^\d+\.\s+(.+?)$/gm,       // Numbered statements
];

const MULTIPLE_CHOICE_PATTERNS = [
  /^[A-D][\.)]\s+(.+?)$/gm,
  /^[a-d][\.)]\s+(.+?)$/gm,
  /^\([A-D]\)\s+(.+?)$/gm,
];

const ANSWER_KEY_PATTERNS = [
  /Answer(?:s)?\s*Key/i,
  /Correct\s+Answer(?:s)?/i,
  /Respuestas?\s+Correctas?/i,
];

// K5 Standards mapping (simplified - expand based on actual standards)
const K5_STANDARDS: Record<string, K5Standard> = {
  'K.CC.1': {
    code: 'K.CC.1',
    description: 'Count to 100 by ones and tens',
    grade: 'K',
    subject: 'Mathematics',
  },
  'K.CC.2': {
    code: 'K.CC.2',
    description: 'Count forward from a given number',
    grade: 'K',
    subject: 'Mathematics',
  },
  '1.OA.1': {
    code: '1.OA.1',
    description: 'Use addition and subtraction within 20',
    grade: '1',
    subject: 'Mathematics',
  },
  // Add more standards as needed
};

/**
 * Extract questions from text
 */
function extractQuestions(text: string, pageNumber: number): Array<{
  question: string;
  lineNumber: number;
  type: 'question' | 'statement';
}> {
  const questions: Array<{
    question: string;
    lineNumber: number;
    type: 'question' | 'statement';
  }> = [];

  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    for (const pattern of QUESTION_PATTERNS) {
      const matches = line.matchAll(pattern);

      for (const match of matches) {
        const questionText = match[1] || match[0];

        questions.push({
          question: questionText.trim(),
          lineNumber: i,
          type: questionText.includes('?') ? 'question' : 'statement',
        });
      }
    }
  }

  return questions;
}

/**
 * Extract multiple choice options
 */
function extractMultipleChoiceOptions(
  text: string,
  questionLineNumber: number
): string[] | undefined {
  const lines = text.split('\n');
  const options: string[] = [];

  // Look at next few lines after question
  for (let i = questionLineNumber + 1; i < Math.min(questionLineNumber + 10, lines.length); i++) {
    const line = lines[i].trim();

    for (const pattern of MULTIPLE_CHOICE_PATTERNS) {
      const match = line.match(pattern);

      if (match) {
        options.push(match[1].trim());
      }
    }

    // Stop if we've collected 4 options (A-D)
    if (options.length >= 4) {
      break;
    }

    // Stop if we hit another question
    if (QUESTION_PATTERNS.some(p => p.test(line))) {
      break;
    }
  }

  // Only return if we have 2-5 options
  return options.length >= 2 && options.length <= 5 ? options : undefined;
}

/**
 * Detect assessment type
 */
function detectAssessmentType(
  question: string,
  hasOptions: boolean
): Assessment['type'] {
  const lowerQuestion = question.toLowerCase();

  if (hasOptions) {
    return 'multiple-choice';
  }

  if (lowerQuestion.includes('true or false') ||
      lowerQuestion.includes('verdadero o falso')) {
    return 'true-false';
  }

  if (lowerQuestion.includes('explain') ||
      lowerQuestion.includes('describe') ||
      lowerQuestion.includes('explica') ||
      lowerQuestion.includes('describe')) {
    return 'essay';
  }

  return 'short-answer';
}

/**
 * Extract answer key if present
 */
function extractAnswerKey(text: string): Map<number, string> | undefined {
  const answerKey = new Map<number, string>();

  // Check if there's an answer key section
  const hasAnswerKey = ANSWER_KEY_PATTERNS.some(p => p.test(text));

  if (!hasAnswerKey) {
    return undefined;
  }

  // Extract answers (simplified pattern)
  const answerPattern = /(\d+)[\.):\s]+([A-D]|True|False|Verdadero|Falso)/gi;
  const matches = text.matchAll(answerPattern);

  for (const match of matches) {
    const questionNum = parseInt(match[1]);
    const answer = match[2];
    answerKey.set(questionNum, answer);
  }

  return answerKey.size > 0 ? answerKey : undefined;
}

/**
 * Identify K5 curriculum standard
 */
function identifyStandard(question: string, text: string): K5Standard | undefined {
  const lowerText = text.toLowerCase();
  const lowerQuestion = question.toLowerCase();

  // Look for explicit standard references
  for (const [code, standard] of Object.entries(K5_STANDARDS)) {
    if (lowerText.includes(code.toLowerCase()) ||
        lowerQuestion.includes(standard.description.toLowerCase())) {
      return standard;
    }
  }

  // Infer standard from content (simplified)
  if (lowerQuestion.includes('count') || lowerQuestion.includes('contar')) {
    return K5_STANDARDS['K.CC.1'];
  }

  if (lowerQuestion.includes('add') || lowerQuestion.includes('subtract') ||
      lowerQuestion.includes('sumar') || lowerQuestion.includes('restar')) {
    return K5_STANDARDS['1.OA.1'];
  }

  return undefined;
}

/**
 * Estimate question difficulty (1-5 scale)
 */
function estimateDifficulty(
  question: string,
  type: Assessment['type'],
  readingLevel?: number
): number {
  let difficulty = 3; // Default medium

  // Adjust based on question type
  if (type === 'true-false') {
    difficulty = 2;
  } else if (type === 'essay') {
    difficulty = 4;
  }

  // Adjust based on reading level
  if (readingLevel) {
    if (readingLevel <= 2) difficulty = Math.max(1, difficulty - 1);
    if (readingLevel >= 8) difficulty = Math.min(5, difficulty + 1);
  }

  // Adjust based on question complexity
  const words = question.split(/\s+/).length;
  if (words > 20) difficulty = Math.min(5, difficulty + 1);
  if (words < 8) difficulty = Math.max(1, difficulty - 1);

  return difficulty;
}

/**
 * Extract assessments from PDF text
 */
function extractAssessments(textResult: TextExtractionResult): Assessment[] {
  logger.info('Starting assessment extraction');

  const assessments: Assessment[] = [];
  const answerKey = extractAnswerKey(textResult.text);
  let assessmentNumber = 1;

  for (const page of textResult.pages) {
    const questions = extractQuestions(page.text, page.pageNumber);

    for (const q of questions) {
      const options = extractMultipleChoiceOptions(page.text, q.lineNumber);
      const type = detectAssessmentType(q.question, !!options);
      const standard = identifyStandard(q.question, textResult.text);
      const difficulty = estimateDifficulty(
        q.question,
        type,
        textResult.readingLevel
      );

      const assessment: Assessment = {
        id: `assessment_${page.pageNumber}_${assessmentNumber}`,
        type,
        question: q.question,
        options,
        correctAnswer: answerKey?.get(assessmentNumber),
        pageNumber: page.pageNumber,
        standard,
        difficulty,
      };

      assessments.push(assessment);
      assessmentNumber++;
    }
  }

  logger.info('Assessment extraction complete', {
    total: assessments.length,
    types: {
      multipleChoice: assessments.filter(a => a.type === 'multiple-choice').length,
      trueFalse: assessments.filter(a => a.type === 'true-false').length,
      shortAnswer: assessments.filter(a => a.type === 'short-answer').length,
      essay: assessments.filter(a => a.type === 'essay').length,
    },
  });

  return assessments;
}

serve(async (req) => {
  const startTime = Date.now();

  try {
    if (req.method !== 'POST') {
      throw new AppError('METHOD_NOT_ALLOWED', 'Only POST method is allowed', 405);
    }

    const { jobId } = await req.json();

    if (!jobId) {
      throw new AppError('INVALID_INPUT', 'jobId is required', 400);
    }

    logger.info('Processing assessment extraction', { jobId });

    // Load text extraction results
    const textResultPath = `results/${jobId}/text-extraction.json`;
    const textBlob = await retryWithBackoff(() =>
      storageService.downloadFile('documents', textResultPath)
    );
    const textResult: TextExtractionResult = JSON.parse(await textBlob.text());

    await dbService.updateProcessingJob(jobId, { progress: 50 });

    // Extract assessments
    const assessments = extractAssessments(textResult);

    await dbService.updateProcessingJob(jobId, { progress: 80 });

    // Store assessments in database
    if (assessments.length > 0) {
      const assessmentRecords = assessments.map(a => ({
        id: a.id,
        type: a.type,
        question: a.question,
        options: a.options,
        correct_answer: a.correctAnswer,
        page_number: a.pageNumber,
        standard_code: a.standard?.code,
        difficulty: a.difficulty,
      }));

      await dbService.insertAssessments(assessmentRecords);
    }

    // Store results
    const resultPath = `results/${jobId}/assessments.json`;
    const resultBlob = new Blob([JSON.stringify(assessments, null, 2)], {
      type: 'application/json',
    });

    await storageService.uploadFile('documents', resultPath, resultBlob, {
      contentType: 'application/json',
    });

    // Update job with results
    await dbService.updateProcessingJob(jobId, {
      status: 'completed',
      progress: 100,
      completed_at: new Date(),
      results: { assessments },
    });

    logger.info('Assessment extraction completed', { jobId });

    const processingTime = Date.now() - startTime;

    return successResponse({
      jobId,
      assessments,
      resultPath,
      statistics: {
        total: assessments.length,
        byType: {
          multipleChoice: assessments.filter(a => a.type === 'multiple-choice').length,
          trueFalse: assessments.filter(a => a.type === 'true-false').length,
          shortAnswer: assessments.filter(a => a.type === 'short-answer').length,
          essay: assessments.filter(a => a.type === 'essay').length,
        },
        byDifficulty: {
          easy: assessments.filter(a => a.difficulty && a.difficulty <= 2).length,
          medium: assessments.filter(a => a.difficulty && a.difficulty === 3).length,
          hard: assessments.filter(a => a.difficulty && a.difficulty >= 4).length,
        },
      },
    }, processingTime);

  } catch (error) {
    logger.error('Assessment extraction failed', error as Error);

    // Update job as failed
    try {
      const { jobId } = await req.json();
      await dbService.updateProcessingJob(jobId, {
        status: 'failed',
        error: (error as Error).message,
      });
    } catch {}

    return errorResponse(error as Error);
  }
});
