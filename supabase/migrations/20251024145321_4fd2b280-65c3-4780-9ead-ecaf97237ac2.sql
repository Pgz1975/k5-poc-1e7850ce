-- Phase 1: Database Schema Updates for Exercise Chaining

-- 1.1: Populate order_in_lesson for existing exercises
UPDATE manual_assessments 
SET order_in_lesson = subquery.row_num
FROM (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY parent_lesson_id ORDER BY created_at) - 1 as row_num
  FROM manual_assessments
  WHERE parent_lesson_id IS NOT NULL
) AS subquery
WHERE manual_assessments.id = subquery.id;

-- 1.2: Add passing_score column to manual_assessments
ALTER TABLE manual_assessments 
ADD COLUMN IF NOT EXISTS passing_score INTEGER DEFAULT 70;

COMMENT ON COLUMN manual_assessments.passing_score IS 'Minimum score (0-100) required to mark exercise as completed';