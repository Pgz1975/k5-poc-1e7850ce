# K5 PDF Parsing System - Database Documentation

## Overview

This directory contains the complete database schema, migrations, functions, and policies for the K5 bilingual educational content management system. The schema is designed for **FERPA** and **COPPA** compliance with bilingual support (Spanish/English) and Puerto Rican dialect detection.

## Directory Structure

```
src/database/
├── schema.sql                      # Complete database schema (all tables)
├── migrations/                     # Migration files for database setup
│   ├── 001_initial_schema.sql     # Creates all 8 core tables
│   ├── 002_helper_functions.sql   # Installs helper functions and triggers
│   └── 003_rls_policies.sql       # Sets up Row Level Security policies
├── functions/                      # Database functions
│   ├── helper_functions.sql       # Utility functions for search, analytics
│   └── trigger_functions.sql      # Automatic triggers for timestamps, validation
└── policies/                       # Security policies
    └── rls_policies.sql           # Row Level Security for FERPA/COPPA compliance
```

## Core Tables (8 Tables)

### 1. **pdf_documents**
Master table for all uploaded PDF files with processing metadata.

**Key Features:**
- File hash for deduplication (SHA-256)
- Processing status tracking
- Grade level and subject classification
- Bilingual language support
- Quality metrics

### 2. **pdf_text_content**
Extracted text with language detection and positioning data.

**Key Features:**
- Page-by-page text extraction
- Puerto Rican Spanish dialect detection
- Reading complexity scores
- Bounding box coordinates for text positioning
- Full-text search indexes (Spanish & English)

### 3. **pdf_images**
Extracted images with cultural context and accessibility metadata.

**Key Features:**
- Image optimization tracking (WebP conversion)
- OCR text extraction
- Cultural relevance tags (Puerto Rico specific)
- ADA-compliant alt text
- Image quality metrics

### 4. **text_image_correlations**
Intelligent linking between text and images for enhanced display.

**Key Features:**
- Multiple correlation types (adjacent, caption, reference, etc.)
- Confidence scoring
- Layout suggestions for rendering
- Display order optimization

### 5. **assessment_questions**
Structured storage for educational assessments.

**Key Features:**
- Multiple-choice question format
- Curriculum standard alignment (DEPR codes)
- Skill assessment tracking
- Bilingual question support
- Reference to passages and images

### 6. **reading_progress** (FERPA Compliant)
Student reading progress with privacy controls.

**Key Features:**
- Completion tracking
- Time spent analytics
- Comprehension scoring
- Reading speed calculation (WPM)
- Engagement metrics (annotations, vocabulary lookups)

### 7. **vocabulary_terms**
Bilingual vocabulary with Puerto Rican regionalisms.

**Key Features:**
- Spanish and English definitions
- Puerto Rican dialect indicators
- Phonetic pronunciations
- Grade-level categorization
- Student lookup frequency tracking

### 8. **user_annotations** (COPPA Compliant)
Student highlights, notes, and bookmarks with privacy controls.

**Key Features:**
- Multiple annotation types (highlight, note, bookmark, question)
- Privacy flags (is_private, shared_with_teacher)
- Vocabulary term linking
- Position tracking for rendering
- COPPA-compliant parental access

## Database Functions

### Search & Discovery
- `search_text_content()` - Bilingual full-text search
- `find_similar_content()` - Content recommendation engine
- `get_correlated_content()` - Text-image correlation retrieval

### Analytics
- `get_document_statistics()` - Aggregate document stats
- `get_student_progress_summary()` - Student progress analytics
- `get_vocabulary_by_grade()` - Grade-level vocabulary lists

### Quality & Processing
- `calculate_reading_complexity()` - Reading level calculation
- `detect_puerto_rican_dialect()` - Puerto Rican Spanish detection
- `update_document_quality_score()` - Quality metric calculation

## Automatic Triggers

### Timestamp Management
- `trigger_set_timestamp()` - Auto-updates `updated_at` columns
- `trigger_update_reading_progress_timestamp()` - Tracks reading sessions

### Data Integrity
- `trigger_validate_assessment_question()` - Validates answer choices
- `trigger_calculate_text_complexity()` - Auto-calculates reading scores

### Analytics Automation
- `trigger_increment_vocabulary_lookup()` - Tracks vocabulary usage
- `trigger_update_annotation_count()` - Maintains annotation counters
- `trigger_update_document_stats()` - Updates document statistics

## Row Level Security (RLS)

All tables have RLS enabled with policies for different user roles:

### User Roles
- **Students**: View grade-appropriate content, manage own progress/annotations
- **Teachers**: Upload/manage content, view all educational materials
- **Parents**: View child's progress with COPPA consent
- **Admins**: Full system access
- **Service Role**: Backend processing access

### FERPA Compliance
- Student reading progress is private by default
- Only student, teacher, and consented parents can view progress
- Audit logging for all data access

### COPPA Compliance
- Student annotations are private by default
- Parental consent required for data access
- Privacy flags on all student-generated content
- Parent-student relationship tracking with consent dates

## Setup Instructions

### 1. Initial Database Setup

```bash
# Connect to your Supabase database
psql -h <your-supabase-host> -U postgres -d postgres

# Run migrations in order
\i src/database/migrations/001_initial_schema.sql
\i src/database/migrations/002_helper_functions.sql
\i src/database/migrations/003_rls_policies.sql
```

### 2. Verify Installation

```sql
-- Check schema version
SELECT * FROM schema_version ORDER BY applied_at DESC;

-- Verify all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'pdf_%' OR table_name IN ('vocabulary_terms', 'user_annotations', 'reading_progress');

-- Verify RLS policies
SELECT * FROM verify_rls_policies();

-- Check function count
SELECT COUNT(*) as function_count
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public';
```

### 3. Create Storage Buckets

```sql
-- Create storage buckets for PDFs and images
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('educational-pdfs', 'educational-pdfs', false),
  ('educational-images', 'educational-images', true);

-- Set up bucket policies (adjust as needed)
CREATE POLICY "Authenticated users can upload PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'educational-pdfs'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Public can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'educational-images');
```

## Performance Optimization

### Indexes
All critical queries have supporting indexes:
- GIN indexes for array columns (grade_level, subject_area, tags)
- Full-text search indexes for Spanish and English
- Composite indexes for common query patterns
- B-tree indexes for sorting and filtering

### Recommended Settings
```sql
-- For large text content searches
SET work_mem = '64MB';

-- For better text search performance
ALTER DATABASE your_db SET default_text_search_config = 'pg_catalog.spanish';
```

## Testing

### Sample Data Insertion

```sql
-- Insert a sample PDF document
INSERT INTO pdf_documents (
  filename,
  original_filename,
  file_size,
  storage_path,
  file_hash,
  content_type,
  grade_level,
  subject_area,
  primary_language,
  processing_status
) VALUES (
  'sample_reading_passage.pdf',
  'El Coquí de Puerto Rico.pdf',
  524288,
  'pdfs/2025/01/sample_reading_passage.pdf',
  'abc123def456',
  'reading_passage',
  ARRAY['2', '3'],
  ARRAY['reading', 'comprehension'],
  'spanish',
  'completed'
);

-- Test bilingual search
SELECT * FROM search_text_content('coquí', 'spanish', ARRAY['2', '3']);

-- Test student progress
INSERT INTO reading_progress (student_id, pdf_document_id, total_pages)
VALUES (auth.uid(), '<document-id>', 10);
```

## Migration Rollback

To rollback migrations (use with caution):

```sql
-- Rollback RLS policies
DROP POLICY IF EXISTS ... ; -- for each policy

-- Rollback functions
DROP FUNCTION IF EXISTS calculate_reading_complexity CASCADE;
-- ... repeat for all functions

-- Rollback schema (DANGEROUS - deletes all data)
DROP TABLE IF EXISTS user_annotations CASCADE;
DROP TABLE IF EXISTS vocabulary_terms CASCADE;
DROP TABLE IF EXISTS reading_progress CASCADE;
-- ... repeat for all tables
```

## Maintenance

### Regular Tasks

```sql
-- Analyze tables for query optimization
ANALYZE pdf_documents;
ANALYZE pdf_text_content;
ANALYZE reading_progress;

-- Vacuum to reclaim space
VACUUM ANALYZE;

-- Reindex for performance
REINDEX TABLE pdf_text_content;
```

### Monitoring Queries

```sql
-- Check document processing status
SELECT processing_status, COUNT(*)
FROM pdf_documents
GROUP BY processing_status;

-- Top vocabulary lookups
SELECT term, student_lookup_count
FROM vocabulary_terms
ORDER BY student_lookup_count DESC
LIMIT 20;

-- Student engagement metrics
SELECT
  COUNT(DISTINCT student_id) as active_students,
  AVG(completion_percentage) as avg_completion,
  SUM(time_spent_seconds)/3600 as total_hours
FROM reading_progress
WHERE last_accessed_at > NOW() - INTERVAL '7 days';
```

## Security Best Practices

1. **Never disable RLS** in production
2. **Use service role key** only in secure server environments
3. **Regularly audit** RLS policies with `pg_policies` view
4. **Monitor access patterns** for unusual activity
5. **Rotate encryption keys** for sensitive data
6. **Backup database** before running migrations
7. **Test RLS policies** thoroughly with different user roles

## Support Tables

Additional supporting tables included:
- `content_tags` - Flexible tagging system
- `document_tags` - Document-tag relationships
- `pdf_processing_logs` - Detailed processing audit trail
- `user_roles` - User role management
- `profiles` - User profile data
- `parent_student_relationships` - COPPA consent tracking

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [FERPA Compliance Guide](https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html)
- [COPPA Compliance](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)

## Version History

- **1.0.0** (2025-10-20) - Initial schema with 8 core tables
- **1.1.0** (2025-10-20) - Added helper functions and triggers
- **1.2.0** (2025-10-20) - Implemented RLS policies for FERPA/COPPA compliance

---

**License**: MIT
**Maintainer**: K5 Platform Team
**Last Updated**: 2025-10-20
