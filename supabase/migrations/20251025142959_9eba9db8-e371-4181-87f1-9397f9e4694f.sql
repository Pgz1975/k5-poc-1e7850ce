-- Coquí Voice Integration - Demo Metrics Table
-- Simplified schema for tracking demo phase metrics

-- Create demo_metrics table for tracking session usage and costs
CREATE TABLE IF NOT EXISTS demo_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES voice_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  
  -- Session details
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_ms INTEGER,
  
  -- Inactivity tracking
  inactivity_warnings INTEGER DEFAULT 0,
  inactivity_triggered BOOLEAN DEFAULT false,
  timeout_at TIMESTAMPTZ,
  
  -- Cost estimates (tracking only, not enforced)
  estimated_cost_cents NUMERIC(10,4),
  
  -- Activity metadata
  activity_id UUID REFERENCES manual_assessments(id) ON DELETE SET NULL,
  language TEXT CHECK (language IN ('es-PR', 'en-US')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for student lookups
CREATE INDEX IF NOT EXISTS idx_demo_metrics_student ON demo_metrics(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_metrics_session ON demo_metrics(session_id);

-- Enable RLS
ALTER TABLE demo_metrics ENABLE ROW LEVEL SECURITY;

-- Students can view their own metrics
CREATE POLICY "Students view own demo metrics" ON demo_metrics
  FOR SELECT USING (auth.uid() = student_id);

-- System can insert/update metrics
CREATE POLICY "System manage demo metrics" ON demo_metrics
  FOR ALL USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_demo_metrics_updated_at
  BEFORE UPDATE ON demo_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();