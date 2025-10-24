-- Create lesson_ordering table for managing lesson/exercise display order
CREATE TABLE lesson_ordering (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_level INTEGER NOT NULL CHECK (grade_level >= 0 AND grade_level <= 5),
  assessment_id UUID NOT NULL REFERENCES manual_assessments(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL,
  parent_lesson_id UUID REFERENCES manual_assessments(id) ON DELETE CASCADE,
  domain_name TEXT,
  domain_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(grade_level, assessment_id),
  UNIQUE(grade_level, display_order)
);

-- Create indexes for performance
CREATE INDEX idx_lesson_ordering_grade ON lesson_ordering(grade_level, display_order);
CREATE INDEX idx_lesson_ordering_parent ON lesson_ordering(parent_lesson_id, display_order);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_lesson_ordering_updated_at
  BEFORE UPDATE ON lesson_ordering
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE lesson_ordering ENABLE ROW LEVEL SECURITY;

-- Teachers can manage lesson ordering (create, read, update, delete)
CREATE POLICY "Teachers manage lesson ordering"
  ON lesson_ordering FOR ALL
  USING (
    has_role(auth.uid(), 'teacher_english'::app_role) OR
    has_role(auth.uid(), 'teacher_spanish'::app_role) OR
    has_role(auth.uid(), 'school_director'::app_role)
  )
  WITH CHECK (
    has_role(auth.uid(), 'teacher_english'::app_role) OR
    has_role(auth.uid(), 'teacher_spanish'::app_role) OR
    has_role(auth.uid(), 'school_director'::app_role)
  );

-- Students can view lesson ordering
CREATE POLICY "Students view lesson ordering"
  ON lesson_ordering FOR SELECT
  USING (true);