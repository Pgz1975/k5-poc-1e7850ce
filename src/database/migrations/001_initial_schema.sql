-- ============================================================================
-- MIGRATION 001: Initial Schema Setup
-- ============================================================================
-- Description: Creates all core tables for K5 PDF parsing system
-- Author: System Architect
-- Date: 2025-10-20
-- Version: 1.0.0
-- ============================================================================

-- Execute the main schema file
\i ../schema.sql

-- Verify tables were created
DO $$
BEGIN
  ASSERT (SELECT COUNT(*) FROM information_schema.tables
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
          )) = 8, 'All 8 core tables must be created';

  RAISE NOTICE 'Migration 001 completed successfully - All tables created';
END $$;
