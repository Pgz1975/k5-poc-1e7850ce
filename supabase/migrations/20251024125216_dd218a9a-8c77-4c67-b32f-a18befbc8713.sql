-- Add policy for teachers to view all published parent lessons in their language
CREATE POLICY "Teachers view published parent lessons"
ON manual_assessments
FOR SELECT
TO authenticated
USING (
  status = 'published' 
  AND parent_lesson_id IS NULL 
  AND can_access_language_content(auth.uid(), language)
  AND (
    has_role(auth.uid(), 'teacher_english'::app_role) 
    OR has_role(auth.uid(), 'teacher_spanish'::app_role)
    OR has_role(auth.uid(), 'school_director'::app_role)
  )
);