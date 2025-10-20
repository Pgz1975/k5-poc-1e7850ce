# K5 Database - Quick Start Guide

## 🚀 Installation in 3 Steps

### Step 1: Connect to Database
```bash
# Using Supabase CLI
supabase db reset

# Or using psql directly
psql -h your-db.supabase.co -U postgres -d postgres
```

### Step 2: Run Migrations
```bash
# From the database directory
cd /workspaces/k5-poc-1e7850ce/src/database

# Run migrations in order
psql -h your-db.supabase.co -U postgres -d postgres -f migrations/001_initial_schema.sql
psql -h your-db.supabase.co -U postgres -d postgres -f migrations/002_helper_functions.sql
psql -h your-db.supabase.co -U postgres -d postgres -f migrations/003_rls_policies.sql
```

### Step 3: Verify Installation
```bash
psql -h your-db.supabase.co -U postgres -d postgres -f verify_installation.sql
```

---

## ✅ What You Get

### 8 Core Tables
1. **pdf_documents** - PDF file metadata and processing status
2. **pdf_text_content** - Extracted text with language detection
3. **pdf_images** - Images with cultural context and accessibility
4. **text_image_correlations** - Intelligent text-image linking
5. **assessment_questions** - Structured assessment data
6. **reading_progress** - Student progress tracking (FERPA compliant)
7. **vocabulary_terms** - Bilingual vocabulary with Puerto Rican terms
8. **user_annotations** - Student notes and highlights (COPPA compliant)

### 16+ Database Functions
- Full-text search (Spanish & English)
- Reading complexity calculation
- Puerto Rican dialect detection
- Student progress analytics
- Content recommendations
- Automatic triggers for timestamps and validation

### 35+ Security Policies
- Row-level security on all tables
- Role-based access (Student, Teacher, Parent, Admin)
- FERPA compliance for student data
- COPPA compliance with parental consent
- Private-by-default annotations

### 40+ Performance Indexes
- Full-text search indexes
- Array indexes for grade levels and tags
- Composite indexes for common queries
- GIN indexes for optimal performance

---

## 📊 Quick Examples

### Insert a Document
```sql
INSERT INTO pdf_documents (
  filename,
  original_filename,
  file_size,
  storage_path,
  file_hash,
  content_type,
  grade_level,
  subject_area,
  primary_language
) VALUES (
  'el-coqui.pdf',
  'El Coquí de Puerto Rico.pdf',
  524288,
  'pdfs/2025/01/el-coqui.pdf',
  'sha256hash123',
  'reading_passage',
  ARRAY['2', '3'],
  ARRAY['reading', 'science'],
  'spanish'
);
```

### Search Content
```sql
-- Search for Puerto Rican content
SELECT * FROM search_text_content(
  'coquí',
  'spanish',
  ARRAY['2', '3'],
  20
);
```

### Track Student Progress
```sql
-- Create progress tracking
INSERT INTO reading_progress (
  student_id,
  pdf_document_id,
  total_pages,
  current_page
) VALUES (
  auth.uid(),
  '<document-uuid>',
  10,
  1
);

-- Get student summary
SELECT * FROM get_student_progress_summary(auth.uid());
```

### Add Vocabulary
```sql
INSERT INTO vocabulary_terms (
  term,
  term_language,
  definition_spanish,
  definition_english,
  grade_level,
  is_regionalism,
  regional_notes
) VALUES (
  'guagua',
  'spanish',
  'Autobús para transporte público',
  'Bus for public transportation',
  ARRAY['K', '1', '2', '3', '4', '5'],
  true,
  'Term specific to Puerto Rican Spanish'
);
```

---

## 🔐 Security Setup

### Create User Roles
```sql
-- Make someone a teacher
INSERT INTO user_roles (user_id, role)
VALUES ('<user-uuid>', 'teacher');

-- Make someone a student
INSERT INTO user_roles (user_id, role)
VALUES ('<user-uuid>', 'student');

-- Set student grade level
INSERT INTO profiles (id, grade_level)
VALUES ('<user-uuid>', '3');
```

### Parent-Student Relationship (COPPA)
```sql
-- Link parent to child with consent
INSERT INTO parent_student_relationships (
  parent_id,
  student_id,
  is_active,
  has_data_access_consent,
  consent_date
) VALUES (
  '<parent-uuid>',
  '<student-uuid>',
  true,
  true,
  NOW()
);
```

---

## 📦 Storage Buckets

Create these buckets in Supabase:

```sql
-- PDFs (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('educational-pdfs', 'educational-pdfs', false);

-- Images (public with CDN)
INSERT INTO storage.buckets (id, name, public)
VALUES ('educational-images', 'educational-images', true);
```

---

## 🧪 Testing

### Test Functions
```sql
-- Test reading complexity
SELECT calculate_reading_complexity(
  'Este es un texto simple para niños.',
  'spanish'
);

-- Test Puerto Rican dialect detection
SELECT detect_puerto_rican_dialect(
  'Vamos en la guagua al zafacón.'
); -- Should return true

-- Test similar content
SELECT * FROM find_similar_content('<document-uuid>', 5);

-- Test document stats
SELECT * FROM get_document_statistics();
```

### Test RLS Policies
```sql
-- Verify RLS is working
SELECT * FROM verify_rls_policies();

-- Test as student (should only see grade-appropriate content)
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claims.sub TO '<student-uuid>';
SELECT * FROM pdf_documents;
```

---

## 📈 Monitoring

### Check Processing Status
```sql
SELECT
  processing_status,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (processing_completed_at - processing_started_at))) as avg_seconds
FROM pdf_documents
GROUP BY processing_status;
```

### Student Engagement
```sql
SELECT
  COUNT(DISTINCT student_id) as active_students,
  AVG(completion_percentage) as avg_completion,
  SUM(time_spent_seconds)/3600 as total_hours
FROM reading_progress
WHERE last_accessed_at > NOW() - INTERVAL '7 days';
```

### Top Vocabulary
```sql
SELECT
  term,
  term_language,
  student_lookup_count,
  is_regionalism
FROM vocabulary_terms
ORDER BY student_lookup_count DESC
LIMIT 20;
```

---

## 🔧 Maintenance

### Regular Tasks
```sql
-- Optimize query performance
ANALYZE pdf_documents;
ANALYZE pdf_text_content;
ANALYZE reading_progress;

-- Reclaim space
VACUUM ANALYZE;

-- Rebuild indexes if needed
REINDEX TABLE pdf_text_content;
```

### Backup
```bash
# Backup entire database
pg_dump -h your-db.supabase.co -U postgres -d postgres > k5_backup.sql

# Backup specific tables
pg_dump -h your-db.supabase.co -U postgres -d postgres \
  -t pdf_documents -t pdf_text_content > content_backup.sql
```

---

## 📚 Full Documentation

- **Complete Setup**: [README.md](./README.md)
- **Implementation Details**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **Schema Reference**: [schema.sql](./schema.sql)
- **Security Policies**: [policies/rls_policies.sql](./policies/rls_policies.sql)

---

## ⚡ Performance Tips

1. **Use indexes** - All common queries are indexed
2. **Batch inserts** - Use transactions for multiple records
3. **Limit results** - Use LIMIT in queries for large datasets
4. **Use materialized views** - For complex aggregations
5. **Monitor slow queries** - Enable query logging

---

## 🆘 Troubleshooting

### RLS Blocking Queries?
```sql
-- Temporarily disable RLS (DEVELOPMENT ONLY)
ALTER TABLE pdf_documents DISABLE ROW LEVEL SECURITY;

-- Check your role
SELECT current_user, current_setting('request.jwt.claims', true);
```

### Full-Text Search Not Working?
```sql
-- Check search configuration
SHOW default_text_search_config;

-- Rebuild text search index
REINDEX INDEX idx_pdf_text_search_es;
REINDEX INDEX idx_pdf_text_search_en;
```

### Triggers Not Firing?
```sql
-- List all triggers
SELECT * FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- Check trigger function
\df+ trigger_set_timestamp
```

---

## 🎯 Next Steps

1. ✅ Database installed
2. ⏭️ Create Edge Functions for PDF processing
3. ⏭️ Build text extraction pipeline
4. ⏭️ Implement image processing
5. ⏭️ Create student UI for reading
6. ⏭️ Build teacher dashboard

---

**Need Help?** Check [README.md](./README.md) for detailed documentation.
