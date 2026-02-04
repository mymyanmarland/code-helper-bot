-- 1) Fix user_roles policies so admins can manage roles
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Allow users to create a default 'user' role for themselves (safe bootstrap)
DROP POLICY IF EXISTS "Users can insert own user role" ON public.user_roles;
CREATE POLICY "Users can insert own user role"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id AND role = 'user');

-- 2) Admin access for admin dashboard data
-- Profiles: admins can see all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Chat messages: admins can view and delete all messages
DROP POLICY IF EXISTS "Admins can view all messages" ON public.chat_messages;
CREATE POLICY "Admins can view all messages"
ON public.chat_messages
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete all messages" ON public.chat_messages;
CREATE POLICY "Admins can delete all messages"
ON public.chat_messages
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- 3) Seed roles for existing users
-- Give every existing profile a default 'user' role
INSERT INTO public.user_roles (user_id, role)
SELECT p.user_id, 'user'::public.app_role
FROM public.profiles p
ON CONFLICT (user_id, role) DO NOTHING;

-- Make mymyanmarland@gmail.com an admin
INSERT INTO public.user_roles (user_id, role)
SELECT p.user_id, 'admin'::public.app_role
FROM public.profiles p
WHERE p.username = 'mymyanmarland@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;