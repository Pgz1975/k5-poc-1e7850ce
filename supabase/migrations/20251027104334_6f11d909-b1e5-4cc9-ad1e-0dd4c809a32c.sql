-- Manual deletion of lesson 5ed132bd-3ff9-4837-b19a-f4dc970fa1bc and its exercises
-- Reason: User requested deletion of "AI G2: Dominio 2 - Fluidez Lectora"
-- WARNING: This will delete student progress data (4 completed_activity records)

BEGIN;

-- Step 1: Delete dependent records (avoid foreign key violations)
DELETE FROM voice_interactions 
WHERE assessment_id = '5ed132bd-3ff9-4837-b19a-f4dc970fa1bc'
   OR assessment_id IN (
     SELECT id FROM manual_assessments 
     WHERE parent_lesson_id = '5ed132bd-3ff9-4837-b19a-f4dc970fa1bc'
   );

DELETE FROM voice_sessions
WHERE assessment_id = '5ed132bd-3ff9-4837-b19a-f4dc970fa1bc'
   OR assessment_id IN (
     SELECT id FROM manual_assessments 
     WHERE parent_lesson_id = '5ed132bd-3ff9-4837-b19a-f4dc970fa1bc'
   );

DELETE FROM completed_activity
WHERE activity_id = '5ed132bd-3ff9-4837-b19a-f4dc970fa1bc'
   OR activity_id IN (
     SELECT id FROM manual_assessments 
     WHERE parent_lesson_id = '5ed132bd-3ff9-4837-b19a-f4dc970fa1bc'
   );

DELETE FROM lesson_ordering
WHERE assessment_id = '5ed132bd-3ff9-4837-b19a-f4dc970fa1bc'
   OR assessment_id IN (
     SELECT id FROM manual_assessments 
     WHERE parent_lesson_id = '5ed132bd-3ff9-4837-b19a-f4dc970fa1bc'
   );

-- Step 2: Delete child exercises
DELETE FROM manual_assessments
WHERE parent_lesson_id = '5ed132bd-3ff9-4837-b19a-f4dc970fa1bc';

-- Step 3: Delete the main lesson
DELETE FROM manual_assessments
WHERE id = '5ed132bd-3ff9-4837-b19a-f4dc970fa1bc';

COMMIT;