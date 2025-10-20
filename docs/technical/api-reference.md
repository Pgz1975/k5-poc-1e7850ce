# API Reference Documentation

## Overview

The K5 PDF Parsing System exposes RESTful APIs through Supabase Edge Functions and storage endpoints. All endpoints require authentication via JWT tokens.

## Base URLs

```
Production:  https://[project-ref].supabase.co/functions/v1
Storage:     https://[project-ref].supabase.co/storage/v1
Database:    https://[project-ref].supabase.co/rest/v1
```

## Authentication

All API requests must include a valid JWT token in the Authorization header:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Obtaining a Token

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'teacher@school.edu',
  password: 'secure_password'
})

// Token available in: data.session.access_token
```

## Edge Functions

### 1. PDF Upload & Processing

#### POST /functions/v1/pdf-upload

Uploads a PDF file and triggers processing pipeline.

**Request**:
```http
POST /functions/v1/pdf-upload HTTP/1.1
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

{
  "file": <PDF_FILE>,
  "metadata": {
    "grade_level": ["2", "3"],
    "subject_area": ["reading", "comprehension"],
    "content_type": "reading_passage",
    "primary_language": "spanish"
  }
}
```

**Response** (202 Accepted):
```json
{
  "success": true,
  "data": {
    "document_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "processing",
    "estimated_completion": "2025-10-20T12:35:00Z",
    "presigned_url": "https://..."
  },
  "message": "PDF uploaded successfully. Processing started."
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Only PDF files are allowed",
    "details": {
      "allowed_types": ["application/pdf"],
      "received_type": "application/msword"
    }
  }
}
```

**cURL Example**:
```bash
curl -X POST \
  https://[project-ref].supabase.co/functions/v1/pdf-upload \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F 'metadata={"grade_level":["2"],"content_type":"reading_passage","primary_language":"spanish"}'
```

**TypeScript Example**:
```typescript
async function uploadPDF(file: File, metadata: PDFMetadata) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('metadata', JSON.stringify(metadata))

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/pdf-upload`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      },
      body: formData
    }
  )

  if (!response.ok) {
    throw new Error('Upload failed')
  }

  return await response.json()
}
```

---

### 2. PDF Processing Status

#### GET /functions/v1/pdf-status/:documentId

Retrieves the current processing status of a PDF.

**Request**:
```http
GET /functions/v1/pdf-status/123e4567-e89b-12d3-a456-426614174000 HTTP/1.1
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "document_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "processing",
    "progress": {
      "current_step": "image_extraction",
      "completed_steps": [
        "upload_validation",
        "pdf_parse",
        "text_extraction",
        "language_detection"
      ],
      "total_steps": 12,
      "percent_complete": 33
    },
    "started_at": "2025-10-20T12:30:00Z",
    "estimated_completion": "2025-10-20T12:35:00Z",
    "statistics": {
      "pages_processed": 5,
      "total_pages": 15,
      "text_sections": 45,
      "images_extracted": 12
    }
  }
}
```

**Status Values**:
- `pending`: Queued for processing
- `processing`: Currently being processed
- `completed`: Processing finished successfully
- `failed`: Processing encountered an error
- `requires_review`: Completed but flagged for manual review

---

### 3. Batch PDF Upload

#### POST /functions/v1/pdf-batch-upload

Uploads multiple PDFs in a single request.

**Request**:
```http
POST /functions/v1/pdf-batch-upload HTTP/1.1
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

{
  "files": [<PDF_FILE_1>, <PDF_FILE_2>, ...],
  "metadata": [
    { "grade_level": ["1"], "content_type": "reading_passage" },
    { "grade_level": ["2"], "content_type": "assessment" }
  ]
}
```

**Response** (202 Accepted):
```json
{
  "success": true,
  "data": {
    "batch_id": "batch_abc123",
    "documents": [
      {
        "document_id": "doc_001",
        "filename": "story1.pdf",
        "status": "processing"
      },
      {
        "document_id": "doc_002",
        "filename": "assessment.pdf",
        "status": "processing"
      }
    ],
    "total_count": 2,
    "estimated_completion": "2025-10-20T12:40:00Z"
  }
}
```

---

### 4. Text Extraction

#### GET /functions/v1/pdf-text/:documentId

Retrieves all extracted text from a processed PDF.

**Request**:
```http
GET /functions/v1/pdf-text/123e4567-e89b-12d3-a456-426614174000 HTTP/1.1
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters**:
- `page`: Filter by page number (optional)
- `language`: Filter by language (`spanish` or `english`)
- `format`: Response format (`json`, `plain`, `html`)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "document_id": "123e4567-e89b-12d3-a456-426614174000",
    "total_pages": 15,
    "total_sections": 87,
    "languages": ["spanish", "english"],
    "content": [
      {
        "id": "section_001",
        "page_number": 1,
        "section_order": 1,
        "text_content": "El Coquí y el Bosque Encantado",
        "detected_language": "spanish",
        "language_confidence": 0.97,
        "content_category": "title",
        "word_count": 5,
        "bbox": {
          "x1": 72.0,
          "y1": 100.0,
          "x2": 540.0,
          "y2": 120.0
        }
      },
      {
        "id": "section_002",
        "page_number": 1,
        "section_order": 2,
        "text_content": "Había una vez un coquí que vivía en el bosque...",
        "detected_language": "spanish",
        "language_confidence": 0.99,
        "content_category": "paragraph",
        "word_count": 156,
        "reading_complexity_score": 3.2
      }
    ]
  }
}
```

---

### 5. Image Extraction

#### GET /functions/v1/pdf-images/:documentId

Retrieves metadata and URLs for all extracted images.

**Request**:
```http
GET /functions/v1/pdf-images/123e4567-e89b-12d3-a456-426614174000 HTTP/1.1
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters**:
- `page`: Filter by page number
- `type`: Filter by image type (`illustration`, `photograph`, `diagram`)
- `include_thumbnails`: Include thumbnail URLs (default: `true`)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "document_id": "123e4567-e89b-12d3-a456-426614174000",
    "total_images": 12,
    "images": [
      {
        "id": "img_001",
        "page_number": 1,
        "image_order": 1,
        "storage_path": "123e4567/page-1-img-1.webp",
        "url": "https://[project-ref].supabase.co/storage/v1/object/public/educational-images/123e4567/page-1-img-1.webp",
        "thumbnail_url": "https://[project-ref].supabase.co/storage/v1/object/public/educational-images/123e4567/thumbnails/page-1-thumb.webp",
        "dimensions": {
          "width": 800,
          "height": 600,
          "aspect_ratio": 1.33
        },
        "file_sizes": {
          "original_bytes": 245678,
          "optimized_bytes": 89234,
          "compression_ratio": 0.36
        },
        "image_type": "illustration",
        "contains_text": false,
        "alt_text": "A colorful coquí frog in a tropical forest",
        "tags": ["animal", "nature", "colorful", "educational"],
        "cultural_context": ["puerto_rico", "caribbean"],
        "quality_score": 0.91
      }
    ]
  }
}
```

---

### 6. Content Search

#### GET /functions/v1/search

Full-text search across all processed PDFs.

**Request**:
```http
GET /functions/v1/search?q=lectura%20comprensión&language=spanish&grade=2 HTTP/1.1
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters**:
- `q`: Search query (required)
- `language`: Filter by language (`spanish`, `english`)
- `grade`: Filter by grade level
- `content_type`: Filter by content type
- `limit`: Results per page (default: 20, max: 100)
- `offset`: Pagination offset

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "query": "lectura comprensión",
    "total_results": 156,
    "results": [
      {
        "document_id": "doc_123",
        "document_title": "Ejercicios de Lectura - Grado 2",
        "text_section_id": "section_456",
        "page_number": 5,
        "text_excerpt": "...práctica de lectura y comprensión para estudiantes...",
        "relevance_score": 0.89,
        "match_highlights": [
          "<mark>lectura</mark>",
          "<mark>comprensión</mark>"
        ],
        "metadata": {
          "grade_level": ["2"],
          "subject_area": ["reading", "comprehension"],
          "primary_language": "spanish"
        }
      }
    ],
    "facets": {
      "grade_levels": {
        "K": 12,
        "1": 34,
        "2": 67,
        "3": 43
      },
      "languages": {
        "spanish": 98,
        "english": 45,
        "bilingual": 13
      }
    }
  }
}
```

---

### 7. Assessment Questions

#### GET /functions/v1/assessments/:documentId/questions

Retrieves structured assessment questions from a processed PDF.

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "document_id": "doc_123",
    "total_questions": 25,
    "questions": [
      {
        "id": "q_001",
        "question_number": 1,
        "page_number": 2,
        "question_text": "¿Cuál es el tema principal del cuento?",
        "question_language": "spanish",
        "choices": {
          "A": "La amistad",
          "B": "El valor",
          "C": "La naturaleza",
          "D": "La familia"
        },
        "correct_answer": "A",
        "standard_code": "2.RL.2",
        "skill_assessed": "comprehension",
        "difficulty_level": "medium",
        "has_image": false,
        "passage_reference_id": "section_012"
      }
    ]
  }
}
```

---

## Storage API

### 1. Upload File to Storage

#### POST /storage/v1/object/:bucket/:path

Direct upload to Supabase Storage (requires presigned URL or bucket permissions).

**Request**:
```http
POST /storage/v1/object/educational-pdfs/folder/file.pdf HTTP/1.1
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/pdf

<BINARY_FILE_DATA>
```

**Response** (200 OK):
```json
{
  "Key": "folder/file.pdf",
  "Id": "folder/file.pdf"
}
```

---

### 2. Get File from Storage

#### GET /storage/v1/object/public/:bucket/:path

Retrieve a file from public bucket.

**Request**:
```http
GET /storage/v1/object/public/educational-images/123e4567/page-1-img-1.webp HTTP/1.1
```

**Response**: Binary image data with appropriate Content-Type header

---

### 3. Generate Signed URL

#### POST /storage/v1/object/sign/:bucket/:path

Generate a temporary signed URL for private files.

**Request**:
```json
{
  "expiresIn": 3600
}
```

**Response** (200 OK):
```json
{
  "signedURL": "https://[project-ref].supabase.co/storage/v1/object/sign/educational-pdfs/doc.pdf?token=abc123..."
}
```

---

## Database REST API

### Query PDF Documents

#### GET /rest/v1/pdf_documents

**Request**:
```http
GET /rest/v1/pdf_documents?grade_level=cs.{2}&processing_status=eq.completed&select=*,pdf_text_content(*),pdf_images(*) HTTP/1.1
Authorization: Bearer <JWT_TOKEN>
apikey: <SUPABASE_ANON_KEY>
```

**PostgREST Query Operators**:
- `eq`: Equals
- `neq`: Not equals
- `gt`, `gte`: Greater than (or equal)
- `lt`, `lte`: Less than (or equal)
- `like`, `ilike`: Pattern matching
- `cs`: Contains (for arrays)
- `cd`: Contained by
- `or`: Logical OR
- `and`: Logical AND

**Example Queries**:

```javascript
// Find all Spanish reading passages for Grade 2
const { data, error } = await supabase
  .from('pdf_documents')
  .select('*')
  .eq('primary_language', 'spanish')
  .eq('content_type', 'reading_passage')
  .contains('grade_level', ['2'])
  .eq('processing_status', 'completed')

// Full-text search with joins
const { data, error } = await supabase
  .from('pdf_text_content')
  .select(`
    *,
    pdf_documents (
      filename,
      grade_level,
      primary_language
    )
  `)
  .textSearch('text_content', 'lectura comprensión', {
    type: 'websearch',
    config: 'spanish'
  })
```

---

## Rate Limits

| Endpoint | Rate Limit |
|----------|------------|
| PDF Upload | 100 requests/minute |
| Status Check | 1000 requests/minute |
| Search | 500 requests/minute |
| Storage Read | 10,000 requests/minute |
| Database Query | 1000 requests/minute |

**Rate Limit Headers**:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1698765432
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_FILE_TYPE` | 400 | File is not a PDF |
| `FILE_TOO_LARGE` | 413 | File exceeds 100MB limit |
| `UNAUTHORIZED` | 401 | Invalid or missing JWT token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Document not found |
| `PROCESSING_FAILED` | 500 | PDF processing error |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |

**Error Response Format**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context"
    },
    "timestamp": "2025-10-20T12:30:00Z",
    "request_id": "req_abc123"
  }
}
```

---

## OpenAPI Specification

Full OpenAPI 3.0 specification available at:
```
https://[project-ref].supabase.co/functions/v1/openapi.json
```

---

**Next**: See [Edge Functions Documentation](./edge-functions.md) for implementation details.
