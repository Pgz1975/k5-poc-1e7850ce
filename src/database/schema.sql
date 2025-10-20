-- ============================================================================
-- K5 PDF PARSING SYSTEM - SUPABASE DATABASE SCHEMA
-- ============================================================================
-- Version: 1.0.0
-- Purpose: Complete database schema for K5 educational PDF parsing system
--          with FERPA compliance, bilingual support, and intelligent content correlation
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- For accent-insensitive search
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- For encryption

-- ============================================================================
-- CUSTOM TYPES
-- ============================================================================

-- Grade level enumeration (K-5)
CREATE TYPE grade_level AS ENUM ('K', '1', '2', '3', '4', '5');

-- Language enumeration
CREATE TYPE language_type AS ENUM ('en', 'es', 'bilingual');

-- Subject areas
CREATE TYPE subject_type AS ENUM (
    'mathematics',
    'reading',
    'writing',
    'science',
    'social_studies',
    'art',
    'music',
    'physical_education',
    'general'
);

-- PDF processing status
CREATE TYPE processing_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'retrying'
);

-- Image optimization status
CREATE TYPE optimization_status AS ENUM (
    'pending',
    'optimizing',
    'completed',
    'failed'
);

-- Question types
CREATE TYPE question_type AS ENUM (
    'multiple_choice',
    'true_false',
    'short_answer',
    'essay',
    'matching',
    'fill_blank',
    'diagram_labeling'
);

-- Content categorization
CREATE TYPE content_category AS ENUM (
    'worksheet',
    'assessment',
    'reading_material',
    'reference',
    'activity',
    'homework',
    'lesson_plan'
);

-- ============================================================================
-- TABLE 1: PDF_DOCUMENTS
-- Core metadata for uploaded PDF files
-- ============================================================================

CREATE TABLE pdf_documents (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- File metadata
    filename VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL CHECK (file_size_bytes > 0),
    storage_path TEXT NOT NULL UNIQUE, -- Supabase storage path
    checksum VARCHAR(64) NOT NULL, -- SHA-256 hash for deduplication

    -- Content classification
    grade_levels grade_level[] NOT NULL DEFAULT '{}', -- Support multiple grades
    primary_language language_type NOT NULL DEFAULT 'en',
    secondary_language language_type, -- For bilingual materials
    subject subject_type NOT NULL DEFAULT 'general',
    content_category content_category NOT NULL DEFAULT 'worksheet',

    -- PDF properties
    page_count INTEGER NOT NULL CHECK (page_count > 0),
    pdf_version VARCHAR(10),
    is_searchable BOOLEAN DEFAULT false, -- Has extractable text
    has_images BOOLEAN DEFAULT false,
    has_forms BOOLEAN DEFAULT false,

    -- Processing metadata
    processing_status processing_status DEFAULT 'pending',
    processing_started_at TIMESTAMPTZ,
    processing_completed_at TIMESTAMPTZ,
    processing_error TEXT,
    retry_count INTEGER DEFAULT 0,

    -- Quality metrics
    text_extraction_quality_score DECIMAL(3,2) CHECK (text_extraction_quality_score BETWEEN 0 AND 1),
    image_quality_score DECIMAL(3,2) CHECK (image_quality_score BETWEEN 0 AND 1),
    overall_quality_score DECIMAL(3,2) CHECK (overall_quality_score BETWEEN 0 AND 1),

    -- User and organizational metadata
    uploaded_by UUID REFERENCES auth.users(id),
    organization_id UUID, -- For multi-tenant support
    school_id UUID,
    class_id UUID,

    -- Tags and categorization
    tags TEXT[] DEFAULT '{}',
    keywords TEXT[] DEFAULT '{}', -- Auto-extracted keywords

    -- FERPA and privacy
    contains_pii BOOLEAN DEFAULT false,
    ferpa_compliant BOOLEAN DEFAULT true,
    data_classification VARCHAR(20) DEFAULT 'public', -- public, internal, confidential, restricted

    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ, -- Soft delete

    -- Metadata JSON for extensibility
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for pdf_documents
CREATE INDEX idx_pdf_documents_grade_levels ON pdf_documents USING GIN(grade_levels);
CREATE INDEX idx_pdf_documents_language ON pdf_documents(primary_language, secondary_language);
CREATE INDEX idx_pdf_documents_subject ON pdf_documents(subject);
CREATE INDEX idx_pdf_documents_status ON pdf_documents(processing_status);
CREATE INDEX idx_pdf_documents_uploaded_by ON pdf_documents(uploaded_by);
CREATE INDEX idx_pdf_documents_organization ON pdf_documents(organization_id, school_id, class_id);
CREATE INDEX idx_pdf_documents_tags ON pdf_documents USING GIN(tags);
CREATE INDEX idx_pdf_documents_keywords ON pdf_documents USING GIN(keywords);
CREATE INDEX idx_pdf_documents_checksum ON pdf_documents(checksum);
CREATE INDEX idx_pdf_documents_created_at ON pdf_documents(created_at DESC);
CREATE INDEX idx_pdf_documents_deleted_at ON pdf_documents(deleted_at) WHERE deleted_at IS NULL;

-- Full-text search index on filename and metadata
CREATE INDEX idx_pdf_documents_fts ON pdf_documents USING GIN(
    to_tsvector('english', coalesce(filename, '') || ' ' || coalesce(metadata::text, ''))
);

-- ============================================================================
-- TABLE 2: PDF_TEXT_CONTENT
-- Extracted text with precise positioning and language detection
-- ============================================================================

CREATE TABLE pdf_text_content (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES pdf_documents(id) ON DELETE CASCADE,

    -- Page and positioning
    page_number INTEGER NOT NULL CHECK (page_number > 0),
    block_sequence INTEGER NOT NULL, -- Order of text blocks on page

    -- Text content
    text_content TEXT NOT NULL,
    text_length INTEGER GENERATED ALWAYS AS (length(text_content)) STORED,
    word_count INTEGER,

    -- Language detection
    detected_language language_type,
    language_confidence DECIMAL(3,2) CHECK (language_confidence BETWEEN 0 AND 1),
    is_mixed_language BOOLEAN DEFAULT false,

    -- Positioning (bounding box coordinates)
    bbox_x1 DECIMAL(10,4), -- Top-left x
    bbox_y1 DECIMAL(10,4), -- Top-left y
    bbox_x2 DECIMAL(10,4), -- Bottom-right x
    bbox_y2 DECIMAL(10,4), -- Bottom-right y
    bbox_width DECIMAL(10,4) GENERATED ALWAYS AS (bbox_x2 - bbox_x1) STORED,
    bbox_height DECIMAL(10,4) GENERATED ALWAYS AS (bbox_y2 - bbox_y1) STORED,

    -- Text properties
    font_name VARCHAR(100),
    font_size DECIMAL(5,2),
    is_bold BOOLEAN DEFAULT false,
    is_italic BOOLEAN DEFAULT false,
    text_color VARCHAR(20), -- Hex color

    -- Content type classification
    is_heading BOOLEAN DEFAULT false,
    is_question BOOLEAN DEFAULT false,
    is_answer BOOLEAN DEFAULT false,
    is_instruction BOOLEAN DEFAULT false,
    heading_level INTEGER CHECK (heading_level BETWEEN 1 AND 6),

    -- Reading level analysis
    reading_level_grade DECIMAL(3,1), -- Flesch-Kincaid grade level
    complexity_score DECIMAL(3,2),

    -- Correlation tracking
    has_nearby_images BOOLEAN DEFAULT false,
    correlated_image_ids UUID[] DEFAULT '{}',

    -- Quality metrics
    extraction_confidence DECIMAL(3,2) CHECK (extraction_confidence BETWEEN 0 AND 1),
    ocr_required BOOLEAN DEFAULT false,
    ocr_confidence DECIMAL(3,2),

    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for pdf_text_content
CREATE INDEX idx_text_content_document ON pdf_text_content(document_id, page_number, block_sequence);
CREATE INDEX idx_text_content_page ON pdf_text_content(page_number);
CREATE INDEX idx_text_content_language ON pdf_text_content(detected_language);
CREATE INDEX idx_text_content_type ON pdf_text_content(is_heading, is_question, is_answer);
CREATE INDEX idx_text_content_position ON pdf_text_content(bbox_x1, bbox_y1, bbox_x2, bbox_y2);
CREATE INDEX idx_text_content_correlated_images ON pdf_text_content USING GIN(correlated_image_ids);

-- Full-text search indexes for bilingual support
CREATE INDEX idx_text_content_fts_english ON pdf_text_content USING GIN(
    to_tsvector('english', text_content)
);
CREATE INDEX idx_text_content_fts_spanish ON pdf_text_content USING GIN(
    to_tsvector('spanish', text_content)
);

-- Trigram index for fuzzy search
CREATE INDEX idx_text_content_trigram ON pdf_text_content USING GIN(text_content gin_trgm_ops);

-- ============================================================================
-- TABLE 3: PDF_IMAGES
-- Image metadata with optimization tracking
-- ============================================================================

CREATE TABLE pdf_images (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES pdf_documents(id) ON DELETE CASCADE,

    -- Page and positioning
    page_number INTEGER NOT NULL CHECK (page_number > 0),
    image_sequence INTEGER NOT NULL, -- Order on page

    -- Image storage
    original_storage_path TEXT NOT NULL,
    optimized_storage_path TEXT,
    thumbnail_storage_path TEXT,

    -- Image properties
    width_pixels INTEGER NOT NULL CHECK (width_pixels > 0),
    height_pixels INTEGER NOT NULL CHECK (height_pixels > 0),
    aspect_ratio DECIMAL(10,4) GENERATED ALWAYS AS (width_pixels::decimal / height_pixels::decimal) STORED,
    file_format VARCHAR(10), -- jpeg, png, svg, etc.
    color_space VARCHAR(20), -- RGB, CMYK, Grayscale
    bit_depth INTEGER,
    has_transparency BOOLEAN DEFAULT false,

    -- File sizes
    original_size_bytes BIGINT NOT NULL,
    optimized_size_bytes BIGINT,
    thumbnail_size_bytes BIGINT,
    compression_ratio DECIMAL(5,2),

    -- Positioning (bounding box)
    bbox_x1 DECIMAL(10,4),
    bbox_y1 DECIMAL(10,4),
    bbox_x2 DECIMAL(10,4),
    bbox_y2 DECIMAL(10,4),

    -- Image classification
    image_type VARCHAR(50), -- diagram, chart, photo, illustration, icon
    is_decorative BOOLEAN DEFAULT false,
    is_educational_content BOOLEAN DEFAULT true,
    contains_text BOOLEAN DEFAULT false,

    -- OCR for images with text
    extracted_text TEXT,
    ocr_confidence DECIMAL(3,2),
    detected_text_language language_type,

    -- AI-based image analysis
    ai_description TEXT, -- Auto-generated description
    ai_labels TEXT[] DEFAULT '{}', -- Auto-detected labels
    ai_confidence DECIMAL(3,2),
    educational_value_score DECIMAL(3,2),

    -- Accessibility
    alt_text TEXT,
    caption TEXT,
    has_alt_text BOOLEAN GENERATED ALWAYS AS (alt_text IS NOT NULL) STORED,

    -- Optimization status
    optimization_status optimization_status DEFAULT 'pending',
    optimization_started_at TIMESTAMPTZ,
    optimization_completed_at TIMESTAMPTZ,
    optimization_error TEXT,

    -- Correlation tracking
    has_nearby_text BOOLEAN DEFAULT false,
    correlated_text_ids UUID[] DEFAULT '{}',
    correlation_confidence DECIMAL(3,2),

    -- Quality metrics
    quality_score DECIMAL(3,2) CHECK (quality_score BETWEEN 0 AND 1),
    sharpness_score DECIMAL(3,2),
    noise_level DECIMAL(3,2),

    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for pdf_images
CREATE INDEX idx_images_document ON pdf_images(document_id, page_number, image_sequence);
CREATE INDEX idx_images_page ON pdf_images(page_number);
CREATE INDEX idx_images_type ON pdf_images(image_type, is_educational_content);
CREATE INDEX idx_images_optimization ON pdf_images(optimization_status);
CREATE INDEX idx_images_position ON pdf_images(bbox_x1, bbox_y1, bbox_x2, bbox_y2);
CREATE INDEX idx_images_correlated_text ON pdf_images USING GIN(correlated_text_ids);
CREATE INDEX idx_images_labels ON pdf_images USING GIN(ai_labels);

-- Full-text search on extracted text and descriptions
CREATE INDEX idx_images_fts ON pdf_images USING GIN(
    to_tsvector('english',
        coalesce(extracted_text, '') || ' ' ||
        coalesce(ai_description, '') || ' ' ||
        coalesce(alt_text, '')
    )
);

-- ============================================================================
-- TABLE 4: TEXT_IMAGE_CORRELATIONS
-- Smart linking between text blocks and images
-- ============================================================================

CREATE TABLE text_image_correlations (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES pdf_documents(id) ON DELETE CASCADE,
    text_content_id UUID NOT NULL REFERENCES pdf_text_content(id) ON DELETE CASCADE,
    image_id UUID NOT NULL REFERENCES pdf_images(id) ON DELETE CASCADE,

    -- Correlation metrics
    correlation_type VARCHAR(50), -- proximity, reference, caption, diagram_label
    confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score BETWEEN 0 AND 1),

    -- Spatial relationship
    distance_pixels DECIMAL(10,2), -- Distance between text and image
    relative_position VARCHAR(20), -- above, below, left, right, overlapping
    same_page BOOLEAN DEFAULT true,

    -- Semantic relationship
    is_caption BOOLEAN DEFAULT false,
    is_label BOOLEAN DEFAULT false,
    is_reference BOOLEAN DEFAULT false, -- Text refers to image
    is_description BOOLEAN DEFAULT false,

    -- Reference detection
    reference_text VARCHAR(255), -- e.g., "see Figure 1", "diagram below"
    reference_pattern VARCHAR(100), -- Pattern used to detect reference

    -- AI-based correlation
    semantic_similarity_score DECIMAL(3,2), -- NLP-based similarity
    visual_text_match_score DECIMAL(3,2), -- OCR text match
    context_relevance_score DECIMAL(3,2),

    -- Manual verification
    manually_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMPTZ,
    verification_notes TEXT,

    -- Quality
    correlation_quality VARCHAR(20) DEFAULT 'auto', -- auto, verified, rejected

    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Unique constraint to prevent duplicates
    UNIQUE(text_content_id, image_id)
);

-- Indexes for text_image_correlations
CREATE INDEX idx_correlations_document ON text_image_correlations(document_id);
CREATE INDEX idx_correlations_text ON text_image_correlations(text_content_id);
CREATE INDEX idx_correlations_image ON text_image_correlations(image_id);
CREATE INDEX idx_correlations_type ON text_image_correlations(correlation_type);
CREATE INDEX idx_correlations_confidence ON text_image_correlations(confidence_score DESC);
CREATE INDEX idx_correlations_verified ON text_image_correlations(manually_verified, correlation_quality);

-- ============================================================================
-- TABLE 5: ASSESSMENT_QUESTIONS
-- Structured questions extracted from PDFs
-- ============================================================================

CREATE TABLE assessment_questions (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES pdf_documents(id) ON DELETE CASCADE,

    -- Question location
    page_number INTEGER NOT NULL,
    question_number VARCHAR(20), -- e.g., "1", "2a", "Q3"
    section_name VARCHAR(255),

    -- Question content
    question_text TEXT NOT NULL,
    question_type question_type NOT NULL,

    -- Multiple choice options
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    option_e TEXT,
    correct_answer CHAR(1) CHECK (correct_answer IN ('A', 'B', 'C', 'D', 'E')),

    -- Answer and explanation
    answer_text TEXT,
    explanation TEXT,
    solution_steps TEXT[], -- For math problems

    -- Educational metadata
    grade_level grade_level NOT NULL,
    subject subject_type NOT NULL,
    topic VARCHAR(255),
    skill_tested VARCHAR(255),
    bloom_taxonomy_level VARCHAR(50), -- remember, understand, apply, analyze, evaluate, create
    difficulty_level VARCHAR(20), -- easy, medium, hard

    -- Standards alignment
    common_core_standard VARCHAR(100),
    state_standard VARCHAR(100),
    learning_objective TEXT,

    -- Points and scoring
    points_possible INTEGER DEFAULT 1,
    partial_credit_allowed BOOLEAN DEFAULT false,

    -- Related content
    related_text_ids UUID[] DEFAULT '{}',
    related_image_ids UUID[] DEFAULT '{}',
    prerequisite_question_ids UUID[] DEFAULT '{}',

    -- Language support
    language language_type DEFAULT 'en',
    has_translation BOOLEAN DEFAULT false,
    translated_question_text TEXT,
    translated_options JSONB,

    -- Quality metrics
    extraction_confidence DECIMAL(3,2) CHECK (extraction_confidence BETWEEN 0 AND 1),
    manually_reviewed BOOLEAN DEFAULT false,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,

    -- Usage tracking
    times_used INTEGER DEFAULT 0,
    average_score DECIMAL(5,2),
    difficulty_index DECIMAL(3,2), -- Calculated from student performance

    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for assessment_questions
CREATE INDEX idx_questions_document ON assessment_questions(document_id, page_number);
CREATE INDEX idx_questions_type ON assessment_questions(question_type);
CREATE INDEX idx_questions_grade_subject ON assessment_questions(grade_level, subject);
CREATE INDEX idx_questions_difficulty ON assessment_questions(difficulty_level);
CREATE INDEX idx_questions_standard ON assessment_questions(common_core_standard);
CREATE INDEX idx_questions_language ON assessment_questions(language);
CREATE INDEX idx_questions_related_content ON assessment_questions USING GIN(related_text_ids);

-- Full-text search on questions
CREATE INDEX idx_questions_fts ON assessment_questions USING GIN(
    to_tsvector('english',
        coalesce(question_text, '') || ' ' ||
        coalesce(topic, '') || ' ' ||
        coalesce(skill_tested, '')
    )
);

-- ============================================================================
-- TABLE 6: READING_MATERIALS
-- Categorized reading content from PDFs
-- ============================================================================

CREATE TABLE reading_materials (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES pdf_documents(id) ON DELETE CASCADE,

    -- Content identification
    title VARCHAR(500) NOT NULL,
    author VARCHAR(255),
    source VARCHAR(255),

    -- Content location
    start_page INTEGER NOT NULL,
    end_page INTEGER NOT NULL,
    page_count INTEGER GENERATED ALWAYS AS (end_page - start_page + 1) STORED,

    -- Full text content
    full_text TEXT NOT NULL,
    word_count INTEGER,
    character_count INTEGER,

    -- Educational classification
    grade_level grade_level NOT NULL,
    subject subject_type DEFAULT 'reading',
    genre VARCHAR(100), -- fiction, non-fiction, poetry, biography, etc.
    theme VARCHAR(255),

    -- Reading level analysis
    lexile_measure VARCHAR(20), -- e.g., "600L"
    guided_reading_level VARCHAR(10), -- e.g., "Level M"
    dra_level INTEGER,
    flesch_kincaid_grade DECIMAL(3,1),
    flesch_reading_ease DECIMAL(5,2),

    -- Complexity metrics
    average_sentence_length DECIMAL(5,2),
    average_word_length DECIMAL(4,2),
    unique_word_count INTEGER,
    vocabulary_difficulty_score DECIMAL(3,2),

    -- Language support
    primary_language language_type DEFAULT 'en',
    has_spanish_version BOOLEAN DEFAULT false,
    spanish_version_id UUID REFERENCES reading_materials(id),

    -- Educational features
    has_comprehension_questions BOOLEAN DEFAULT false,
    has_vocabulary_list BOOLEAN DEFAULT false,
    has_discussion_prompts BOOLEAN DEFAULT false,
    has_illustrations BOOLEAN DEFAULT false,

    -- Content structure
    paragraph_count INTEGER,
    sentence_count INTEGER,
    heading_count INTEGER,

    -- Related content
    related_image_ids UUID[] DEFAULT '{}',
    related_question_ids UUID[] DEFAULT '{}',
    vocabulary_words TEXT[] DEFAULT '{}',

    -- Standards alignment
    common_core_standard VARCHAR(100),
    reading_skill VARCHAR(255), -- main idea, inference, vocabulary, etc.

    -- Quality and review
    content_quality_score DECIMAL(3,2),
    age_appropriate BOOLEAN DEFAULT true,
    culturally_responsive BOOLEAN DEFAULT true,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,

    -- Usage tracking
    times_assigned INTEGER DEFAULT 0,
    average_completion_time_minutes INTEGER,
    average_comprehension_score DECIMAL(5,2),

    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for reading_materials
CREATE INDEX idx_reading_document ON reading_materials(document_id);
CREATE INDEX idx_reading_grade_subject ON reading_materials(grade_level, subject);
CREATE INDEX idx_reading_genre ON reading_materials(genre);
CREATE INDEX idx_reading_language ON reading_materials(primary_language);
CREATE INDEX idx_reading_level ON reading_materials(flesch_kincaid_grade);
CREATE INDEX idx_reading_related_content ON reading_materials USING GIN(related_image_ids);

-- Full-text search on reading materials
CREATE INDEX idx_reading_fts ON reading_materials USING GIN(
    to_tsvector('english',
        coalesce(title, '') || ' ' ||
        coalesce(full_text, '') || ' ' ||
        coalesce(theme, '')
    )
);

-- ============================================================================
-- TABLE 7: PROCESSING_QUEUE
-- PDF processing status and queue management
-- ============================================================================

CREATE TABLE processing_queue (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES pdf_documents(id) ON DELETE CASCADE,

    -- Queue management
    priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10), -- 1=highest, 10=lowest
    status processing_status DEFAULT 'pending',

    -- Processing steps
    step_text_extraction BOOLEAN DEFAULT false,
    step_image_extraction BOOLEAN DEFAULT false,
    step_image_optimization BOOLEAN DEFAULT false,
    step_ocr BOOLEAN DEFAULT false,
    step_language_detection BOOLEAN DEFAULT false,
    step_question_extraction BOOLEAN DEFAULT false,
    step_correlation_analysis BOOLEAN DEFAULT false,
    step_quality_assessment BOOLEAN DEFAULT false,

    -- Current processing
    current_step VARCHAR(100),
    current_step_started_at TIMESTAMPTZ,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),

    -- Timing
    queued_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,

    -- Duration tracking
    total_processing_time_seconds INTEGER,
    text_extraction_time_seconds INTEGER,
    image_processing_time_seconds INTEGER,
    correlation_time_seconds INTEGER,

    -- Error handling
    error_message TEXT,
    error_code VARCHAR(50),
    error_stack TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    next_retry_at TIMESTAMPTZ,

    -- Resource allocation
    processing_worker_id VARCHAR(100),
    allocated_memory_mb INTEGER,
    cpu_cores_allocated INTEGER,

    -- Results summary
    pages_processed INTEGER DEFAULT 0,
    text_blocks_extracted INTEGER DEFAULT 0,
    images_extracted INTEGER DEFAULT 0,
    questions_extracted INTEGER DEFAULT 0,
    correlations_created INTEGER DEFAULT 0,

    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for processing_queue
CREATE INDEX idx_queue_status ON processing_queue(status, priority DESC, queued_at);
CREATE INDEX idx_queue_document ON processing_queue(document_id);
CREATE INDEX idx_queue_worker ON processing_queue(processing_worker_id);
CREATE INDEX idx_queue_retry ON processing_queue(next_retry_at) WHERE status = 'failed' AND retry_count < max_retries;
CREATE INDEX idx_queue_progress ON processing_queue(progress_percentage);

-- ============================================================================
-- TABLE 8: QUALITY_METRICS
-- Extraction accuracy tracking and analytics
-- ============================================================================

CREATE TABLE quality_metrics (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES pdf_documents(id) ON DELETE CASCADE,

    -- Metric type
    metric_category VARCHAR(50) NOT NULL, -- text_extraction, image_quality, correlation, overall
    metric_name VARCHAR(100) NOT NULL,

    -- Metric values
    score DECIMAL(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100),
    confidence DECIMAL(3,2) CHECK (confidence BETWEEN 0 AND 1),

    -- Text extraction metrics
    text_extraction_accuracy DECIMAL(5,2),
    ocr_accuracy DECIMAL(5,2),
    character_error_rate DECIMAL(5,4),
    word_error_rate DECIMAL(5,4),

    -- Image quality metrics
    image_sharpness_avg DECIMAL(5,2),
    image_resolution_avg INTEGER,
    image_optimization_ratio DECIMAL(5,2),

    -- Correlation metrics
    correlation_accuracy DECIMAL(5,2),
    false_positive_rate DECIMAL(5,4),
    false_negative_rate DECIMAL(5,4),
    precision_score DECIMAL(3,2),
    recall_score DECIMAL(3,2),
    f1_score DECIMAL(3,2),

    -- Language detection
    language_detection_accuracy DECIMAL(5,2),
    mixed_language_handling_score DECIMAL(5,2),

    -- Question extraction
    question_extraction_accuracy DECIMAL(5,2),
    question_type_classification_accuracy DECIMAL(5,2),
    answer_extraction_accuracy DECIMAL(5,2),

    -- Overall quality
    overall_quality_score DECIMAL(5,2),
    processing_quality_grade CHAR(1) CHECK (processing_quality_grade IN ('A', 'B', 'C', 'D', 'F')),

    -- Benchmarking
    baseline_score DECIMAL(5,2), -- Expected score for this type
    improvement_percentage DECIMAL(5,2),
    meets_quality_threshold BOOLEAN,

    -- Sample data for validation
    sample_size INTEGER,
    validation_method VARCHAR(100), -- auto, manual, hybrid
    validated_by UUID REFERENCES auth.users(id),
    validated_at TIMESTAMPTZ,

    -- Detailed breakdown
    metrics_breakdown JSONB DEFAULT '{}'::jsonb,

    -- Issues identified
    issues_found TEXT[] DEFAULT '{}',
    warnings TEXT[] DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',

    -- Comparison to previous runs
    previous_metric_id UUID REFERENCES quality_metrics(id),
    score_change DECIMAL(5,2),
    trend VARCHAR(20), -- improving, stable, declining

    -- Audit fields
    measured_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for quality_metrics
CREATE INDEX idx_metrics_document ON quality_metrics(document_id);
CREATE INDEX idx_metrics_category ON quality_metrics(metric_category, metric_name);
CREATE INDEX idx_metrics_score ON quality_metrics(score DESC);
CREATE INDEX idx_metrics_grade ON quality_metrics(processing_quality_grade);
CREATE INDEX idx_metrics_threshold ON quality_metrics(meets_quality_threshold);
CREATE INDEX idx_metrics_measured_at ON quality_metrics(measured_at DESC);
CREATE INDEX idx_metrics_trend ON quality_metrics(trend);

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- Automatically update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_pdf_documents_updated_at BEFORE UPDATE ON pdf_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pdf_text_content_updated_at BEFORE UPDATE ON pdf_text_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pdf_images_updated_at BEFORE UPDATE ON pdf_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_text_image_correlations_updated_at BEFORE UPDATE ON text_image_correlations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_questions_updated_at BEFORE UPDATE ON assessment_questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_materials_updated_at BEFORE UPDATE ON reading_materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_processing_queue_updated_at BEFORE UPDATE ON processing_queue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE pdf_documents IS 'Core metadata for uploaded PDF files with FERPA compliance and multi-tenant support';
COMMENT ON TABLE pdf_text_content IS 'Extracted text with precise positioning, language detection, and reading level analysis';
COMMENT ON TABLE pdf_images IS 'Image metadata with optimization tracking and AI-based analysis';
COMMENT ON TABLE text_image_correlations IS 'Smart linking between text blocks and images using spatial and semantic analysis';
COMMENT ON TABLE assessment_questions IS 'Structured questions extracted from PDFs with standards alignment';
COMMENT ON TABLE reading_materials IS 'Categorized reading content with complexity metrics and bilingual support';
COMMENT ON TABLE processing_queue IS 'PDF processing status and queue management with retry logic';
COMMENT ON TABLE quality_metrics IS 'Extraction accuracy tracking and quality analytics';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
