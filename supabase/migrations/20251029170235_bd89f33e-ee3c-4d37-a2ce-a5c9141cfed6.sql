-- STEP 1: Publish all draft content to make lessons and exercises visible
-- This will change all items with status='draft' to status='published'
-- Affecting approximately 629 rows based on analysis

UPDATE manual_assessments
SET 
  status = 'published',
  published_at = CASE 
    WHEN published_at IS NULL THEN now() 
    ELSE published_at 
  END,
  updated_at = now()
WHERE status = 'draft';

-- Log the number of affected rows
-- This query will show confirmation of the update