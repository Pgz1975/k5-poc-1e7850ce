-- ============================================================================
-- BILINGUAL TEXT SEARCH FUNCTIONS
-- Advanced search for Spanish and English content
-- ============================================================================
-- Version: 1.0.0
-- Purpose: Provide powerful bilingual search capabilities with fuzzy matching,
--          accent-insensitive search, and language-aware ranking
-- ============================================================================

-- ============================================================================
-- BILINGUAL FULL-TEXT SEARCH
-- Search across both English and Spanish content
-- ============================================================================

CREATE OR REPLACE FUNCTION search_bilingual_text(
    search_query TEXT,
    target_language language_type DEFAULT NULL,
    grade_filter grade_level DEFAULT NULL,
    subject_filter subject_type DEFAULT NULL,
    limit_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    content_id UUID,
    document_id UUID,
    page_number INTEGER,
    text_content TEXT,
    detected_language language_type,
    relevance_score REAL,
    highlighted_text TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH search_results AS (
        SELECT
            tc.id,
            tc.document_id,
            tc.page_number,
            tc.text_content,
            tc.detected_language,
            CASE
                -- If target language specified, boost matching language
                WHEN target_language IS NOT NULL AND tc.detected_language = target_language THEN
                    CASE tc.detected_language
                        WHEN 'en' THEN ts_rank(to_tsvector('english', tc.text_content), plainto_tsquery('english', search_query)) * 1.5
                        WHEN 'es' THEN ts_rank(to_tsvector('spanish', tc.text_content), plainto_tsquery('spanish', search_query)) * 1.5
                        ELSE ts_rank(to_tsvector('simple', tc.text_content), plainto_tsquery('simple', search_query))
                    END
                -- Otherwise, use appropriate language dictionary
                ELSE
                    CASE tc.detected_language
                        WHEN 'en' THEN ts_rank(to_tsvector('english', tc.text_content), plainto_tsquery('english', search_query))
                        WHEN 'es' THEN ts_rank(to_tsvector('spanish', tc.text_content), plainto_tsquery('spanish', search_query))
                        ELSE ts_rank(to_tsvector('simple', tc.text_content), plainto_tsquery('simple', search_query))
                    END
            END AS rank_score,
            ts_headline(
                CASE tc.detected_language
                    WHEN 'en' THEN 'english'
                    WHEN 'es' THEN 'spanish'
                    ELSE 'simple'
                END::regconfig,
                tc.text_content,
                plainto_tsquery(
                    CASE tc.detected_language
                        WHEN 'en' THEN 'english'
                        WHEN 'es' THEN 'spanish'
                        ELSE 'simple'
                    END::regconfig,
                    search_query
                ),
                'MaxWords=50, MinWords=20, ShortWord=3, HighlightAll=FALSE, MaxFragments=3'
            ) AS highlighted
        FROM pdf_text_content tc
        INNER JOIN pdf_documents pd ON tc.document_id = pd.id
        WHERE
            pd.deleted_at IS NULL
            AND (
                -- English search
                (tc.detected_language = 'en' AND to_tsvector('english', tc.text_content) @@ plainto_tsquery('english', search_query))
                OR
                -- Spanish search
                (tc.detected_language = 'es' AND to_tsvector('spanish', tc.text_content) @@ plainto_tsquery('spanish', search_query))
                OR
                -- Bilingual/other
                to_tsvector('simple', tc.text_content) @@ plainto_tsquery('simple', search_query)
            )
            -- Optional filters
            AND (target_language IS NULL OR tc.detected_language = target_language)
            AND (grade_filter IS NULL OR grade_filter = ANY(pd.grade_levels))
            AND (subject_filter IS NULL OR pd.subject = subject_filter)
    )
    SELECT
        sr.id,
        sr.document_id,
        sr.page_number,
        sr.text_content,
        sr.detected_language,
        sr.rank_score,
        sr.highlighted
    FROM search_results sr
    ORDER BY sr.rank_score DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- FUZZY SEARCH WITH TRIGRAMS
-- Find similar text even with typos or partial matches
-- ============================================================================

CREATE OR REPLACE FUNCTION search_fuzzy_text(
    search_query TEXT,
    similarity_threshold REAL DEFAULT 0.3,
    target_language language_type DEFAULT NULL,
    limit_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    content_id UUID,
    document_id UUID,
    page_number INTEGER,
    text_content TEXT,
    similarity_score REAL,
    detected_language language_type
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        tc.id,
        tc.document_id,
        tc.page_number,
        tc.text_content,
        similarity(tc.text_content, search_query) AS sim_score,
        tc.detected_language
    FROM pdf_text_content tc
    INNER JOIN pdf_documents pd ON tc.document_id = pd.id
    WHERE
        pd.deleted_at IS NULL
        AND similarity(tc.text_content, search_query) > similarity_threshold
        AND (target_language IS NULL OR tc.detected_language = target_language)
    ORDER BY sim_score DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- SEARCH QUESTIONS
-- Search assessment questions with grade and subject filtering
-- ============================================================================

CREATE OR REPLACE FUNCTION search_questions(
    search_query TEXT,
    grade_filter grade_level DEFAULT NULL,
    subject_filter subject_type DEFAULT NULL,
    question_type_filter question_type DEFAULT NULL,
    language_filter language_type DEFAULT NULL,
    limit_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    question_id UUID,
    document_id UUID,
    question_text TEXT,
    question_type question_type,
    grade_level grade_level,
    subject subject_type,
    language language_type,
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        aq.id,
        aq.document_id,
        aq.question_text,
        aq.question_type,
        aq.grade_level,
        aq.subject,
        aq.language,
        ts_rank(
            to_tsvector('english', aq.question_text || ' ' || coalesce(aq.topic, '') || ' ' || coalesce(aq.skill_tested, '')),
            plainto_tsquery('english', search_query)
        ) AS rank_score
    FROM assessment_questions aq
    INNER JOIN pdf_documents pd ON aq.document_id = pd.id
    WHERE
        pd.deleted_at IS NULL
        AND to_tsvector('english', aq.question_text || ' ' || coalesce(aq.topic, '') || ' ' || coalesce(aq.skill_tested, ''))
            @@ plainto_tsquery('english', search_query)
        AND (grade_filter IS NULL OR aq.grade_level = grade_filter)
        AND (subject_filter IS NULL OR aq.subject = subject_filter)
        AND (question_type_filter IS NULL OR aq.question_type = question_type_filter)
        AND (language_filter IS NULL OR aq.language = language_filter)
    ORDER BY rank_score DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- SEARCH READING MATERIALS
-- Search with reading level and genre filtering
-- ============================================================================

CREATE OR REPLACE FUNCTION search_reading_materials(
    search_query TEXT,
    grade_filter grade_level DEFAULT NULL,
    max_reading_level DECIMAL DEFAULT NULL,
    genre_filter VARCHAR DEFAULT NULL,
    language_filter language_type DEFAULT NULL,
    limit_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    material_id UUID,
    document_id UUID,
    title VARCHAR,
    genre VARCHAR,
    grade_level grade_level,
    reading_level DECIMAL,
    language language_type,
    relevance_score REAL,
    highlighted_excerpt TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        rm.id,
        rm.document_id,
        rm.title,
        rm.genre,
        rm.grade_level,
        rm.flesch_kincaid_grade,
        rm.primary_language,
        ts_rank(
            to_tsvector('english', rm.title || ' ' || rm.full_text || ' ' || coalesce(rm.theme, '')),
            plainto_tsquery('english', search_query)
        ) AS rank_score,
        ts_headline(
            'english',
            rm.full_text,
            plainto_tsquery('english', search_query),
            'MaxWords=100, MinWords=50, ShortWord=3, MaxFragments=2'
        ) AS excerpt
    FROM reading_materials rm
    INNER JOIN pdf_documents pd ON rm.document_id = pd.id
    WHERE
        pd.deleted_at IS NULL
        AND to_tsvector('english', rm.title || ' ' || rm.full_text || ' ' || coalesce(rm.theme, ''))
            @@ plainto_tsquery('english', search_query)
        AND (grade_filter IS NULL OR rm.grade_level = grade_filter)
        AND (max_reading_level IS NULL OR rm.flesch_kincaid_grade <= max_reading_level)
        AND (genre_filter IS NULL OR rm.genre = genre_filter)
        AND (language_filter IS NULL OR rm.primary_language = language_filter)
    ORDER BY rank_score DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- ACCENT-INSENSITIVE SEARCH
-- Search Spanish text without accent marks
-- ============================================================================

CREATE OR REPLACE FUNCTION search_unaccented(
    search_query TEXT,
    grade_filter grade_level DEFAULT NULL,
    limit_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    content_id UUID,
    document_id UUID,
    text_content TEXT,
    page_number INTEGER,
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        tc.id,
        tc.document_id,
        tc.text_content,
        tc.page_number,
        ts_rank(
            to_tsvector('spanish', unaccent(tc.text_content)),
            plainto_tsquery('spanish', unaccent(search_query))
        ) AS rank_score
    FROM pdf_text_content tc
    INNER JOIN pdf_documents pd ON tc.document_id = pd.id
    WHERE
        pd.deleted_at IS NULL
        AND to_tsvector('spanish', unaccent(tc.text_content))
            @@ plainto_tsquery('spanish', unaccent(search_query))
        AND (grade_filter IS NULL OR grade_filter = ANY(pd.grade_levels))
    ORDER BY rank_score DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- SEMANTIC SEARCH BY TOPIC
-- Find content related to educational topics
-- ============================================================================

CREATE OR REPLACE FUNCTION search_by_topic(
    topic_keywords TEXT[],
    grade_filter grade_level DEFAULT NULL,
    subject_filter subject_type DEFAULT NULL,
    limit_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    document_id UUID,
    filename VARCHAR,
    subject subject_type,
    grade_levels grade_level[],
    keyword_matches INTEGER,
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pd.id,
        pd.filename,
        pd.subject,
        pd.grade_levels,
        (
            SELECT COUNT(*)
            FROM unnest(topic_keywords) AS keyword
            WHERE keyword = ANY(pd.keywords) OR keyword = ANY(pd.tags)
        )::INTEGER AS matches,
        (
            SELECT COUNT(*)::REAL / GREATEST(array_length(topic_keywords, 1), 1)
        ) AS score
    FROM pdf_documents pd
    WHERE
        pd.deleted_at IS NULL
        AND (
            pd.keywords && topic_keywords
            OR pd.tags && topic_keywords
        )
        AND (grade_filter IS NULL OR grade_filter = ANY(pd.grade_levels))
        AND (subject_filter IS NULL OR pd.subject = subject_filter)
    ORDER BY matches DESC, score DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- COMBINED SEARCH
-- Search across documents, text, questions, and reading materials
-- ============================================================================

CREATE OR REPLACE FUNCTION search_all_content(
    search_query TEXT,
    grade_filter grade_level DEFAULT NULL,
    subject_filter subject_type DEFAULT NULL,
    content_types TEXT[] DEFAULT ARRAY['documents', 'text', 'questions', 'reading'],
    limit_results INTEGER DEFAULT 100
)
RETURNS TABLE (
    result_type VARCHAR,
    result_id UUID,
    document_id UUID,
    title TEXT,
    preview TEXT,
    relevance_score REAL,
    grade_level grade_level,
    subject subject_type,
    language language_type
) AS $$
BEGIN
    RETURN QUERY
    -- Search documents
    SELECT
        'document'::VARCHAR,
        pd.id,
        pd.id,
        pd.filename,
        SUBSTRING(pd.metadata::TEXT, 1, 200),
        ts_rank(
            to_tsvector('english', pd.filename || ' ' || coalesce(pd.metadata::TEXT, '')),
            plainto_tsquery('english', search_query)
        ),
        pd.grade_levels[1],
        pd.subject,
        pd.primary_language
    FROM pdf_documents pd
    WHERE
        'documents' = ANY(content_types)
        AND pd.deleted_at IS NULL
        AND to_tsvector('english', pd.filename || ' ' || coalesce(pd.metadata::TEXT, ''))
            @@ plainto_tsquery('english', search_query)
        AND (grade_filter IS NULL OR grade_filter = ANY(pd.grade_levels))
        AND (subject_filter IS NULL OR pd.subject = subject_filter)

    UNION ALL

    -- Search text content
    SELECT
        'text'::VARCHAR,
        tc.id,
        tc.document_id,
        'Page ' || tc.page_number::TEXT,
        SUBSTRING(tc.text_content, 1, 200),
        ts_rank(
            to_tsvector('english', tc.text_content),
            plainto_tsquery('english', search_query)
        ),
        pd.grade_levels[1],
        pd.subject,
        tc.detected_language
    FROM pdf_text_content tc
    INNER JOIN pdf_documents pd ON tc.document_id = pd.id
    WHERE
        'text' = ANY(content_types)
        AND pd.deleted_at IS NULL
        AND to_tsvector('english', tc.text_content) @@ plainto_tsquery('english', search_query)
        AND (grade_filter IS NULL OR grade_filter = ANY(pd.grade_levels))
        AND (subject_filter IS NULL OR pd.subject = subject_filter)

    UNION ALL

    -- Search questions
    SELECT
        'question'::VARCHAR,
        aq.id,
        aq.document_id,
        'Question: ' || SUBSTRING(aq.question_text, 1, 50),
        SUBSTRING(aq.question_text, 1, 200),
        ts_rank(
            to_tsvector('english', aq.question_text),
            plainto_tsquery('english', search_query)
        ),
        aq.grade_level,
        aq.subject,
        aq.language
    FROM assessment_questions aq
    INNER JOIN pdf_documents pd ON aq.document_id = pd.id
    WHERE
        'questions' = ANY(content_types)
        AND pd.deleted_at IS NULL
        AND to_tsvector('english', aq.question_text) @@ plainto_tsquery('english', search_query)
        AND (grade_filter IS NULL OR aq.grade_level = grade_filter)
        AND (subject_filter IS NULL OR aq.subject = subject_filter)

    UNION ALL

    -- Search reading materials
    SELECT
        'reading'::VARCHAR,
        rm.id,
        rm.document_id,
        rm.title,
        SUBSTRING(rm.full_text, 1, 200),
        ts_rank(
            to_tsvector('english', rm.title || ' ' || rm.full_text),
            plainto_tsquery('english', search_query)
        ),
        rm.grade_level,
        rm.subject,
        rm.primary_language
    FROM reading_materials rm
    INNER JOIN pdf_documents pd ON rm.document_id = pd.id
    WHERE
        'reading' = ANY(content_types)
        AND pd.deleted_at IS NULL
        AND to_tsvector('english', rm.title || ' ' || rm.full_text) @@ plainto_tsquery('english', search_query)
        AND (grade_filter IS NULL OR rm.grade_level = grade_filter)
        AND (subject_filter IS NULL OR rm.subject = subject_filter)

    ORDER BY relevance_score DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- AUTOCOMPLETE SEARCH
-- Provide search suggestions based on partial input
-- ============================================================================

CREATE OR REPLACE FUNCTION autocomplete_search(
    partial_query TEXT,
    limit_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    suggestion TEXT,
    suggestion_type VARCHAR,
    frequency INTEGER
) AS $$
BEGIN
    RETURN QUERY
    -- Keywords from documents
    SELECT
        keyword,
        'keyword'::VARCHAR,
        COUNT(*)::INTEGER AS freq
    FROM pdf_documents,
         unnest(keywords) AS keyword
    WHERE
        deleted_at IS NULL
        AND keyword ILIKE partial_query || '%'
    GROUP BY keyword

    UNION ALL

    -- Tags from documents
    SELECT
        tag,
        'tag'::VARCHAR,
        COUNT(*)::INTEGER
    FROM pdf_documents,
         unnest(tags) AS tag
    WHERE
        deleted_at IS NULL
        AND tag ILIKE partial_query || '%'
    GROUP BY tag

    UNION ALL

    -- Topics from questions
    SELECT DISTINCT
        topic,
        'topic'::VARCHAR,
        COUNT(*)::INTEGER
    FROM assessment_questions
    WHERE
        topic IS NOT NULL
        AND topic ILIKE partial_query || '%'
    GROUP BY topic

    ORDER BY frequency DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION search_bilingual_text IS 'Full-text search across English and Spanish content with language-aware ranking';
COMMENT ON FUNCTION search_fuzzy_text IS 'Fuzzy text search using trigrams for typo-tolerant matching';
COMMENT ON FUNCTION search_questions IS 'Search assessment questions with filters for grade, subject, and type';
COMMENT ON FUNCTION search_reading_materials IS 'Search reading materials with reading level and genre filtering';
COMMENT ON FUNCTION search_unaccented IS 'Accent-insensitive search for Spanish content';
COMMENT ON FUNCTION search_by_topic IS 'Semantic search by educational topics and keywords';
COMMENT ON FUNCTION search_all_content IS 'Combined search across all content types';
COMMENT ON FUNCTION autocomplete_search IS 'Autocomplete suggestions for search queries';

-- ============================================================================
-- END OF SEARCH FUNCTIONS
-- ============================================================================
