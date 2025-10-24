-- Phase 1: Add new exercise subtypes and drag_drop_mode column

-- Add drag_drop_mode column for new drag-and-drop exercises
ALTER TABLE manual_assessments 
ADD COLUMN IF NOT EXISTS drag_drop_mode TEXT;

-- Add check constraint for drag_drop_mode values
ALTER TABLE manual_assessments 
ADD CONSTRAINT drag_drop_mode_check 
CHECK (drag_drop_mode IS NULL OR drag_drop_mode IN ('letters', 'match', 'sequence', 'fill_sentence'));

-- Add index for new subtypes (will be used for write_answer and drag_drop)
CREATE INDEX IF NOT EXISTS idx_manual_assessments_subtype_new 
ON manual_assessments(subtype) 
WHERE subtype IN ('write_answer', 'drag_drop');

-- Add index for drag_drop_mode
CREATE INDEX IF NOT EXISTS idx_manual_assessments_drag_drop_mode 
ON manual_assessments(drag_drop_mode) 
WHERE drag_drop_mode IS NOT NULL;

-- Add column comment for documentation
COMMENT ON COLUMN manual_assessments.drag_drop_mode IS 
'Specifies drag-and-drop interaction type: letters (assemble word from letters), match (categorize items to zones), sequence (order items), fill_sentence (complete sentence with draggable words). Only applicable when subtype is drag_drop.';