-- Temporary debug policy: Allow all authenticated users to update any assessment
-- NOTE: This is for debugging only and MUST be removed before POC delivery
CREATE POLICY "Debug: Allow update for all authenticated users"
ON public.manual_assessments
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);