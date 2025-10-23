-- Create model_usage_costs table for cost tracking
CREATE TABLE IF NOT EXISTS public.model_usage_costs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id),
  session_id UUID NOT NULL,
  model_type TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  estimated_cost DECIMAL(10, 6) DEFAULT 0,
  actual_cost DECIMAL(10, 6),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for model_usage_costs
CREATE INDEX IF NOT EXISTS idx_model_usage_costs_student ON public.model_usage_costs(student_id);
CREATE INDEX IF NOT EXISTS idx_model_usage_costs_session ON public.model_usage_costs(session_id);
CREATE INDEX IF NOT EXISTS idx_model_usage_costs_model ON public.model_usage_costs(model_type);
CREATE INDEX IF NOT EXISTS idx_model_usage_costs_created ON public.model_usage_costs(created_at);

-- Create model_switch_events table
CREATE TABLE IF NOT EXISTS public.model_switch_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id),
  session_id UUID NOT NULL,
  from_model TEXT,
  to_model TEXT NOT NULL,
  switch_reason TEXT,
  transcript_preserved BOOLEAN DEFAULT true,
  switched_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Add indexes for model_switch_events
CREATE INDEX IF NOT EXISTS idx_model_switch_events_student ON public.model_switch_events(student_id);
CREATE INDEX IF NOT EXISTS idx_model_switch_events_session ON public.model_switch_events(session_id);

-- Update voice_interactions table with new columns
ALTER TABLE public.voice_interactions
ADD COLUMN IF NOT EXISTS model_type TEXT,
ADD COLUMN IF NOT EXISTS cost_estimate DECIMAL(10, 6) DEFAULT 0;

-- Enable RLS on new tables
ALTER TABLE public.model_usage_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_switch_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for model_usage_costs
CREATE POLICY "Students can view own usage costs"
  ON public.model_usage_costs
  FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own usage costs"
  ON public.model_usage_costs
  FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own usage costs"
  ON public.model_usage_costs
  FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view all usage costs"
  ON public.model_usage_costs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('teacher_english', 'teacher_spanish', 'school_director', 'regional_director')
    )
  );

-- RLS policies for model_switch_events
CREATE POLICY "Students can view own switch events"
  ON public.model_switch_events
  FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own switch events"
  ON public.model_switch_events
  FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can view all switch events"
  ON public.model_switch_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('teacher_english', 'teacher_spanish', 'school_director', 'regional_director')
    )
  );