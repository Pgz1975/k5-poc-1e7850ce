/**
 * Shared utility functions for Edge Functions
 */

import { ErrorResponse, RateLimitInfo } from './types.ts';

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorResponse = (
  error: Error | AppError,
  statusCode: number = 500
): Response => {
  const errorData: ErrorResponse = {
    code: error instanceof AppError ? error.code : 'INTERNAL_ERROR',
    message: error.message,
    details: error instanceof AppError ? error.details : undefined,
  };

  return new Response(
    JSON.stringify({
      success: false,
      error: errorData,
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    }),
    {
      status: error instanceof AppError ? error.statusCode : statusCode,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export const successResponse = <T>(
  data: T,
  processingTime: number,
  statusCode: number = 200
): Response => {
  return new Response(
    JSON.stringify({
      success: true,
      data,
      metadata: {
        processingTime,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    }),
    {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000 // 1 minute
  ) {}

  check(identifier: string): RateLimitInfo {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);

    const remaining = Math.max(0, this.maxRequests - validRequests.length);
    const reset = new Date(now + this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      throw new AppError(
        'RATE_LIMIT_EXCEEDED',
        'Too many requests',
        429,
        { limit: this.maxRequests, reset }
      );
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return {
      limit: this.maxRequests,
      remaining,
      reset,
    };
  }
}

export const validatePDF = async (file: File): Promise<void> => {
  const MAX_SIZE = 100 * 1024 * 1024; // 100MB

  if (!file) {
    throw new AppError('INVALID_INPUT', 'No file provided', 400);
  }

  if (file.size > MAX_SIZE) {
    throw new AppError(
      'FILE_TOO_LARGE',
      `File size exceeds maximum of ${MAX_SIZE / 1024 / 1024}MB`,
      400,
      { fileSize: file.size, maxSize: MAX_SIZE }
    );
  }

  if (file.type !== 'application/pdf') {
    throw new AppError(
      'INVALID_FILE_TYPE',
      'File must be a PDF',
      400,
      { providedType: file.type }
    );
  }

  // Check PDF magic number
  const buffer = await file.slice(0, 5).arrayBuffer();
  const header = new TextDecoder().decode(buffer);

  if (!header.startsWith('%PDF-')) {
    throw new AppError(
      'INVALID_PDF',
      'File is not a valid PDF document',
      400
    );
  }
};

export const calculateHash = async (data: Uint8Array): Promise<string> => {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
};

export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
};

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private log(level: string, message: string, data?: Record<string, unknown>) {
    console.log(JSON.stringify({
      level,
      context: this.context,
      message,
      data,
      timestamp: new Date().toISOString(),
    }));
  }

  info(message: string, data?: Record<string, unknown>) {
    this.log('INFO', message, data);
  }

  warn(message: string, data?: Record<string, unknown>) {
    this.log('WARN', message, data);
  }

  error(message: string, error?: Error, data?: Record<string, unknown>) {
    this.log('ERROR', message, {
      ...data,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
    });
  }

  debug(message: string, data?: Record<string, unknown>) {
    this.log('DEBUG', message, data);
  }
}
