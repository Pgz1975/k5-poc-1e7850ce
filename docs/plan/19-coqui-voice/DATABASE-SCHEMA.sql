-- Coqui Voice Integration - Complete Database Schema
-- Version: 1.0
-- Date: October 25, 2025

-- ============================================
-- CORE TABLES
-- ============================================

-- Configuration extension for manual_assessments
ALTER TABLE manual_assessments ADD COLUMN IF NOT EXISTS
  coqui_config JSONB DEFAULT '{
    "interaction_triggers": {
      "spontaneous_at_start": true,
      "inactivity_threshold_ms": 10000,
      "max_inactivity_prompts": 2,
      "help_button_enabled": true
    },
    "guidance_strategy": {
      "hint_progression": [],
      "max_hints": 3,
      "difficulty_adaptation": "auto",
      "guidance_style": "socratic"
    },
    "pronunciation_targets": [],
    "success_celebration_level": "brief",
    "language_specific": {
      "use_code_switching": false,
      "primary_language": "es",
      "support_language": "en"
    }
  }';

-- Main interaction tracking table
CREATE TABLE IF NOT EXISTS coqui_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES voice_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES manual_assessments(id) ON DELETE SET NULL,

  -- Interaction details
  interaction_type TEXT NOT NULL CHECK (interaction_type IN (
    'spontaneous',
    'help_requested',
    'inactivity_prompt',
    'struggle_detection',
    'celebration',
    'correction'
  )),
  trigger_reason TEXT,
  trigger_metadata JSONB,

  -- Context snapshot at time of interaction
  context_snapshot JSONB NOT NULL,
  student_state JSONB,

  -- Prompts and responses
  prompt_used TEXT,
  prompt_tokens INTEGER,
  ai_response_summary TEXT,
  response_tokens INTEGER,

  -- Transcriptions (anonymized)
  transcription_student TEXT,
  transcription_ai TEXT,

  -- Pedagogical metrics
  hints_given INTEGER DEFAULT 0,
  hint_effectiveness INTEGER CHECK (hint_effectiveness BETWEEN 0 AND 100),
  guidance_level TEXT CHECK (guidance_level IN ('minimal', 'moderate', 'extensive')),

  -- Performance metrics
  duration_ms INTEGER NOT NULL,
  latency_ms INTEGER,
  token_count INTEGER,
  estimated_cost_cents NUMERIC(10,4) NOT NULL,

  -- Effectiveness scoring
  effectiveness_score INTEGER CHECK (effectiveness_score BETWEEN 0 AND 100),
  student_satisfaction INTEGER CHECK (student_satisfaction BETWEEN 1 AND 5),
  educational_value INTEGER CHECK (educational_value BETWEEN 1 AND 5),

  -- Privacy & Compliance
  retention_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  parent_accessible BOOLEAN DEFAULT true,
  anonymized BOOLEAN DEFAULT false,
  coppa_compliant BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Indexes for performance
  INDEX idx_student_activity (student_id, activity_id),
  INDEX idx_session (session_id),
  INDEX idx_created (created_at DESC),
  INDEX idx_retention (retention_expires_at)
);

-- Cost tracking and optimization
CREATE TABLE IF NOT EXISTS voice_cost_optimization (
  student_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Budget management
  yearly_budget_cents INTEGER DEFAULT 500,
  spent_cents NUMERIC(10,4) DEFAULT 0,
  reserved_cents NUMERIC(10,4) DEFAULT 0,

  -- Period tracking
  current_period_start DATE DEFAULT CURRENT_DATE,
  current_period_end DATE DEFAULT (CURRENT_DATE + INTERVAL '1 year'),

  -- Usage statistics
  total_sessions INTEGER DEFAULT 0,
  total_duration_ms INTEGER DEFAULT 0,
  avg_session_duration_ms INTEGER,
  avg_session_cost_cents NUMERIC(10,4),
  last_session_cost_cents NUMERIC(10,4),
  last_session_date TIMESTAMPTZ,

  -- Optimization settings
  optimization_level TEXT DEFAULT 'standard' CHECK (optimization_level IN (
    'premium',    -- Full features, normal speed
    'standard',   -- Balanced features and cost
    'reduced',    -- Limited features, faster speed
    'minimal'     -- Bare minimum, maximum savings
  )),

  -- Alert management
  cost_alerts_sent INTEGER DEFAULT 0,
  last_alert_date TIMESTAMPTZ,
  alert_threshold_percent INTEGER DEFAULT 80,

  -- Performance metrics
  successful_sessions INTEGER DEFAULT 0,
  failed_sessions INTEGER DEFAULT 0,
  effectiveness_rating NUMERIC(3,2),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student adaptation and learning metrics
CREATE TABLE IF NOT EXISTS student_adaptation_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES manual_assessments(id) ON DELETE CASCADE,

  -- Adaptation level
  adaptation_level TEXT NOT NULL CHECK (adaptation_level IN (
    'learning',    -- New to concept, needs maximum support
    'practicing',  -- Understanding basics, building confidence
    'mastering',   -- Strong understanding, minimal support
    'struggling',  -- Having difficulty, needs intervention
    'advanced'     -- Beyond grade level, needs challenges
  )),

  -- Performance metrics
  hints_needed INTEGER DEFAULT 0,
  hints_effectiveness NUMERIC(5,2),
  attempts_count INTEGER DEFAULT 0,
  correct_attempts INTEGER DEFAULT 0,
  success_rate NUMERIC(5,2),

  -- Time metrics
  avg_response_time_ms INTEGER,
  total_time_spent_ms INTEGER,
  fastest_correct_ms INTEGER,
  slowest_correct_ms INTEGER,

  -- Struggle indicators
  struggle_points JSONB DEFAULT '[]',
  confusion_patterns JSONB DEFAULT '[]',
  common_errors JSONB DEFAULT '[]',

  -- Learning trajectory
  improvement_rate NUMERIC(5,2),
  mastery_score NUMERIC(5,2),
  confidence_score NUMERIC(5,2),

  -- Recommendations
  recommended_guidance_level TEXT,
  recommended_difficulty TEXT,
  suggested_interventions JSONB DEFAULT '[]',

  -- Timestamps
  first_attempt_at TIMESTAMPTZ,
  last_interaction_at TIMESTAMPTZ,
  mastery_achieved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint for student-activity pair
  UNIQUE(student_id, activity_id)
);

-- WCPM (Words Correct Per Minute) assessment results
CREATE TABLE IF NOT EXISTS wcpm_assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES manual_assessments(id) ON DELETE SET NULL,
  session_id UUID REFERENCES voice_sessions(id) ON DELETE SET NULL,

  -- Assessment details
  passage_text TEXT NOT NULL,
  passage_word_count INTEGER NOT NULL,
  grade_level INTEGER NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('es', 'en')),

  -- Performance metrics
  words_per_minute NUMERIC(5,2) NOT NULL,
  target_wpm NUMERIC(5,2) NOT NULL,
  accuracy_percentage NUMERIC(5,2) NOT NULL,

  -- Error tracking
  total_errors INTEGER DEFAULT 0,
  pronunciation_errors JSONB DEFAULT '[]',
  fluency_errors JSONB DEFAULT '[]',
  self_corrections INTEGER DEFAULT 0,

  -- Detailed metrics
  reading_duration_seconds NUMERIC(10,2),
  pause_count INTEGER DEFAULT 0,
  avg_pause_duration_ms INTEGER,

  -- Coqui interventions
  coqui_corrections_given INTEGER DEFAULT 0,
  coqui_encouragements_given INTEGER DEFAULT 0,
  intervention_effectiveness INTEGER CHECK (intervention_effectiveness BETWEEN 0 AND 100),

  -- Performance rating
  performance_level TEXT CHECK (performance_level IN (
    'above_target',
    'on_target',
    'approaching_target',
    'needs_practice',
    'needs_intervention'
  )),

  -- Recommendations
  recommended_practice JSONB,
  focus_areas JSONB DEFAULT '[]',

  -- Timestamps
  assessment_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hint progression tracking
CREATE TABLE IF NOT EXISTS hint_progression (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES manual_assessments(id) ON DELETE CASCADE,

  -- Hint details
  hint_level INTEGER NOT NULL CHECK (hint_level BETWEEN 1 AND 5),
  hint_text TEXT NOT NULL,
  hint_type TEXT CHECK (hint_type IN (
    'contextual',
    'elimination',
    'partial_reveal',
    'phonetic',
    'visual',
    'example'
  )),

  -- Language versions
  hint_text_es TEXT,
  hint_text_en TEXT,

  -- Effectiveness tracking
  times_used INTEGER DEFAULT 0,
  effectiveness_score NUMERIC(5,2),
  led_to_correct_answer INTEGER DEFAULT 0,

  -- Configuration
  auto_trigger_after_seconds INTEGER,
  requires_wrong_attempts INTEGER,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ordering
  UNIQUE(activity_id, hint_level)
);

-- Session performance analytics
CREATE TABLE IF NOT EXISTS coqui_session_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES voice_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Session metrics
  total_interactions INTEGER DEFAULT 0,
  spontaneous_count INTEGER DEFAULT 0,
  help_requested_count INTEGER DEFAULT 0,
  inactivity_prompt_count INTEGER DEFAULT 0,

  -- Engagement metrics
  engagement_score NUMERIC(5,2),
  participation_rate NUMERIC(5,2),
  response_quality NUMERIC(5,2),

  -- Learning metrics
  concepts_covered JSONB DEFAULT '[]',
  skills_practiced JSONB DEFAULT '[]',
  learning_objectives_met JSONB DEFAULT '[]',

  -- Cost metrics
  total_cost_cents NUMERIC(10,4),
  cost_per_interaction NUMERIC(10,4),
  cost_effectiveness_score NUMERIC(5,2),

  -- Timestamps
  session_start TIMESTAMPTZ,
  session_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_interactions_student_date ON coqui_interactions(student_id, created_at DESC);
CREATE INDEX idx_interactions_activity ON coqui_interactions(activity_id);
CREATE INDEX idx_interactions_type ON coqui_interactions(interaction_type);
CREATE INDEX idx_interactions_session ON coqui_interactions(session_id);

CREATE INDEX idx_adaptation_student ON student_adaptation_metrics(student_id);
CREATE INDEX idx_adaptation_activity ON student_adaptation_metrics(activity_id);
CREATE INDEX idx_adaptation_level ON student_adaptation_metrics(adaptation_level);

CREATE INDEX idx_wcpm_student ON wcpm_assessment_results(student_id);
CREATE INDEX idx_wcpm_date ON wcpm_assessment_results(assessment_date DESC);

CREATE INDEX idx_cost_optimization_student ON voice_cost_optimization(student_id);
CREATE INDEX idx_cost_optimization_level ON voice_cost_optimization(optimization_level);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE coqui_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_cost_optimization ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_adaptation_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE wcpm_assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE hint_progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE coqui_session_analytics ENABLE ROW LEVEL SECURITY;

-- Students can view their own data
CREATE POLICY "Students view own interactions" ON coqui_interactions
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students view own cost data" ON voice_cost_optimization
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students view own adaptation metrics" ON student_adaptation_metrics
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students view own WCPM results" ON wcpm_assessment_results
  FOR SELECT USING (auth.uid() = student_id);

-- Teachers can view all student data
CREATE POLICY "Teachers view all interactions" ON coqui_interactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers view all cost data" ON voice_cost_optimization
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers modify adaptation metrics" ON student_adaptation_metrics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

-- Parents can view their children's data
CREATE POLICY "Parents view children interactions" ON coqui_interactions
  FOR SELECT USING (
    parent_accessible = true
    AND EXISTS (
      SELECT 1 FROM family_relationships
      WHERE parent_id = auth.uid()
      AND student_id = coqui_interactions.student_id
    )
  );

-- System can insert/update all data
CREATE POLICY "System manage interactions" ON coqui_interactions
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'system'
  ));

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coqui_interactions_updated_at
  BEFORE UPDATE ON coqui_interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voice_cost_optimization_updated_at
  BEFORE UPDATE ON voice_cost_optimization
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_adaptation_metrics_updated_at
  BEFORE UPDATE ON student_adaptation_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-delete expired interactions (GDPR/COPPA compliance)
CREATE OR REPLACE FUNCTION delete_expired_interactions()
RETURNS void AS $$
BEGIN
  DELETE FROM coqui_interactions
  WHERE retention_expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (run daily)
SELECT cron.schedule(
  'delete-expired-coqui-interactions',
  '0 2 * * *', -- 2 AM daily
  'SELECT delete_expired_interactions();'
);

-- Calculate and update adaptation level
CREATE OR REPLACE FUNCTION update_adaptation_level()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.success_rate > 0.8 AND NEW.hints_needed < 2 THEN
    NEW.adaptation_level = 'mastering';
  ELSIF NEW.success_rate > 0.6 THEN
    NEW.adaptation_level = 'practicing';
  ELSIF NEW.success_rate < 0.4 THEN
    NEW.adaptation_level = 'struggling';
  ELSE
    NEW.adaptation_level = 'learning';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_adaptation_level
  BEFORE INSERT OR UPDATE ON student_adaptation_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_adaptation_level();

-- ============================================
-- INITIAL DATA MIGRATION
-- ============================================

-- Migrate existing voice_guidance to coqui_config
UPDATE manual_assessments
SET coqui_config = jsonb_build_object(
  'interaction_triggers', jsonb_build_object(
    'spontaneous_at_start', type = 'lesson',
    'inactivity_threshold_ms', 10000,
    'max_inactivity_prompts', 2,
    'help_button_enabled', true
  ),
  'guidance_strategy', jsonb_build_object(
    'hint_progression', ARRAY[]::text[],
    'max_hints', 3,
    'difficulty_adaptation', 'auto',
    'existing_guidance', voice_guidance
  )
)
WHERE voice_guidance IS NOT NULL;

-- Initialize cost tracking for existing students
INSERT INTO voice_cost_optimization (student_id)
SELECT DISTINCT student_id
FROM voice_sessions
ON CONFLICT (student_id) DO NOTHING;

-- ============================================
-- PERMISSIONS GRANTS
-- ============================================

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE coqui_interactions IS 'Tracks all Coqui voice assistant interactions with students';
COMMENT ON TABLE voice_cost_optimization IS 'Manages per-student voice API cost tracking and optimization';
COMMENT ON TABLE student_adaptation_metrics IS 'Tracks student learning progress and adaptation levels per activity';
COMMENT ON TABLE wcpm_assessment_results IS 'Stores Words Correct Per Minute reading assessment results';
COMMENT ON TABLE hint_progression IS 'Defines progressive hint sequences for each activity';
COMMENT ON TABLE coqui_session_analytics IS 'Aggregated analytics for voice sessions';

COMMENT ON COLUMN coqui_interactions.interaction_type IS 'Type of interaction trigger';
COMMENT ON COLUMN voice_cost_optimization.optimization_level IS 'Cost optimization level affecting feature availability';
COMMENT ON COLUMN student_adaptation_metrics.adaptation_level IS 'Current learning adaptation level for personalized guidance';