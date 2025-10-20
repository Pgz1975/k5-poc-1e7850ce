/**
 * K5 Platform TypeScript/JavaScript Client SDK
 * Type-safe client for interacting with the K5 API
 */

import type {
  PDFDocument,
  UploadPDFRequest,
  UploadPDFResponse,
  SearchRequest,
  SearchResponse,
  Assessment,
  VoiceRecognitionRequest,
  VoiceRecognitionResponse,
  WebhookSubscription,
  ProcessingProgress,
  QuotaInfo,
} from '../types';

// ============================================================================
// Client Configuration
// ============================================================================

export interface K5ClientConfig {
  baseUrl: string;
  apiKey?: string;
  token?: string;
  timeout?: number;
  retries?: number;
}

export interface RequestOptions {
  method: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

// ============================================================================
// K5 API Client
// ============================================================================

export class K5Client {
  private config: Required<K5ClientConfig>;

  constructor(config: K5ClientConfig) {
    this.config = {
      baseUrl: config.baseUrl.replace(/\/$/, ''), // Remove trailing slash
      apiKey: config.apiKey || '',
      token: config.token || '',
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
    };
  }

  // ==========================================================================
  // PDF Document Methods
  // ==========================================================================

  /**
   * Upload a PDF document
   */
  async uploadPDF(
    file: File | Blob,
    metadata: Omit<UploadPDFRequest, 'file'>
  ): Promise<UploadPDFResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', metadata.contentType);
    formData.append('gradeLevel', JSON.stringify(metadata.gradeLevel));
    formData.append('subjectArea', JSON.stringify(metadata.subjectArea));
    formData.append('primaryLanguage', metadata.primaryLanguage);

    if (metadata.readingLevel) {
      formData.append('readingLevel', metadata.readingLevel);
    }
    if (metadata.curriculumStandards) {
      formData.append('curriculumStandards', JSON.stringify(metadata.curriculumStandards));
    }
    if (metadata.metadata) {
      formData.append('metadata', JSON.stringify(metadata.metadata));
    }

    return this.request<UploadPDFResponse>('/pdf/upload', {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Get PDF document by ID
   */
  async getDocument(id: string): Promise<PDFDocument> {
    return this.request<PDFDocument>(`/pdf/${id}`, {
      method: 'GET',
    });
  }

  /**
   * List PDF documents
   */
  async listDocuments(params?: {
    contentType?: string;
    gradeLevel?: string[];
    page?: number;
    limit?: number;
  }): Promise<{ items: PDFDocument[]; total: number; hasMore: boolean }> {
    const queryParams = new URLSearchParams();
    if (params?.contentType) queryParams.append('contentType', params.contentType);
    if (params?.gradeLevel) queryParams.append('gradeLevel', params.gradeLevel.join(','));
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return this.request(`/pdf?${queryParams.toString()}`, {
      method: 'GET',
    });
  }

  /**
   * Get PDF content
   */
  async getContent(documentId: string, pageNumber?: number): Promise<any> {
    const url = pageNumber
      ? `/pdf/${documentId}/content?page=${pageNumber}`
      : `/pdf/${documentId}/content`;

    return this.request(url, { method: 'GET' });
  }

  /**
   * Get PDF images
   */
  async getImages(documentId: string, pageNumber?: number): Promise<any> {
    const url = pageNumber
      ? `/pdf/${documentId}/images?page=${pageNumber}`
      : `/pdf/${documentId}/images`;

    return this.request(url, { method: 'GET' });
  }

  /**
   * Get processing progress
   */
  async getProgress(documentId: string): Promise<ProcessingProgress> {
    return this.request<ProcessingProgress>(`/pdf/${documentId}/progress`, {
      method: 'GET',
    });
  }

  /**
   * Delete PDF document
   */
  async deleteDocument(id: string): Promise<void> {
    await this.request(`/pdf/${id}`, { method: 'DELETE' });
  }

  // ==========================================================================
  // Search Methods
  // ==========================================================================

  /**
   * Search educational content
   */
  async search(request: SearchRequest): Promise<SearchResponse> {
    return this.request<SearchResponse>('/search', {
      method: 'POST',
      body: request,
    });
  }

  /**
   * Get search suggestions
   */
  async getSuggestions(query: string, limit?: number): Promise<string[]> {
    const params = new URLSearchParams({ q: query });
    if (limit) params.append('limit', limit.toString());

    const response = await this.request<{ suggestions: string[] }>(
      `/search/suggestions?${params.toString()}`,
      { method: 'GET' }
    );

    return response.suggestions;
  }

  // ==========================================================================
  // Assessment Methods
  // ==========================================================================

  /**
   * Create assessment
   */
  async createAssessment(assessment: any): Promise<Assessment> {
    return this.request<Assessment>('/assessments', {
      method: 'POST',
      body: assessment,
    });
  }

  /**
   * Get assessment by ID
   */
  async getAssessment(id: string): Promise<Assessment> {
    return this.request<Assessment>(`/assessments/${id}`, {
      method: 'GET',
    });
  }

  /**
   * List assessments
   */
  async listAssessments(params?: {
    assessmentType?: string;
    gradeLevel?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: Assessment[]; total: number; hasMore: boolean }> {
    const queryParams = new URLSearchParams();
    if (params?.assessmentType) queryParams.append('assessmentType', params.assessmentType);
    if (params?.gradeLevel) queryParams.append('gradeLevel', params.gradeLevel);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return this.request(`/assessments?${queryParams.toString()}`, {
      method: 'GET',
    });
  }

  /**
   * Submit assessment answers
   */
  async submitAssessment(
    assessmentId: string,
    answers: Record<string, any>,
    studentId?: string
  ): Promise<any> {
    return this.request(`/assessments/${assessmentId}/submit`, {
      method: 'POST',
      body: { answers, studentId },
    });
  }

  // ==========================================================================
  // Voice Recognition Methods
  // ==========================================================================

  /**
   * Recognize voice reading
   */
  async recognizeVoice(
    audioFile: Blob,
    options: Omit<VoiceRecognitionRequest, 'audioData'>
  ): Promise<VoiceRecognitionResponse> {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('language', options.language);

    if (options.documentId) formData.append('documentId', options.documentId);
    if (options.pageNumber) formData.append('pageNumber', options.pageNumber.toString());
    if (options.expectedText) formData.append('expectedText', options.expectedText);
    if (options.studentId) formData.append('studentId', options.studentId);

    return this.request<VoiceRecognitionResponse>('/voice/recognize', {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Get voice reading sessions
   */
  async getVoiceSessions(params?: {
    studentId?: string;
    documentId?: string;
    page?: number;
    limit?: number;
  }): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.studentId) queryParams.append('studentId', params.studentId);
    if (params?.documentId) queryParams.append('documentId', params.documentId);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return this.request(`/voice/sessions?${queryParams.toString()}`, {
      method: 'GET',
    });
  }

  /**
   * Get voice analytics
   */
  async getVoiceAnalytics(studentId: string, dateFrom?: string, dateTo?: string): Promise<any> {
    const queryParams = new URLSearchParams({ studentId });
    if (dateFrom) queryParams.append('dateFrom', dateFrom);
    if (dateTo) queryParams.append('dateTo', dateTo);

    return this.request(`/voice/analytics?${queryParams.toString()}`, {
      method: 'GET',
    });
  }

  // ==========================================================================
  // Webhook Methods
  // ==========================================================================

  /**
   * Create webhook subscription
   */
  async createWebhook(webhook: {
    url: string;
    events: string[];
    secret?: string;
  }): Promise<WebhookSubscription> {
    return this.request<WebhookSubscription>('/webhooks/subscriptions', {
      method: 'POST',
      body: webhook,
    });
  }

  /**
   * List webhook subscriptions
   */
  async listWebhooks(): Promise<WebhookSubscription[]> {
    return this.request<WebhookSubscription[]>('/webhooks/subscriptions', {
      method: 'GET',
    });
  }

  /**
   * Get webhook subscription
   */
  async getWebhook(id: string): Promise<WebhookSubscription> {
    return this.request<WebhookSubscription>(`/webhooks/subscriptions/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Update webhook subscription
   */
  async updateWebhook(id: string, updates: Partial<WebhookSubscription>): Promise<WebhookSubscription> {
    return this.request<WebhookSubscription>(`/webhooks/subscriptions/${id}`, {
      method: 'PATCH',
      body: updates,
    });
  }

  /**
   * Delete webhook subscription
   */
  async deleteWebhook(id: string): Promise<void> {
    await this.request(`/webhooks/subscriptions/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Test webhook
   */
  async testWebhook(id: string): Promise<any> {
    return this.request(`/webhooks/test/${id}`, {
      method: 'POST',
    });
  }

  // ==========================================================================
  // Analytics & Quota Methods
  // ==========================================================================

  /**
   * Get quota information
   */
  async getQuota(): Promise<QuotaInfo> {
    return this.request<QuotaInfo>('/quota', {
      method: 'GET',
    });
  }

  /**
   * Get document analytics
   */
  async getDocumentAnalytics(documentId: string): Promise<any> {
    return this.request(`/analytics/documents/${documentId}`, {
      method: 'GET',
    });
  }

  // ==========================================================================
  // Core Request Method
  // ==========================================================================

  private async request<T>(
    endpoint: string,
    options: Partial<RequestOptions>
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      ...options.headers,
    };

    // Add authentication
    if (this.config.token) {
      headers['Authorization'] = `Bearer ${this.config.token}`;
    } else if (this.config.apiKey) {
      headers['Authorization'] = `ApiKey ${this.config.apiKey}`;
    }

    // Add content-type for JSON requests
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const requestOptions: RequestInit = {
      method: options.method || 'GET',
      headers,
      body: options.body instanceof FormData
        ? options.body
        : options.body
        ? JSON.stringify(options.body)
        : undefined,
    };

    try {
      const response = await this.fetchWithRetry(url, requestOptions);

      if (!response.ok) {
        const error = await response.json();
        throw new K5APIError(
          error.error?.message || 'Request failed',
          response.status,
          error.error?.code || 'UNKNOWN_ERROR',
          error.error?.details
        );
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      if (error instanceof K5APIError) {
        throw error;
      }
      throw new K5APIError(
        error instanceof Error ? error.message : 'Unknown error',
        500,
        'NETWORK_ERROR'
      );
    }
  }

  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries: number = this.config.retries
  ): Promise<Response> {
    for (let i = 0; i <= retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Don't retry on 4xx errors (client errors)
        if (response.status >= 400 && response.status < 500) {
          return response;
        }

        // Retry on 5xx errors and network errors
        if (response.status >= 500 && i < retries) {
          await this.delay(Math.pow(2, i) * 1000); // Exponential backoff
          continue;
        }

        return response;
      } catch (error) {
        if (i === retries) {
          throw error;
        }
        await this.delay(Math.pow(2, i) * 1000);
      }
    }

    throw new Error('Max retries exceeded');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Update authentication token
   */
  setToken(token: string): void {
    this.config.token = token;
    this.config.apiKey = '';
  }

  /**
   * Update API key
   */
  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
    this.config.token = '';
  }
}

// ============================================================================
// Error Class
// ============================================================================

export class K5APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'K5APIError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      details: this.details,
    };
  }
}

// ============================================================================
// Factory Function
// ============================================================================

export function createK5Client(config: K5ClientConfig): K5Client {
  return new K5Client(config);
}

// ============================================================================
// Usage Example
// ============================================================================

/**
 * Example usage:
 *
 * ```typescript
 * import { createK5Client } from './k5-client';
 *
 * // Initialize client
 * const client = createK5Client({
 *   baseUrl: 'https://api.k5platform.com/v1',
 *   token: 'your-jwt-token',
 *   timeout: 30000,
 * });
 *
 * // Upload PDF
 * const response = await client.uploadPDF(file, {
 *   contentType: 'reading_passage',
 *   gradeLevel: ['3', '4'],
 *   subjectArea: ['reading', 'comprehension'],
 *   primaryLanguage: 'spanish',
 * });
 *
 * // Search content
 * const results = await client.search({
 *   query: 'comprensión lectora',
 *   filters: {
 *     gradeLevel: ['3'],
 *     primaryLanguage: ['spanish'],
 *   },
 *   pagination: { page: 1, limit: 20 },
 * });
 *
 * // Subscribe to progress (requires separate WebSocket setup)
 * ```
 */
