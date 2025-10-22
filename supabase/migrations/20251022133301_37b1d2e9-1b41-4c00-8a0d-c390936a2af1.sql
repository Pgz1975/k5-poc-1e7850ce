-- Add parent_lesson_id and order_in_lesson for exercise linking
ALTER TABLE public.manual_assessments 
ADD COLUMN parent_lesson_id UUID REFERENCES public.manual_assessments(id) ON DELETE CASCADE,
ADD COLUMN order_in_lesson INTEGER;

CREATE INDEX idx_manual_assessments_parent ON public.manual_assessments(parent_lesson_id);

COMMENT ON COLUMN public.manual_assessments.parent_lesson_id IS 
'Links an exercise to its parent lesson. NULL for standalone exercises or lessons.';

COMMENT ON COLUMN public.manual_assessments.order_in_lesson IS 
'Position of exercise within parent lesson. NULL for standalone content.';

-- Update RLS: Students can view exercises from accessible lessons
CREATE POLICY "Students view exercises from accessible lessons" 
ON public.manual_assessments 
FOR SELECT 
TO authenticated
USING (
  parent_lesson_id IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.manual_assessments parent
    WHERE parent.id = manual_assessments.parent_lesson_id
    AND parent.status = 'published'
    AND can_access_grade_content(auth.uid(), parent.grade_level)
    AND can_access_language_content(auth.uid(), parent.language)
  )
);