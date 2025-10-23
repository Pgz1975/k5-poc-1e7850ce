-- Fix incorrectly categorized lesson - convert to assessment
UPDATE manual_assessments 
SET type = 'assessment'
WHERE id = '8953b8be-a9d1-48d0-9854-3b6832c84a57' 
AND type = 'lesson';