-- ============================================
-- Supabase COMPLETE Database Backup
-- ============================================
-- Generated: 2025-10-25T12:57:55.107Z
-- Project: meertwtenhlmnlpwxhyz
-- URL: https://meertwtenhlmnlpwxhyz.supabase.co
--
-- Tables Exported (5 total):
--   ✓ manual_assessments (0 records)
--   ✓ profiles (0 records)
--   ✓ user_roles (0 records)
--   ✓ voice_sessions (0 records)
--   ✓ pdf_text_content (0 records)
--
-- ============================================

-- Disable foreign key checks during import
SET session_replication_role = 'replica';

BEGIN;


-- ============================================
-- Table: manual_assessments
-- Records: 0
-- ============================================

-- Table: public.manual_assessments
CREATE TABLE IF NOT EXISTS public.manual_assessments (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "type" TEXT,
    "subtype" TEXT,
    "title" TEXT,
    "description" TEXT,
    "content" JSONB,
    "grade_level" INTEGER,
    "language" TEXT,
    "subject_area" TEXT,
    "curriculum_standards" TEXT,
    "enable_voice" BOOLEAN,
    "voice_speed" INTEGER,
    "auto_read_question" BOOLEAN,
    "difficulty_level" TEXT,
    "estimated_duration_minutes" INTEGER,
    "status" TEXT,
    "published_at" TIMESTAMPTZ,
    "view_count" INTEGER,
    "completion_count" INTEGER,
    "average_score" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    "metadata" JSONB,
    "voice_guidance" TEXT,
    "activity_template" TEXT,
    "coqui_dialogue" TEXT,
    "pronunciation_words" TEXT,
    "max_attempts" INTEGER,
    "parent_lesson_id" UUID,
    "order_in_lesson" TEXT,
    "drag_drop_mode" TEXT,
    "passing_score" INTEGER
);

-- Index on created_at
CREATE INDEX IF NOT EXISTS idx_manual_assessments_created_at ON public.manual_assessments(created_at);


-- ============================================
-- Table: pdf_text_content
-- Records: 0
-- ============================================

-- Schema detection failed for pdf_text_content. Using generic schema.

-- No data for table pdf_text_content


-- ============================================
-- Table: profiles
-- Records: 0
-- ============================================

-- Table: public.profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    "grade_level" TEXT,
    "assigned_region" TEXT,
    "school_id" TEXT,
    "language_specialization" TEXT,
    "learning_languages" JSONB
);

-- Index on created_at
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);


-- ============================================
-- Table: user_roles
-- Records: 0
-- ============================================

-- Table: public.user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" UUID,
    "role" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Index on user_id
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Index on created_at
CREATE INDEX IF NOT EXISTS idx_user_roles_created_at ON public.user_roles(created_at);


-- ============================================
-- Table: voice_sessions
-- Records: 0
-- ============================================

-- Table: public.voice_sessions
CREATE TABLE IF NOT EXISTS public.voice_sessions (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "session_id" TEXT,
    "student_id" UUID,
    "assessment_id" TEXT,
    "language" TEXT,
    "grade_level" INTEGER,
    "metrics" JSONB,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "ended_at" TEXT,
    "model" TEXT
);

-- Index on created_at
CREATE INDEX IF NOT EXISTS idx_voice_sessions_created_at ON public.voice_sessions(created_at);


COMMIT;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

-- ============================================
-- Backup Statistics
-- ============================================
-- Total Tables: 5
-- Total Records: 0
-- Backup Date: 2025-10-25T12:57:55.107Z
-- ============================================
