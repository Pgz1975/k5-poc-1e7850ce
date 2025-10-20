-- ============================================================================
-- K5 PDF PARSING SYSTEM - HELPER FUNCTIONS
-- ============================================================================
-- Purpose: Database functions for text search, correlation, and analytics
-- Version: 1.0.0
-- ============================================================================

-- ============================================================================
-- FUNCTION: Calculate Reading Complexity Score
-- ============================================================================
-- Based on word count, sentence structure, and average word length
-- Returns a complexity score suitable for grade-level assessment
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_reading_complexity(
  p_text TEXT,
  p_language TEXT
)
RETURNS DECIMAL(5,2)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_word_count INTEGER;
  v_sentence_count INTEGER;
  v_avg_word_length DECIMAL(5,2);
  v_avg_sentence_length DECIMAL(5,2);
  v_complexity_score DECIMAL(5,2);
BEGIN
  -- Handle empty text
  IF p_text IS NULL OR LENGTH(TRIM(p_text)) = 0 THEN
    RETURN 0.00;
  END IF;

  -- Count words (split on whitespace)
  v_word_count := array_length(regexp_split_to_array(TRIM(p_text), '\s+'), 1);

  -- Count sentences (split on sentence terminators)
  v_sentence_count := array_length(
    regexp_split_to_array(p_text, '[.!?]+\s*'), 1
  );

  -- Ensure we have at least 1 sentence to avoid division by zero
  v_sentence_count := GREATEST(v_sentence_count, 1);

  -- Calculate average word length
  v_avg_word_length := LENGTH(REPLACE(p_text, ' ', ''))::DECIMAL / NULLIF(v_word_count, 0);

  -- Calculate average sentence length
  v_avg_sentence_length := v_word_count::DECIMAL / v_sentence_count;

  -- Complexity formula (similar to Flesch-Kincaid readability)
  -- Higher score = more complex
  v_complexity_score := (v_avg_sentence_length * 0.39) + (v_avg_word_length * 11.8);

  RETURN ROUND(v_complexity_score, 2);
END;
$$;

COMMENT ON FUNCTION calculate_reading_complexity IS 'Calculates reading complexity score for grade-level assessment';

-- ============================================================================
-- FUNCTION: Find Similar Content
-- ============================================================================
-- Finds documents similar to a given document based on grade, subject, and language
-- ============================================================================
CREATE OR REPLACE FUNCTION find_similar_content(
  p_document_id UUID,
  p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
  similar_doc_id UUID,
  similarity_score DECIMAL(3,2),
  content_type TEXT,
  grade_level TEXT[],
  primary_language TEXT,
  filename TEXT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  WITH source_doc AS (
    SELECT
      pd.grade_level,
      pd.subject_area,
      pd.primary_language,
      pd.content_type
    FROM pdf_documents pd
    WHERE pd.id = p_document_id
      AND pd.processing_status = 'completed'
  )
  SELECT
    pd.id,
    (
      -- Grade level overlap (40% weight)
      CASE
        WHEN pd.grade_level && sd.grade_level THEN 0.40
        ELSE 0.00
      END +
      -- Subject area overlap (30% weight)
      CASE
        WHEN pd.subject_area && sd.subject_area THEN 0.30
        ELSE 0.00
      END +
      -- Same language (20% weight)
      CASE
        WHEN pd.primary_language = sd.primary_language THEN 0.20
        ELSE 0.00
      END +
      -- Same content type (10% weight)
      CASE
        WHEN pd.content_type = sd.content_type THEN 0.10
        ELSE 0.00
      END
    )::DECIMAL(3,2) AS similarity_score,
    pd.content_type,
    pd.grade_level,
    pd.primary_language,
    pd.filename
  FROM pdf_documents pd
  CROSS JOIN source_doc sd
  WHERE pd.id != p_document_id
    AND pd.processing_status = 'completed'
  ORDER BY similarity_score DESC
  LIMIT p_limit;
END;
$$;

COMMENT ON FUNCTION find_similar_content IS 'Finds similar documents based on educational metadata';

-- ============================================================================
-- FUNCTION: Get Document Statistics
-- ============================================================================
-- Returns aggregate statistics for all processed documents
-- ============================================================================
CREATE OR REPLACE FUNCTION get_document_statistics()
RETURNS TABLE (
  total_documents BIGINT,
  total_pages BIGINT,
  total_images BIGINT,
  spanish_docs BIGINT,
  english_docs BIGINT,
  bilingual_docs BIGINT,
  avg_processing_time_seconds DECIMAL(10,2),
  total_storage_bytes BIGINT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    COUNT(*)::BIGINT AS total_documents,
    COALESCE(SUM(page_count), 0)::BIGINT AS total_pages,
    COALESCE(SUM(image_count), 0)::BIGINT AS total_images,
    COUNT(*) FILTER (WHERE primary_language = 'spanish')::BIGINT AS spanish_docs,
    COUNT(*) FILTER (WHERE primary_language = 'english')::BIGINT AS english_docs,
    COUNT(*) FILTER (WHERE primary_language = 'bilingual')::BIGINT AS bilingual_docs,
    COALESCE(
      AVG(
        EXTRACT(EPOCH FROM (processing_completed_at - processing_started_at))
      ), 0
    )::DECIMAL(10,2) AS avg_processing_time_seconds,
    COALESCE(SUM(file_size), 0)::BIGINT AS total_storage_bytes
  FROM pdf_documents
  WHERE processing_status = 'completed';
$$;

COMMENT ON FUNCTION get_document_statistics IS 'Returns comprehensive statistics for all processed documents';

-- ============================================================================
-- FUNCTION: Search Text Content (Bilingual)
-- ============================================================================
-- Full-text search across Spanish and English content
-- ============================================================================
CREATE OR REPLACE FUNCTION search_text_content(
  p_search_query TEXT,
  p_language TEXT DEFAULT NULL,
  p_grade_levels TEXT[] DEFAULT NULL,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  text_id UUID,
  document_id UUID,
  page_number INTEGER,
  text_preview TEXT,
  detected_language TEXT,
  rank REAL
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    tc.id,
    tc.pdf_document_id,
    tc.page_number,
    LEFT(tc.text_content, 200) || '...' AS text_preview,
    tc.detected_language,
    CASE
      WHEN tc.detected_language = 'spanish' THEN
        ts_rank(to_tsvector('spanish', tc.text_content), plainto_tsquery('spanish', p_search_query))
      ELSE
        ts_rank(to_tsvector('english', tc.text_content), plainto_tsquery('english', p_search_query))
    END AS rank
  FROM pdf_text_content tc
  INNER JOIN pdf_documents pd ON pd.id = tc.pdf_document_id
  WHERE
    pd.processing_status = 'completed'
    AND (
      p_language IS NULL
      OR tc.detected_language = p_language
    )
    AND (
      p_grade_levels IS NULL
      OR pd.grade_level && p_grade_levels
    )
    AND (
      CASE
        WHEN tc.detected_language = 'spanish' THEN
          to_tsvector('spanish', tc.text_content) @@ plainto_tsquery('spanish', p_search_query)
        ELSE
          to_tsvector('english', tc.text_content) @@ plainto_tsquery('english', p_search_query)
      END
    )
  ORDER BY rank DESC
  LIMIT p_limit;
END;
$$;

COMMENT ON FUNCTION search_text_content IS 'Bilingual full-text search with grade-level filtering';

-- ============================================================================
-- FUNCTION: Get Correlated Content
-- ============================================================================
-- Retrieves text and images that are correlated for a given page
-- ============================================================================
CREATE OR REPLACE FUNCTION get_correlated_content(
  p_document_id UUID,
  p_page_number INTEGER
)
RETURNS TABLE (
  text_content_id UUID,
  text_content TEXT,
  image_id UUID,
  image_path TEXT,
  correlation_type TEXT,
  confidence_score DECIMAL(3,2),
  layout_suggestion TEXT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    tc.id AS text_content_id,
    tc.text_content,
    img.id AS image_id,
    img.storage_path AS image_path,
    corr.correlation_type,
    corr.confidence_score,
    corr.layout_suggestion
  FROM text_image_correlations corr
  INNER JOIN pdf_text_content tc ON tc.id = corr.text_content_id
  INNER JOIN pdf_images img ON img.id = corr.image_id
  WHERE tc.pdf_document_id = p_document_id
    AND tc.page_number = p_page_number
  ORDER BY corr.display_order, corr.confidence_score DESC;
$$;

COMMENT ON FUNCTION get_correlated_content IS 'Retrieves correlated text and images for enhanced display';

-- ============================================================================
-- FUNCTION: Calculate Student Progress Summary
-- ============================================================================
-- Aggregates reading progress for a student
-- ============================================================================
CREATE OR REPLACE FUNCTION get_student_progress_summary(
  p_student_id UUID
)
RETURNS TABLE (
  total_documents INTEGER,
  completed_documents INTEGER,
  in_progress_documents INTEGER,
  total_time_minutes INTEGER,
  avg_comprehension_score DECIMAL(5,2),
  total_annotations INTEGER,
  vocabulary_lookups INTEGER
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    COUNT(*)::INTEGER AS total_documents,
    COUNT(*) FILTER (WHERE is_completed = true)::INTEGER AS completed_documents,
    COUNT(*) FILTER (WHERE is_completed = false AND completion_percentage > 0)::INTEGER AS in_progress_documents,
    COALESCE(SUM(time_spent_seconds) / 60, 0)::INTEGER AS total_time_minutes,
    AVG(comprehension_score)::DECIMAL(5,2) AS avg_comprehension_score,
    COALESCE(SUM(annotations_count), 0)::INTEGER AS total_annotations,
    COALESCE(SUM(vocabulary_lookups_count), 0)::INTEGER AS vocabulary_lookups
  FROM reading_progress
  WHERE student_id = p_student_id;
$$;

COMMENT ON FUNCTION get_student_progress_summary IS 'Returns comprehensive progress summary for a student (FERPA compliant)';

-- ============================================================================
-- FUNCTION: Get Vocabulary by Grade and Frequency
-- ============================================================================
-- Returns most frequently looked up vocabulary terms by grade level
-- ============================================================================
CREATE OR REPLACE FUNCTION get_vocabulary_by_grade(
  p_grade_level TEXT,
  p_language TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  term_id UUID,
  term TEXT,
  term_language TEXT,
  definition TEXT,
  difficulty_level TEXT,
  lookup_count INTEGER,
  is_regionalism BOOLEAN
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    vt.id,
    vt.term,
    vt.term_language,
    COALESCE(
      CASE WHEN vt.term_language = 'spanish' THEN vt.definition_spanish ELSE vt.definition_english END,
      vt.definition_spanish,
      vt.definition_english
    ) AS definition,
    vt.difficulty_level,
    vt.student_lookup_count::INTEGER,
    vt.is_regionalism
  FROM vocabulary_terms vt
  WHERE p_grade_level = ANY(vt.grade_level)
    AND (p_language IS NULL OR vt.term_language = p_language)
  ORDER BY vt.student_lookup_count DESC, vt.term
  LIMIT p_limit;
$$;

COMMENT ON FUNCTION get_vocabulary_by_grade IS 'Returns vocabulary terms filtered by grade level and sorted by lookup frequency';

-- ============================================================================
-- FUNCTION: Detect Puerto Rican Spanish Dialect
-- ============================================================================
-- Analyzes text for Puerto Rican Spanish specific features
-- ============================================================================
CREATE OR REPLACE FUNCTION detect_puerto_rican_dialect(
  p_text TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  pr_indicators TEXT[] := ARRAY[
    'guagua',      -- bus
    'zafacón',     -- trash can
    'mahones',     -- jeans
    'enfogonao',   -- excited/enthused
    'janguear',    -- hang out
    'chavos',      -- money
    'corillo',     -- group of friends
    'bregar',      -- deal with
    'boricua',     -- Puerto Rican
    'chévere',     -- cool/great
    'wepa',        -- exclamation
    'ay bendito'   -- oh dear
  ];
  indicator TEXT;
  match_count INTEGER := 0;
BEGIN
  -- Check for Puerto Rican specific vocabulary
  FOREACH indicator IN ARRAY pr_indicators
  LOOP
    IF p_text ~* ('\m' || indicator || '\M') THEN
      match_count := match_count + 1;
    END IF;
  END LOOP;

  -- If we find 2 or more indicators, it's likely Puerto Rican Spanish
  RETURN match_count >= 2;
END;
$$;

COMMENT ON FUNCTION detect_puerto_rican_dialect IS 'Detects Puerto Rican Spanish dialect based on vocabulary indicators';

-- ============================================================================
-- FUNCTION: Update Document Quality Score
-- ============================================================================
-- Calculates overall quality score based on extraction confidence and content
-- ============================================================================
CREATE OR REPLACE FUNCTION update_document_quality_score(
  p_document_id UUID
)
RETURNS DECIMAL(3,2)
LANGUAGE plpgsql
AS $$
DECLARE
  v_quality_score DECIMAL(3,2);
  v_text_confidence DECIMAL(3,2);
  v_lang_confidence DECIMAL(3,2);
  v_has_images BOOLEAN;
  v_has_correlations BOOLEAN;
BEGIN
  -- Get base confidence scores
  SELECT
    COALESCE(text_extraction_confidence, 0),
    COALESCE(language_detection_confidence, 0),
    image_count > 0,
    EXISTS (
      SELECT 1 FROM text_image_correlations tic
      INNER JOIN pdf_text_content tc ON tc.id = tic.text_content_id
      WHERE tc.pdf_document_id = p_document_id
    )
  INTO
    v_text_confidence,
    v_lang_confidence,
    v_has_images,
    v_has_correlations
  FROM pdf_documents
  WHERE id = p_document_id;

  -- Calculate quality score
  v_quality_score := (
    (v_text_confidence * 0.4) +  -- 40% weight on text extraction
    (v_lang_confidence * 0.3) +   -- 30% weight on language detection
    (CASE WHEN v_has_images THEN 0.15 ELSE 0.0 END) +  -- 15% bonus for images
    (CASE WHEN v_has_correlations THEN 0.15 ELSE 0.0 END)  -- 15% bonus for correlations
  );

  -- Update the document
  UPDATE pdf_documents
  SET quality_score = v_quality_score,
      updated_at = NOW()
  WHERE id = p_document_id;

  RETURN v_quality_score;
END;
$$;

COMMENT ON FUNCTION update_document_quality_score IS 'Calculates and updates overall quality score for a document';
