-- Store existing data
DO $$
DECLARE
  roles_backup jsonb;
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_roles') THEN
    SELECT jsonb_agg(row_to_json(user_roles)) INTO roles_backup FROM public.user_roles;
    CREATE TEMP TABLE IF NOT EXISTS role_backup (data jsonb);
    TRUNCATE role_backup;
    INSERT INTO role_backup VALUES (roles_backup);
  END IF;
END $$;

-- Drop cascade removes user_roles table
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Recreate enum
CREATE TYPE public.app_role AS ENUM (
  'student', 'student_kindergarten', 'student_1', 'student_2', 'student_3', 'student_4', 'student_5',
  'family', 'teacher_english', 'teacher_spanish', 'school_director', 'regional_director',
  'spanish_program_admin', 'english_program_admin', 'depr_executive'
);

-- Recreate table (no IF NOT EXISTS since CASCADE dropped it)
DROP TABLE IF EXISTS public.user_roles;
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Restore data
DO $$
DECLARE backup_data jsonb; role_record jsonb;
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'pg_temp' AND tablename = 'role_backup') THEN
    SELECT data INTO backup_data FROM role_backup;
    IF backup_data IS NOT NULL THEN
      FOR role_record IN SELECT * FROM jsonb_array_elements(backup_data) LOOP
        BEGIN
          INSERT INTO public.user_roles (user_id, created_at, role)
          VALUES ((role_record->>'user_id')::uuid, (role_record->>'created_at')::timestamp with time zone, 
                  (role_record->>'role')::text::app_role)
          ON CONFLICT (user_id, role) DO NOTHING;
        EXCEPTION WHEN OTHERS THEN CONTINUE;
        END;
      END LOOP;
    END IF;
  END IF;
END $$;

-- RLS Policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role during signup" ON public.user_roles
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Helper functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

-- Extend profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS grade_level integer CHECK (grade_level >= 0 AND grade_level <= 5),
ADD COLUMN IF NOT EXISTS assigned_region text CHECK (assigned_region IN ('San Juan', 'Bayamón', 'Arecibo', 'Mayagüez', 'Ponce', 'Caguas', 'Humacao')),
ADD COLUMN IF NOT EXISTS school_id uuid,
ADD COLUMN IF NOT EXISTS language_specialization language_code;

CREATE OR REPLACE FUNCTION public.get_user_grade_level(user_id uuid)
RETURNS integer LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE user_role app_role; user_grade integer;
BEGIN
  SELECT role INTO user_role FROM public.user_roles WHERE user_roles.user_id = get_user_grade_level.user_id LIMIT 1;
  SELECT grade_level INTO user_grade FROM public.profiles WHERE id = get_user_grade_level.user_id;
  RETURN CASE user_role
    WHEN 'student_kindergarten' THEN 0 WHEN 'student_1' THEN 1 WHEN 'student_2' THEN 2
    WHEN 'student_3' THEN 3 WHEN 'student_4' THEN 4 WHEN 'student_5' THEN 5
    ELSE user_grade END;
END; $$;

CREATE OR REPLACE FUNCTION public.can_access_grade_content(user_id uuid, content_grade_level integer)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE user_role app_role;
BEGIN
  SELECT role INTO user_role FROM public.user_roles WHERE user_roles.user_id = can_access_grade_content.user_id LIMIT 1;
  IF user_role IN ('depr_executive', 'spanish_program_admin', 'english_program_admin', 
                    'regional_director', 'school_director', 'teacher_english', 'teacher_spanish') THEN
    RETURN true;
  END IF;
  RETURN public.get_user_grade_level(user_id) = content_grade_level;
END; $$;

CREATE OR REPLACE FUNCTION public.can_access_language_content(user_id uuid, content_language language_code)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE user_role app_role; teacher_lang language_code;
BEGIN
  SELECT role INTO user_role FROM public.user_roles WHERE user_roles.user_id = can_access_language_content.user_id LIMIT 1;
  IF user_role IN ('student', 'student_kindergarten', 'student_1', 'student_2', 'student_3', 'student_4', 'student_5', 
                    'family', 'depr_executive', 'school_director', 'regional_director') THEN RETURN true; END IF;
  IF user_role = 'spanish_program_admin' THEN RETURN content_language = 'es'; END IF;
  IF user_role = 'english_program_admin' THEN RETURN content_language = 'en'; END IF;
  IF user_role IN ('teacher_english', 'teacher_spanish') THEN
    SELECT language_specialization INTO teacher_lang FROM public.profiles WHERE id = can_access_language_content.user_id;
    RETURN teacher_lang = content_language;
  END IF;
  RETURN true;
END; $$;

-- Update manual_assessments policies
DROP POLICY IF EXISTS "Students can view published assessments" ON public.manual_assessments;
DROP POLICY IF EXISTS "Teachers can view own assessments" ON public.manual_assessments;
DROP POLICY IF EXISTS "Teachers can create assessments" ON public.manual_assessments;
DROP POLICY IF EXISTS "Teachers can update own assessments" ON public.manual_assessments;
DROP POLICY IF EXISTS "Teachers can delete own assessments" ON public.manual_assessments;

CREATE POLICY "Students view grade-appropriate assessments" ON public.manual_assessments FOR SELECT TO authenticated
USING (status = 'published' AND public.can_access_grade_content(auth.uid(), grade_level) 
       AND public.can_access_language_content(auth.uid(), language));

CREATE POLICY "Teachers manage assessments" ON public.manual_assessments FOR ALL TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid() AND public.can_access_language_content(auth.uid(), language));

CREATE POLICY "Directors view assessments" ON public.manual_assessments FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'school_director'::app_role) OR public.has_role(auth.uid(), 'regional_director'::app_role) 
       OR public.has_role(auth.uid(), 'spanish_program_admin'::app_role) OR public.has_role(auth.uid(), 'english_program_admin'::app_role) 
       OR public.has_role(auth.uid(), 'depr_executive'::app_role));

-- Update PDF policies
DROP POLICY IF EXISTS "Users can view their own uploaded documents" ON public.pdf_documents;

CREATE POLICY "Users view accessible documents" ON public.pdf_documents FOR SELECT TO authenticated
USING (uploaded_by = auth.uid() 
  OR (grade_level && ARRAY[public.get_user_grade_level(auth.uid())]::integer[] 
      AND public.can_access_language_content(auth.uid(), primary_language))
  OR public.has_role(auth.uid(), 'school_director'::app_role) OR public.has_role(auth.uid(), 'regional_director'::app_role)
  OR public.has_role(auth.uid(), 'spanish_program_admin'::app_role) 
  OR public.has_role(auth.uid(), 'english_program_admin'::app_role) OR public.has_role(auth.uid(), 'depr_executive'::app_role));