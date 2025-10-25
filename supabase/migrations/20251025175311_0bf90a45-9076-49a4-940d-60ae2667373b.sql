-- Update foreign key constraint to cascade deletes
-- This allows deleting assessments even if they have voice sessions

-- First, drop the existing foreign key constraint
ALTER TABLE voice_sessions 
DROP CONSTRAINT IF EXISTS voice_sessions_assessment_id_fkey;

-- Recreate it with ON DELETE CASCADE
ALTER TABLE voice_sessions
ADD CONSTRAINT voice_sessions_assessment_id_fkey
FOREIGN KEY (assessment_id)
REFERENCES manual_assessments(id)
ON DELETE CASCADE;