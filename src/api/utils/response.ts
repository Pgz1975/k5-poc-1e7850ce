/**
 * K5 Platform API Response Utilities
 * Standardized response formatters and error handlers
 */

import type { APIError, ValidationError, FieldError } from '../types';

// ============================================================================
// Response Types
// ============================================================================

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  meta?: ResponseMeta;
  timestamp: string;
  requestId?: string;
}

export interface ErrorResponse {
  success: false;
  error: APIError;
  timestamp: string;
  requestId?: string;
}

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  hasMore?: boolean;
  processingTime?: number;
}

// ============================================================================
// HTTP Status Codes
// ============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ============================================================================
// Error Codes
// ============================================================================

export const ERROR_CODES = {
  // Authentication & Authorization
  MISSING_AUTH: 'MISSING_AUTH',
  INVALID_TOKEN: 'INVALID_TOKEN',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  INVALID_API_KEY: 'INVALID_API_KEY',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

  // Rate Limiting & Quotas
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',

  // Resources
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_LOCKED: 'RESOURCE_LOCKED',

  // Processing
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  EXTRACTION_FAILED: 'EXTRACTION_FAILED',

  // External Services
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',

  // Generic
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const;

// ============================================================================
// Response Formatters
// ============================================================================

export class ResponseFormatter {
  private requestId: string;

  constructor(requestId?: string) {
    this.requestId = requestId || this.generateRequestId();
  }

  /**
   * Format success response
   */
  success<T>(data: T, meta?: ResponseMeta, statusCode: number = HTTP_STATUS.OK): {
    status: number;
    body: SuccessResponse<T>;
  } {
    return {
      status: statusCode,
      body: {
        success: true,
        data,
        meta,
        timestamp: new Date().toISOString(),
        requestId: this.requestId,
      },
    };
  }

  /**
   * Format created response
   */
  created<T>(data: T, location?: string): {
    status: number;
    body: SuccessResponse<T>;
    headers?: Record<string, string>;
  } {
    const response = this.success(data, undefined, HTTP_STATUS.CREATED);
    return location
      ? { ...response, headers: { Location: location } }
      : response;
  }

  /**
   * Format no content response
   */
  noContent(): {
    status: number;
    body?: null;
  } {
    return {
      status: HTTP_STATUS.NO_CONTENT,
    };
  }

  /**
   * Format error response
   */
  error(
    code: string,
    message: string,
    statusCode: number = HTTP_STATUS.BAD_REQUEST,
    details?: Record<string, any>
  ): {
    status: number;
    body: ErrorResponse;
  } {
    return {
      status: statusCode,
      body: {
        success: false,
        error: {
          code,
          message,
          details,
          timestamp: new Date().toISOString(),
          requestId: this.requestId,
        },
        timestamp: new Date().toISOString(),
        requestId: this.requestId,
      },
    };
  }

  /**
   * Format validation error
   */
  validationError(fields: FieldError[]): {
    status: number;
    body: ErrorResponse;
  } {
    return {
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      body: {
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Validation failed',
          details: { fields },
          timestamp: new Date().toISOString(),
          requestId: this.requestId,
        } as ValidationError,
        timestamp: new Date().toISOString(),
        requestId: this.requestId,
      },
    };
  }

  /**
   * Format not found error
   */
  notFound(resource: string = 'Resource'): {
    status: number;
    body: ErrorResponse;
  } {
    return this.error(
      ERROR_CODES.RESOURCE_NOT_FOUND,
      `${resource} not found`,
      HTTP_STATUS.NOT_FOUND
    );
  }

  /**
   * Format unauthorized error
   */
  unauthorized(message: string = 'Unauthorized'): {
    status: number;
    body: ErrorResponse;
  } {
    return this.error(
      ERROR_CODES.INVALID_TOKEN,
      message,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  /**
   * Format forbidden error
   */
  forbidden(message: string = 'Forbidden'): {
    status: number;
    body: ErrorResponse;
  } {
    return this.error(
      ERROR_CODES.INSUFFICIENT_PERMISSIONS,
      message,
      HTTP_STATUS.FORBIDDEN
    );
  }

  /**
   * Format rate limit error
   */
  rateLimitExceeded(retryAfter: number): {
    status: number;
    body: ErrorResponse;
    headers: Record<string, string>;
  } {
    const response = this.error(
      ERROR_CODES.RATE_LIMIT_EXCEEDED,
      'Too many requests',
      HTTP_STATUS.TOO_MANY_REQUESTS,
      { retryAfter }
    );
    return {
      ...response,
      headers: {
        'Retry-After': retryAfter.toString(),
      },
    };
  }

  /**
   * Format internal server error
   */
  internalError(error?: any): {
    status: number;
    body: ErrorResponse;
  } {
    const details = process.env.NODE_ENV === 'development'
      ? { originalError: error?.message || error }
      : undefined;

    return this.error(
      ERROR_CODES.INTERNAL_ERROR,
      'Internal server error',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      details
    );
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create response formatter with request ID
 */
export function createResponseFormatter(requestId?: string): ResponseFormatter {
  return new ResponseFormatter(requestId);
}

/**
 * Extract request ID from headers
 */
export function getRequestId(req: any): string | undefined {
  return req.headers?.['x-request-id'] ||
         req.headers?.get?.('x-request-id') ||
         undefined;
}

/**
 * Format Zod validation errors
 */
export function formatZodErrors(error: any): FieldError[] {
  if (!error.errors || !Array.isArray(error.errors)) {
    return [];
  }

  return error.errors.map((err: any) => ({
    field: err.path.join('.'),
    message: err.message,
    value: err.received,
  }));
}

/**
 * Safe error handler that never throws
 */
export function safeErrorHandler(
  error: any,
  requestId?: string
): {
  status: number;
  body: ErrorResponse;
} {
  try {
    const formatter = new ResponseFormatter(requestId);

    // Handle known error types
    if (error.name === 'ZodError') {
      return formatter.validationError(formatZodErrors(error));
    }

    if (error.code && error.message) {
      const statusCode = getStatusCodeForError(error.code);
      return formatter.error(error.code, error.message, statusCode, error.details);
    }

    return formatter.internalError(error);
  } catch {
    // Last resort fallback
    return {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'An unexpected error occurred',
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      },
    };
  }
}

/**
 * Get appropriate HTTP status code for error code
 */
export function getStatusCodeForError(code: string): number {
  const statusMap: Record<string, number> = {
    [ERROR_CODES.MISSING_AUTH]: HTTP_STATUS.UNAUTHORIZED,
    [ERROR_CODES.INVALID_TOKEN]: HTTP_STATUS.UNAUTHORIZED,
    [ERROR_CODES.EXPIRED_TOKEN]: HTTP_STATUS.UNAUTHORIZED,
    [ERROR_CODES.INSUFFICIENT_PERMISSIONS]: HTTP_STATUS.FORBIDDEN,
    [ERROR_CODES.INVALID_API_KEY]: HTTP_STATUS.UNAUTHORIZED,
    [ERROR_CODES.VALIDATION_ERROR]: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    [ERROR_CODES.INVALID_INPUT]: HTTP_STATUS.BAD_REQUEST,
    [ERROR_CODES.MISSING_REQUIRED_FIELD]: HTTP_STATUS.BAD_REQUEST,
    [ERROR_CODES.RATE_LIMIT_EXCEEDED]: HTTP_STATUS.TOO_MANY_REQUESTS,
    [ERROR_CODES.QUOTA_EXCEEDED]: HTTP_STATUS.TOO_MANY_REQUESTS,
    [ERROR_CODES.RESOURCE_NOT_FOUND]: HTTP_STATUS.NOT_FOUND,
    [ERROR_CODES.RESOURCE_ALREADY_EXISTS]: HTTP_STATUS.CONFLICT,
    [ERROR_CODES.RESOURCE_LOCKED]: HTTP_STATUS.CONFLICT,
    [ERROR_CODES.PROCESSING_FAILED]: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    [ERROR_CODES.UPLOAD_FAILED]: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    [ERROR_CODES.EXTRACTION_FAILED]: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: HTTP_STATUS.SERVICE_UNAVAILABLE,
    [ERROR_CODES.DATABASE_ERROR]: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    [ERROR_CODES.STORAGE_ERROR]: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    [ERROR_CODES.NOT_IMPLEMENTED]: HTTP_STATUS.NOT_FOUND,
  };

  return statusMap[code] || HTTP_STATUS.INTERNAL_SERVER_ERROR;
}

/**
 * Create pagination metadata
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): ResponseMeta {
  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;

  return {
    page,
    limit,
    total,
    hasMore,
  };
}
