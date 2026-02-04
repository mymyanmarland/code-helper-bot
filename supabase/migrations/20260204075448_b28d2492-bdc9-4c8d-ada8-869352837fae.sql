-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create analytics table for tracking
CREATE TABLE public.analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view analytics"
ON public.analytics
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert analytics"
ON public.analytics
FOR INSERT
WITH CHECK (true);

-- Create settings table
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings"
ON public.site_settings
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage settings"
ON public.site_settings
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));