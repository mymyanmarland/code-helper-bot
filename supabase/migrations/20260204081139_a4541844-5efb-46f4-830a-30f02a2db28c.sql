-- Fix analytics table: Only allow users to insert their own analytics
DROP POLICY IF EXISTS "Authenticated users can insert analytics" ON public.analytics;

CREATE POLICY "Users can only insert their own analytics"
ON public.analytics
FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Fix site_settings table: Only allow authenticated users to view settings
DROP POLICY IF EXISTS "Anyone can view settings" ON public.site_settings;

CREATE POLICY "Authenticated users can view settings"
ON public.site_settings
FOR SELECT
USING (auth.uid() IS NOT NULL);