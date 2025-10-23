-- Add 'lesson' as a valid subtype by modifying the check constraint

-- Drop the existing constraint
ALTER TABLE manual_assessments 
DROP CONSTRAINT IF EXISTS manual_assessments_subtype_check;

-- Add new constraint that includes 'lesson'
ALTER TABLE manual_assessments
ADD CONSTRAINT manual_assessments_subtype_check 
CHECK (subtype IN ('lesson', 'multiple_choice', 'true_false', 'fill_blank'));

-- Update all existing lessons to use the correct subtype
UPDATE manual_assessments 
SET subtype = 'lesson'
WHERE type = 'lesson' 
  AND subtype IN ('multiple_choice', 'true_false', 'fill_blank');

-- Add a comment documenting valid subtype values
COMMENT ON COLUMN manual_assessments.subtype IS 'Valid values: lesson (for type=lesson), multiple_choice, true_false, fill_blank (for type=exercise/assessment)';