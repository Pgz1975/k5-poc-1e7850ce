-- Update drag_drop_mode to include 'match' option
ALTER TABLE manual_assessments 
DROP CONSTRAINT IF EXISTS manual_assessments_drag_drop_mode_check;

ALTER TABLE manual_assessments 
ADD CONSTRAINT manual_assessments_drag_drop_mode_check 
CHECK (drag_drop_mode IN ('letters', 'match'));