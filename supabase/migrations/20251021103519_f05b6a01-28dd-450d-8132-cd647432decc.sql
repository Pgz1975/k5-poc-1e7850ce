-- Create generated_assessments table for storing created assessments
CREATE TABLE IF NOT EXISTS generated_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES auth.users(id),
  source_pdf_id UUID REFERENCES pdf_documents(id),
  selected_items JSONB NOT NULL DEFAULT '{"texts":[],"images":[],"questions":[]}'::jsonb,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('reading_exercise', 'quiz', 'lesson', 'vocabulary_cards', 'vowel_recognition', 'picture_match', 'size_comparison', 'position_learning', 'pattern_recognition', 'simple_math')),
  grade_level INTEGER CHECK (grade_level >= 0 AND grade_level <= 5),
  language language_code NOT NULL DEFAULT 'es',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE generated_assessments ENABLE ROW LEVEL SECURITY;

-- Policies for generated_assessments
CREATE POLICY "Users can view their own assessments"
  ON generated_assessments FOR SELECT
  USING (created_by = auth.uid());

CREATE POLICY "Users can create their own assessments"
  ON generated_assessments FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own assessments"
  ON generated_assessments FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own assessments"
  ON generated_assessments FOR DELETE
  USING (created_by = auth.uid());

-- Create assessment-uploads storage bucket for user uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('assessment-uploads', 'assessment-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for assessment-uploads
CREATE POLICY "Users can upload their own images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'assessment-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view public assessment uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'assessment-uploads');

CREATE POLICY "Users can update their own uploads"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'assessment-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own uploads"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'assessment-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Trigger for updating updated_at
CREATE TRIGGER update_generated_assessments_updated_at
  BEFORE UPDATE ON generated_assessments
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();