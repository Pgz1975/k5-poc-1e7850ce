-- Step 1: Add columns to manual_assessments table
ALTER TABLE manual_assessments 
ADD COLUMN IF NOT EXISTS activity_template TEXT,
ADD COLUMN IF NOT EXISTS coqui_dialogue TEXT,
ADD COLUMN IF NOT EXISTS pronunciation_words TEXT[],
ADD COLUMN IF NOT EXISTS max_attempts INTEGER DEFAULT 3;

-- Step 2: Create tracking table for voice assessment results
CREATE TABLE IF NOT EXISTS voice_assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES manual_assessments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  word_practiced TEXT,
  pronunciation_score INTEGER CHECK (pronunciation_score BETWEEN 1 AND 5),
  attempts INTEGER,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE voice_assessment_results ENABLE ROW LEVEL SECURITY;

-- Students can view their own results
CREATE POLICY "Students view own results"
  ON voice_assessment_results FOR SELECT
  USING (student_id = auth.uid());

-- System can insert results
CREATE POLICY "System inserts results"
  ON voice_assessment_results FOR INSERT
  WITH CHECK (true);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_voice_results_student ON voice_assessment_results(student_id);
CREATE INDEX IF NOT EXISTS idx_voice_results_assessment ON voice_assessment_results(assessment_id);