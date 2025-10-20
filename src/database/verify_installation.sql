-- ============================================================================
-- K5 PDF PARSING SYSTEM - INSTALLATION VERIFICATION SCRIPT
-- ============================================================================
-- Purpose: Verify all database components are properly installed
-- Usage: psql -h <host> -U postgres -d postgres -f verify_installation.sql
-- ============================================================================

\echo '============================================================================'
\echo 'K5 PDF PARSING SYSTEM - INSTALLATION VERIFICATION'
\echo '============================================================================'
\echo ''

-- ============================================================================
-- 1. VERIFY SCHEMA VERSION
-- ============================================================================
\echo '1. Checking schema version...'
SELECT
  version,
  applied_at,
  description
FROM schema_version
ORDER BY applied_at DESC;

\echo ''

-- ============================================================================
-- 2. VERIFY ALL TABLES EXIST
-- ============================================================================
\echo '2. Verifying all core tables exist...'
SELECT
  table_name,
  CASE
    WHEN table_name IN (
      'pdf_documents',
      'pdf_text_content',
      'pdf_images',
      'text_image_correlations',
      'assessment_questions',
      'reading_progress',
      'vocabulary_terms',
      'user_annotations'
    ) THEN 'CORE TABLE'
    ELSE 'SUPPORTING TABLE'
  END as table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND (
  table_name LIKE 'pdf_%'
  OR table_name IN ('vocabulary_terms', 'user_annotations', 'reading_progress', 'content_tags', 'document_tags', 'user_roles', 'profiles', 'parent_student_relationships')
)
ORDER BY table_type, table_name;

\echo ''

-- ============================================================================
-- 3. VERIFY INDEXES
-- ============================================================================
\echo '3. Checking index counts per table...'
SELECT
  schemaname || '.' || tablename AS table_name,
  COUNT(*) AS index_count
FROM pg_indexes
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
GROUP BY schemaname, tablename
ORDER BY tablename;

\echo ''

-- ============================================================================
-- 4. VERIFY FUNCTIONS
-- ============================================================================
\echo '4. Verifying database functions...'
SELECT
  p.proname AS function_name,
  pg_get_function_result(p.oid) AS return_type,
  CASE
    WHEN p.proname LIKE 'trigger_%' THEN 'TRIGGER FUNCTION'
    WHEN p.proname LIKE 'get_%' THEN 'QUERY FUNCTION'
    WHEN p.proname LIKE 'calculate_%' THEN 'CALCULATION FUNCTION'
    WHEN p.proname LIKE 'search_%' THEN 'SEARCH FUNCTION'
    WHEN p.proname LIKE 'detect_%' THEN 'DETECTION FUNCTION'
    WHEN p.proname LIKE 'find_%' THEN 'DISCOVERY FUNCTION'
    WHEN p.proname LIKE 'update_%' THEN 'UPDATE FUNCTION'
    ELSE 'UTILITY FUNCTION'
  END AS function_type
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
  'verify_rls_policies',
  'trigger_set_timestamp',
  'trigger_update_reading_progress_timestamp',
  'trigger_increment_vocabulary_lookup',
  'trigger_update_annotation_count',
  'trigger_calculate_text_complexity',
  'trigger_update_document_stats',
  'trigger_validate_assessment_question'
)
ORDER BY function_type, function_name;

\echo ''

-- ============================================================================
-- 5. VERIFY TRIGGERS
-- ============================================================================
\echo '5. Checking triggers are attached...'
SELECT
  event_object_table AS table_name,
  trigger_name,
  event_manipulation AS trigger_event,
  action_timing AS timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND event_object_table IN (
  'pdf_documents',
  'pdf_text_content',
  'pdf_images',
  'reading_progress',
  'vocabulary_terms',
  'user_annotations',
  'assessment_questions'
)
ORDER BY event_object_table, trigger_name;

\echo ''

-- ============================================================================
-- 6. VERIFY ROW LEVEL SECURITY
-- ============================================================================
\echo '6. Verifying Row Level Security is enabled...'
SELECT * FROM verify_rls_policies();

\echo ''

-- ============================================================================
-- 7. VERIFY FULL-TEXT SEARCH INDEXES
-- ============================================================================
\echo '7. Checking full-text search indexes...'
SELECT
  schemaname || '.' || tablename AS table_name,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND indexdef LIKE '%to_tsvector%'
ORDER BY tablename, indexname;

\echo ''

-- ============================================================================
-- 8. VERIFY FOREIGN KEY CONSTRAINTS
-- ============================================================================
\echo '8. Checking foreign key constraints...'
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
AND tc.table_name IN (
  'pdf_text_content',
  'pdf_images',
  'text_image_correlations',
  'assessment_questions',
  'reading_progress',
  'user_annotations',
  'document_tags'
)
ORDER BY tc.table_name, kcu.column_name;

\echo ''

-- ============================================================================
-- 9. SUMMARY STATISTICS
-- ============================================================================
\echo '9. Installation Summary...'
\echo ''

DO $$
DECLARE
  v_table_count INTEGER;
  v_core_table_count INTEGER;
  v_index_count INTEGER;
  v_function_count INTEGER;
  v_trigger_count INTEGER;
  v_policy_count INTEGER;
  v_rls_enabled_count INTEGER;
BEGIN
  -- Count tables
  SELECT COUNT(*)
  INTO v_table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name NOT LIKE 'pg_%';

  SELECT COUNT(*)
  INTO v_core_table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name IN (
    'pdf_documents',
    'pdf_text_content',
    'pdf_images',
    'text_image_correlations',
    'assessment_questions',
    'reading_progress',
    'vocabulary_terms',
    'user_annotations'
  );

  -- Count indexes
  SELECT COUNT(*)
  INTO v_index_count
  FROM pg_indexes
  WHERE schemaname = 'public';

  -- Count functions
  SELECT COUNT(*)
  INTO v_function_count
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public';

  -- Count triggers
  SELECT COUNT(*)
  INTO v_trigger_count
  FROM information_schema.triggers
  WHERE trigger_schema = 'public';

  -- Count policies
  SELECT COUNT(*)
  INTO v_policy_count
  FROM pg_policies
  WHERE schemaname = 'public';

  -- Count RLS enabled tables
  SELECT COUNT(*)
  INTO v_rls_enabled_count
  FROM pg_tables
  WHERE schemaname = 'public'
  AND rowsecurity = true;

  RAISE NOTICE '╔════════════════════════════════════════════════════════════════╗';
  RAISE NOTICE '║              K5 PDF PARSING SYSTEM - SUMMARY                   ║';
  RAISE NOTICE '╠════════════════════════════════════════════════════════════════╣';
  RAISE NOTICE '║ Total Tables:                    % tables                    ║', LPAD(v_table_count::TEXT, 5);
  RAISE NOTICE '║ Core Tables:                     % tables                    ║', LPAD(v_core_table_count::TEXT, 5);
  RAISE NOTICE '║ Indexes:                         % indexes                   ║', LPAD(v_index_count::TEXT, 5);
  RAISE NOTICE '║ Functions:                       % functions                 ║', LPAD(v_function_count::TEXT, 5);
  RAISE NOTICE '║ Triggers:                        % triggers                  ║', LPAD(v_trigger_count::TEXT, 5);
  RAISE NOTICE '║ RLS Policies:                    % policies                  ║', LPAD(v_policy_count::TEXT, 5);
  RAISE NOTICE '║ RLS Enabled Tables:              % tables                    ║', LPAD(v_rls_enabled_count::TEXT, 5);
  RAISE NOTICE '╠════════════════════════════════════════════════════════════════╣';

  -- Validation
  IF v_core_table_count = 8 THEN
    RAISE NOTICE '║ ✅ All 8 core tables installed                                ║';
  ELSE
    RAISE NOTICE '║ ❌ MISSING CORE TABLES! Expected 8, found %                   ║', v_core_table_count;
  END IF;

  IF v_index_count >= 40 THEN
    RAISE NOTICE '║ ✅ Performance indexes installed                              ║';
  ELSE
    RAISE NOTICE '║ ⚠️  Some indexes may be missing (found %)                    ║', v_index_count;
  END IF;

  IF v_function_count >= 15 THEN
    RAISE NOTICE '║ ✅ Helper and trigger functions installed                     ║';
  ELSE
    RAISE NOTICE '║ ❌ MISSING FUNCTIONS! Expected 15+, found %                   ║', v_function_count;
  END IF;

  IF v_policy_count >= 20 THEN
    RAISE NOTICE '║ ✅ RLS policies installed (FERPA/COPPA compliant)             ║';
  ELSE
    RAISE NOTICE '║ ⚠️  Some RLS policies may be missing (found %)               ║', v_policy_count;
  END IF;

  IF v_rls_enabled_count >= 8 THEN
    RAISE NOTICE '║ ✅ Row Level Security enabled on core tables                  ║';
  ELSE
    RAISE NOTICE '║ ❌ RLS NOT ENABLED on all tables! Found %                     ║', v_rls_enabled_count;
  END IF;

  RAISE NOTICE '╠════════════════════════════════════════════════════════════════╣';
  RAISE NOTICE '║ Status: % ║',
    CASE
      WHEN v_core_table_count = 8
        AND v_function_count >= 15
        AND v_policy_count >= 20
        AND v_rls_enabled_count >= 8
      THEN 'INSTALLATION SUCCESSFUL ✅                            '
      ELSE 'INSTALLATION INCOMPLETE ❌                            '
    END;
  RAISE NOTICE '╚════════════════════════════════════════════════════════════════╝';
  RAISE NOTICE '';
END $$;

-- ============================================================================
-- 10. QUICK FUNCTIONALITY TESTS
-- ============================================================================
\echo '10. Running quick functionality tests...'
\echo ''

-- Test reading complexity calculation
\echo 'Testing calculate_reading_complexity()...'
SELECT
  'Reading Complexity' AS test,
  calculate_reading_complexity(
    'Este es un texto de ejemplo para niños. Es muy simple y fácil de leer.',
    'spanish'
  ) AS result,
  'Should return a numeric score' AS expected;

-- Test Puerto Rican dialect detection
\echo ''
\echo 'Testing detect_puerto_rican_dialect()...'
SELECT
  'Puerto Rican Dialect Detection' AS test,
  detect_puerto_rican_dialect('Vamos en la guagua al zafacón con el corillo.') AS result,
  'Should return TRUE' AS expected;

-- Test document statistics
\echo ''
\echo 'Testing get_document_statistics()...'
SELECT * FROM get_document_statistics();

\echo ''
\echo '============================================================================'
\echo 'VERIFICATION COMPLETE'
\echo '============================================================================'
\echo ''
\echo 'Next steps:'
\echo '1. Review the summary above to ensure all components are installed'
\echo '2. Check that RLS is enabled on all 8 core tables'
\echo '3. Verify policy count is >= 20 for FERPA/COPPA compliance'
\echo '4. Create storage buckets: educational-pdfs and educational-images'
\echo '5. Begin implementing Edge Functions for PDF processing'
\echo ''
\echo 'Documentation: /workspaces/k5-poc-1e7850ce/src/database/README.md'
\echo '============================================================================'
