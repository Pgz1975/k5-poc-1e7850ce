-- Phase 3: Allow write_answer and drag_drop subtypes

-- First, let's check the current constraint and recreate it with new values
-- The subtype column likely has a CHECK constraint that needs to be updated

-- Drop the old constraint if it exists
ALTER TABLE manual_assessments 
DROP CONSTRAINT IF EXISTS manual_assessments_subtype_check;

-- Add new constraint that includes all exercise subtypes
ALTER TABLE manual_assessments 
ADD CONSTRAINT manual_assessments_subtype_check 
CHECK (
  subtype IN (
    'lesson',
    'multiple_choice', 
    'true_false', 
    'fill_blank', 
    'write_answer', 
    'drag_drop'
  )
);

-- Add comment for documentation
COMMENT ON COLUMN manual_assessments.subtype IS 
'Type of exercise: lesson (parent container), multiple_choice (select from options), true_false (binary choice), fill_blank (drag letters to form word), write_answer (type single word answer), drag_drop (versatile drag-and-drop interactions with modes: letters, match, sequence, fill_sentence)';
