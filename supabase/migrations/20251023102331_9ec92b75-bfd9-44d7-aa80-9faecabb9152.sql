-- Create completed_activity table for tracking student progress
CREATE TABLE public.completed_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES manual_assessments(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('lesson', 'exercise', 'assessment')),
  score DECIMAL(5,2) NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  duration_seconds INTEGER NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX idx_completed_activity_student ON completed_activity(student_id);
CREATE INDEX idx_completed_activity_type ON completed_activity(activity_type);
CREATE INDEX idx_completed_activity_completed_at ON completed_activity(completed_at DESC);

-- Enable RLS
ALTER TABLE public.completed_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Students can view own completed activities"
  ON public.completed_activity FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own completed activities"
  ON public.completed_activity FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Add learning_languages array field to profiles
ALTER TABLE public.profiles 
ADD COLUMN learning_languages TEXT[] DEFAULT ARRAY['es', 'en'];

-- Add check constraint for valid languages
ALTER TABLE public.profiles
ADD CONSTRAINT valid_learning_languages 
CHECK (learning_languages <@ ARRAY['es', 'en']::TEXT[]);

-- Populate grade_level based on user roles (explicit enum checks)
UPDATE public.profiles p
SET grade_level = CASE 
  WHEN ur.role = 'student_kindergarten' THEN 0
  WHEN ur.role = 'student_1' THEN 1
  WHEN ur.role = 'student_2' THEN 2
  WHEN ur.role = 'student_3' THEN 3
  WHEN ur.role = 'student_4' THEN 4
  WHEN ur.role = 'student_5' THEN 5
  ELSE p.grade_level
END
FROM public.user_roles ur
WHERE p.id = ur.user_id
  AND ur.role IN ('student_kindergarten', 'student_1', 'student_2', 'student_3', 'student_4', 'student_5')
  AND p.grade_level IS NULL;