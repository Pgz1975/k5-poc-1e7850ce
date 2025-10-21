-- ============================================================================
-- TABLE: manual_assessments
-- Stores manually created lessons, exercises, and assessments by teachers
-- ============================================================================
CREATE TABLE IF NOT EXISTS manual_assessments (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Type Classification
  type TEXT NOT NULL CHECK (type IN ('lesson', 'exercise', 'assessment')),
  subtype TEXT NOT NULL CHECK (subtype IN (
    'multiple_choice',
    'true_false',
    'fill_blank',
    'matching',
    'short_answer',
    'reading',
    'listening'
  )),

  -- Basic Info
  title TEXT NOT NULL,
  description TEXT,

  -- Content (JSONB for flexibility)
  content JSONB NOT NULL,

  -- Educational Metadata
  grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 0 AND 5),
  language language_code NOT NULL DEFAULT 'es',
  subject_area TEXT NOT NULL DEFAULT 'reading',
  curriculum_standards TEXT[],

  -- Voice Settings
  enable_voice BOOLEAN DEFAULT true,
  voice_speed DECIMAL(2,1) DEFAULT 1.0 CHECK (voice_speed BETWEEN 0.5 AND 2.0),
  auto_read_question BOOLEAN DEFAULT true,

  -- Difficulty & Duration
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  estimated_duration_minutes INTEGER DEFAULT 5,

  -- Status & Publishing
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,

  -- Usage Tracking
  view_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  average_score DECIMAL(5,2),

  -- Ownership & Timestamps
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Additional Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_manual_assessments_type ON manual_assessments(type);
CREATE INDEX idx_manual_assessments_subtype ON manual_assessments(subtype);
CREATE INDEX idx_manual_assessments_created_by ON manual_assessments(created_by);
CREATE INDEX idx_manual_assessments_grade_language ON manual_assessments(grade_level, language);
CREATE INDEX idx_manual_assessments_subject ON manual_assessments(subject_area);
CREATE INDEX idx_manual_assessments_status ON manual_assessments(status);
CREATE INDEX idx_manual_assessments_created_at ON manual_assessments(created_at DESC);
CREATE INDEX idx_manual_assessments_content_gin ON manual_assessments USING GIN(content);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_manual_assessments_updated_at
  BEFORE UPDATE ON manual_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION set_published_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_published_at_trigger
  BEFORE UPDATE ON manual_assessments
  FOR EACH ROW
  EXECUTE FUNCTION set_published_timestamp();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE manual_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view own assessments"
  ON manual_assessments FOR SELECT
  USING (created_by = auth.uid());

CREATE POLICY "Teachers can create assessments"
  ON manual_assessments FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Teachers can update own assessments"
  ON manual_assessments FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Teachers can delete own assessments"
  ON manual_assessments FOR DELETE
  USING (created_by = auth.uid());

CREATE POLICY "Students can view published assessments"
  ON manual_assessments FOR SELECT
  USING (status = 'published');

-- ============================================================================
-- STORAGE BUCKET
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('manual-assessment-images', 'manual-assessment-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Teachers can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'manual-assessment-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view assessment images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'manual-assessment-images');

CREATE POLICY "Teachers can update own images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'manual-assessment-images'
    AND auth.uid() = owner
  );

CREATE POLICY "Teachers can delete own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'manual-assessment-images'
    AND auth.uid() = owner
  );