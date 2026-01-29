-- =============================================================================
-- Supabase RLS (Row Level Security) Policies
-- =============================================================================
-- CRITICAL: This is the REAL security layer for a static GitHub Pages site.
-- Client-side auth only controls UX - RLS enforces actual data access control.
-- =============================================================================

-- =============================================================================
-- 1. PROFILES TABLE
-- =============================================================================

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT,
    first_name TEXT,
    last_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    provider TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- Policy: Users can only view their OWN profile
CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Users can only insert their OWN profile (on signup)
CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy: Users can only update their OWN profile
CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy: Users can only delete their OWN profile
CREATE POLICY "Users can delete their own profile"
    ON public.profiles
    FOR DELETE
    USING (auth.uid() = id);

-- =============================================================================
-- 2. AUTOMATIC PROFILE CREATION ON SIGNUP
-- =============================================================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, provider, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_app_meta_data->>'provider',
        NOW()
    );
    RETURN NEW;
END;
$$;

-- Drop trigger if exists (for idempotency)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 3. AVATARS STORAGE BUCKET
-- =============================================================================

-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies (for idempotency)
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

-- Policy: Users can upload avatars to their own folder
CREATE POLICY "Users can upload their own avatar"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Policy: Users can update their own avatars
CREATE POLICY "Users can update their own avatar"
    ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    )
    WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Policy: Users can delete their own avatars
CREATE POLICY "Users can delete their own avatar"
    ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Policy: Avatars are publicly readable (for display on profile)
CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'avatars');

-- =============================================================================
-- 4. CONTACT MESSAGES TABLE (Optional - if storing contact form submissions)
-- =============================================================================

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins can view contact messages" ON public.contact_messages;

-- Policy: Anyone can submit a contact message (authenticated or not)
CREATE POLICY "Anyone can insert contact messages"
    ON public.contact_messages
    FOR INSERT
    WITH CHECK (true);

-- Policy: Only authenticated users can view their own messages
CREATE POLICY "Users can view their own messages"
    ON public.contact_messages
    FOR SELECT
    USING (auth.uid() = user_id);

-- =============================================================================
-- 5. RATE LIMITING TABLE (For CSRF and abuse prevention)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL, -- Could be user_id, IP, or hashed token
    action TEXT NOT NULL,     -- e.g., 'login', 'password_reset', 'contact_form'
    count INTEGER DEFAULT 1,
    window_start TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup
    ON public.rate_limits(identifier, action, window_start);

-- Policy: System can manage rate limits (via service role only)
-- No user-facing policies - this table is managed by edge functions or service role

-- =============================================================================
-- 6. SESSION AUDIT LOG (Security tracking)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.auth_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,      -- 'login', 'logout', 'password_reset', 'profile_update'
    provider TEXT,             -- 'email', 'github', 'google'
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.auth_audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own audit log" ON public.auth_audit_log;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.auth_audit_log;

-- Policy: Users can view their own security log
CREATE POLICY "Users can view their own audit log"
    ON public.auth_audit_log
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Allow inserts (will be done via auth triggers or service role)
CREATE POLICY "System can insert audit logs"
    ON public.auth_audit_log
    FOR INSERT
    WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- =============================================================================
-- 7. UPDATED_AT TRIGGER FUNCTION
-- =============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Apply to profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- 8. SECURITY BEST PRACTICES
-- =============================================================================

-- Revoke all privileges from public schema by default
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;

-- Grant specific permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT ON public.contact_messages TO authenticated;
GRANT SELECT, INSERT ON public.auth_audit_log TO authenticated;

-- Storage permissions are handled by storage policies above

-- =============================================================================
-- USAGE NOTES FOR STATIC SITE (GitHub Pages):
-- =============================================================================
--
-- 1. These policies protect your DATA, not your HTML pages.
-- 2. Always fetch sensitive data via authenticated Supabase calls.
-- 3. The anon key can only do what these policies allow.
-- 4. For admin functions, use Supabase Edge Functions with service role.
-- 5. Monitor auth_audit_log for suspicious activity.
--
-- To apply these migrations:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Paste this entire file and execute
-- 3. Or use Supabase CLI: supabase db push
-- =============================================================================
