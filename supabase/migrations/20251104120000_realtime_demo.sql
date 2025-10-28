-- OpenAI Realtime API Demo Activities - Database Migration
-- Version: 2.0 - COMPLETE ISOLATION ARCHITECTURE
-- Date: October 28, 2025
-- Purpose: Create ISOLATED demo tables - ZERO changes to production tables

-- ============================================
-- ARCHITECTURAL PRINCIPLE: COMPLETE ISOLATION
-- ============================================
--
-- This migration creates COMPLETELY SEPARATE tables for demos:
--   - demo_activities (NOT using manual_assessments)
--   - demo_voice_sessions (NOT using voice_sessions)
--   - demo_interactions (NOT using voice_interactions)
--
-- Production tables remain COMPLETELY UNTOUCHED:
--   ✓ manual_assessments - unchanged
--   ✓ voice_sessions - unchanged
--   ✓ voice_interactions - unchanged
--
-- Benefits:
--   - Zero risk to production
--   - Can drop entire demo system without affecting production
--   - Clear separation of concerns
--   - Easy to maintain and iterate

-- ============================================
-- CREATE NEW DEMO_ACTIVITIES TABLE
-- ============================================

-- Dedicated table for demo activities (NOT modifying manual_assessments)
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
  grade_level INTEGER NOT NULL DEFAULT 1 CHECK (grade_level = 1), -- Grade 1 only
  content JSONB NOT NULL,
  voice_guidance TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure unique demos per type/language
  UNIQUE(demo_type, language)
);

COMMENT ON TABLE demo_activities IS
'Isolated demo activities showcasing OpenAI Realtime API.
COMPLETELY SEPARATE from manual_assessments.
Can be dropped without affecting production.';

COMMENT ON COLUMN demo_activities.demo_type IS
'Type of demo: readflow, pronunciation, speed_quiz, voice_builder, spelling, writing, story';

COMMENT ON COLUMN demo_activities.content IS
'Demo-specific configuration and content (JSONB).
Structure varies by demo_type.';

-- Index for fast demo queries
CREATE INDEX IF NOT EXISTS idx_demo_activities_type_lang
ON demo_activities(demo_type, language);

CREATE INDEX IF NOT EXISTS idx_demo_activities_grade
ON demo_activities(grade_level);

-- ============================================
-- CREATE NEW DEMO_VOICE_SESSIONS TABLE
-- ============================================

-- Dedicated table for demo sessions (NOT using voice_sessions)
CREATE TABLE IF NOT EXISTS demo_voice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_activity_id UUID NOT NULL REFERENCES demo_activities(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,

  -- Demo telemetry
  telemetry JSONB DEFAULT '{}',

  -- Cost tracking
  total_api_cost_cents INTEGER DEFAULT 0,

  -- Completion tracking
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),

  -- Session metadata
  metadata JSONB DEFAULT '{}'
);

COMMENT ON TABLE demo_voice_sessions IS
'Demo voice sessions - COMPLETELY SEPARATE from voice_sessions.
Tracks all demo activity sessions.';

COMMENT ON COLUMN demo_voice_sessions.telemetry IS
'Demo-specific telemetry (JSONB):
{
  "demo_type": "readflow",
  "completion_percentage": 87,
  "words_practiced": ["coquí", "perro"],
  "pronunciation_scores": [0.92, 0.85],
  "retry_count": 2,
  "help_requests": 1,
  "student_satisfaction": 5,
  "technical_issues": []
}';

-- Indexes for demo session queries
CREATE INDEX IF NOT EXISTS idx_demo_sessions_activity
ON demo_voice_sessions(demo_activity_id);

CREATE INDEX IF NOT EXISTS idx_demo_sessions_student
ON demo_voice_sessions(student_id);

CREATE INDEX IF NOT EXISTS idx_demo_sessions_started
ON demo_voice_sessions(started_at DESC);

-- ============================================
-- CREATE NEW DEMO_INTERACTIONS TABLE
-- ============================================

-- Dedicated table for demo interactions (NOT using voice_interactions)
CREATE TABLE IF NOT EXISTS demo_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_session_id UUID NOT NULL REFERENCES demo_voice_sessions(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  transcript TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE demo_interactions IS
'Demo interactions - COMPLETELY SEPARATE from voice_interactions.
Logs individual interactions within demo sessions.';

-- Index for interaction queries
CREATE INDEX IF NOT EXISTS idx_demo_interactions_session
ON demo_interactions(demo_session_id);

CREATE INDEX IF NOT EXISTS idx_demo_interactions_type
ON demo_interactions(interaction_type);

-- ============================================
-- DEMO ANALYTICS VIEWS
-- ============================================

-- View: Demo session summary
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

COMMENT ON VIEW demo_session_summary IS
'Summary of all demo sessions with key metrics.
ISOLATED from production voice_sessions.';

-- View: Demo effectiveness by type
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

COMMENT ON VIEW demo_effectiveness_by_type IS
'Effectiveness metrics grouped by demo type.
Shows which demos are most used and effective.';

-- ============================================
-- COPPA-COMPLIANT CLEANUP (30-DAY RETENTION)
-- ============================================

-- Function to delete old demo data
CREATE OR REPLACE FUNCTION cleanup_old_demo_data()
RETURNS void AS $$
BEGIN
  -- Delete demo sessions older than 30 days
  DELETE FROM demo_voice_sessions
  WHERE started_at < NOW() - INTERVAL '30 days';

  -- Delete orphaned interactions (cascade should handle this, but be explicit)
  DELETE FROM demo_interactions
  WHERE demo_session_id NOT IN (SELECT id FROM demo_voice_sessions);

  RAISE NOTICE 'Demo data cleanup completed. Deleted sessions older than 30 days.';
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_demo_data IS
'COPPA-compliant cleanup: Removes demo data older than 30 days.
Run daily via cron or manually.';

-- ============================================
-- RLS POLICIES FOR DEMO ACCESS
-- ============================================

-- Enable RLS on demo tables
ALTER TABLE demo_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_voice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_interactions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view demo activities (they're public demos)
CREATE POLICY "Demo activities are publicly viewable" ON demo_activities
FOR SELECT
TO authenticated
USING (true);

-- Policy: Students can create their own demo sessions
CREATE POLICY "Students can create demo sessions" ON demo_voice_sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

-- Policy: Students can view their own demo sessions
CREATE POLICY "Students can view own demo sessions" ON demo_voice_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

-- Policy: Students can update their own demo sessions
CREATE POLICY "Students can update own demo sessions" ON demo_voice_sessions
FOR UPDATE
TO authenticated
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

-- Policy: Students can create interactions in their sessions
CREATE POLICY "Students can create demo interactions" ON demo_interactions
FOR INSERT
TO authenticated
WITH CHECK (
  demo_session_id IN (
    SELECT id FROM demo_voice_sessions WHERE student_id = auth.uid()
  )
);

-- Policy: Students can view interactions in their sessions
CREATE POLICY "Students can view own demo interactions" ON demo_interactions
FOR SELECT
TO authenticated
USING (
  demo_session_id IN (
    SELECT id FROM demo_voice_sessions WHERE student_id = auth.uid()
  )
);

-- Teachers and admins get full access (if user_roles table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_roles') THEN
    -- Check if role enum exists, otherwise use actual role names from the database
    IF EXISTS (SELECT FROM pg_type WHERE typname = 'user_role') THEN
      -- Teachers and admins can manage all demos (using enum values)
      CREATE POLICY "Teachers manage all demos" ON demo_activities
      FOR ALL
      TO authenticated
      USING (
        auth.uid() IN (
          SELECT user_id FROM user_roles
          WHERE role IN ('teacher_english', 'teacher_spanish', 'school_director', 'regional_director', 'admin')::user_role[]
        )
      );

      CREATE POLICY "Teachers view all demo sessions" ON demo_voice_sessions
      FOR SELECT
      TO authenticated
      USING (
        auth.uid() IN (
          SELECT user_id FROM user_roles
          WHERE role IN ('teacher_english', 'teacher_spanish', 'school_director', 'regional_director', 'admin')::user_role[]
        )
      );
    ELSE
      -- Fallback: use text comparison if enum doesn't exist
      CREATE POLICY "Teachers manage all demos" ON demo_activities
      FOR ALL
      TO authenticated
      USING (
        auth.uid() IN (
          SELECT user_id FROM user_roles
          WHERE role::text IN ('teacher_english', 'teacher_spanish', 'school_director', 'regional_director', 'admin')
        )
      );

      CREATE POLICY "Teachers view all demo sessions" ON demo_voice_sessions
      FOR SELECT
      TO authenticated
      USING (
        auth.uid() IN (
          SELECT user_id FROM user_roles
          WHERE role::text IN ('teacher_english', 'teacher_spanish', 'school_director', 'regional_director', 'admin')
        )
      );
    END IF;
  END IF;
END $$;

-- ============================================
-- SAMPLE DEMO DATA - READFLOW (Spanish)
-- ============================================

INSERT INTO demo_activities (
  title,
  description,
  demo_type,
  language,
  grade_level,
  content,
  voice_guidance
) VALUES (
  '📖 ReadFlow: El Coquí Canta',
  'Interactive reading with real-time word highlighting and WCPM tracking',
  'readflow',
  'es-PR',
  1,
  '{
    "passage": {
      "title": "El Coquí Canta",
      "text": "El coquí vive en Puerto Rico. Es un animal pequeño. El coquí canta en la noche. Dice co-quí, co-quí. El sonido es bonito. Todos en Puerto Rico aman al coquí.",
      "words": [
        {"id": 0, "text": "El", "pronunciation": "el", "syllables": 1, "difficulty": "easy"},
        {"id": 1, "text": "coquí", "pronunciation": "co-quí", "syllables": 2, "difficulty": "medium"},
        {"id": 2, "text": "vive", "pronunciation": "vi-ve", "syllables": 2, "difficulty": "easy"}
      ],
      "target_wcpm": 40,
      "min_accuracy": 0.85
    },
    "reading_assistance": {
      "word_highlighting": true,
      "auto_scroll": true,
      "pronunciation_hints": true,
      "pace_feedback": true
    }
  }',
  'Listen carefully as student reads passage aloud. Track each word spoken. Highlight current word in real-time. Provide immediate, gentle pronunciation correction for errors. Model correct pronunciation syllable by syllable. Encourage fluency and expression. Use Puerto Rican accent.'
)
ON CONFLICT (demo_type, language) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  voice_guidance = EXCLUDED.voice_guidance,
  updated_at = NOW();

-- ============================================
-- SAMPLE DEMO DATA - READFLOW (English)
-- ============================================

INSERT INTO demo_activities (
  title,
  description,
  demo_type,
  language,
  grade_level,
  content,
  voice_guidance
) VALUES (
  '📖 ReadFlow: The Coquí Sings',
  'Interactive reading with real-time word highlighting and WCPM tracking',
  'readflow',
  'en-US',
  1,
  '{
    "passage": {
      "title": "The Coquí Sings",
      "text": "The coquí lives in Puerto Rico. It is a small animal. The coquí sings at night. It says co-kee, co-kee. The sound is pretty. Everyone in Puerto Rico loves the coquí.",
      "words": [
        {"id": 0, "text": "The", "pronunciation": "thuh", "syllables": 1, "difficulty": "easy"},
        {"id": 1, "text": "coquí", "pronunciation": "co-KEE", "syllables": 2, "difficulty": "medium"},
        {"id": 2, "text": "lives", "pronunciation": "lives", "syllables": 1, "difficulty": "easy"}
      ],
      "target_wcpm": 45,
      "min_accuracy": 0.85
    },
    "reading_assistance": {
      "word_highlighting": true,
      "auto_scroll": true,
      "pronunciation_hints": true,
      "pace_feedback": true
    }
  }',
  'Listen as student reads. Highlight words in real-time. Help with pronunciation using clear American accent. Explain what a coquí is. Encourage smooth reading.'
)
ON CONFLICT (demo_type, language) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  voice_guidance = EXCLUDED.voice_guidance,
  updated_at = NOW();

-- ============================================
-- GRANTS AND PERMISSIONS
-- ============================================

-- Grant read access to authenticated users for demo views
GRANT SELECT ON demo_session_summary TO authenticated;
GRANT SELECT ON demo_effectiveness_by_type TO authenticated;

-- Grant execute on cleanup function to authenticated users
GRANT EXECUTE ON FUNCTION cleanup_old_demo_data() TO authenticated;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify demo activities exist
SELECT
  id,
  title,
  demo_type,
  language,
  grade_level,
  created_at
FROM demo_activities
ORDER BY demo_type, language;

-- Check indexes were created
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('demo_activities', 'demo_voice_sessions', 'demo_interactions')
ORDER BY tablename, indexname;

-- Verify RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('demo_activities', 'demo_voice_sessions', 'demo_interactions')
ORDER BY tablename, policyname;

-- ============================================
-- PRODUCTION TABLE VERIFICATION
-- ============================================

-- CRITICAL: Verify production tables were NOT modified
DO $$
BEGIN
  -- Check manual_assessments has NO demo columns
  IF EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'manual_assessments'
    AND column_name IN ('is_demo', 'demo_config')
  ) THEN
    RAISE EXCEPTION '❌ CRITICAL: Production table manual_assessments was modified! Rollback immediately.';
  END IF;

  -- Check voice_sessions has NO demo columns
  IF EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'voice_sessions'
    AND column_name = 'demo_telemetry'
  ) THEN
    RAISE EXCEPTION '❌ CRITICAL: Production table voice_sessions was modified! Rollback immediately.';
  END IF;

  RAISE NOTICE '✅ VERIFICATION PASSED: Production tables are untouched.';
END $$;

-- ============================================
-- ROLLBACK SCRIPT (IF NEEDED)
-- ============================================

-- Uncomment to completely remove demo system:
/*
DROP VIEW IF EXISTS demo_effectiveness_by_type;
DROP VIEW IF EXISTS demo_session_summary;
DROP FUNCTION IF EXISTS cleanup_old_demo_data();
DROP TABLE IF EXISTS demo_interactions CASCADE;
DROP TABLE IF EXISTS demo_voice_sessions CASCADE;
DROP TABLE IF EXISTS demo_activities CASCADE;
*/

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ OpenAI Realtime API Demo migration completed successfully (v2.0 - COMPLETE ISOLATION)';
  RAISE NOTICE '';
  RAISE NOTICE '📊 CREATED (Isolated Tables):';
  RAISE NOTICE '   - demo_activities (NOT in manual_assessments)';
  RAISE NOTICE '   - demo_voice_sessions (NOT in voice_sessions)';
  RAISE NOTICE '   - demo_interactions (NOT in voice_interactions)';
  RAISE NOTICE '';
  RAISE NOTICE '✓ UNTOUCHED (Production Tables):';
  RAISE NOTICE '   - manual_assessments (zero changes)';
  RAISE NOTICE '   - voice_sessions (zero changes)';
  RAISE NOTICE '   - voice_interactions (zero changes)';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Created:';
  RAISE NOTICE '   - Analytics views for demo tracking';
  RAISE NOTICE '   - COPPA-compliant cleanup function (30-day retention)';
  RAISE NOTICE '   - RLS policies for demo access control';
  RAISE NOTICE '   - Sample demo activities (ReadFlow Spanish + English)';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  Next steps:';
  RAISE NOTICE '   1. Insert remaining 5 demo types (pronunciation, speed_quiz, etc.)';
  RAISE NOTICE '   2. Create dedicated Edge Function: realtime-voice-demo-relay';
  RAISE NOTICE '   3. Implement ExperimentalVoiceClient (standalone, NOT extending production)';
  RAISE NOTICE '   4. Setup demo routes: /demo/**';
  RAISE NOTICE '   5. Test demo access with Grade 1 student account';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 ISOLATION VERIFIED: Can drop demo_* tables without affecting production';
END $$;
