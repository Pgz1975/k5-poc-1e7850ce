-- ============================================================================
-- K5 PDF PARSING SYSTEM - TRIGGER FUNCTIONS
-- ============================================================================
-- Purpose: Automatic timestamp updates and data integrity triggers
-- Version: 1.0.0
-- ============================================================================

-- ============================================================================
-- TRIGGER FUNCTION: Update Timestamp
-- ============================================================================
-- Automatically updates the updated_at column when a row is modified
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION trigger_set_timestamp IS 'Automatically updates updated_at timestamp on row modification';

-- ============================================================================
-- TRIGGER FUNCTION: Update Reading Progress Timestamp
-- ============================================================================
-- Updates last_accessed_at when reading progress is updated
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_update_reading_progress_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.last_accessed_at = NOW();
  NEW.updated_at = NOW();

  -- Calculate completion percentage
  IF NEW.total_pages > 0 THEN
    NEW.completion_percentage = (NEW.current_page::DECIMAL / NEW.total_pages * 100)::DECIMAL(5,2);
  END IF;

  -- Mark as completed if on last page
  IF NEW.current_page >= NEW.total_pages AND NEW.is_completed = false THEN
    NEW.is_completed = true;
    NEW.completed_at = NOW();
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION trigger_update_reading_progress_timestamp IS 'Updates timestamps and completion status for reading progress';

-- ============================================================================
-- TRIGGER FUNCTION: Update Vocabulary Lookup Count
-- ============================================================================
-- Increments lookup count when vocabulary annotation is created
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_increment_vocabulary_lookup()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Increment lookup count if this is a vocabulary lookup annotation
  IF NEW.annotation_type = 'vocabulary_lookup' AND NEW.vocabulary_term_id IS NOT NULL THEN
    UPDATE vocabulary_terms
    SET student_lookup_count = student_lookup_count + 1
    WHERE id = NEW.vocabulary_term_id;
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION trigger_increment_vocabulary_lookup IS 'Increments vocabulary lookup count when students look up terms';

-- ============================================================================
-- TRIGGER FUNCTION: Update Reading Progress Annotation Count
-- ============================================================================
-- Updates annotation count in reading_progress when annotations are added/removed
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_update_annotation_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment annotation count
    UPDATE reading_progress
    SET
      annotations_count = annotations_count + 1,
      vocabulary_lookups_count = CASE
        WHEN NEW.annotation_type = 'vocabulary_lookup' THEN vocabulary_lookups_count + 1
        ELSE vocabulary_lookups_count
      END
    WHERE student_id = NEW.student_id
      AND pdf_document_id = NEW.pdf_document_id;

  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement annotation count
    UPDATE reading_progress
    SET
      annotations_count = GREATEST(annotations_count - 1, 0),
      vocabulary_lookups_count = CASE
        WHEN OLD.annotation_type = 'vocabulary_lookup' THEN GREATEST(vocabulary_lookups_count - 1, 0)
        ELSE vocabulary_lookups_count
      END
    WHERE student_id = OLD.student_id
      AND pdf_document_id = OLD.pdf_document_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

COMMENT ON FUNCTION trigger_update_annotation_count IS 'Maintains annotation counts in reading_progress table';

-- ============================================================================
-- TRIGGER FUNCTION: Calculate Text Complexity on Insert
-- ============================================================================
-- Automatically calculates reading complexity score for new text content
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_calculate_text_complexity()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Calculate complexity score if not already set
  IF NEW.reading_complexity_score IS NULL AND NEW.text_content IS NOT NULL THEN
    NEW.reading_complexity_score = calculate_reading_complexity(
      NEW.text_content,
      NEW.detected_language
    );
  END IF;

  -- Detect Puerto Rican dialect for Spanish content
  IF NEW.detected_language = 'spanish' AND NEW.dialect_variant IS NULL THEN
    IF detect_puerto_rican_dialect(NEW.text_content) THEN
      NEW.dialect_variant = 'puerto_rican_spanish';
    ELSE
      NEW.dialect_variant = 'standard_spanish';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION trigger_calculate_text_complexity IS 'Calculates complexity score and detects dialect for text content';

-- ============================================================================
-- TRIGGER FUNCTION: Update Document Statistics
-- ============================================================================
-- Updates aggregate statistics in pdf_documents when content is added
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_update_document_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_TABLE_NAME = 'pdf_text_content' THEN
    -- Update word count
    UPDATE pdf_documents
    SET
      word_count = COALESCE(word_count, 0) + NEW.word_count,
      updated_at = NOW()
    WHERE id = NEW.pdf_document_id;

  ELSIF TG_TABLE_NAME = 'pdf_images' THEN
    -- Update image count
    UPDATE pdf_documents
    SET
      image_count = COALESCE(image_count, 0) + 1,
      updated_at = NOW()
    WHERE id = NEW.pdf_document_id;
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION trigger_update_document_stats IS 'Updates document statistics when content is added';

-- ============================================================================
-- TRIGGER FUNCTION: Validate Assessment Question
-- ============================================================================
-- Ensures assessment questions have valid answer choices
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_validate_assessment_question()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Ensure correct_answer references a choice that exists
  IF NEW.correct_answer = 'A' AND NEW.choice_a IS NULL THEN
    RAISE EXCEPTION 'Choice A must be provided if it is the correct answer';
  END IF;

  IF NEW.correct_answer = 'B' AND NEW.choice_b IS NULL THEN
    RAISE EXCEPTION 'Choice B must be provided if it is the correct answer';
  END IF;

  IF NEW.correct_answer = 'C' AND NEW.choice_c IS NULL THEN
    RAISE EXCEPTION 'Choice C must be provided if it is the correct answer';
  END IF;

  IF NEW.correct_answer = 'D' AND NEW.choice_d IS NULL THEN
    RAISE EXCEPTION 'Choice D must be provided if it is the correct answer';
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION trigger_validate_assessment_question IS 'Validates assessment question answer choices';

-- ============================================================================
-- CREATE TRIGGERS
-- ============================================================================

-- Updated timestamp triggers
DROP TRIGGER IF EXISTS set_timestamp_pdf_documents ON pdf_documents;
CREATE TRIGGER set_timestamp_pdf_documents
  BEFORE UPDATE ON pdf_documents
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_vocabulary_terms ON vocabulary_terms;
CREATE TRIGGER set_timestamp_vocabulary_terms
  BEFORE UPDATE ON vocabulary_terms
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_user_annotations ON user_annotations;
CREATE TRIGGER set_timestamp_user_annotations
  BEFORE UPDATE ON user_annotations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Reading progress triggers
DROP TRIGGER IF EXISTS update_reading_progress_timestamp ON reading_progress;
CREATE TRIGGER update_reading_progress_timestamp
  BEFORE INSERT OR UPDATE ON reading_progress
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_reading_progress_timestamp();

-- Vocabulary lookup triggers
DROP TRIGGER IF EXISTS increment_vocabulary_lookup ON user_annotations;
CREATE TRIGGER increment_vocabulary_lookup
  AFTER INSERT ON user_annotations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_increment_vocabulary_lookup();

-- Annotation count triggers
DROP TRIGGER IF EXISTS update_annotation_count ON user_annotations;
CREATE TRIGGER update_annotation_count
  AFTER INSERT OR DELETE ON user_annotations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_annotation_count();

-- Text complexity triggers
DROP TRIGGER IF EXISTS calculate_text_complexity ON pdf_text_content;
CREATE TRIGGER calculate_text_complexity
  BEFORE INSERT ON pdf_text_content
  FOR EACH ROW
  EXECUTE FUNCTION trigger_calculate_text_complexity();

-- Document statistics triggers
DROP TRIGGER IF EXISTS update_document_stats_text ON pdf_text_content;
CREATE TRIGGER update_document_stats_text
  AFTER INSERT ON pdf_text_content
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_document_stats();

DROP TRIGGER IF EXISTS update_document_stats_images ON pdf_images;
CREATE TRIGGER update_document_stats_images
  AFTER INSERT ON pdf_images
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_document_stats();

-- Assessment validation triggers
DROP TRIGGER IF EXISTS validate_assessment_question ON assessment_questions;
CREATE TRIGGER validate_assessment_question
  BEFORE INSERT OR UPDATE ON assessment_questions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_validate_assessment_question();
