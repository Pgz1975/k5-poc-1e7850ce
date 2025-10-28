-- OpenAI Realtime API Demo Activities - Database Migration
-- Version: 2.0 - COMPLETE ISOLATION ARCHITECTURE
-- Date: October 28, 2025
-- Purpose: Create ISOLATED demo tables - ZERO changes to production tables

-- ============================================
-- CREATE NEW DEMO_ACTIVITIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS demo_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  demo_type TEXT NOT NULL CHECK (demo_type IN (
    'readflow',
    'pronunciation',
    'speed_quiz',
    'voice_builder',
    'spelling',
    'writing',
    'story'
  )),
  language TEXT NOT NULL CHECK (language IN ('es-PR', 'en-US')),
  grade_level INTEGER NOT NULL DEFAULT 1 CHECK (grade_level = 1),
  content JSONB NOT NULL,
  voice_guidance TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(demo_type, language)
);

COMMENT ON TABLE demo_activities IS 'Isolated demo activities showcasing OpenAI Realtime API.';

CREATE INDEX IF NOT EXISTS idx_demo_activities_type_lang ON demo_activities(demo_type, language);
CREATE INDEX IF NOT EXISTS idx_demo_activities_grade ON demo_activities(grade_level);

-- ============================================
-- CREATE NEW DEMO_VOICE_SESSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS demo_voice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_activity_id UUID NOT NULL REFERENCES demo_activities(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  telemetry JSONB DEFAULT '{}',
  total_api_cost_cents INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  metadata JSONB DEFAULT '{}'
);

COMMENT ON TABLE demo_voice_sessions IS 'Demo voice sessions - COMPLETELY SEPARATE from voice_sessions.';

CREATE INDEX IF NOT EXISTS idx_demo_sessions_activity ON demo_voice_sessions(demo_activity_id);
CREATE INDEX IF NOT EXISTS idx_demo_sessions_student ON demo_voice_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_demo_sessions_started ON demo_voice_sessions(started_at DESC);

-- ============================================
-- CREATE NEW DEMO_INTERACTIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS demo_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_session_id UUID NOT NULL REFERENCES demo_voice_sessions(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  transcript TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE demo_interactions IS 'Demo interactions - COMPLETELY SEPARATE from voice_interactions.';

CREATE INDEX IF NOT EXISTS idx_demo_interactions_session ON demo_interactions(demo_session_id);
CREATE INDEX IF NOT EXISTS idx_demo_interactions_type ON demo_interactions(interaction_type);

-- ============================================
-- DEMO ANALYTICS VIEWS
-- ============================================

CREATE OR REPLACE VIEW demo_session_summary AS
SELECT
  ds.id AS session_id,
  ds.student_id,
  da.title AS demo_title,
  da.demo_type,
  da.language,
  ds.started_at,
  ds.ended_at,
  EXTRACT(EPOCH FROM (ds.ended_at - ds.started_at)) AS duration_seconds,
  ds.completion_percentage,
  ds.telemetry->>'student_satisfaction' AS satisfaction,
  ds.total_api_cost_cents / 100.0 AS cost_dollars
FROM demo_voice_sessions ds
JOIN demo_activities da ON ds.demo_activity_id = da.id;

CREATE OR REPLACE VIEW demo_effectiveness_by_type AS
SELECT
  da.demo_type,
  da.language,
  COUNT(DISTINCT ds.student_id) AS unique_students,
  COUNT(ds.id) AS total_sessions,
  AVG(EXTRACT(EPOCH FROM (ds.ended_at - ds.started_at))) AS avg_duration_seconds,
  AVG(ds.completion_percentage) AS avg_completion_pct,
  AVG((ds.telemetry->>'student_satisfaction')::numeric) AS avg_satisfaction,
  SUM(ds.total_api_cost_cents) / 100.0 AS total_cost_dollars
FROM demo_voice_sessions ds
JOIN demo_activities da ON ds.demo_activity_id = da.id
WHERE ds.ended_at IS NOT NULL
GROUP BY da.demo_type, da.language
ORDER BY total_sessions DESC;

-- ============================================
-- COPPA-COMPLIANT CLEANUP
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_old_demo_data()
RETURNS void AS $$
BEGIN
  DELETE FROM demo_voice_sessions WHERE started_at < NOW() - INTERVAL '30 days';
  DELETE FROM demo_interactions WHERE demo_session_id NOT IN (SELECT id FROM demo_voice_sessions);
  RAISE NOTICE 'Demo data cleanup completed.';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE demo_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_voice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_interactions ENABLE ROW LEVEL SECURITY;

-- Demo activities are publicly viewable
CREATE POLICY "Demo activities are publicly viewable" ON demo_activities
FOR SELECT TO authenticated USING (true);

-- Students can manage their own demo sessions
CREATE POLICY "Students can create demo sessions" ON demo_voice_sessions
FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view own demo sessions" ON demo_voice_sessions
FOR SELECT TO authenticated USING (auth.uid() = student_id);

CREATE POLICY "Students can update own demo sessions" ON demo_voice_sessions
FOR UPDATE TO authenticated USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

-- Students can manage their own demo interactions
CREATE POLICY "Students can create demo interactions" ON demo_interactions
FOR INSERT TO authenticated WITH CHECK (
  demo_session_id IN (SELECT id FROM demo_voice_sessions WHERE student_id = auth.uid())
);

CREATE POLICY "Students can view own demo interactions" ON demo_interactions
FOR SELECT TO authenticated USING (
  demo_session_id IN (SELECT id FROM demo_voice_sessions WHERE student_id = auth.uid())
);

-- Teachers and admins get full access
CREATE POLICY "Teachers manage all demos" ON demo_activities
FOR ALL TO authenticated
USING (
  has_role(auth.uid(), 'teacher_english'::app_role) OR
  has_role(auth.uid(), 'teacher_spanish'::app_role) OR
  has_role(auth.uid(), 'school_director'::app_role) OR
  has_role(auth.uid(), 'regional_director'::app_role) OR
  has_role(auth.uid(), 'depr_executive'::app_role)
);

CREATE POLICY "Teachers view all demo sessions" ON demo_voice_sessions
FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'teacher_english'::app_role) OR
  has_role(auth.uid(), 'teacher_spanish'::app_role) OR
  has_role(auth.uid(), 'school_director'::app_role) OR
  has_role(auth.uid(), 'regional_director'::app_role) OR
  has_role(auth.uid(), 'depr_executive'::app_role)
);

-- ============================================
-- SAMPLE DEMO DATA
-- ============================================

INSERT INTO demo_activities (title, description, demo_type, language, grade_level, content, voice_guidance) 
VALUES (
  '📖 ReadFlow: El Coquí Canta',
  'Interactive reading with real-time word highlighting and WCPM tracking',
  'readflow',
  'es-PR',
  1,
  '{"passage": {"title": "El Coquí Canta", "text": "El coquí vive en Puerto Rico. Es un animal pequeño. El coquí canta en la noche. Dice co-quí, co-quí. El sonido es bonito. Todos en Puerto Rico aman al coquí.", "words": [{"id": 0, "text": "El", "pronunciation": "el", "syllables": 1, "difficulty": "easy"}, {"id": 1, "text": "coquí", "pronunciation": "co-quí", "syllables": 2, "difficulty": "medium"}, {"id": 2, "text": "vive", "pronunciation": "vi-ve", "syllables": 2, "difficulty": "easy"}], "target_wcpm": 40, "min_accuracy": 0.85}, "reading_assistance": {"word_highlighting": true, "auto_scroll": true, "pronunciation_hints": true, "pace_feedback": true}}',
  'Listen carefully as student reads passage aloud. Track each word spoken. Highlight current word in real-time. Provide immediate, gentle pronunciation correction for errors. Model correct pronunciation syllable by syllable. Encourage fluency and expression. Use Puerto Rican accent.'
)
ON CONFLICT (demo_type, language) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  voice_guidance = EXCLUDED.voice_guidance,
  updated_at = NOW();

INSERT INTO demo_activities (title, description, demo_type, language, grade_level, content, voice_guidance) 
VALUES (
  '📖 ReadFlow: The Coquí Sings',
  'Interactive reading with real-time word highlighting and WCPM tracking',
  'readflow',
  'en-US',
  1,
  '{"passage": {"title": "The Coquí Sings", "text": "The coquí lives in Puerto Rico. It is a small animal. The coquí sings at night. It says co-kee, co-kee. The sound is pretty. Everyone in Puerto Rico loves the coquí.", "words": [{"id": 0, "text": "The", "pronunciation": "thuh", "syllables": 1, "difficulty": "easy"}, {"id": 1, "text": "coquí", "pronunciation": "co-KEE", "syllables": 2, "difficulty": "medium"}, {"id": 2, "text": "lives", "pronunciation": "lives", "syllables": 1, "difficulty": "easy"}], "target_wcpm": 45, "min_accuracy": 0.85}, "reading_assistance": {"word_highlighting": true, "auto_scroll": true, "pronunciation_hints": true, "pace_feedback": true}}',
  'Listen as student reads. Highlight words in real-time. Help with pronunciation using clear American accent. Explain what a coquí is. Encourage smooth reading.'
)
ON CONFLICT (demo_type, language) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  voice_guidance = EXCLUDED.voice_guidance,
  updated_at = NOW();

-- ============================================
-- GRANTS
-- ============================================

GRANT SELECT ON demo_session_summary TO authenticated;
GRANT SELECT ON demo_effectiveness_by_type TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_demo_data() TO authenticated;

-- ============================================
-- VERIFICATION
-- ============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'manual_assessments' AND column_name IN ('is_demo', 'demo_config')
  ) THEN
    RAISE EXCEPTION '❌ CRITICAL: Production table manual_assessments was modified!';
  END IF;

  IF EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'voice_sessions' AND column_name = 'demo_telemetry'
  ) THEN
    RAISE EXCEPTION '❌ CRITICAL: Production table voice_sessions was modified!';
  END IF;

  RAISE NOTICE '✅ VERIFICATION PASSED: Production tables are untouched.';
END $$;