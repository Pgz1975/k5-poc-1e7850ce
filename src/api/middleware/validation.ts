import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';

/**
 * Validation middleware factory using Zod
 */
export const validate = (schema: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request body
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }

      // Validate query parameters
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }

      // Validate path parameters
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }

      next();
    } catch (error) {
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

      res.status(500).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed'
        }
      });
    }
  };
};

// Common validation schemas
export const schemas = {
  // UUID parameter
  uuid: z.object({
    id: z.string().uuid('Invalid UUID format')
  }),

  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20)
  }),

  // Grade level
  gradeLevel: z.enum(['K', '1', '2', '3', '4', '5']),

  // Subject
  subject: z.enum(['math', 'science', 'reading', 'writing', 'social-studies']),

  // Language
  language: z.enum(['en', 'ko', 'both', 'bilingual']),

  // PDF upload
  pdfUpload: z.object({
    gradeLevel: z.enum(['K', '1', '2', '3', '4', '5']),
    subject: z.enum(['math', 'science', 'reading', 'writing', 'social-studies']).optional(),
    language: z.enum(['en', 'ko', 'bilingual']).default('bilingual'),
    metadata: z.object({
      title: z.string().optional(),
      author: z.string().optional(),
      publisher: z.string().optional(),
      isbn: z.string().optional()
    }).optional()
  }),

  // Process PDF
  processPdf: z.object({
    id: z.string().uuid(),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
    options: z.object({
      extractImages: z.boolean().default(true),
      generateQuestions: z.boolean().default(true),
      bilingual: z.boolean().default(true)
    }).optional()
  }),

  // Content text query
  contentText: z.object({
    language: z.enum(['en', 'ko', 'both']).default('both'),
    page: z.coerce.number().int().min(1).optional(),
    format: z.enum(['plain', 'structured', 'markdown']).default('structured')
  }),

  // Images query
  contentImages: z.object({
    page: z.coerce.number().int().min(1).optional(),
    type: z.enum(['diagram', 'photo', 'chart', 'illustration']).optional()
  }),

  // Search query
  search: z.object({
    q: z.string().min(1, 'Search query is required'),
    language: z.enum(['en', 'ko', 'both']).default('both'),
    gradeLevel: z.array(z.enum(['K', '1', '2', '3', '4', '5'])).optional(),
    subject: z.enum(['math', 'science', 'reading', 'writing', 'social-studies']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20)
  }),

  // Assessment questions query
  assessmentQuestions: z.object({
    type: z.array(z.enum(['multiple-choice', 'short-answer', 'essay', 'true-false'])).optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    count: z.coerce.number().int().min(1).max(50).default(10)
  }),

  // Validate answer
  validateAnswer: z.object({
    questionId: z.string().uuid(),
    answer: z.union([z.string(), z.array(z.string())]),
    studentId: z.string().uuid().optional()
  }),

  // Quality metrics query
  qualityMetrics: z.object({
    includeDetails: z.coerce.boolean().default(false)
  }),

  // Usage statistics query
  usageStats: z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    groupBy: z.enum(['day', 'week', 'month']).default('day')
  }),

  // Feedback submission
  feedback: z.object({
    resourceType: z.enum(['pdf', 'question', 'search-result']),
    resourceId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(1000).optional(),
    tags: z.array(z.enum(['helpful', 'confusing', 'incorrect', 'too-easy', 'too-hard'])).optional()
  }),

  // Admin queue query
  adminQueue: z.object({
    status: z.enum(['queued', 'processing', 'completed', 'failed']).optional(),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).optional()
  }),

  // Reprocess PDF
  reprocessPdf: z.object({
    clearCache: z.boolean().default(false),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal')
  }),

  // Delete PDF query
  deletePdf: z.object({
    cascade: z.coerce.boolean().default(true)
  })
};

/**
 * File upload validation middleware
 */
export const validateFileUpload = (options: {
  maxSize?: number; // in bytes
  allowedMimeTypes?: string[];
  required?: boolean;
}) => {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB default
    allowedMimeTypes = ['application/pdf'],
    required = true
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const file = req.file;

    // Check if file is required
    if (required && !file) {
      res.status(400).json({
        success: false,
        error: {
          code: 'FILE_REQUIRED',
          message: 'File upload is required'
        }
      });
      return;
    }

    // If file not provided and not required, continue
    if (!file) {
      next();
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      res.status(413).json({
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: `File size exceeds maximum limit of ${maxSize / (1024 * 1024)}MB`,
          details: {
            fileSize: file.size,
            maxSize
          }
        }
      });
      return;
    }

    // Check MIME type
    if (!allowedMimeTypes.includes(file.mimetype)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FILE_TYPE',
          message: 'Invalid file type',
          details: {
            providedType: file.mimetype,
            allowedTypes: allowedMimeTypes
          }
        }
      });
      return;
    }

    next();
  };
};

/**
 * Sanitize user input to prevent injection attacks
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  // Sanitize string values in body, query, and params
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      // Remove potentially dangerous characters
      return obj
        .replace(/[<>]/g, '') // Remove angle brackets
        .trim();
    }

    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }

    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }

    return obj;
  };

  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);

  next();
};
