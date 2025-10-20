import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

/**
 * Custom error classes
 */
export class ValidationError extends Error implements ApiError {
  statusCode = 400;
  code = 'VALIDATION_ERROR';
  details?: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class AuthenticationError extends Error implements ApiError {
  statusCode = 401;
  code = 'AUTHENTICATION_ERROR';

  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error implements ApiError {
  statusCode = 403;
  code = 'AUTHORIZATION_ERROR';

  constructor(message: string = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error implements ApiError {
  statusCode = 404;
  code = 'NOT_FOUND';

  constructor(resource: string = 'Resource') {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error implements ApiError {
  statusCode = 409;
  code = 'CONFLICT';

  constructor(message: string = 'Resource conflict') {
    super(message);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends Error implements ApiError {
  statusCode = 429;
  code = 'RATE_LIMIT_EXCEEDED';
  details?: any;

  constructor(message: string = 'Too many requests', details?: any) {
    super(message);
    this.name = 'RateLimitError';
    this.details = details;
  }
}

export class InternalServerError extends Error implements ApiError {
  statusCode = 500;
  code = 'INTERNAL_SERVER_ERROR';

  constructor(message: string = 'Internal server error') {
    super(message);
    this.name = 'InternalServerError';
  }
}

/**
 * Error handler middleware
 */
export const errorHandler = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for debugging
  console.error('Error occurred:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code
    }));

    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request parameters',
        details: formattedErrors
      }
    });
    return;
  }

  // Handle custom API errors
  const apiError = error as ApiError;
  const statusCode = apiError.statusCode || 500;
  const errorCode = apiError.code || 'INTERNAL_SERVER_ERROR';

  // Don't expose internal error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const errorResponse: any = {
    success: false,
    error: {
      code: errorCode,
      message: error.message || 'An error occurred'
    }
  };

  // Add details if available
  if (apiError.details) {
    errorResponse.error.details = apiError.details;
  }

  // Add stack trace in development
  if (isDevelopment && error.stack) {
    errorResponse.error.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 handler for unknown routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    }
  });
};

/**
 * Error logger middleware
 */
export const errorLogger = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log to external service in production
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to logging service (e.g., Sentry, CloudWatch)
    console.error('Production error:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      request: {
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.body,
        ip: req.ip,
        userAgent: req.get('user-agent')
      },
      timestamp: new Date().toISOString()
    });
  }

  next(error);
};
