-- ============================================================================
-- MIGRATION 003: Row Level Security Policies
-- ============================================================================
-- Description: Implements FERPA and COPPA compliant access control
-- Author: System Architect
-- Date: 2025-10-20
-- Version: 1.0.0
-- Compliance: FERPA, COPPA
-- ============================================================================

-- Execute RLS policies
\i ../policies/rls_policies.sql

-- Verify RLS is enabled and policies are created
DO $$
DECLARE
  v_rls_enabled_count INTEGER;
  v_policy_count INTEGER;
BEGIN
  -- Check RLS is enabled on core tables
  SELECT COUNT(*)
  INTO v_rls_enabled_count
  FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename IN (
    'pdf_documents',
    'pdf_text_content',
    'pdf_images',
    'text_image_correlations',
    'assessment_questions',
    'reading_progress',
    'vocabulary_terms',
    'user_annotations'
  )
  AND rowsecurity = true;

  -- Count total policies created
  SELECT COUNT(*)
  INTO v_policy_count
  FROM pg_policies
  WHERE schemaname = 'public';

  ASSERT v_rls_enabled_count >= 8, 'RLS must be enabled on all 8 core tables';
  ASSERT v_policy_count >= 20, 'At least 20 RLS policies must be created';

  RAISE NOTICE 'Migration 003 completed successfully';
  RAISE NOTICE 'RLS enabled on % tables', v_rls_enabled_count;
  RAISE NOTICE 'Total policies created: %', v_policy_count;
END $$;

-- Update schema version
INSERT INTO schema_version (version, description)
VALUES ('1.2.0', 'Added Row Level Security policies for FERPA/COPPA compliance')
ON CONFLICT (version) DO NOTHING;
