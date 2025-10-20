/**
 * K5 Platform Voice Recognition API Routes
 * Integration with OpenAI Realtime Voice API for reading fluency assessment
 */

import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { voiceRecognitionRequestSchema } from '../validation/schemas';
import { ResponseFormatter } from '../utils/response';
import type { VoiceRecognitionResponse, VoiceRecognitionError } from '../types';

const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// POST /api/v1/voice/recognize
// Recognize and assess voice reading
// ============================================================================

router.post('/recognize', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    // Validate request
    const validatedData = voiceRecognitionRequestSchema.parse(req.body);

    // Check if audio data is provided
    if (!req.files || !req.files.audio) {
      return res.status(400).json(
        formatter.error('MISSING_AUDIO', 'Audio file is required')
      );
    }

    const audioFile = Array.isArray(req.files.audio)
      ? req.files.audio[0]
      : req.files.audio;

    // Get expected text if documentId provided
    let expectedText = validatedData.expectedText;
    if (validatedData.documentId && validatedData.pageNumber && !expectedText) {
      const { data: content } = await supabase
        .from('pdf_content')
        .select('text_content')
        .eq('document_id', validatedData.documentId)
        .eq('page_number', validatedData.pageNumber)
        .single();

      expectedText = content?.text_content;
    }

    // Call OpenAI Whisper API for transcription
    const transcription = await transcribeAudio(
      audioFile.data,
      validatedData.language
    );

    // Calculate fluency metrics
    const fluencyMetrics = expectedText
      ? await calculateFluencyMetrics(
          transcription,
          expectedText,
          audioFile.size / 1024 // Convert to KB for duration estimation
        )
      : null;

    // Prepare response
    const response: VoiceRecognitionResponse = {
      success: true,
      transcription: transcription.text,
      confidence: transcription.confidence,
      fluencyScore: fluencyMetrics?.fluencyScore,
      accuracyScore: fluencyMetrics?.accuracyScore,
      wordsPerMinute: fluencyMetrics?.wordsPerMinute,
      errors: fluencyMetrics?.errors,
      feedback: fluencyMetrics?.feedback,
    };

    // Save voice reading session
    if (validatedData.studentId || req.auth.userId) {
      await supabase.from('voice_reading_sessions').insert({
        student_id: validatedData.studentId || req.auth.userId,
        document_id: validatedData.documentId,
        page_number: validatedData.pageNumber,
        transcription: transcription.text,
        expected_text: expectedText,
        fluency_score: fluencyMetrics?.fluencyScore,
        accuracy_score: fluencyMetrics?.accuracyScore,
        words_per_minute: fluencyMetrics?.wordsPerMinute,
        language: validatedData.language,
        audio_duration: transcription.duration,
        created_at: new Date().toISOString(),
      });
    }

    const formattedResponse = formatter.success(response);
    return res.status(formattedResponse.status).json(formattedResponse.body);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(422).json(formatter.validationError(error.errors));
    }

    console.error('Voice recognition error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// GET /api/v1/voice/sessions
// Get voice reading session history
// ============================================================================

router.get('/sessions', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const studentId = req.query.studentId as string || req.auth.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('voice_reading_sessions')
      .select('*', { count: 'exact' })
      .eq('student_id', studentId);

    if (req.query.documentId) {
      query = query.eq('document_id', req.query.documentId);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: sessions, error, count } = await query;

    if (error) {
      throw new Error(`Failed to get sessions: ${error.message}`);
    }

    const response = formatter.success(sessions, {
      page,
      limit,
      total: count || 0,
      hasMore: (count || 0) > offset + limit,
    });

    return res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Get sessions error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// GET /api/v1/voice/analytics
// Get voice reading analytics for a student
// ============================================================================

router.get('/analytics', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const studentId = req.query.studentId as string || req.auth.userId;
    const dateFrom = req.query.dateFrom as string;
    const dateTo = req.query.dateTo as string;

    // Get aggregated analytics
    const { data: analytics, error } = await supabase.rpc(
      'get_voice_reading_analytics',
      {
        p_student_id: studentId,
        p_date_from: dateFrom,
        p_date_to: dateTo,
      }
    );

    if (error) {
      throw new Error(`Failed to get analytics: ${error.message}`);
    }

    const response = formatter.success(analytics);
    return res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Get analytics error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Transcribe audio using OpenAI Whisper API
 */
async function transcribeAudio(
  audioData: Buffer,
  language: 'es' | 'en'
): Promise<{ text: string; confidence: number; duration: number }> {
  try {
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', audioData, 'audio.webm');
    form.append('model', 'whisper-1');
    form.append('language', language);
    form.append('response_format', 'verbose_json');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders(),
      },
      body: form,
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      text: result.text,
      confidence: result.segments?.reduce(
        (acc: number, seg: any) => acc + (seg.confidence || 0),
        0
      ) / (result.segments?.length || 1),
      duration: result.duration || 0,
    };
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

/**
 * Calculate fluency metrics
 */
async function calculateFluencyMetrics(
  transcribedText: string,
  expectedText: string,
  durationSeconds: number
): Promise<{
  fluencyScore: number;
  accuracyScore: number;
  wordsPerMinute: number;
  errors: VoiceRecognitionError[];
  feedback: string;
}> {
  // Normalize texts
  const normalizedTranscription = transcribedText.toLowerCase().trim();
  const normalizedExpected = expectedText.toLowerCase().trim();

  // Calculate word-level accuracy using Levenshtein distance
  const transcribedWords = normalizedTranscription.split(/\s+/);
  const expectedWords = normalizedExpected.split(/\s+/);

  const errors: VoiceRecognitionError[] = [];
  let correctWords = 0;

  // Simple word matching (can be enhanced with better algorithms)
  for (let i = 0; i < expectedWords.length; i++) {
    const expected = expectedWords[i];
    const transcribed = transcribedWords[i];

    if (expected === transcribed) {
      correctWords++;
    } else if (transcribed) {
      errors.push({
        type: 'substitution',
        word: transcribed,
        expectedWord: expected,
        position: i,
        confidence: 0.8,
      });
    } else {
      errors.push({
        type: 'omission',
        word: expected,
        position: i,
        confidence: 0.9,
      });
    }
  }

  // Check for insertions
  if (transcribedWords.length > expectedWords.length) {
    for (let i = expectedWords.length; i < transcribedWords.length; i++) {
      errors.push({
        type: 'insertion',
        word: transcribedWords[i],
        position: i,
        confidence: 0.7,
      });
    }
  }

  // Calculate metrics
  const accuracyScore = (correctWords / expectedWords.length) * 100;
  const wordsPerMinute = (transcribedWords.length / durationSeconds) * 60;

  // Calculate fluency score (combination of accuracy and speed)
  const targetWPM = 100; // Adjust based on grade level
  const speedScore = Math.min(100, (wordsPerMinute / targetWPM) * 100);
  const fluencyScore = (accuracyScore * 0.7 + speedScore * 0.3);

  // Generate feedback
  let feedback = '';
  if (fluencyScore >= 90) {
    feedback = 'Excellent reading! Your fluency and accuracy are outstanding.';
  } else if (fluencyScore >= 75) {
    feedback = 'Good reading! Keep practicing to improve your fluency.';
  } else if (fluencyScore >= 60) {
    feedback = 'You\'re making progress. Focus on accuracy and pacing.';
  } else {
    feedback = 'Keep practicing! Try reading slower to improve accuracy.';
  }

  return {
    fluencyScore: Math.round(fluencyScore),
    accuracyScore: Math.round(accuracyScore),
    wordsPerMinute: Math.round(wordsPerMinute),
    errors,
    feedback,
  };
}

export default router;
