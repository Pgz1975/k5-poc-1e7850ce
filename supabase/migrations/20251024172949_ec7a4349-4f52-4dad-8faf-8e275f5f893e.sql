-- Add RLS policy to allow authenticated users to insert into lesson_ordering
CREATE POLICY "Authenticated users can insert lesson ordering"
ON public.lesson_ordering
FOR INSERT
TO authenticated
WITH CHECK (true);