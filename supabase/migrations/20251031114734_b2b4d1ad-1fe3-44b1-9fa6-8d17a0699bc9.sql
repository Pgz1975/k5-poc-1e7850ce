-- Voice Session Monitoring Tables

-- Table to track all voice session metrics
CREATE TABLE IF NOT EXISTS public.voice_session_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  implementation_type TEXT NOT NULL CHECK (implementation_type IN ('websocket', 'webrtc')),
  language TEXT NOT NULL,
  activity_id TEXT,
  activity_type TEXT,
  
  -- Connection metrics
  connection_start_ms BIGINT NOT NULL,
  connection_established_ms BIGINT,
  connection_duration_ms BIGINT,
  connection_success BOOLEAN DEFAULT false,
  
  -- Performance metrics
  avg_latency_ms NUMERIC(10,2),
  p95_latency_ms NUMERIC(10,2),
  p99_latency_ms NUMERIC(10,2),
  buffer_underruns INTEGER DEFAULT 0,
  reconnection_attempts INTEGER DEFAULT 0,
  
  -- Audio metrics
  audio_chunks_sent INTEGER DEFAULT 0,
  audio_chunks_received INTEGER DEFAULT 0,
  total_audio_duration_ms BIGINT DEFAULT 0,
  
  -- Quality metrics
  transcript_accuracy_score NUMERIC(3,2), -- 0.00 to 1.00
  user_satisfaction_score NUMERIC(3,2), -- 0.00 to 1.00
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  session_ended_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Table to track errors
CREATE TABLE IF NOT EXISTS public.voice_session_errors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  implementation_type TEXT NOT NULL CHECK (implementation_type IN ('websocket', 'webrtc')),
  
  error_type TEXT NOT NULL,
  error_code TEXT,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  is_retryable BOOLEAN DEFAULT false,
  
  -- Context
  activity_id TEXT,
  activity_type TEXT,
  language TEXT,
  
  -- Timing
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Feature flag table for A/B testing
CREATE TABLE IF NOT EXISTS public.voice_feature_flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flag_name TEXT UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  
  -- Targeting
  target_grades INTEGER[],
  target_languages TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_voice_metrics_student ON public.voice_session_metrics(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voice_metrics_implementation ON public.voice_session_metrics(implementation_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voice_metrics_success ON public.voice_session_metrics(connection_success, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voice_errors_session ON public.voice_session_errors(session_id);
CREATE INDEX IF NOT EXISTS idx_voice_errors_type ON public.voice_session_errors(error_type, occurred_at DESC);

-- Enable RLS
ALTER TABLE public.voice_session_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_session_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_feature_flags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for metrics (teachers and admins can view all, students can view their own)
CREATE POLICY "Students can view own metrics"
  ON public.voice_session_metrics
  FOR SELECT
  USING (
    student_id = auth.uid()::text OR
    has_role(auth.uid(), 'teacher_english') OR
    has_role(auth.uid(), 'teacher_spanish') OR
    has_role(auth.uid(), 'school_director') OR
    has_role(auth.uid(), 'depr_executive')
  );

CREATE POLICY "System can insert metrics"
  ON public.voice_session_metrics
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update metrics"
  ON public.voice_session_metrics
  FOR UPDATE
  USING (true);

-- RLS Policies for errors (admins and teachers only)
CREATE POLICY "Teachers can view errors"
  ON public.voice_session_errors
  FOR SELECT
  USING (
    has_role(auth.uid(), 'teacher_english') OR
    has_role(auth.uid(), 'teacher_spanish') OR
    has_role(auth.uid(), 'school_director') OR
    has_role(auth.uid(), 'depr_executive')
  );

CREATE POLICY "System can insert errors"
  ON public.voice_session_errors
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for feature flags (admins only)
CREATE POLICY "Admins can manage feature flags"
  ON public.voice_feature_flags
  FOR ALL
  USING (
    has_role(auth.uid(), 'depr_executive') OR
    has_role(auth.uid(), 'school_director')
  );

CREATE POLICY "Anyone can read feature flags"
  ON public.voice_feature_flags
  FOR SELECT
  USING (true);

-- Insert initial feature flag for WebRTC rollout
INSERT INTO public.voice_feature_flags (flag_name, enabled, rollout_percentage, metadata)
VALUES (
  'voice_webrtc_migration',
  false,
  0,
  '{"description": "Gradual rollout of WebRTC voice implementation", "safe_rollback": true}'::jsonb
)
ON CONFLICT (flag_name) DO NOTHING;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_voice_metrics_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER voice_metrics_updated_at
  BEFORE UPDATE ON public.voice_session_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_voice_metrics_timestamp();

CREATE TRIGGER voice_flags_updated_at
  BEFORE UPDATE ON public.voice_feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION update_voice_metrics_timestamp();