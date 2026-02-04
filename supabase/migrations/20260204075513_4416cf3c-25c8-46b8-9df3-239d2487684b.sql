-- Fix analytics insert policy to only allow authenticated users
DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.analytics;

CREATE POLICY "Authenticated users can insert analytics"
ON public.analytics
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);