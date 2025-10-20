/**
 * K5 Platform OpenAPI/Swagger Documentation
 * Complete API specification for REST endpoints
 */

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'K5 Educational Platform API',
    version: '1.0.0',
    description: `
      REST API for the K5 Educational Platform - a bilingual reading and assessment system
      for K-5 students in Puerto Rico.

      ## Features
      - PDF document upload and processing
      - Full-text search across educational content
      - Assessment creation and submission
      - Voice recognition for reading fluency
      - Real-time progress tracking via WebSockets
      - Webhook notifications for events

      ## Authentication
      All endpoints require authentication using either:
      - JWT Bearer token: \`Authorization: Bearer <token>\`
      - API Key: \`Authorization: ApiKey <key>\`
    `,
    contact: {
      name: 'K5 Platform Support',
      email: 'support@k5platform.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },

  servers: [
    {
      url: 'https://api.k5platform.com/v1',
      description: 'Production server',
    },
    {
      url: 'https://staging-api.k5platform.com/v1',
      description: 'Staging server',
    },
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Development server',
    },
  ],

  tags: [
    {
      name: 'PDF Documents',
      description: 'Upload, process, and manage PDF documents',
    },
    {
      name: 'Search',
      description: 'Full-text search across educational content',
    },
    {
      name: 'Assessments',
      description: 'Create and manage student assessments',
    },
    {
      name: 'Voice Recognition',
      description: 'Reading fluency assessment via voice',
    },
    {
      name: 'Webhooks',
      description: 'Webhook subscriptions and event notifications',
    },
    {
      name: 'Analytics',
      description: 'Usage and performance analytics',
    },
  ],

  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT authentication token',
      },
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'API key authentication (prefix with "ApiKey ")',
      },
    },

    schemas: {
      // ======================================================================
      // Domain Models
      // ======================================================================

      PDFDocument: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          filename: { type: 'string' },
          originalFilename: { type: 'string' },
          fileSize: { type: 'integer' },
          contentType: {
            type: 'string',
            enum: ['reading_passage', 'assessment', 'instructional_material', 'activity_sheet', 'teacher_guide'],
          },
          gradeLevel: {
            type: 'array',
            items: { type: 'string', enum: ['K', '1', '2', '3', '4', '5'] },
          },
          subjectArea: {
            type: 'array',
            items: { type: 'string', enum: ['reading', 'comprehension', 'vocabulary', 'fluency', 'writing', 'grammar'] },
          },
          primaryLanguage: {
            type: 'string',
            enum: ['spanish', 'english', 'bilingual'],
          },
          processingStatus: {
            type: 'string',
            enum: ['pending', 'processing', 'completed', 'failed', 'validating'],
          },
          processingProgress: { type: 'number', minimum: 0, maximum: 100 },
          pageCount: { type: 'integer' },
          uploadedAt: { type: 'string', format: 'date-time' },
        },
      },

      PDFContent: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          documentId: { type: 'string', format: 'uuid' },
          pageNumber: { type: 'integer', minimum: 1 },
          textContent: { type: 'string' },
          detectedLanguage: { type: 'string', enum: ['spanish', 'english', 'bilingual'] },
          languageConfidence: { type: 'number', minimum: 0, maximum: 1 },
          wordCount: { type: 'integer' },
        },
      },

      Assessment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          assessmentType: { type: 'string', enum: ['diagnostic', 'formative', 'summative'] },
          gradeLevel: { type: 'array', items: { type: 'string' } },
          totalPoints: { type: 'number' },
          passingScore: { type: 'number' },
          questions: { type: 'array', items: { $ref: '#/components/schemas/AssessmentQuestion' } },
        },
      },

      AssessmentQuestion: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          questionNumber: { type: 'integer' },
          questionText: { type: 'string' },
          questionType: { type: 'string', enum: ['multiple_choice', 'true_false', 'short_answer', 'essay'] },
          points: { type: 'number' },
          options: { type: 'array', items: { $ref: '#/components/schemas/AssessmentOption' } },
        },
      },

      AssessmentOption: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          optionText: { type: 'string' },
          isCorrect: { type: 'boolean' },
          order: { type: 'integer' },
        },
      },

      VoiceRecognitionResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          transcription: { type: 'string' },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
          fluencyScore: { type: 'number', minimum: 0, maximum: 100 },
          accuracyScore: { type: 'number', minimum: 0, maximum: 100 },
          wordsPerMinute: { type: 'number' },
          errors: { type: 'array', items: { $ref: '#/components/schemas/VoiceRecognitionError' } },
          feedback: { type: 'string' },
        },
      },

      VoiceRecognitionError: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['mispronunciation', 'omission', 'insertion', 'substitution'] },
          word: { type: 'string' },
          expectedWord: { type: 'string' },
          position: { type: 'integer' },
          confidence: { type: 'number' },
        },
      },

      // ======================================================================
      // Request/Response Models
      // ======================================================================

      UploadPDFRequest: {
        type: 'object',
        required: ['contentType', 'gradeLevel', 'subjectArea', 'primaryLanguage'],
        properties: {
          contentType: { type: 'string', enum: ['reading_passage', 'assessment', 'instructional_material'] },
          gradeLevel: { type: 'array', items: { type: 'string' } },
          subjectArea: { type: 'array', items: { type: 'string' } },
          primaryLanguage: { type: 'string' },
          readingLevel: { type: 'string' },
          curriculumStandards: { type: 'array', items: { type: 'string' } },
        },
      },

      SearchRequest: {
        type: 'object',
        required: ['query'],
        properties: {
          query: { type: 'string', minLength: 1, maxLength: 500 },
          filters: {
            type: 'object',
            properties: {
              contentType: { type: 'array', items: { type: 'string' } },
              gradeLevel: { type: 'array', items: { type: 'string' } },
              subjectArea: { type: 'array', items: { type: 'string' } },
              primaryLanguage: { type: 'array', items: { type: 'string' } },
            },
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer', minimum: 1, default: 1 },
              limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
            },
          },
        },
      },

      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', default: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
              details: { type: 'object' },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },

      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', default: true },
          data: { type: 'object' },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
              hasMore: { type: 'boolean' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },

    responses: {
      Unauthorized: {
        description: 'Authentication required or invalid token',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
          },
        },
      },
      Forbidden: {
        description: 'Insufficient permissions',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
          },
        },
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
          },
        },
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
          },
        },
      },
      RateLimitExceeded: {
        description: 'Rate limit exceeded',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
          },
        },
      },
    },
  },

  paths: {
    '/pdf/upload': {
      post: {
        tags: ['PDF Documents'],
        summary: 'Upload a PDF document',
        description: 'Upload and process a new PDF document',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                    description: 'PDF file to upload',
                  },
                  contentType: { type: 'string' },
                  gradeLevel: { type: 'array', items: { type: 'string' } },
                  subjectArea: { type: 'array', items: { type: 'string' } },
                  primaryLanguage: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'PDF uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        documentId: { type: 'string' },
                        filename: { type: 'string' },
                        status: { type: 'string' },
                        message: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '429': { $ref: '#/components/responses/RateLimitExceeded' },
        },
      },
    },

    '/pdf/{id}': {
      get: {
        tags: ['PDF Documents'],
        summary: 'Get PDF document',
        description: 'Retrieve a PDF document by ID',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'PDF document retrieved',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      properties: {
                        data: { $ref: '#/components/schemas/PDFDocument' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['PDF Documents'],
        summary: 'Delete PDF document',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '204': { description: 'Document deleted successfully' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    '/search': {
      post: {
        tags: ['Search'],
        summary: 'Search educational content',
        description: 'Full-text search across all PDF content',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SearchRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Search results',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
        },
      },
    },

    '/voice/recognize': {
      post: {
        tags: ['Voice Recognition'],
        summary: 'Recognize voice reading',
        description: 'Transcribe and assess reading fluency',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['audio', 'language'],
                properties: {
                  audio: { type: 'string', format: 'binary' },
                  language: { type: 'string', enum: ['es', 'en'] },
                  documentId: { type: 'string', format: 'uuid' },
                  pageNumber: { type: 'integer' },
                  expectedText: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Voice recognition completed',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      properties: {
                        data: { $ref: '#/components/schemas/VoiceRecognitionResponse' },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },

    '/webhooks/subscriptions': {
      post: {
        tags: ['Webhooks'],
        summary: 'Create webhook subscription',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['url', 'events'],
                properties: {
                  url: { type: 'string', format: 'uri' },
                  events: {
                    type: 'array',
                    items: {
                      type: 'string',
                      enum: [
                        'pdf.upload.completed',
                        'pdf.processing.completed',
                        'assessment.created',
                        'voice.recognition.completed',
                      ],
                    },
                  },
                  secret: { type: 'string', minLength: 32 },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Webhook subscription created',
          },
        },
      },
      get: {
        tags: ['Webhooks'],
        summary: 'List webhook subscriptions',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of webhook subscriptions',
          },
        },
      },
    },
  },
};
