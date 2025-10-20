/**
 * K5 Platform API Types
 * Comprehensive type definitions for the K5 educational platform API
 */

// ============================================================================
// Core Domain Types
// ============================================================================

export type GradeLevel = 'K' | '1' | '2' | '3' | '4' | '5';
export type Language = 'spanish' | 'english' | 'bilingual';
export type ContentType =
  | 'reading_passage'
  | 'assessment'
  | 'instructional_material'
  | 'activity_sheet'
  | 'teacher_guide';

export type ProcessingStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'validating';

export type SubjectArea =
  | 'reading'
  | 'comprehension'
  | 'vocabulary'
  | 'fluency'
  | 'writing'
  | 'grammar';

// ============================================================================
// PDF Document Types
// ============================================================================

export interface PDFDocument {
  id: string;
  filename: string;
  originalFilename: string;
  fileSize: number;
  storageBucket: string;
  storagePath: string;
  fileHash: string;
  contentType: ContentType;
  gradeLevel: GradeLevel[];
  subjectArea: SubjectArea[];
  primaryLanguage: Language;
  readingLevel?: string;
  curriculumStandards?: string[];
  processingStatus: ProcessingStatus;
  processingProgress?: number;
  processingError?: string;
  pageCount: number;
  uploadedBy?: string;
  uploadedAt: string;
  processedAt?: string;
  metadata?: Record<string, any>;
}

export interface PDFContent {
  id: string;
  documentId: string;
  pageNumber: number;
  textContent: string;
  rawText: string;
  detectedLanguage: Language;
  languageConfidence: number;
  wordCount: number;
  characterCount: number;
  contentHash: string;
  hasImages: boolean;
  imageCount: number;
  processingMetadata?: Record<string, any>;
}

export interface PDFImage {
  id: string;
  documentId: string;
  pageNumber: number;
  imageIndex: number;
  storagePath: string;
  thumbnailPath?: string;
  format: string;
  width: number;
  height: number;
  fileSize: number;
  alt?: string;
  caption?: string;
  processingMetadata?: Record<string, any>;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface UploadPDFRequest {
  file: File | Blob;
  contentType: ContentType;
  gradeLevel: GradeLevel[];
  subjectArea: SubjectArea[];
  primaryLanguage: Language;
  readingLevel?: string;
  curriculumStandards?: string[];
  metadata?: Record<string, any>;
}

export interface UploadPDFResponse {
  success: boolean;
  documentId: string;
  uploadUrl?: string;
  message: string;
  processingStarted: boolean;
}

export interface ProcessingProgress {
  documentId: string;
  status: ProcessingStatus;
  progress: number;
  currentStep: string;
  stepsCompleted: number;
  totalSteps: number;
  estimatedTimeRemaining?: number;
  error?: string;
}

export interface SearchRequest {
  query: string;
  filters?: {
    contentType?: ContentType[];
    gradeLevel?: GradeLevel[];
    subjectArea?: SubjectArea[];
    primaryLanguage?: Language[];
    readingLevel?: string;
  };
  pagination?: {
    page: number;
    limit: number;
  };
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface SearchResult {
  document: PDFDocument;
  relevance: number;
  highlights?: string[];
  matchedContent?: {
    pageNumber: number;
    excerpt: string;
  }[];
}

// ============================================================================
// Assessment Types
// ============================================================================

export interface Assessment {
  id: string;
  documentId: string;
  title: string;
  description?: string;
  assessmentType: 'diagnostic' | 'formative' | 'summative';
  gradeLevel: GradeLevel[];
  subjectArea: SubjectArea[];
  curriculumStandards: string[];
  questions: AssessmentQuestion[];
  totalPoints: number;
  passingScore: number;
  timeLimit?: number;
  metadata?: Record<string, any>;
}

export interface AssessmentQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  points: number;
  options?: AssessmentOption[];
  correctAnswer?: string | string[];
  explanation?: string;
  curriculumStandard?: string;
  difficultyLevel?: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
}

export interface AssessmentOption {
  id: string;
  optionText: string;
  isCorrect: boolean;
  order: number;
}

// ============================================================================
// Voice Recognition Types
// ============================================================================

export interface VoiceRecognitionRequest {
  audioData: Blob | ArrayBuffer;
  documentId?: string;
  pageNumber?: number;
  language: 'es' | 'en';
  expectedText?: string;
  studentId?: string;
}

export interface VoiceRecognitionResponse {
  success: boolean;
  transcription: string;
  confidence: number;
  fluencyScore?: number;
  accuracyScore?: number;
  wordsPerMinute?: number;
  errors?: VoiceRecognitionError[];
  feedback?: string;
}

export interface VoiceRecognitionError {
  type: 'mispronunciation' | 'omission' | 'insertion' | 'substitution';
  word: string;
  expectedWord?: string;
  position: number;
  confidence: number;
}

// ============================================================================
// Webhook Types
// ============================================================================

export interface WebhookEvent {
  id: string;
  type: WebhookEventType;
  timestamp: string;
  data: Record<string, any>;
  signature: string;
}

export type WebhookEventType =
  | 'pdf.upload.completed'
  | 'pdf.processing.started'
  | 'pdf.processing.completed'
  | 'pdf.processing.failed'
  | 'pdf.content.extracted'
  | 'pdf.images.processed'
  | 'assessment.created'
  | 'voice.recognition.completed';

export interface WebhookSubscription {
  id: string;
  url: string;
  events: WebhookEventType[];
  secret: string;
  active: boolean;
  createdAt: string;
  lastTriggered?: string;
}

// ============================================================================
// API Error Types
// ============================================================================

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  path?: string;
  requestId?: string;
}

export interface ValidationError extends APIError {
  code: 'VALIDATION_ERROR';
  fields: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
  value?: any;
}

// ============================================================================
// Rate Limiting Types
// ============================================================================

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

export interface QuotaInfo {
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  uploads: {
    used: number;
    limit: number;
    resetDate: string;
  };
  storage: {
    used: number;
    limit: number;
    unit: 'GB';
  };
  apiCalls: {
    used: number;
    limit: number;
    resetDate: string;
  };
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface DocumentAnalytics {
  documentId: string;
  views: number;
  downloads: number;
  voiceReadings: number;
  averageCompletionRate: number;
  averageFluencyScore?: number;
  lastAccessed?: string;
  topUsers?: string[];
}

export interface SystemMetrics {
  totalDocuments: number;
  totalStorage: number;
  processingQueue: number;
  averageProcessingTime: number;
  successRate: number;
  activeUsers: number;
  apiCallsToday: number;
}
