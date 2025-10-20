# K5 Platform API Documentation

Comprehensive API infrastructure for the K5 educational platform, supporting bilingual reading, assessments, and voice recognition for K-5 students.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Client SDK](#client-sdk)
- [GraphQL](#graphql)
- [Real-time Subscriptions](#real-time-subscriptions)
- [Webhooks](#webhooks)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

## 🎯 Overview

The K5 Platform API provides a complete backend infrastructure for educational content management, including:

- **PDF Processing**: Upload, parse, and manage educational documents
- **Full-text Search**: Semantic search across all content
- **Assessments**: Create and grade student assessments
- **Voice Recognition**: Reading fluency assessment using OpenAI Realtime API
- **Real-time Updates**: WebSocket subscriptions for live progress tracking
- **Webhooks**: Event-driven notifications

## ✨ Features

### Core Capabilities

- ✅ RESTful API with OpenAPI/Swagger documentation
- ✅ GraphQL API for flexible querying
- ✅ Type-safe TypeScript/JavaScript SDK
- ✅ JWT and API key authentication
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting and quota management
- ✅ Real-time subscriptions via WebSockets
- ✅ Webhook notifications
- ✅ Comprehensive error handling
- ✅ Request validation with Zod

### Integration Features

- 🔄 Voice recognition integration with OpenAI
- 🔄 Supabase Storage for file management
- 🔄 Supabase Realtime for WebSocket subscriptions
- 🔄 Edge Functions for serverless processing

## 🚀 Getting Started

### Installation

```bash
npm install @k5-platform/api
# or
yarn add @k5-platform/api
```

### Quick Start

```typescript
import { createK5Client } from '@k5-platform/api';

// Initialize the client
const client = createK5Client({
  baseUrl: 'https://api.k5platform.com',
  token: 'your-jwt-token',
});

// Upload a PDF
const response = await client.uploadPDF(file, {
  contentType: 'reading_passage',
  gradeLevel: ['3', '4'],
  subjectArea: ['reading', 'comprehension'],
  primaryLanguage: 'spanish',
});

console.log(`Document uploaded: ${response.documentId}`);
```

## 🔐 Authentication

### JWT Bearer Token

```typescript
const client = createK5Client({
  baseUrl: 'https://api.k5platform.com',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
});
```

### API Key

```typescript
const client = createK5Client({
  baseUrl: 'https://api.k5platform.com',
  apiKey: 'k5_abc123...',
});
```

### Update Authentication

```typescript
// Update token
client.setToken('new-token');

// Update API key
client.setApiKey('new-api-key');
```

## 📡 API Endpoints

### PDF Documents

```typescript
// Upload PDF
const response = await client.uploadPDF(file, metadata);

// Get document
const doc = await client.getDocument(documentId);

// List documents
const docs = await client.listDocuments({
  contentType: 'reading_passage',
  gradeLevel: ['3'],
  page: 1,
  limit: 20,
});

// Get content
const content = await client.getContent(documentId, pageNumber);

// Get images
const images = await client.getImages(documentId);

// Get processing progress
const progress = await client.getProgress(documentId);

// Delete document
await client.deleteDocument(documentId);
```

### Search

```typescript
// Full-text search
const results = await client.search({
  query: 'comprensión lectora',
  filters: {
    gradeLevel: ['3', '4'],
    primaryLanguage: ['spanish'],
  },
  pagination: { page: 1, limit: 20 },
});

// Get suggestions
const suggestions = await client.getSuggestions('comp', 5);
```

### Assessments

```typescript
// Create assessment
const assessment = await client.createAssessment({
  title: 'Reading Comprehension Test',
  assessmentType: 'diagnostic',
  gradeLevel: ['3'],
  questions: [
    {
      questionNumber: 1,
      questionText: '¿Cuál es el tema principal?',
      questionType: 'multiple_choice',
      points: 10,
      options: [
        { optionText: 'Opción A', isCorrect: true, order: 1 },
        { optionText: 'Opción B', isCorrect: false, order: 2 },
      ],
    },
  ],
});

// Get assessment
const assessment = await client.getAssessment(assessmentId);

// Submit answers
const result = await client.submitAssessment(assessmentId, {
  question1: 'answer1',
  question2: 'answer2',
});
```

### Voice Recognition

```typescript
// Recognize voice
const result = await client.recognizeVoice(audioBlob, {
  language: 'es',
  documentId: 'doc-123',
  pageNumber: 1,
  studentId: 'student-456',
});

console.log(`Fluency score: ${result.fluencyScore}`);
console.log(`Transcription: ${result.transcription}`);

// Get sessions
const sessions = await client.getVoiceSessions({
  studentId: 'student-456',
  page: 1,
  limit: 10,
});

// Get analytics
const analytics = await client.getVoiceAnalytics('student-456');
```

### Webhooks

```typescript
// Create webhook subscription
const webhook = await client.createWebhook({
  url: 'https://your-server.com/webhooks',
  events: ['pdf.processing.completed', 'assessment.created'],
  secret: 'your-webhook-secret',
});

// List webhooks
const webhooks = await client.listWebhooks();

// Test webhook
await client.testWebhook(webhookId);

// Delete webhook
await client.deleteWebhook(webhookId);
```

## 📦 Client SDK

### TypeScript SDK Features

```typescript
import { K5Client, K5APIError } from '@k5-platform/api';

const client = new K5Client({
  baseUrl: 'https://api.k5platform.com',
  token: 'your-token',
  timeout: 30000,
  retries: 3,
});

try {
  const result = await client.uploadPDF(file, metadata);
} catch (error) {
  if (error instanceof K5APIError) {
    console.error(`API Error [${error.code}]: ${error.message}`);
    console.error(`Status: ${error.statusCode}`);
    console.error(`Details:`, error.details);
  }
}
```

### Auto-retry with Exponential Backoff

The SDK automatically retries failed requests with exponential backoff:

- Initial retry: 1 second
- Second retry: 2 seconds
- Third retry: 4 seconds

## 🔄 GraphQL

### Schema

```graphql
query GetDocument {
  document(id: "doc-123") {
    id
    filename
    contentType
    gradeLevel
    processingStatus
    content {
      pageNumber
      textContent
    }
  }
}

mutation UploadPDF {
  uploadPDF(input: {
    contentType: READING_PASSAGE
    gradeLevel: [THREE, FOUR]
    subjectArea: [READING]
    primaryLanguage: SPANISH
  }) {
    success
    documentId
    message
  }
}

subscription ProcessingProgress {
  processingProgress(documentId: "doc-123") {
    status
    progress
    currentStep
  }
}
```

## 🔴 Real-time Subscriptions

### Using the Subscription Manager

```typescript
import { getRealtimeManager } from '@k5-platform/api';

const manager = getRealtimeManager(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Subscribe to processing progress
const unsubscribe = manager.subscribeToProcessingProgress(
  documentId,
  (update) => {
    console.log(`Progress: ${update.progress}%`);
    console.log(`Status: ${update.status}`);
  },
  {
    onConnect: () => console.log('Connected'),
    onError: (error) => console.error('Error:', error),
    onDisconnect: () => console.log('Disconnected'),
  }
);

// Cleanup
unsubscribe();
```

### React Hook Example

```typescript
import { useEffect, useState } from 'react';
import { getRealtimeManager, ProcessingUpdate } from '@k5-platform/api';

export function useProcessingProgress(documentId: string) {
  const [progress, setProgress] = useState<ProcessingUpdate | null>(null);

  useEffect(() => {
    const manager = getRealtimeManager(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );

    const unsubscribe = manager.subscribeToProcessingProgress(
      documentId,
      setProgress
    );

    return unsubscribe;
  }, [documentId]);

  return progress;
}
```

## 🪝 Webhooks

### Webhook Events

- `pdf.upload.completed`
- `pdf.processing.started`
- `pdf.processing.completed`
- `pdf.processing.failed`
- `pdf.content.extracted`
- `pdf.images.processed`
- `assessment.created`
- `voice.recognition.completed`

### Webhook Payload

```json
{
  "id": "evt_123",
  "type": "pdf.processing.completed",
  "timestamp": "2025-10-20T19:30:00Z",
  "data": {
    "documentId": "doc-123",
    "filename": "reading-passage.pdf",
    "status": "completed"
  },
  "signature": "sha256=..."
}
```

### Verifying Webhook Signatures

```typescript
import { createHmac } from 'crypto';

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return signature === `sha256=${expectedSignature}`;
}
```

## ⚠️ Error Handling

### Error Types

```typescript
import { K5APIError } from '@k5-platform/api';

try {
  await client.getDocument('invalid-id');
} catch (error) {
  if (error instanceof K5APIError) {
    switch (error.code) {
      case 'RESOURCE_NOT_FOUND':
        // Handle not found
        break;
      case 'VALIDATION_ERROR':
        // Handle validation error
        console.error(error.details.fields);
        break;
      case 'RATE_LIMIT_EXCEEDED':
        // Handle rate limit
        console.log(`Retry after ${error.details.retryAfter}s`);
        break;
      default:
        // Handle other errors
        break;
    }
  }
}
```

### Error Codes

- `MISSING_AUTH` - Missing authorization header
- `INVALID_TOKEN` - Invalid or expired token
- `INSUFFICIENT_PERMISSIONS` - Insufficient permissions
- `VALIDATION_ERROR` - Request validation failed
- `RATE_LIMIT_EXCEEDED` - Rate limit exceeded
- `QUOTA_EXCEEDED` - Quota exceeded
- `RESOURCE_NOT_FOUND` - Resource not found
- `PROCESSING_FAILED` - Processing failed
- `INTERNAL_ERROR` - Internal server error

## 🚦 Rate Limiting

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1634567890
```

### Quota Plans

| Plan | Uploads/Day | Storage | API Calls/Day | Voice/Day |
|------|------------|---------|---------------|-----------|
| Free | 10 | 1GB | 1,000 | 50 |
| Basic | 50 | 10GB | 10,000 | 200 |
| Premium | 200 | 100GB | 50,000 | 1,000 |
| Enterprise | Unlimited | Unlimited | Unlimited | Unlimited |

## 📚 Examples

See the `/examples` directory for complete examples:

- `upload-pdf.ts` - Upload and track PDF processing
- `search-content.ts` - Search with filters
- `voice-assessment.ts` - Voice recognition assessment
- `webhooks.ts` - Webhook integration
- `realtime.ts` - Real-time subscriptions

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Support

For support, email support@k5platform.com or visit our documentation at https://docs.k5platform.com
