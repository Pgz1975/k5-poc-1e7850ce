-- Add voice guidance column to manual_assessments
ALTER TABLE manual_assessments 
ADD COLUMN IF NOT EXISTS voice_guidance TEXT;

-- Voice guidance library for reusable templates
CREATE TABLE IF NOT EXISTS voice_guidance_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  template_id TEXT,
  grade_level INTEGER,
  activity_type TEXT,
  language language_code NOT NULL DEFAULT 'es',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE voice_guidance_library ENABLE ROW LEVEL SECURITY;

-- Teachers can manage their own guidance
CREATE POLICY "Teachers manage their voice guidance"
  ON voice_guidance_library
  FOR ALL
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Voice interactions tracking
CREATE TABLE IF NOT EXISTS voice_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  student_id UUID REFERENCES auth.users(id),
  assessment_id UUID REFERENCES manual_assessments(id),
  text TEXT NOT NULL,
  is_user BOOLEAN NOT NULL,
  language TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE voice_interactions ENABLE ROW LEVEL SECURITY;

-- Students view their own interactions
CREATE POLICY "Students view own interactions"
  ON voice_interactions
  FOR SELECT
  USING (student_id = auth.uid());

-- System can insert interactions
CREATE POLICY "System inserts interactions"
  ON voice_interactions
  FOR INSERT
  WITH CHECK (true);

-- Voice sessions for metrics
CREATE TABLE IF NOT EXISTS voice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  student_id UUID REFERENCES auth.users(id),
  assessment_id UUID REFERENCES manual_assessments(id),
  language TEXT,
  grade_level INTEGER,
  metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE voice_sessions ENABLE ROW LEVEL SECURITY;

-- Students view their own sessions
CREATE POLICY "Students view own sessions"
  ON voice_sessions
  FOR SELECT
  USING (student_id = auth.uid());

-- System can manage sessions
CREATE POLICY "System manages sessions"
  ON voice_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert sample voice guidance templates
INSERT INTO voice_guidance_library (content, template_id, grade_level, activity_type, language)
VALUES 
  ('Hola nene, vamos a practicar los sonidos de las vocales. Escucha bien y repite después de mí. ¡Tú puedes!', 'vowel_practice', 1, 'phonics', 'es'),
  ('¡Qué chévere que estés aquí! Hoy vamos a leer juntos. No te preocupes si te equivocas, así aprendemos.', 'reading_intro', 2, 'reading', 'es'),
  ('Vamos a jugar con los sonidos. Te voy a decir una palabra y tú me dices qué sonido escuchas al principio. ¿Listo?', 'sound_game', 1, 'phonics', 'es'),
  ('Great job! Let''s practice reading together. Listen carefully and repeat after me.', 'reading_practice', 2, 'reading', 'en')
ON CONFLICT DO NOTHING;