-- ============================================================================
-- K5 PDF PARSING SYSTEM - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Creates all 8 core tables for bilingual K-5 educational PDF parsing
-- with FERPA/COPPA compliance, full-text search, and image correlation
-- ============================================================================

-- Create enum types
CREATE TYPE processing_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE content_type AS ENUM ('textbook', 'worksheet', 'assessment', 'reading_material', 'other');
CREATE TYPE language_code AS ENUM ('es', 'en', 'es-PR');
CREATE TYPE correlation_type AS ENUM ('spatial', 'semantic', 'caption', 'reference');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false', 'short_answer', 'fill_blank', 'matching');

-- ============================================================================
-- TABLE: pdf_documents
-- Stores metadata about uploaded PDF documents
-- ============================================================================
CREATE TABLE IF NOT EXISTS pdf_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  storage_bucket TEXT NOT NULL DEFAULT 'educational-pdfs',
  storage_path TEXT NOT NULL UNIQUE,
  file_hash TEXT NOT NULL,
  
  -- Document metadata
  content_type content_type DEFAULT 'other',
  grade_level INTEGER[] DEFAULT ARRAY[1,2,3,4,5],
  subject_area TEXT[],
  primary_language language_code DEFAULT 'es',
  reading_level DECIMAL(3,1),
  curriculum_standards JSONB DEFAULT '[]'::jsonb,
  
  -- Processing status
  processing_status processing_status DEFAULT 'pending',
  processing_progress INTEGER DEFAULT 0 CHECK (processing_progress >= 0 AND processing_progress <= 100),
  processing_error TEXT,
  processing_started_at TIMESTAMPTZ,
  processing_completed_at TIMESTAMPTZ,
  
  -- PDF properties
  page_count INTEGER,
  total_words INTEGER DEFAULT 0,
  total_images INTEGER DEFAULT 0,
  has_text_layer BOOLEAN DEFAULT true,
  
  -- Quality metrics
  quality_score DECIMAL(3,2) CHECK (quality_score >= 0 AND quality_score <= 1),
  ocr_confidence DECIMAL(3,2),
  
  -- Ownership and timestamps
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Additional metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- TABLE: pdf_text_content
-- Stores extracted text content from PDFs with language detection
-- ============================================================================
CREATE TABLE IF NOT EXISTS pdf_text_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES pdf_documents(id) ON DELETE CASCADE,
  
  -- Page and position
  page_number INTEGER NOT NULL CHECK (page_number > 0),
  block_index INTEGER NOT NULL CHECK (block_index >= 0),
  
  -- Text content
  text_content TEXT NOT NULL,
  text_length INTEGER NOT NULL,
  
  -- Language detection
  detected_language language_code NOT NULL,
  language_confidence DECIMAL(3,2) CHECK (language_confidence >= 0 AND language_confidence <= 1),
  is_puerto_rican_dialect BOOLEAN DEFAULT false,
  
  -- Position data (bounding box)
  bbox JSONB,
  
  -- Formatting
  font_family TEXT,
  font_size DECIMAL(5,2),
  is_bold BOOLEAN DEFAULT false,
  is_italic BOOLEAN DEFAULT false,
  text_color TEXT,
  
  -- Reading metrics
  reading_complexity DECIMAL(5,2),
  word_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Full-text search
  search_vector_es tsvector,
  search_vector_en tsvector,
  
  UNIQUE(document_id, page_number, block_index)
);

-- ============================================================================
-- TABLE: pdf_images
-- Stores extracted images from PDFs with alt text and cultural context
-- ============================================================================
CREATE TABLE IF NOT EXISTS pdf_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES pdf_documents(id) ON DELETE CASCADE,
  
  -- Page and position
  page_number INTEGER NOT NULL CHECK (page_number > 0),
  image_index INTEGER NOT NULL CHECK (image_index >= 0),
  
  -- Storage
  storage_bucket TEXT NOT NULL DEFAULT 'educational-pdfs',
  storage_path TEXT NOT NULL UNIQUE,
  thumbnail_path TEXT,
  
  -- Image properties
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  format TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  
  -- Position (bounding box)
  bbox JSONB,
  
  -- AI-generated descriptions
  alt_text TEXT,
  caption TEXT,
  cultural_context TEXT,
  educational_relevance TEXT,
  
  -- Detected content
  contains_text BOOLEAN DEFAULT false,
  detected_objects JSONB DEFAULT '[]'::jsonb,
  
  -- Quality metrics
  quality_score DECIMAL(3,2),
  is_decorative BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(document_id, page_number, image_index)
);

-- ============================================================================
-- TABLE: text_image_correlations
-- Links text blocks with related images for comprehension
-- ============================================================================
CREATE TABLE IF NOT EXISTS text_image_correlations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  text_content_id UUID NOT NULL REFERENCES pdf_text_content(id) ON DELETE CASCADE,
  image_id UUID NOT NULL REFERENCES pdf_images(id) ON DELETE CASCADE,
  
  -- Correlation metrics
  correlation_type correlation_type NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  
  -- Spatial relationship
  distance_pixels INTEGER,
  relative_position TEXT,
  
  -- Semantic relationship
  semantic_similarity DECIMAL(3,2),
  shared_concepts TEXT[],
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(text_content_id, image_id, correlation_type)
);

-- ============================================================================
-- TABLE: assessment_questions
-- Auto-generated comprehension questions from PDF content
-- ============================================================================
CREATE TABLE IF NOT EXISTS assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES pdf_documents(id) ON DELETE CASCADE,
  
  -- Question content
  question_text TEXT NOT NULL,
  question_type question_type NOT NULL,
  
  -- Answer options
  correct_answer TEXT NOT NULL,
  options JSONB DEFAULT '[]'::jsonb,
  explanation TEXT,
  
  -- Source references
  source_page INTEGER,
  source_text_ids UUID[],
  source_image_ids UUID[],
  
  -- Educational metadata
  skill_assessed TEXT NOT NULL,
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  grade_level INTEGER CHECK (grade_level BETWEEN 1 AND 5),
  language language_code NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: reading_progress
-- Tracks student reading progress through PDFs (COPPA compliant)
-- ============================================================================
CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES pdf_documents(id) ON DELETE CASCADE,
  
  -- Progress tracking
  current_page INTEGER NOT NULL DEFAULT 1,
  pages_completed INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  
  -- Time tracking
  total_time_seconds INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  
  -- Engagement metrics
  annotations_count INTEGER DEFAULT 0,
  vocabulary_lookups_count INTEGER DEFAULT 0,
  
  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(student_id, document_id)
);

-- ============================================================================
-- TABLE: vocabulary_terms
-- Bilingual vocabulary extracted from PDFs with definitions
-- ============================================================================
CREATE TABLE IF NOT EXISTS vocabulary_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES pdf_documents(id) ON DELETE CASCADE,
  
  -- Term data
  term TEXT NOT NULL,
  language language_code NOT NULL,
  
  -- Translations
  english_translation TEXT,
  spanish_translation TEXT,
  puerto_rican_variant TEXT,
  
  -- Definitions
  definition TEXT,
  example_usage TEXT,
  
  -- Educational metadata
  grade_level INTEGER CHECK (grade_level BETWEEN 1 AND 5),
  frequency_in_document INTEGER DEFAULT 1,
  is_academic_vocabulary BOOLEAN DEFAULT false,
  subject_area TEXT,
  
  -- Phonetics for voice
  phonetic_spelling TEXT,
  pronunciation_guide TEXT,
  
  -- Usage tracking
  lookup_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(document_id, term, language)
);

-- ============================================================================
-- TABLE: user_annotations
-- Student notes and highlights on PDF content (COPPA compliant)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES pdf_documents(id) ON DELETE CASCADE,
  
  -- Annotation type and content
  annotation_type TEXT NOT NULL CHECK (annotation_type IN ('highlight', 'note', 'bookmark', 'question')),
  content TEXT,
  
  -- Location
  page_number INTEGER NOT NULL,
  text_content_id UUID REFERENCES pdf_text_content(id) ON DELETE SET NULL,
  selection_text TEXT,
  position JSONB,
  
  -- Styling
  color TEXT DEFAULT '#FFFF00',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- pdf_documents indexes
CREATE INDEX idx_pdf_documents_status ON pdf_documents(processing_status);
CREATE INDEX idx_pdf_documents_uploaded_by ON pdf_documents(uploaded_by);
CREATE INDEX idx_pdf_documents_grade_level ON pdf_documents USING GIN(grade_level);
CREATE INDEX idx_pdf_documents_subject_area ON pdf_documents USING GIN(subject_area);
CREATE INDEX idx_pdf_documents_created_at ON pdf_documents(created_at DESC);

-- pdf_text_content indexes
CREATE INDEX idx_text_content_document_page ON pdf_text_content(document_id, page_number);
CREATE INDEX idx_text_content_language ON pdf_text_content(detected_language);
CREATE INDEX idx_text_search_es ON pdf_text_content USING GIN(search_vector_es);
CREATE INDEX idx_text_search_en ON pdf_text_content USING GIN(search_vector_en);

-- pdf_images indexes
CREATE INDEX idx_images_document_page ON pdf_images(document_id, page_number);
CREATE INDEX idx_images_quality ON pdf_images(quality_score DESC) WHERE NOT is_decorative;

-- text_image_correlations indexes
CREATE INDEX idx_correlations_text ON text_image_correlations(text_content_id);
CREATE INDEX idx_correlations_image ON text_image_correlations(image_id);
CREATE INDEX idx_correlations_confidence ON text_image_correlations(confidence_score DESC);

-- assessment_questions indexes
CREATE INDEX idx_questions_document ON assessment_questions(document_id);
CREATE INDEX idx_questions_grade_language ON assessment_questions(grade_level, language);

-- reading_progress indexes
CREATE INDEX idx_progress_student ON reading_progress(student_id);
CREATE INDEX idx_progress_document ON reading_progress(document_id);
CREATE INDEX idx_progress_updated ON reading_progress(updated_at DESC);

-- vocabulary_terms indexes
CREATE INDEX idx_vocabulary_document ON vocabulary_terms(document_id);
CREATE INDEX idx_vocabulary_term_language ON vocabulary_terms(term, language);
CREATE INDEX idx_vocabulary_lookup_count ON vocabulary_terms(lookup_count DESC);

-- user_annotations indexes
CREATE INDEX idx_annotations_student ON user_annotations(student_id);
CREATE INDEX idx_annotations_document ON user_annotations(document_id);
CREATE INDEX idx_annotations_page ON user_annotations(document_id, page_number);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pdf_documents_updated_at BEFORE UPDATE ON pdf_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pdf_text_content_updated_at BEFORE UPDATE ON pdf_text_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pdf_images_updated_at BEFORE UPDATE ON pdf_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_questions_updated_at BEFORE UPDATE ON assessment_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_progress_updated_at BEFORE UPDATE ON reading_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vocabulary_terms_updated_at BEFORE UPDATE ON vocabulary_terms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_annotations_updated_at BEFORE UPDATE ON user_annotations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE pdf_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_text_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_image_correlations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_annotations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - FERPA/COPPA COMPLIANT
-- ============================================================================

-- pdf_documents policies
CREATE POLICY "Users can view their own uploaded documents"
  ON pdf_documents FOR SELECT
  USING (uploaded_by = auth.uid());

CREATE POLICY "Users can upload documents"
  ON pdf_documents FOR INSERT
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Users can update their own documents"
  ON pdf_documents FOR UPDATE
  USING (uploaded_by = auth.uid());

CREATE POLICY "Users can delete their own documents"
  ON pdf_documents FOR DELETE
  USING (uploaded_by = auth.uid());

-- pdf_text_content policies (inherits from document access)
CREATE POLICY "Users can view text from their documents"
  ON pdf_text_content FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM pdf_documents
    WHERE id = pdf_text_content.document_id
    AND uploaded_by = auth.uid()
  ));

-- pdf_images policies (inherits from document access)
CREATE POLICY "Users can view images from their documents"
  ON pdf_images FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM pdf_documents
    WHERE id = pdf_images.document_id
    AND uploaded_by = auth.uid()
  ));

-- text_image_correlations policies
CREATE POLICY "Users can view correlations from their documents"
  ON text_image_correlations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM pdf_text_content tc
    JOIN pdf_documents d ON tc.document_id = d.id
    WHERE tc.id = text_image_correlations.text_content_id
    AND d.uploaded_by = auth.uid()
  ));

-- assessment_questions policies
CREATE POLICY "Users can view questions from their documents"
  ON assessment_questions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM pdf_documents
    WHERE id = assessment_questions.document_id
    AND uploaded_by = auth.uid()
  ));

-- reading_progress policies
CREATE POLICY "Students can view their own progress"
  ON reading_progress FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert their own progress"
  ON reading_progress FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own progress"
  ON reading_progress FOR UPDATE
  USING (student_id = auth.uid());

-- vocabulary_terms policies
CREATE POLICY "Users can view vocabulary from their documents"
  ON vocabulary_terms FOR SELECT
  USING (
    document_id IS NULL OR
    EXISTS (
      SELECT 1 FROM pdf_documents
      WHERE id = vocabulary_terms.document_id
      AND uploaded_by = auth.uid()
    )
  );

-- user_annotations policies
CREATE POLICY "Students can view their own annotations"
  ON user_annotations FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can create their own annotations"
  ON user_annotations FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own annotations"
  ON user_annotations FOR UPDATE
  USING (student_id = auth.uid());

CREATE POLICY "Students can delete their own annotations"
  ON user_annotations FOR DELETE
  USING (student_id = auth.uid());