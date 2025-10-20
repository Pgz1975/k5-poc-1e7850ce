-- ============================================================================
-- MIGRATION 002: Helper Functions and Triggers
-- ============================================================================
-- Description: Installs helper functions, triggers, and automated processes
-- Author: System Architect
-- Date: 2025-10-20
-- Version: 1.0.0
-- ============================================================================

-- Execute helper functions
\i ../functions/helper_functions.sql

-- Execute trigger functions
\i ../functions/trigger_functions.sql

-- Verify functions were created
DO $$
DECLARE
  v_function_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO v_function_count
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public'
  AND p.proname IN (
    'calculate_reading_complexity',
    'find_similar_content',
    'get_document_statistics',
    'search_text_content',
    'get_correlated_content',
    'get_student_progress_summary',
    'get_vocabulary_by_grade',
    'detect_puerto_rican_dialect',
    'update_document_quality_score',
    'trigger_set_timestamp',
    'trigger_update_reading_progress_timestamp',
    'trigger_increment_vocabulary_lookup',
    'trigger_update_annotation_count',
    'trigger_calculate_text_complexity',
    'trigger_update_document_stats',
    'trigger_validate_assessment_question'
  );

  ASSERT v_function_count >= 15, 'All helper and trigger functions must be created';

  RAISE NOTICE 'Migration 002 completed successfully - % functions created', v_function_count;
END $$;

-- Update schema version
INSERT INTO schema_version (version, description)
VALUES ('1.1.0', 'Added helper functions and triggers for automation')
ON CONFLICT (version) DO NOTHING;
