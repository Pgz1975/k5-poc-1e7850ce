/**
 * K5 Platform API Validation Schemas
 * Zod schemas for request validation
 */

import { z } from 'zod';

// ============================================================================
// Enum Schemas
// ============================================================================

export const gradeLevelSchema = z.enum(['K', '1', '2', '3', '4', '5']);

export const languageSchema = z.enum(['spanish', 'english', 'bilingual']);

export const contentTypeSchema = z.enum([
  'reading_passage',
  'assessment',
  'instructional_material',
  'activity_sheet',
  'teacher_guide',
]);

export const subjectAreaSchema = z.enum([
  'reading',
  'comprehension',
  'vocabulary',
  'fluency',
  'writing',
  'grammar',
]);

export const processingStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
  'validating',
]);

// ============================================================================
// PDF Upload Schemas
// ============================================================================

export const uploadPDFSchema = z.object({
  contentType: contentTypeSchema,
  gradeLevel: z.array(gradeLevelSchema).min(1, 'At least one grade level required'),
  subjectArea: z.array(subjectAreaSchema).min(1, 'At least one subject area required'),
  primaryLanguage: languageSchema,
  readingLevel: z.string().optional(),
  curriculumStandards: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

export const uploadPDFResponseSchema = z.object({
  success: z.boolean(),
  documentId: z.string().uuid(),
  uploadUrl: z.string().url().optional(),
  message: z.string(),
  processingStarted: z.boolean(),
});

// ============================================================================
// Search Schemas
// ============================================================================

export const searchRequestSchema = z.object({
  query: z.string().min(1, 'Query cannot be empty').max(500, 'Query too long'),
  filters: z.object({
    contentType: z.array(contentTypeSchema).optional(),
    gradeLevel: z.array(gradeLevelSchema).optional(),
    subjectArea: z.array(subjectAreaSchema).optional(),
    primaryLanguage: z.array(languageSchema).optional(),
    readingLevel: z.string().optional(),
  }).optional(),
  pagination: z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
  }).optional(),
  sort: z.object({
    field: z.string(),
    order: z.enum(['asc', 'desc']),
  }).optional(),
});

export const searchResponseSchema = z.object({
  results: z.array(z.any()),
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  hasMore: z.boolean(),
});

// ============================================================================
// Assessment Schemas
// ============================================================================

export const assessmentQuestionSchema = z.object({
  id: z.string().uuid(),
  questionNumber: z.number().int().min(1),
  questionText: z.string().min(1, 'Question text required'),
  questionType: z.enum(['multiple_choice', 'true_false', 'short_answer', 'essay']),
  points: z.number().min(0),
  options: z.array(z.object({
    id: z.string().uuid(),
    optionText: z.string(),
    isCorrect: z.boolean(),
    order: z.number().int(),
  })).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]).optional(),
  explanation: z.string().optional(),
  curriculumStandard: z.string().optional(),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']).optional(),
  imageUrl: z.string().url().optional(),
});

export const assessmentSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  assessmentType: z.enum(['diagnostic', 'formative', 'summative']),
  gradeLevel: z.array(gradeLevelSchema).min(1),
  subjectArea: z.array(subjectAreaSchema).min(1),
  curriculumStandards: z.array(z.string()),
  questions: z.array(assessmentQuestionSchema).min(3, 'Minimum 3 questions required'),
  totalPoints: z.number().min(0),
  passingScore: z.number().min(0),
  timeLimit: z.number().int().min(0).optional(),
  metadata: z.record(z.any()).optional(),
});

// ============================================================================
// Voice Recognition Schemas
// ============================================================================

export const voiceRecognitionRequestSchema = z.object({
  documentId: z.string().uuid().optional(),
  pageNumber: z.number().int().min(1).optional(),
  language: z.enum(['es', 'en']),
  expectedText: z.string().optional(),
  studentId: z.string().uuid().optional(),
});

export const voiceRecognitionResponseSchema = z.object({
  success: z.boolean(),
  transcription: z.string(),
  confidence: z.number().min(0).max(1),
  fluencyScore: z.number().min(0).max(100).optional(),
  accuracyScore: z.number().min(0).max(100).optional(),
  wordsPerMinute: z.number().min(0).optional(),
  errors: z.array(z.object({
    type: z.enum(['mispronunciation', 'omission', 'insertion', 'substitution']),
    word: z.string(),
    expectedWord: z.string().optional(),
    position: z.number().int(),
    confidence: z.number().min(0).max(1),
  })).optional(),
  feedback: z.string().optional(),
});

// ============================================================================
// Webhook Schemas
// ============================================================================

export const webhookEventTypeSchema = z.enum([
  'pdf.upload.completed',
  'pdf.processing.started',
  'pdf.processing.completed',
  'pdf.processing.failed',
  'pdf.content.extracted',
  'pdf.images.processed',
  'assessment.created',
  'voice.recognition.completed',
]);

export const webhookSubscriptionSchema = z.object({
  url: z.string().url('Valid webhook URL required'),
  events: z.array(webhookEventTypeSchema).min(1, 'At least one event type required'),
  secret: z.string().min(32, 'Secret must be at least 32 characters'),
  active: z.boolean().default(true),
});

export const webhookEventSchema = z.object({
  id: z.string().uuid(),
  type: webhookEventTypeSchema,
  timestamp: z.string().datetime(),
  data: z.record(z.any()),
  signature: z.string(),
});

// ============================================================================
// Pagination Schemas
// ============================================================================

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// ============================================================================
// Document Query Schemas
// ============================================================================

export const documentQuerySchema = z.object({
  id: z.string().uuid().optional(),
  contentType: contentTypeSchema.optional(),
  gradeLevel: z.array(gradeLevelSchema).optional(),
  subjectArea: z.array(subjectAreaSchema).optional(),
  primaryLanguage: languageSchema.optional(),
  processingStatus: processingStatusSchema.optional(),
  uploadedBy: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  ...paginationSchema.shape,
});

// ============================================================================
// Analytics Schemas
// ============================================================================

export const analyticsQuerySchema = z.object({
  documentId: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  groupBy: z.enum(['day', 'week', 'month']).optional(),
  metrics: z.array(z.enum([
    'views',
    'downloads',
    'voiceReadings',
    'completionRate',
    'fluencyScore',
  ])).optional(),
});

// ============================================================================
// Export all schemas
// ============================================================================

export const schemas = {
  gradeLevel: gradeLevelSchema,
  language: languageSchema,
  contentType: contentTypeSchema,
  subjectArea: subjectAreaSchema,
  processingStatus: processingStatusSchema,
  uploadPDF: uploadPDFSchema,
  uploadPDFResponse: uploadPDFResponseSchema,
  searchRequest: searchRequestSchema,
  searchResponse: searchResponseSchema,
  assessment: assessmentSchema,
  assessmentQuestion: assessmentQuestionSchema,
  voiceRecognitionRequest: voiceRecognitionRequestSchema,
  voiceRecognitionResponse: voiceRecognitionResponseSchema,
  webhookEventType: webhookEventTypeSchema,
  webhookSubscription: webhookSubscriptionSchema,
  webhookEvent: webhookEventSchema,
  pagination: paginationSchema,
  documentQuery: documentQuerySchema,
  analyticsQuery: analyticsQuerySchema,
};

export type UploadPDFInput = z.infer<typeof uploadPDFSchema>;
export type SearchRequestInput = z.infer<typeof searchRequestSchema>;
export type AssessmentInput = z.infer<typeof assessmentSchema>;
export type VoiceRecognitionRequestInput = z.infer<typeof voiceRecognitionRequestSchema>;
export type WebhookSubscriptionInput = z.infer<typeof webhookSubscriptionSchema>;
export type DocumentQueryInput = z.infer<typeof documentQuerySchema>;
export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
