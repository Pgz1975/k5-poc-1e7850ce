-- Migration: Add student grade-level roles
-- This migration adds specific student roles for each grade level (K-5)
-- and updates related functions and policies

-- Step 1: Add new enum values to existing app_role type
-- PostgreSQL allows adding enum values without dropping the type
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'student_kindergarten';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'student_1';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'student_2';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'student_3';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'student_4';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'student_5';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'teacher_english';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'teacher_spanish';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'school_director';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'regional_director';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'spanish_program_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'english_program_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'depr_executive';

-- Step 2: Add grade_level column to profiles if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS grade_level integer CHECK (grade_level >= 0 AND grade_level <= 5);

-- Step 3: Add assigned_region column for regional directors
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS assigned_region text CHECK (assigned_region IN ('San Juan', 'Bayamón', 'Arecibo', 'Mayagüez', 'Ponce', 'Caguas', 'Humacao'));

-- Step 4: Add school_id for school-level users
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS school_id uuid;

-- Step 5: Add language_specialization for teachers
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS language_specialization language_code;

-- Step 6: Create or replace helper function to get user's grade level
CREATE OR REPLACE FUNCTION public.get_user_grade_level(user_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
  user_grade integer;
BEGIN
  -- Get the user's role
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_roles.user_id = get_user_grade_level.user_id
  LIMIT 1;

  -- Get grade level from profile
  SELECT grade_level INTO user_grade
  FROM public.profiles
  WHERE id = get_user_grade_level.user_id;

  -- Return grade based on role or profile
  CASE user_role
    WHEN 'student_kindergarten' THEN RETURN 0;
    WHEN 'student_1' THEN RETURN 1;
    WHEN 'student_2' THEN RETURN 2;
    WHEN 'student_3' THEN RETURN 3;
    WHEN 'student_4' THEN RETURN 4;
    WHEN 'student_5' THEN RETURN 5;
    ELSE RETURN COALESCE(user_grade, 0);
  END CASE;
END;
$$;

-- Step 7: Create function to check if user can access grade-level content
CREATE OR REPLACE FUNCTION public.can_access_grade_content(user_id uuid, content_grade_level integer)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
  user_grade_level integer;
BEGIN
  -- Get the user's role
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_roles.user_id = can_access_grade_content.user_id
  LIMIT 1;

  -- Administrators and directors can access all grades
  IF user_role IN ('depr_executive', 'spanish_program_admin', 'english_program_admin',
                    'regional_director', 'school_director', 'teacher_english', 'teacher_spanish') THEN
    RETURN true;
  END IF;

  -- Parents can access their children's grade levels (handled separately)
  IF user_role = 'family' THEN
    RETURN true;
  END IF;

  -- Students can only access their grade level
  user_grade_level := public.get_user_grade_level(user_id);
  RETURN user_grade_level = content_grade_level;
END;
$$;

-- Step 8: Create function to check if user can access language-specific content
CREATE OR REPLACE FUNCTION public.can_access_language_content(user_id uuid, content_language language_code)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
  teacher_lang language_code;
BEGIN
  -- Get the user's role
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_roles.user_id = can_access_language_content.user_id
  LIMIT 1;

  -- Students, families, and top-level admins can access both languages
  IF user_role IN ('student', 'student_kindergarten', 'student_1', 'student_2',
                    'student_3', 'student_4', 'student_5', 'family',
                    'depr_executive', 'school_director', 'regional_director') THEN
    RETURN true;
  END IF;

  -- Spanish program admin can only access Spanish content
  IF user_role = 'spanish_program_admin' THEN
    RETURN content_language = 'es';
  END IF;

  -- English program admin can only access English content
  IF user_role = 'english_program_admin' THEN
    RETURN content_language = 'en';
  END IF;

  -- Teachers can only access content in their specialization
  IF user_role IN ('teacher_english', 'teacher_spanish') THEN
    SELECT language_specialization INTO teacher_lang
    FROM public.profiles
    WHERE id = can_access_language_content.user_id;

    IF teacher_lang IS NULL THEN
      -- Fallback to role-based language for backwards compatibility
      RETURN (user_role = 'teacher_english' AND content_language = 'en') OR
             (user_role = 'teacher_spanish' AND content_language = 'es');
    END IF;

    RETURN teacher_lang = content_language;
  END IF;

  -- Default: allow access
  RETURN true;
END;
$$;

-- Step 9: Update manual_assessments policies (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'manual_assessments') THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Students can view published assessments" ON public.manual_assessments;
    DROP POLICY IF EXISTS "Teachers can view own assessments" ON public.manual_assessments;
    DROP POLICY IF EXISTS "Teachers can create assessments" ON public.manual_assessments;
    DROP POLICY IF EXISTS "Teachers can update own assessments" ON public.manual_assessments;
    DROP POLICY IF EXISTS "Teachers can delete own assessments" ON public.manual_assessments;
    DROP POLICY IF EXISTS "Students view grade-appropriate assessments" ON public.manual_assessments;
    DROP POLICY IF EXISTS "Teachers manage their assessments" ON public.manual_assessments;
    DROP POLICY IF EXISTS "Teachers manage assessments in their language" ON public.manual_assessments;
    DROP POLICY IF EXISTS "Directors view all assessments" ON public.manual_assessments;
    DROP POLICY IF EXISTS "Directors view assessments in their scope" ON public.manual_assessments;

    -- Create new policies
    CREATE POLICY "Students view grade-appropriate assessments"
    ON public.manual_assessments FOR SELECT TO authenticated
    USING (
      status = 'published'
      AND public.can_access_grade_content(auth.uid(), grade_level)
      AND public.can_access_language_content(auth.uid(), language)
    );

    CREATE POLICY "Teachers manage their assessments"
    ON public.manual_assessments FOR ALL TO authenticated
    USING (created_by = auth.uid())
    WITH CHECK (
      created_by = auth.uid()
      AND public.can_access_language_content(auth.uid(), language)
    );

    CREATE POLICY "Directors view all assessments"
    ON public.manual_assessments FOR SELECT TO authenticated
    USING (
      public.has_role(auth.uid(), 'school_director'::app_role)
      OR public.has_role(auth.uid(), 'regional_director'::app_role)
      OR public.has_role(auth.uid(), 'spanish_program_admin'::app_role)
      OR public.has_role(auth.uid(), 'english_program_admin'::app_role)
      OR public.has_role(auth.uid(), 'depr_executive'::app_role)
    );
  END IF;
END $$;

-- Step 10: Update pdf_documents policies
DO $$
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Users can view their own uploaded documents" ON public.pdf_documents;
  DROP POLICY IF EXISTS "Users view accessible documents" ON public.pdf_documents;

  -- Create new policy with grade-level filtering
  CREATE POLICY "Users view accessible documents"
  ON public.pdf_documents FOR SELECT TO authenticated
  USING (
    uploaded_by = auth.uid()
    OR (
      -- Check if user's grade level is in the document's grade_level array
      grade_level @> ARRAY[public.get_user_grade_level(auth.uid())]
      AND public.can_access_language_content(auth.uid(), primary_language)
    )
    OR public.has_role(auth.uid(), 'school_director'::app_role)
    OR public.has_role(auth.uid(), 'regional_director'::app_role)
    OR public.has_role(auth.uid(), 'spanish_program_admin'::app_role)
    OR public.has_role(auth.uid(), 'english_program_admin'::app_role)
    OR public.has_role(auth.uid(), 'depr_executive'::app_role)
  );
END $$;

-- Step 11: Add comments for documentation
COMMENT ON FUNCTION public.get_user_grade_level IS 'Returns the grade level (0-5) for a given user based on their role or profile';
COMMENT ON FUNCTION public.can_access_grade_content IS 'Checks if a user can access content for a specific grade level based on their role';
COMMENT ON FUNCTION public.can_access_language_content IS 'Checks if a user can access content in a specific language based on their role and specialization';