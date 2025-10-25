-- Temporarily allow all authenticated users to delete activities (DEBUG MODE ONLY)
-- REMOVE THIS BEFORE POC DELIVERY!

DROP POLICY IF EXISTS "Teachers manage their assessments" ON manual_assessments;
DROP POLICY IF EXISTS "Teachers manage assessments" ON manual_assessments;

-- Allow authenticated users to delete (debug mode)
CREATE POLICY "Debug: Allow delete for all authenticated users"
ON manual_assessments FOR DELETE
TO authenticated
USING (true);

-- Keep existing policies for other operations
CREATE POLICY "Teachers manage their assessments (insert/update)"
ON manual_assessments 
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid() AND can_access_language_content(auth.uid(), language));