-- Voice interactions and sessions tables for simplified voice architecture
-- NOTE: voice_guidance already exists in manual_assessments from Plan 10

-- Drop existing policies if they exist (to handle IF NOT EXISTS issue)
DROP POLICY IF EXISTS "Students can insert own interactions" ON voice_interactions;
DROP POLICY IF EXISTS "Students can view own interactions" ON voice_interactions;
DROP POLICY IF EXISTS "Teachers can view all interactions" ON voice_interactions;
DROP POLICY IF EXISTS "Students can view own sessions" ON voice_sessions;
DROP POLICY IF EXISTS "System can manage sessions" ON voice_sessions;
DROP POLICY IF EXISTS "Teachers can view all sessions" ON voice_sessions;

-- Create voice_interactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS voice_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  session_id UUID,
  assessment_id UUID,
  text TEXT NOT NULL,
  is_user BOOLEAN NOT NULL,
  language TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for voice_interactions
CREATE INDEX IF NOT EXISTS idx_voice_interactions_student ON voice_interactions(student_id);
CREATE INDEX IF NOT EXISTS idx_voice_interactions_assessment ON voice_interactions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_voice_interactions_session ON voice_interactions(session_id);

-- Enable RLS on voice_interactions
ALTER TABLE voice_interactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for voice_interactions
CREATE POLICY "Students can insert own interactions"
  ON voice_interactions
  FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view own interactions"
  ON voice_interactions
  FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view all interactions"
  ON voice_interactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher_english', 'teacher_spanish', 'school_director')
    )
  );

-- Create voice_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS voice_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  student_id UUID NOT NULL,
  assessment_id UUID,
  language TEXT,
  grade_level INT,
  metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for voice_sessions
CREATE INDEX IF NOT EXISTS idx_voice_sessions_student ON voice_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_voice_sessions_assessment ON voice_sessions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_voice_sessions_session_id ON voice_sessions(session_id);

-- Enable RLS on voice_sessions
ALTER TABLE voice_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for voice_sessions
CREATE POLICY "Students can view own sessions"
  ON voice_sessions
  FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "System can manage sessions"
  ON voice_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Teachers can view all sessions"
  ON voice_sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher_english', 'teacher_spanish', 'school_director')
    )
  );