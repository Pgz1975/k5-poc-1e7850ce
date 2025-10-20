-- ============================================================================
-- TEXT-IMAGE CORRELATION ALGORITHMS
-- Intelligent linking between text blocks and images
-- ============================================================================
-- Version: 1.0.0
-- Purpose: Implement smart algorithms for correlating text and images based on
--          spatial proximity, semantic relationships, and reference patterns
-- ============================================================================

-- ============================================================================
-- SPATIAL PROXIMITY CORRELATION
-- Find images near text blocks based on position
-- ============================================================================

CREATE OR REPLACE FUNCTION correlate_by_proximity(
    p_document_id UUID,
    proximity_threshold DECIMAL DEFAULT 100.0, -- pixels
    min_confidence DECIMAL DEFAULT 0.5
)
RETURNS TABLE (
    correlation_id UUID,
    text_id UUID,
    image_id UUID,
    distance DECIMAL,
    confidence DECIMAL,
    position VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO text_image_correlations (
        document_id,
        text_content_id,
        image_id,
        correlation_type,
        confidence_score,
        distance_pixels,
        relative_position,
        same_page
    )
    SELECT
        p_document_id,
        tc.id,
        img.id,
        'proximity'::VARCHAR,
        -- Confidence decreases with distance
        GREATEST(0, 1 - (calc_distance / proximity_threshold))::DECIMAL(3,2),
        calc_distance,
        calc_position,
        tc.page_number = img.page_number
    FROM pdf_text_content tc
    CROSS JOIN LATERAL (
        SELECT
            img.id,
            img.bbox_x1,
            img.bbox_y1,
            img.bbox_x2,
            img.bbox_y2,
            img.page_number,
            -- Calculate Euclidean distance between text and image centers
            SQRT(
                POW((tc.bbox_x1 + tc.bbox_x2) / 2 - (img.bbox_x1 + img.bbox_x2) / 2, 2) +
                POW((tc.bbox_y1 + tc.bbox_y2) / 2 - (img.bbox_y1 + img.bbox_y2) / 2, 2)
            ) AS calc_distance,
            -- Determine relative position
            CASE
                WHEN (tc.bbox_y2 < img.bbox_y1) THEN 'above'
                WHEN (tc.bbox_y1 > img.bbox_y2) THEN 'below'
                WHEN (tc.bbox_x2 < img.bbox_x1) THEN 'left'
                WHEN (tc.bbox_x1 > img.bbox_x2) THEN 'right'
                ELSE 'overlapping'
            END AS calc_position
        FROM pdf_images img
        WHERE
            img.document_id = p_document_id
            AND img.is_educational_content = true
            -- Only correlate images on same or adjacent pages
            AND ABS(img.page_number - tc.page_number) <= 1
    ) AS img
    WHERE
        tc.document_id = p_document_id
        AND calc_distance <= proximity_threshold
        AND GREATEST(0, 1 - (calc_distance / proximity_threshold)) >= min_confidence
    ON CONFLICT (text_content_id, image_id) DO UPDATE
    SET
        confidence_score = GREATEST(text_image_correlations.confidence_score, EXCLUDED.confidence_score),
        updated_at = NOW()
    RETURNING
        id,
        text_content_id,
        image_id,
        distance_pixels,
        confidence_score,
        relative_position;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- REFERENCE PATTERN DETECTION
-- Detect text that references images (e.g., "see Figure 1")
-- ============================================================================

CREATE OR REPLACE FUNCTION correlate_by_reference(
    p_document_id UUID
)
RETURNS TABLE (
    correlation_id UUID,
    text_id UUID,
    image_id UUID,
    reference_found TEXT
) AS $$
DECLARE
    reference_patterns TEXT[] := ARRAY[
        'see (figure|diagram|image|picture|photo|illustration|chart|graph|table)\s*(\d+)',
        'shown in (figure|diagram|image|picture|photo|illustration|chart|graph|table)\s*(\d+)',
        'refer to (figure|diagram|image|picture|photo|illustration|chart|graph|table)\s*(\d+)',
        '(figure|diagram|image|picture|photo|illustration|chart|graph|table)\s*(\d+)\s*(shows|displays|illustrates|depicts)',
        'below|above|siguiente|arriba|abajo',
        'ver (figura|diagrama|imagen|foto|ilustración|gráfico|tabla)\s*(\d+)',
        'como se muestra en (la )?(figura|diagrama|imagen|foto|ilustración|gráfico|tabla)\s*(\d+)'
    ];
    pattern TEXT;
BEGIN
    -- Loop through reference patterns
    FOREACH pattern IN ARRAY reference_patterns
    LOOP
        RETURN QUERY
        INSERT INTO text_image_correlations (
            document_id,
            text_content_id,
            image_id,
            correlation_type,
            confidence_score,
            is_reference,
            reference_text,
            reference_pattern,
            same_page
        )
        SELECT
            p_document_id,
            tc.id,
            img.id,
            'reference'::VARCHAR,
            0.9::DECIMAL(3,2), -- High confidence for explicit references
            true,
            matched_ref.ref_text,
            pattern,
            tc.page_number = img.page_number
        FROM pdf_text_content tc
        CROSS JOIN LATERAL (
            SELECT
                (regexp_matches(tc.text_content, pattern, 'i'))[0] AS ref_text
            WHERE tc.text_content ~* pattern
        ) AS matched_ref
        CROSS JOIN LATERAL (
            SELECT img.*
            FROM pdf_images img
            WHERE
                img.document_id = p_document_id
                -- Match images on same or adjacent pages
                AND ABS(img.page_number - tc.page_number) <= 2
            ORDER BY
                ABS(img.page_number - tc.page_number),
                img.image_sequence
            LIMIT 1
        ) AS img
        WHERE tc.document_id = p_document_id
        ON CONFLICT (text_content_id, image_id) DO UPDATE
        SET
            is_reference = true,
            reference_text = EXCLUDED.reference_text,
            reference_pattern = EXCLUDED.reference_pattern,
            confidence_score = GREATEST(text_image_correlations.confidence_score, EXCLUDED.confidence_score),
            updated_at = NOW()
        RETURNING
            id,
            text_content_id,
            image_id,
            reference_text;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- CAPTION DETECTION
-- Identify text blocks that serve as image captions
-- ============================================================================

CREATE OR REPLACE FUNCTION correlate_captions(
    p_document_id UUID,
    max_distance DECIMAL DEFAULT 50.0,
    caption_max_words INTEGER DEFAULT 30
)
RETURNS TABLE (
    correlation_id UUID,
    text_id UUID,
    image_id UUID,
    caption_text TEXT
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO text_image_correlations (
        document_id,
        text_content_id,
        image_id,
        correlation_type,
        confidence_score,
        is_caption,
        distance_pixels,
        relative_position,
        same_page
    )
    SELECT
        p_document_id,
        tc.id,
        img.id,
        'caption'::VARCHAR,
        -- High confidence for short text very close to images
        CASE
            WHEN calc_distance < 20 THEN 0.95
            WHEN calc_distance < 30 THEN 0.85
            WHEN calc_distance < 50 THEN 0.75
            ELSE 0.6
        END::DECIMAL(3,2),
        true,
        calc_distance,
        calc_position,
        tc.page_number = img.page_number
    FROM pdf_text_content tc
    CROSS JOIN LATERAL (
        SELECT
            img.id,
            img.bbox_x1,
            img.bbox_y1,
            img.bbox_x2,
            img.bbox_y2,
            img.page_number,
            SQRT(
                POW((tc.bbox_x1 + tc.bbox_x2) / 2 - (img.bbox_x1 + img.bbox_x2) / 2, 2) +
                POW((tc.bbox_y1 + tc.bbox_y2) / 2 - (img.bbox_y1 + img.bbox_y2) / 2, 2)
            ) AS calc_distance,
            CASE
                WHEN (tc.bbox_y2 < img.bbox_y1) THEN 'above'
                WHEN (tc.bbox_y1 > img.bbox_y2) THEN 'below'
                WHEN (tc.bbox_x2 < img.bbox_x1) THEN 'left'
                WHEN (tc.bbox_x1 > img.bbox_x2) THEN 'right'
                ELSE 'overlapping'
            END AS calc_position
        FROM pdf_images img
        WHERE
            img.document_id = p_document_id
            AND img.page_number = tc.page_number
            AND img.is_educational_content = true
    ) AS img
    WHERE
        tc.document_id = p_document_id
        -- Caption characteristics: short text, close to image
        AND tc.word_count <= caption_max_words
        AND calc_distance <= max_distance
        -- Captions typically above or below images
        AND calc_position IN ('above', 'below')
    ON CONFLICT (text_content_id, image_id) DO UPDATE
    SET
        is_caption = true,
        confidence_score = GREATEST(text_image_correlations.confidence_score, EXCLUDED.confidence_score),
        updated_at = NOW()
    RETURNING
        id,
        text_content_id,
        image_id,
        (SELECT text_content FROM pdf_text_content WHERE id = text_content_id);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- DIAGRAM LABEL DETECTION
-- Identify text that labels parts of diagrams
-- ============================================================================

CREATE OR REPLACE FUNCTION correlate_diagram_labels(
    p_document_id UUID
)
RETURNS TABLE (
    correlation_id UUID,
    text_id UUID,
    image_id UUID
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO text_image_correlations (
        document_id,
        text_content_id,
        image_id,
        correlation_type,
        confidence_score,
        is_label,
        relative_position,
        same_page
    )
    SELECT
        p_document_id,
        tc.id,
        img.id,
        'diagram_label'::VARCHAR,
        0.8::DECIMAL(3,2),
        true,
        'overlapping',
        true
    FROM pdf_text_content tc
    INNER JOIN pdf_images img ON
        img.document_id = p_document_id
        AND img.page_number = tc.page_number
        AND img.image_type IN ('diagram', 'chart')
    WHERE
        tc.document_id = p_document_id
        -- Label characteristics: very short text
        AND tc.word_count <= 5
        AND tc.text_length <= 50
        -- Text overlaps or is inside image boundaries
        AND tc.bbox_x1 >= img.bbox_x1
        AND tc.bbox_x2 <= img.bbox_x2
        AND tc.bbox_y1 >= img.bbox_y1
        AND tc.bbox_y2 <= img.bbox_y2
    ON CONFLICT (text_content_id, image_id) DO UPDATE
    SET
        is_label = true,
        confidence_score = GREATEST(text_image_correlations.confidence_score, EXCLUDED.confidence_score),
        updated_at = NOW()
    RETURNING
        id,
        text_content_id,
        image_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SEMANTIC SIMILARITY (Using OCR text from images)
-- Correlate based on text content similarity
-- ============================================================================

CREATE OR REPLACE FUNCTION correlate_by_semantic_similarity(
    p_document_id UUID,
    similarity_threshold DECIMAL DEFAULT 0.3
)
RETURNS TABLE (
    correlation_id UUID,
    text_id UUID,
    image_id UUID,
    similarity DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO text_image_correlations (
        document_id,
        text_content_id,
        image_id,
        correlation_type,
        confidence_score,
        visual_text_match_score,
        same_page
    )
    SELECT
        p_document_id,
        tc.id,
        img.id,
        'semantic'::VARCHAR,
        LEAST(0.7, sim_score)::DECIMAL(3,2), -- Cap at 0.7 for semantic matches
        sim_score::DECIMAL(3,2),
        tc.page_number = img.page_number
    FROM pdf_text_content tc
    CROSS JOIN LATERAL (
        SELECT
            img.id,
            img.page_number,
            -- Calculate text similarity between text block and image OCR text
            similarity(tc.text_content, img.extracted_text) AS sim_score
        FROM pdf_images img
        WHERE
            img.document_id = p_document_id
            AND img.extracted_text IS NOT NULL
            AND img.extracted_text != ''
            -- Prioritize same or adjacent pages
            AND ABS(img.page_number - tc.page_number) <= 1
    ) AS img
    WHERE
        tc.document_id = p_document_id
        AND img.sim_score >= similarity_threshold
    ON CONFLICT (text_content_id, image_id) DO UPDATE
    SET
        visual_text_match_score = EXCLUDED.visual_text_match_score,
        confidence_score = GREATEST(text_image_correlations.confidence_score, EXCLUDED.confidence_score),
        updated_at = NOW()
    RETURNING
        id,
        text_content_id,
        image_id,
        visual_text_match_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MASTER CORRELATION FUNCTION
-- Run all correlation algorithms for a document
-- ============================================================================

CREATE OR REPLACE FUNCTION correlate_document_content(
    p_document_id UUID,
    run_proximity BOOLEAN DEFAULT true,
    run_reference BOOLEAN DEFAULT true,
    run_caption BOOLEAN DEFAULT true,
    run_label BOOLEAN DEFAULT true,
    run_semantic BOOLEAN DEFAULT true
)
RETURNS TABLE (
    total_correlations INTEGER,
    proximity_count INTEGER,
    reference_count INTEGER,
    caption_count INTEGER,
    label_count INTEGER,
    semantic_count INTEGER,
    avg_confidence DECIMAL
) AS $$
DECLARE
    prox_count INTEGER := 0;
    ref_count INTEGER := 0;
    cap_count INTEGER := 0;
    lab_count INTEGER := 0;
    sem_count INTEGER := 0;
BEGIN
    -- Run proximity correlation
    IF run_proximity THEN
        SELECT COUNT(*) INTO prox_count
        FROM correlate_by_proximity(p_document_id);
    END IF;

    -- Run reference detection
    IF run_reference THEN
        SELECT COUNT(*) INTO ref_count
        FROM correlate_by_reference(p_document_id);
    END IF;

    -- Run caption detection
    IF run_caption THEN
        SELECT COUNT(*) INTO cap_count
        FROM correlate_captions(p_document_id);
    END IF;

    -- Run label detection
    IF run_label THEN
        SELECT COUNT(*) INTO lab_count
        FROM correlate_diagram_labels(p_document_id);
    END IF;

    -- Run semantic similarity
    IF run_semantic THEN
        SELECT COUNT(*) INTO sem_count
        FROM correlate_by_semantic_similarity(p_document_id);
    END IF;

    -- Update text and image records with correlation flags
    UPDATE pdf_text_content
    SET
        has_nearby_images = true,
        correlated_image_ids = (
            SELECT ARRAY_AGG(DISTINCT image_id)
            FROM text_image_correlations
            WHERE text_content_id = pdf_text_content.id
        )
    WHERE document_id = p_document_id
    AND EXISTS (
        SELECT 1 FROM text_image_correlations
        WHERE text_content_id = pdf_text_content.id
    );

    UPDATE pdf_images
    SET
        has_nearby_text = true,
        correlated_text_ids = (
            SELECT ARRAY_AGG(DISTINCT text_content_id)
            FROM text_image_correlations
            WHERE image_id = pdf_images.id
        )
    WHERE document_id = p_document_id
    AND EXISTS (
        SELECT 1 FROM text_image_correlations
        WHERE image_id = pdf_images.id
    );

    -- Return summary
    RETURN QUERY
    SELECT
        (prox_count + ref_count + cap_count + lab_count + sem_count)::INTEGER,
        prox_count,
        ref_count,
        cap_count,
        lab_count,
        sem_count,
        (
            SELECT AVG(confidence_score)::DECIMAL(3,2)
            FROM text_image_correlations
            WHERE document_id = p_document_id
        );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- GET CORRELATED CONTENT
-- Retrieve text and images that are correlated
-- ============================================================================

CREATE OR REPLACE FUNCTION get_correlated_content(
    p_text_content_id UUID DEFAULT NULL,
    p_image_id UUID DEFAULT NULL,
    min_confidence DECIMAL DEFAULT 0.5
)
RETURNS TABLE (
    correlation_id UUID,
    text_id UUID,
    text_content TEXT,
    text_page INTEGER,
    image_id UUID,
    image_path TEXT,
    image_page INTEGER,
    correlation_type VARCHAR,
    confidence DECIMAL,
    is_caption BOOLEAN,
    is_label BOOLEAN,
    is_reference BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        tic.id,
        tic.text_content_id,
        tc.text_content,
        tc.page_number,
        tic.image_id,
        img.optimized_storage_path,
        img.page_number,
        tic.correlation_type,
        tic.confidence_score,
        tic.is_caption,
        tic.is_label,
        tic.is_reference
    FROM text_image_correlations tic
    INNER JOIN pdf_text_content tc ON tic.text_content_id = tc.id
    INNER JOIN pdf_images img ON tic.image_id = img.id
    WHERE
        (p_text_content_id IS NULL OR tic.text_content_id = p_text_content_id)
        AND (p_image_id IS NULL OR tic.image_id = p_image_id)
        AND tic.confidence_score >= min_confidence
    ORDER BY tic.confidence_score DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- RECALCULATE CORRELATION CONFIDENCE
-- Update confidence scores based on multiple factors
-- ============================================================================

CREATE OR REPLACE FUNCTION recalculate_correlation_confidence(
    p_correlation_id UUID
)
RETURNS DECIMAL AS $$
DECLARE
    new_confidence DECIMAL;
BEGIN
    SELECT
        LEAST(1.0,
            -- Base confidence
            COALESCE(confidence_score, 0.5) +
            -- Boost for explicit references
            CASE WHEN is_reference THEN 0.3 ELSE 0 END +
            -- Boost for captions
            CASE WHEN is_caption THEN 0.2 ELSE 0 END +
            -- Boost for labels
            CASE WHEN is_label THEN 0.15 ELSE 0 END +
            -- Boost for semantic similarity
            COALESCE(semantic_similarity_score, 0) * 0.2 +
            -- Boost for OCR text match
            COALESCE(visual_text_match_score, 0) * 0.15 +
            -- Penalty for large distance
            CASE
                WHEN distance_pixels > 200 THEN -0.2
                WHEN distance_pixels > 100 THEN -0.1
                ELSE 0
            END +
            -- Boost for same page
            CASE WHEN same_page THEN 0.1 ELSE 0 END +
            -- Boost for manual verification
            CASE WHEN manually_verified THEN 0.3 ELSE 0 END
        )::DECIMAL(3,2)
    INTO new_confidence
    FROM text_image_correlations
    WHERE id = p_correlation_id;

    -- Update the correlation
    UPDATE text_image_correlations
    SET
        confidence_score = new_confidence,
        updated_at = NOW()
    WHERE id = p_correlation_id;

    RETURN new_confidence;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FIND ORPHANED CONTENT
-- Identify images without text correlations (may need captions)
-- ============================================================================

CREATE OR REPLACE FUNCTION find_orphaned_images(
    p_document_id UUID
)
RETURNS TABLE (
    image_id UUID,
    page_number INTEGER,
    image_type VARCHAR,
    storage_path TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        img.id,
        img.page_number,
        img.image_type,
        img.optimized_storage_path
    FROM pdf_images img
    WHERE
        img.document_id = p_document_id
        AND img.is_educational_content = true
        AND NOT EXISTS (
            SELECT 1 FROM text_image_correlations tic
            WHERE tic.image_id = img.id
            AND tic.confidence_score >= 0.5
        )
    ORDER BY img.page_number, img.image_sequence;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION correlate_by_proximity IS 'Correlate text and images based on spatial proximity using distance calculations';
COMMENT ON FUNCTION correlate_by_reference IS 'Detect explicit references to images in text (e.g., "see Figure 1")';
COMMENT ON FUNCTION correlate_captions IS 'Identify short text blocks near images that serve as captions';
COMMENT ON FUNCTION correlate_diagram_labels IS 'Find text labels that are positioned within diagram boundaries';
COMMENT ON FUNCTION correlate_by_semantic_similarity IS 'Correlate based on text similarity between text blocks and image OCR text';
COMMENT ON FUNCTION correlate_document_content IS 'Master function that runs all correlation algorithms for a document';
COMMENT ON FUNCTION get_correlated_content IS 'Retrieve all correlated content for a text block or image';
COMMENT ON FUNCTION recalculate_correlation_confidence IS 'Recalculate confidence score based on multiple correlation factors';
COMMENT ON FUNCTION find_orphaned_images IS 'Find images without text correlations that may need manual captioning';

-- ============================================================================
-- END OF CORRELATION ALGORITHMS
-- ============================================================================
