-- ===================================================================
-- Security Improvements Migration
-- ===================================================================

-- 1. Allow users to view their own analytics data (GDPR transparency)
CREATE POLICY "Users can view their own analytics"
ON public.analytics FOR SELECT
USING (auth.uid() = user_id);

-- 2. Allow users to delete their own analytics data (GDPR right to erasure)
CREATE POLICY "Users can delete their own analytics"
ON public.analytics FOR DELETE
USING (auth.uid() = user_id);

-- 3. Remove redundant ALL policy from user_roles (keep specific CRUD policies)
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- 4. Replace ALL policy on site_settings with specific policies
DROP POLICY IF EXISTS "Admins can manage settings" ON public.site_settings;

CREATE POLICY "Admins can insert settings"
ON public.site_settings FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update settings"
ON public.site_settings FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete settings"
ON public.site_settings FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));