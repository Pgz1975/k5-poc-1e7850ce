/**
 * K5 Platform Assessment API Routes
 * Endpoints for creating, retrieving, and managing assessments
 */

import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { assessmentSchema } from '../validation/schemas';
import { ResponseFormatter, createPaginationMeta } from '../utils/response';

const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// POST /api/v1/assessments
// Create a new assessment
// ============================================================================

router.post('/', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const validatedData = assessmentSchema.parse(req.body);

    const { data: assessment, error } = await supabase
      .from('assessments')
      .insert({
        document_id: req.body.documentId,
        title: validatedData.title,
        description: validatedData.description,
        assessment_type: validatedData.assessmentType,
        grade_level: validatedData.gradeLevel,
        subject_area: validatedData.subjectArea,
        curriculum_standards: validatedData.curriculumStandards,
        total_points: validatedData.totalPoints,
        passing_score: validatedData.passingScore,
        time_limit: validatedData.timeLimit,
        created_by: req.auth.userId,
        metadata: validatedData.metadata,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create assessment: ${error.message}`);
    }

    // Insert questions
    const questionsWithAssessmentId = validatedData.questions.map((q) => ({
      assessment_id: assessment.id,
      question_number: q.questionNumber,
      question_text: q.questionText,
      question_type: q.questionType,
      points: q.points,
      correct_answer: q.correctAnswer,
      explanation: q.explanation,
      curriculum_standard: q.curriculumStandard,
      difficulty_level: q.difficultyLevel,
      image_url: q.imageUrl,
    }));

    const { data: questions, error: questionsError } = await supabase
      .from('assessment_questions')
      .insert(questionsWithAssessmentId)
      .select();

    if (questionsError) {
      throw new Error(`Failed to create questions: ${questionsError.message}`);
    }

    // Insert options for multiple choice questions
    for (const question of validatedData.questions) {
      if (question.options && question.options.length > 0) {
        const dbQuestion = questions.find(
          (q: any) => q.question_number === question.questionNumber
        );

        if (dbQuestion) {
          const optionsWithQuestionId = question.options.map((opt) => ({
            question_id: dbQuestion.id,
            option_text: opt.optionText,
            is_correct: opt.isCorrect,
            order: opt.order,
          }));

          await supabase
            .from('assessment_options')
            .insert(optionsWithQuestionId);
        }
      }
    }

    const response = formatter.created(
      {
        id: assessment.id,
        title: assessment.title,
        questionCount: questions.length,
      },
      `/api/v1/assessments/${assessment.id}`
    );

    return res.status(response.status).json(response.body);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(422).json(formatter.validationError(error.errors));
    }

    console.error('Create assessment error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// GET /api/v1/assessments/:id
// Get assessment by ID with questions
// ============================================================================

router.get('/:id', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const { id } = req.params;

    const { data: assessment, error } = await supabase
      .from('assessments')
      .select(`
        *,
        assessment_questions (
          *,
          assessment_options (*)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !assessment) {
      return res.status(404).json(formatter.notFound('Assessment'));
    }

    const response = formatter.success(assessment);
    return res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Get assessment error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// GET /api/v1/assessments
// List assessments with filtering
// ============================================================================

router.get('/', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('assessments')
      .select('*', { count: 'exact' });

    // Apply filters
    if (req.query.assessmentType) {
      query = query.eq('assessment_type', req.query.assessmentType);
    }
    if (req.query.gradeLevel) {
      query = query.contains('grade_level', [req.query.gradeLevel]);
    }
    if (req.query.subjectArea) {
      query = query.contains('subject_area', [req.query.subjectArea]);
    }

    query = query.range(offset, offset + limit - 1);

    const { data: assessments, error, count } = await query;

    if (error) {
      throw new Error(`Failed to list assessments: ${error.message}`);
    }

    const meta = createPaginationMeta(page, limit, count || 0);

    const response = formatter.success(assessments, meta);
    return res.status(response.status).json(response.body);
  } catch (error) {
    console.error('List assessments error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// POST /api/v1/assessments/:id/submit
// Submit assessment answers
// ============================================================================

router.post('/:id/submit', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const { id } = req.params;
    const { answers, studentId } = req.body;

    // Get assessment with correct answers
    const { data: assessment, error } = await supabase
      .from('assessments')
      .select(`
        *,
        assessment_questions (
          *,
          assessment_options (*)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !assessment) {
      return res.status(404).json(formatter.notFound('Assessment'));
    }

    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;
    const results: any[] = [];

    assessment.assessment_questions.forEach((question: any) => {
      totalPoints += question.points;
      const studentAnswer = answers[question.id];
      let isCorrect = false;

      if (question.question_type === 'multiple_choice') {
        const correctOption = question.assessment_options.find(
          (opt: any) => opt.is_correct
        );
        isCorrect = studentAnswer === correctOption?.id;
      } else {
        isCorrect = studentAnswer === question.correct_answer;
      }

      if (isCorrect) {
        earnedPoints += question.points;
      }

      results.push({
        questionId: question.id,
        studentAnswer,
        isCorrect,
        pointsEarned: isCorrect ? question.points : 0,
        explanation: question.explanation,
      });
    });

    const percentage = (earnedPoints / totalPoints) * 100;
    const passed = percentage >= (assessment.passing_score || 70);

    // Save submission
    const { data: submission, error: submissionError } = await supabase
      .from('assessment_submissions')
      .insert({
        assessment_id: id,
        student_id: studentId || req.auth.userId,
        answers,
        total_points: totalPoints,
        earned_points: earnedPoints,
        percentage,
        passed,
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (submissionError) {
      throw new Error(`Failed to save submission: ${submissionError.message}`);
    }

    const response = formatter.success({
      submissionId: submission.id,
      totalPoints,
      earnedPoints,
      percentage,
      passed,
      results,
    });

    return res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Submit assessment error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

export default router;
