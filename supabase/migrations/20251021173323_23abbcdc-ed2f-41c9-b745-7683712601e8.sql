-- Add voice_guidance column to manual_assessments table
ALTER TABLE manual_assessments 
ADD COLUMN voice_guidance TEXT;

COMMENT ON COLUMN manual_assessments.voice_guidance IS 
'Instructions for the realtime speech system on how to present this content to students';