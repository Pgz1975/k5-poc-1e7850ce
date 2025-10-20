# 📚 How to Use the K5 PDF Parsing System

This guide will walk you through setting up and using the comprehensive PDF parsing system for bilingual educational content.

## 🚀 Quick Start

### Prerequisites

1. **Supabase Project**
   - Create a project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key from Settings > API

2. **Environment Setup**
   ```bash
   # Create .env file in project root
   cp .env.example .env

   # Add your Supabase credentials
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-key

   # Optional: Redis for caching
   REDIS_URL=redis://localhost:6379

   # Optional: Cloudflare for CDN
   CLOUDFLARE_ACCOUNT_ID=your-account-id
   CLOUDFLARE_R2_ACCESS_KEY=your-access-key
   CLOUDFLARE_R2_SECRET_KEY=your-secret-key
   ```

## 📦 Installation Steps

### Step 1: Database Setup

```bash
# Navigate to database directory
cd src/database

# Connect to your Supabase database
psql -h your-project.supabase.co -U postgres -d postgres

# Run migrations in order
\i migrations/001_initial_schema.sql
\i migrations/002_helper_functions.sql
\i migrations/003_rls_policies.sql

# Verify installation
\i verify_installation.sql
```

### Step 2: Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy all edge functions
cd src/edge-functions

# Deploy each function
supabase functions deploy pdf-upload
supabase functions deploy pdf-processor
supabase functions deploy text-extractor
supabase functions deploy image-extractor
supabase functions deploy language-detector
supabase functions deploy content-correlator
supabase functions deploy quality-validator
supabase functions deploy assessment-generator
```

### Step 3: Create Storage Buckets

Go to your Supabase Dashboard > Storage and create these buckets:

1. **pdf-originals** (Private)
   - Max file size: 100MB
   - Allowed MIME types: application/pdf

2. **pdf-images** (Public)
   - Max file size: 10MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

3. **pdf-thumbnails** (Public)
   - Max file size: 2MB
   - Allowed MIME types: image/jpeg, image/png

4. **pdf-processed** (Public)
   - Max file size: 50MB
   - Allowed MIME types: application/json

5. **assessment-assets** (Private)
   - Max file size: 50MB
   - Allowed MIME types: image/*, audio/*, video/*

### Step 4: Install Client SDK

```bash
# Install the K5 client SDK
npm install @k5/pdf-parser-client

# Or include the client from src/api/client
cp src/api/client/k5-client.ts your-app/lib/
```

## 🎯 Usage Examples

### 1. Basic PDF Upload and Processing

```typescript
import { K5Client } from '@k5/pdf-parser-client';

// Initialize client
const client = new K5Client({
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
  apiKey: 'your-api-key' // Optional for rate limiting
});

// Upload and process a PDF
async function processPDF() {
  try {
    // Upload PDF file
    const file = document.getElementById('pdf-input').files[0];
    const upload = await client.uploadPDF(file, {
      gradeLevel: 3,
      language: 'bilingual', // or 'spanish' or 'english'
      extractImages: true,
      generateAssessments: true
    });

    console.log('Upload started:', upload.id);

    // Monitor processing progress
    const subscription = client.subscribeToProgress(upload.id, (progress) => {
      console.log(`Processing: ${progress.percentage}% - ${progress.stage}`);

      if (progress.status === 'completed') {
        console.log('Processing complete!');
        subscription.unsubscribe();
      }
    });

    // Wait for completion
    const result = await client.waitForCompletion(upload.id);
    console.log('PDF processed:', result);

  } catch (error) {
    console.error('Processing failed:', error);
  }
}
```

### 2. Retrieve Processed Content

```typescript
// Get processed PDF data
async function getProcessedContent(documentId: string) {
  // Get document metadata
  const document = await client.getDocument(documentId);

  // Get extracted text blocks
  const textContent = await client.getTextContent(documentId, {
    language: 'spanish', // Filter by language
    page: 1 // Optional: specific page
  });

  // Get extracted images
  const images = await client.getImages(documentId);

  // Get text-image correlations
  const correlations = await client.getCorrelations(documentId);

  // Get assessment questions
  const assessments = await client.getAssessments(documentId);

  return {
    document,
    textContent,
    images,
    correlations,
    assessments
  };
}
```

### 3. Search Across Documents

```typescript
// Full-text search in Spanish and English
async function searchDocuments(query: string) {
  const results = await client.search({
    query,
    language: 'bilingual', // Search both languages
    gradeLevel: [2, 3, 4], // Grade levels 2-4
    limit: 20
  });

  results.forEach(result => {
    console.log(`
      Document: ${result.title}
      Relevance: ${result.relevance}
      Preview: ${result.preview}
      Language: ${result.language}
    `);
  });
}
```

### 4. Voice Recognition Integration

```typescript
// Prepare content for voice recognition
async function prepareForVoice(documentId: string, page: number) {
  const voiceData = await client.getVoiceContent(documentId, {
    page,
    includePhonetics: true,
    language: 'spanish'
  });

  // Use with OpenAI Realtime Voice
  const voiceSession = {
    text: voiceData.text,
    phonetics: voiceData.phonetics,
    hints: voiceData.pronunciationHints
  };

  return voiceSession;
}
```

### 5. Generate Assessments

```typescript
// Create assessments from content
async function generateAssessment(documentId: string) {
  const assessment = await client.generateAssessment(documentId, {
    questionCount: 10,
    types: ['multiple_choice', 'true_false'],
    difficulty: 'adaptive', // Adjusts to student level
    language: 'bilingual'
  });

  // Display questions
  assessment.questions.forEach(q => {
    console.log(`
      Question: ${q.question}
      Type: ${q.type}
      Options: ${q.options.join(', ')}
      Skill: ${q.skill}
    `);
  });
}
```

### 6. Batch Processing

```typescript
// Process multiple PDFs
async function batchProcess(files: File[]) {
  const batch = await client.createBatch({
    files,
    options: {
      gradeLevel: 3,
      parallel: true,
      maxConcurrent: 5
    }
  });

  // Monitor batch progress
  batch.on('progress', (progress) => {
    console.log(`Batch: ${progress.completed}/${progress.total}`);
  });

  batch.on('complete', (results) => {
    console.log('All PDFs processed:', results);
  });

  await batch.start();
}
```

## 🔧 Advanced Configuration

### Custom Processing Pipeline

```typescript
// Configure custom processing options
const customPipeline = {
  textExtraction: {
    preserveFormatting: true,
    extractTables: true,
    extractLists: true
  },
  imageExtraction: {
    formats: ['webp', 'jpeg'],
    sizes: [320, 640, 1280],
    optimize: true
  },
  languageDetection: {
    detectDialects: true, // Puerto Rican Spanish
    confidence: 0.95
  },
  correlation: {
    algorithm: 'spatial', // or 'semantic'
    threshold: 0.8
  },
  quality: {
    minScore: 0.7,
    autoReject: true
  }
};

const result = await client.uploadPDF(file, customPipeline);
```

### Using GraphQL API

```typescript
import { gql } from '@apollo/client';

// GraphQL query for complex data fetching
const GET_DOCUMENT_FULL = gql`
  query GetDocumentFull($id: ID!) {
    document(id: $id) {
      id
      title
      metadata
      textContent {
        id
        text
        language
        position
      }
      images {
        id
        url
        altText
        culturalContext
      }
      correlations {
        textId
        imageId
        confidence
        type
      }
      assessments {
        questions {
          id
          question
          options
          correctAnswer
        }
      }
    }
  }
`;

// Subscribe to real-time updates
const PROCESSING_SUBSCRIPTION = gql`
  subscription OnProcessingUpdate($documentId: ID!) {
    processingUpdate(documentId: $documentId) {
      status
      progress
      stage
      error
    }
  }
`;
```

### Direct Edge Function Calls

```typescript
// Call edge functions directly
async function directEdgeFunctionCall() {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/pdf-processor`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        documentId: 'doc_123',
        options: {
          priority: 'high',
          language: 'spanish'
        }
      })
    }
  );

  const result = await response.json();
  return result;
}
```

## 📊 Monitoring & Analytics

### Check Processing Status

```typescript
// Monitor system health
async function checkSystemHealth() {
  const health = await client.getSystemHealth();

  console.log(`
    API Status: ${health.api}
    Database: ${health.database}
    Storage: ${health.storage}
    Edge Functions: ${health.edgeFunctions}
    Average Processing Time: ${health.avgProcessingTime}s
    Success Rate: ${health.successRate}%
  `);
}

// Get usage statistics
async function getUsageStats() {
  const stats = await client.getUsageStats({
    period: '7d'
  });

  console.log(`
    PDFs Processed: ${stats.totalProcessed}
    Storage Used: ${stats.storageUsed}
    API Calls: ${stats.apiCalls}
    Cost Estimate: $${stats.estimatedCost}
  `);
}
```

## 🔒 Security & Compliance

### Handle COPPA Compliance

```typescript
// For users under 13
async function uploadWithParentalConsent(file: File, parentToken: string) {
  const upload = await client.uploadPDF(file, {
    coppaConsent: {
      parentToken,
      studentAge: 10,
      dataRetention: '1y'
    }
  });

  return upload;
}
```

### FERPA Compliance

```typescript
// Restrict access to educational records
async function getStudentDocuments(studentId: string, teacherAuth: string) {
  const documents = await client.getStudentDocuments(studentId, {
    authorization: teacherAuth,
    includePrivate: false
  });

  return documents;
}
```

## 🚨 Error Handling

```typescript
// Comprehensive error handling
async function safeProcessPDF(file: File) {
  try {
    const result = await client.uploadPDF(file);
    return { success: true, data: result };

  } catch (error) {
    if (error.code === 'FILE_TOO_LARGE') {
      return {
        success: false,
        error: 'File exceeds 100MB limit'
      };
    }

    if (error.code === 'INVALID_PDF') {
      return {
        success: false,
        error: 'File is corrupted or not a valid PDF'
      };
    }

    if (error.code === 'QUOTA_EXCEEDED') {
      return {
        success: false,
        error: 'Monthly processing quota exceeded'
      };
    }

    // Generic error
    console.error('Processing failed:', error);
    return {
      success: false,
      error: 'Processing failed. Please try again.'
    };
  }
}
```

## 📝 Testing Your Integration

```bash
# Run tests
cd tests
npm install
npm test

# Test specific components
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:e2e        # End-to-end tests
npm run test:performance # Performance tests
```

## 🆘 Troubleshooting

### Common Issues

1. **"Edge function timeout"**
   - Large PDFs may take longer. Increase timeout in function config.

2. **"Language detection failed"**
   - Ensure PDF contains text (not just images)
   - Check if text is extractable (not scanned)

3. **"Storage quota exceeded"**
   - Clean up old processed files
   - Enable automatic cleanup in lifecycle settings

4. **"CORS error"**
   - Add your domain to Supabase allowed origins
   - Check API key permissions

## 📚 Additional Resources

- [API Documentation](/docs/technical/api-reference.md)
- [Database Schema](/docs/technical/database-schema.md)
- [Edge Functions Guide](/docs/technical/edge-functions.md)
- [Implementation Plan](/docs/plan/PDF-PARSING-IMPLEMENTATION-PLAN.md)

## 💡 Next Steps

1. **Deploy to Production**
   - Set up monitoring dashboards
   - Configure auto-scaling
   - Enable CDN for global distribution

2. **Customize for Your Needs**
   - Adjust quality thresholds
   - Add custom assessment types
   - Extend language support

3. **Optimize Performance**
   - Enable Redis caching
   - Configure CDN
   - Set up batch processing schedules

---

For support, please refer to the documentation or create an issue in the repository.