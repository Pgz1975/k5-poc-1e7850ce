-- Temporary debug deletion policies to allow cleaning TEST data
-- Allows authenticated users to delete voice interactions and assessment voice results

-- 1) voice_interactions: allow DELETE for authenticated users
CREATE POLICY "Debug: Allow delete for all authenticated users"
ON public.voice_interactions
FOR DELETE
TO authenticated
USING (true);

-- 2) voice_assessment_results: allow DELETE for authenticated users (safety)
CREATE POLICY "Debug: Allow delete for all authenticated users"
ON public.voice_assessment_results
FOR DELETE
TO authenticated
USING (true);