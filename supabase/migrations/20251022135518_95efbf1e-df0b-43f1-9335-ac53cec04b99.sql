-- Fix infinite recursion in manual_assessments RLS policies

-- Drop the problematic policy
DROP POLICY IF EXISTS "Students view exercises from accessible lessons" ON public.manual_assessments;

-- Create a security definer function to check parent lesson accessibility
CREATE OR REPLACE FUNCTION public.can_access_parent_lesson(_exercise_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _parent_lesson_id uuid;
  _parent_grade_level integer;
  _parent_language language_code;
  _parent_status text;
BEGIN
  -- Get the parent lesson details for this exercise
  SELECT parent_lesson_id INTO _parent_lesson_id
  FROM manual_assessments
  WHERE id = _exercise_id;
  
  -- If no parent lesson, return false
  IF _parent_lesson_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get parent lesson attributes
  SELECT grade_level, language, status 
  INTO _parent_grade_level, _parent_language, _parent_status
  FROM manual_assessments
  WHERE id = _parent_lesson_id;
  
  -- Check if user can access based on grade, language, and published status
  RETURN _parent_status = 'published' 
    AND can_access_grade_content(_user_id, _parent_grade_level)
    AND can_access_language_content(_user_id, _parent_language);
END;
$$;

-- Recreate the policy using the security definer function
CREATE POLICY "Students view exercises from accessible lessons"
ON public.manual_assessments
FOR SELECT
TO authenticated
USING (
  parent_lesson_id IS NOT NULL 
  AND can_access_parent_lesson(id, auth.uid())
);