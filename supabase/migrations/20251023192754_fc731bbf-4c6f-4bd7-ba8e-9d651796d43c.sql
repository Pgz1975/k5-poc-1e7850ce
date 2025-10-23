-- Add cost tracking tables for speech recognition models

-- Create enum for model types
CREATE TYPE voice_model_type AS ENUM (
  'web-speech-api',
  'gpt-4o-realtime-preview-2024-12-17',
  'gpt-4o-realtime-preview-2024-10-01',
  'gpt-4o-mini-realtime-preview-2024-12-17'
);

-- Table for tracking voice model usage costs
CREATE TABLE IF NOT EXISTS voice_model_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  model voice_model_type NOT NULL,
  session_id UUID,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  session_cost DECIMAL(10, 6) DEFAULT 0,
  session_duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for aggregated cost metrics per student per model
CREATE TABLE IF NOT EXISTS voice_cost_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  model voice_model_type NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  total_input_tokens BIGINT DEFAULT 0,
  total_output_tokens BIGINT DEFAULT 0,
  total_cost DECIMAL(10, 4) DEFAULT 0,
  average_cost_per_session DECIMAL(10, 6) DEFAULT 0,
  last_session_cost DECIMAL(10, 6) DEFAULT 0,
  last_session_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, model)
);

-- Enable RLS
ALTER TABLE voice_model_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_cost_summary ENABLE ROW LEVEL SECURITY;

-- RLS Policies for voice_model_usage
CREATE POLICY "Students can view own usage"
  ON voice_model_usage FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own usage"
  ON voice_model_usage FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can view all usage"
  ON voice_model_usage FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher_english', 'teacher_spanish', 'school_director', 'regional_director')
    )
  );

-- RLS Policies for voice_cost_summary  
CREATE POLICY "Students can view own summary"
  ON voice_cost_summary FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can update own summary"
  ON voice_cost_summary FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own summary"
  ON voice_cost_summary FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can view all summaries"
  ON voice_cost_summary FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher_english', 'teacher_spanish', 'school_director', 'regional_director')
    )
  );

-- Indexes for performance
CREATE INDEX idx_voice_model_usage_student ON voice_model_usage(student_id);
CREATE INDEX idx_voice_model_usage_model ON voice_model_usage(model);
CREATE INDEX idx_voice_model_usage_created ON voice_model_usage(created_at);
CREATE INDEX idx_voice_cost_summary_student ON voice_cost_summary(student_id);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_voice_model_usage_updated_at
  BEFORE UPDATE ON voice_model_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voice_cost_summary_updated_at
  BEFORE UPDATE ON voice_cost_summary
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add model parameter to voice_interactions table (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'voice_interactions' AND column_name = 'model'
  ) THEN
    ALTER TABLE voice_interactions ADD COLUMN model voice_model_type DEFAULT 'gpt-4o-realtime-preview-2024-12-17';
  END IF;
END $$;

-- Add model parameter to voice_sessions table (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'voice_sessions' AND column_name = 'model'
  ) THEN
    ALTER TABLE voice_sessions ADD COLUMN model voice_model_type DEFAULT 'gpt-4o-realtime-preview-2024-12-17';
  END IF;
END $$;