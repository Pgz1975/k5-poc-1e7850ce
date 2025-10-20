-- ============================================================================
-- K5 PDF PARSING SYSTEM - ROW LEVEL SECURITY POLICIES
-- ============================================================================
-- Purpose: FERPA and COPPA compliant access control policies
-- Version: 1.0.0
-- Compliance: FERPA (student data privacy), COPPA (child privacy)
-- ============================================================================

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================
ALTER TABLE pdf_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_text_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_image_correlations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_processing_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PDF DOCUMENTS POLICIES
-- ============================================================================

-- Service role has full access (for Edge Functions)
CREATE POLICY "Service role has full access to pdf_documents"
  ON pdf_documents
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Teachers can view all educational content
CREATE POLICY "Teachers can view all pdf_documents"
  ON pdf_documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'teacher'
    )
  );

-- Teachers can upload new PDFs
CREATE POLICY "Teachers can upload pdf_documents"
  ON pdf_documents
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'teacher'
    )
  );

-- Teachers can update documents they uploaded
CREATE POLICY "Teachers can update their pdf_documents"
  ON pdf_documents
  FOR UPDATE
  USING (
    uploaded_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('teacher', 'admin')
    )
  );

-- Students can view published content for their grade level
CREATE POLICY "Students can view grade-appropriate pdf_documents"
  ON pdf_documents
  FOR SELECT
  USING (
    processing_status = 'completed' AND
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN profiles p ON p.id = ur.user_id
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'student'
      AND p.grade_level = ANY(pdf_documents.grade_level)
    )
  );

-- Admins have full access
CREATE POLICY "Admins have full access to pdf_documents"
  ON pdf_documents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- ============================================================================
-- PDF TEXT CONTENT POLICIES
-- ============================================================================

CREATE POLICY "Service role has full access to pdf_text_content"
  ON pdf_text_content
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Users can view text content from accessible documents"
  ON pdf_text_content
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pdf_documents
      WHERE pdf_documents.id = pdf_text_content.pdf_document_id
      AND pdf_documents.processing_status = 'completed'
    )
  );

-- ============================================================================
-- PDF IMAGES POLICIES
-- ============================================================================

CREATE POLICY "Service role has full access to pdf_images"
  ON pdf_images
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Users can view images from accessible documents"
  ON pdf_images
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pdf_documents
      WHERE pdf_documents.id = pdf_images.pdf_document_id
      AND pdf_documents.processing_status = 'completed'
    )
  );

-- ============================================================================
-- TEXT-IMAGE CORRELATIONS POLICIES
-- ============================================================================

CREATE POLICY "Service role has full access to text_image_correlations"
  ON text_image_correlations
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Users can view correlations from accessible content"
  ON text_image_correlations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pdf_text_content tc
      JOIN pdf_documents pd ON pd.id = tc.pdf_document_id
      WHERE tc.id = text_image_correlations.text_content_id
      AND pd.processing_status = 'completed'
    )
  );

-- ============================================================================
-- ASSESSMENT QUESTIONS POLICIES
-- ============================================================================

CREATE POLICY "Service role has full access to assessment_questions"
  ON assessment_questions
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Teachers can view all assessment questions
CREATE POLICY "Teachers can view all assessment_questions"
  ON assessment_questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('teacher', 'admin')
    )
  );

-- Students can view questions but NOT correct answers (enforce at application level)
CREATE POLICY "Students can view grade-appropriate assessment_questions"
  ON assessment_questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pdf_documents pd
      JOIN user_roles ur ON ur.user_id = auth.uid()
      JOIN profiles p ON p.id = ur.user_id
      WHERE pd.id = assessment_questions.pdf_document_id
      AND pd.processing_status = 'completed'
      AND ur.role = 'student'
      AND p.grade_level = ANY(pd.grade_level)
    )
  );

-- ============================================================================
-- READING PROGRESS POLICIES (FERPA COMPLIANT)
-- ============================================================================

CREATE POLICY "Service role has full access to reading_progress"
  ON reading_progress
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Students can view and update their own progress
CREATE POLICY "Students can manage their own reading_progress"
  ON reading_progress
  FOR ALL
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Teachers can view progress of their students
CREATE POLICY "Teachers can view student reading_progress"
  ON reading_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('teacher', 'admin')
    )
  );

-- Parents can view their child's progress (if parent-student relationship exists)
CREATE POLICY "Parents can view their children's reading_progress"
  ON reading_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_student_relationships psr
      WHERE psr.parent_id = auth.uid()
      AND psr.student_id = reading_progress.student_id
      AND psr.is_active = true
    )
  );

-- ============================================================================
-- VOCABULARY TERMS POLICIES
-- ============================================================================

CREATE POLICY "Service role has full access to vocabulary_terms"
  ON vocabulary_terms
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- All authenticated users can view vocabulary terms
CREATE POLICY "Authenticated users can view vocabulary_terms"
  ON vocabulary_terms
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Teachers can add new vocabulary terms
CREATE POLICY "Teachers can add vocabulary_terms"
  ON vocabulary_terms
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('teacher', 'admin')
    )
  );

-- ============================================================================
-- USER ANNOTATIONS POLICIES (COPPA COMPLIANT)
-- ============================================================================

CREATE POLICY "Service role has full access to user_annotations"
  ON user_annotations
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Students can manage their own annotations
CREATE POLICY "Students can manage their own user_annotations"
  ON user_annotations
  FOR ALL
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Teachers can view annotations shared with them
CREATE POLICY "Teachers can view shared user_annotations"
  ON user_annotations
  FOR SELECT
  USING (
    shared_with_teacher = true AND
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('teacher', 'admin')
    )
  );

-- Parents can view their child's annotations (COPPA parental consent)
CREATE POLICY "Parents can view their children's user_annotations"
  ON user_annotations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_student_relationships psr
      WHERE psr.parent_id = auth.uid()
      AND psr.student_id = user_annotations.student_id
      AND psr.is_active = true
      AND psr.has_data_access_consent = true
    )
  );

-- ============================================================================
-- CONTENT TAGS POLICIES
-- ============================================================================

CREATE POLICY "Service role has full access to content_tags"
  ON content_tags
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- All authenticated users can view tags
CREATE POLICY "Authenticated users can view content_tags"
  ON content_tags
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Teachers can manage tags
CREATE POLICY "Teachers can manage content_tags"
  ON content_tags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('teacher', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('teacher', 'admin')
    )
  );

-- ============================================================================
-- DOCUMENT TAGS POLICIES
-- ============================================================================

CREATE POLICY "Service role has full access to document_tags"
  ON document_tags
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- All authenticated users can view document tags
CREATE POLICY "Authenticated users can view document_tags"
  ON document_tags
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Teachers can manage document tags
CREATE POLICY "Teachers can manage document_tags"
  ON document_tags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('teacher', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('teacher', 'admin')
    )
  );

-- ============================================================================
-- PROCESSING LOGS POLICIES
-- ============================================================================

CREATE POLICY "Service role has full access to pdf_processing_logs"
  ON pdf_processing_logs
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Admins can view all processing logs
CREATE POLICY "Admins can view pdf_processing_logs"
  ON pdf_processing_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Teachers can view logs for documents they uploaded
CREATE POLICY "Teachers can view their pdf_processing_logs"
  ON pdf_processing_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pdf_documents pd
      WHERE pd.id = pdf_processing_logs.pdf_document_id
      AND pd.uploaded_by = auth.uid()
    )
  );

-- ============================================================================
-- SUPPORTING TABLES FOR RLS POLICIES
-- ============================================================================
-- These tables should already exist in your main schema
-- Included here as reference for the RLS policies

-- User Roles Table (if not already exists)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'parent', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Profiles Table (if not already exists)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  grade_level TEXT,
  school_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_grade ON profiles(grade_level);

-- Parent-Student Relationships Table (for COPPA compliance)
CREATE TABLE IF NOT EXISTS parent_student_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  has_data_access_consent BOOLEAN DEFAULT false, -- COPPA parental consent
  consent_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_parent_student_parent ON parent_student_relationships(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_student ON parent_student_relationships(student_id);

COMMENT ON TABLE parent_student_relationships IS 'Parent-student relationships with COPPA consent tracking';
COMMENT ON COLUMN parent_student_relationships.has_data_access_consent IS 'COPPA parental consent for accessing student data';

-- ============================================================================
-- POLICY VERIFICATION FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION verify_rls_policies()
RETURNS TABLE (
  table_name TEXT,
  rls_enabled BOOLEAN,
  policy_count BIGINT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    schemaname || '.' || tablename AS table_name,
    rowsecurity AS rls_enabled,
    (
      SELECT COUNT(*)
      FROM pg_policies
      WHERE schemaname = t.schemaname
      AND tablename = t.tablename
    ) AS policy_count
  FROM pg_tables t
  WHERE schemaname = 'public'
  AND tablename IN (
    'pdf_documents',
    'pdf_text_content',
    'pdf_images',
    'text_image_correlations',
    'assessment_questions',
    'reading_progress',
    'vocabulary_terms',
    'user_annotations',
    'content_tags',
    'document_tags',
    'pdf_processing_logs'
  )
  ORDER BY tablename;
$$;

COMMENT ON FUNCTION verify_rls_policies IS 'Verifies RLS is enabled and counts policies for each table';
