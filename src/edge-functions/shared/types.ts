/**
 * Shared TypeScript types for Edge Functions
 */

export interface PDFMetadata {
  pageCount: number;
  author?: string;
  creationDate?: Date;
  modificationDate?: Date;
  title?: string;
  subject?: string;
  keywords?: string[];
  producer?: string;
  fileSize: number;
  version?: string;
}

export interface TextExtractionResult {
  text: string;
  language: 'en' | 'es' | 'es-PR';
  readingLevel?: number;
  confidence: number;
  pages: PageTextContent[];
  dialectMarkers?: DialectMarker[];
}

export interface PageTextContent {
  pageNumber: number;
  text: string;
  bounds: BoundingBox;
  formatting?: FormattingInfo;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FormattingInfo {
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
}

export interface DialectMarker {
  text: string;
  type: 'vocabulary' | 'grammar' | 'syntax';
  confidence: number;
  position: number;
}

export interface ImageExtractionResult {
  images: ExtractedImage[];
  thumbnails: Thumbnail[];
  totalImages: number;
}

export interface ExtractedImage {
  id: string;
  pageNumber: number;
  format: string;
  width: number;
  height: number;
  bounds: BoundingBox;
  hash: string;
  optimizedUrl?: string;
  ocrText?: string;
  fileSize: number;
}

export interface Thumbnail {
  imageId: string;
  url: string;
  width: number;
  height: number;
}

export interface CorrelationResult {
  correlations: ImageTextCorrelation[];
  confidence: number;
}

export interface ImageTextCorrelation {
  imageId: string;
  textContent: string;
  proximity: number;
  contextBefore: string;
  contextAfter: string;
  pageNumber: number;
  confidence: number;
}

export interface Assessment {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  pageNumber: number;
  standard?: K5Standard;
  difficulty?: number;
}

export interface K5Standard {
  code: string;
  description: string;
  grade: 'K' | '1' | '2' | '3' | '4' | '5';
  subject: string;
}

export interface ProcessingJob {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
  results?: ProcessingResults;
}

export interface ProcessingResults {
  metadata: PDFMetadata;
  textExtraction?: TextExtractionResult;
  imageExtraction?: ImageExtractionResult;
  correlations?: CorrelationResult;
  assessments?: Assessment[];
}

export interface EdgeFunctionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
  metadata?: ResponseMetadata;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ResponseMetadata {
  processingTime: number;
  timestamp: Date;
  version: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface ChunkInfo {
  chunkId: string;
  totalChunks: number;
  chunkIndex: number;
  chunkSize: number;
}
