-- Create profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add name column if upgrading from an earlier version
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS name TEXT;

-- Auto-create profile on user signup (admin if email matches)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, name)
  VALUES (
    NEW.id,
    NEW.email,
    CASE WHEN NEW.email = 'joyalsiby123@gmail.com' THEN 'admin' ELSE 'user' END,
    CASE WHEN NEW.email = 'joyalsiby123@gmail.com' THEN 'Joyal Siby' ELSE NULL END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Sync email when auth.users.email changes
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles SET email = NEW.email WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_email_changed ON auth.users;
CREATE TRIGGER on_auth_user_email_changed
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_user_email();

-- Upsert profiles for all existing auth users, ensure admin email is configured
INSERT INTO profiles (id, email, role, name)
SELECT id, email, 'user', NULL FROM auth.users
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- Ensure the admin user is set up with correct role and name
UPDATE profiles
SET role = 'admin', name = 'Joyal Siby'
WHERE email = 'joyalsiby123@gmail.com';

-- Admin check function: only profiles.role = 'admin'
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC function for middleware/layout to check admin status via anon key
CREATE OR REPLACE FUNCTION public.check_admin_status()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
CREATE POLICY "Admin can read all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "Admin can update profiles" ON profiles;
CREATE POLICY "Admin can update profiles"
  ON profiles FOR UPDATE
  USING (is_admin());

-- Drop old whitelist table if it exists
DROP TABLE IF EXISTS admin_whitelist;

-- =========================================================================
-- Update existing RLS policies to use is_admin() instead of auth.role()
-- =========================================================================

-- Projects
DROP POLICY IF EXISTS "Admin can insert projects" ON projects;
CREATE POLICY "Admin can insert projects"
  ON projects FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can update projects" ON projects;
CREATE POLICY "Admin can update projects"
  ON projects FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "Admin can delete projects" ON projects;
CREATE POLICY "Admin can delete projects"
  ON projects FOR DELETE
  USING (is_admin());

-- Certificates
DROP POLICY IF EXISTS "Admin can insert certificates" ON certificates;
CREATE POLICY "Admin can insert certificates"
  ON certificates FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can update certificates" ON certificates;
CREATE POLICY "Admin can update certificates"
  ON certificates FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "Admin can delete certificates" ON certificates;
CREATE POLICY "Admin can delete certificates"
  ON certificates FOR DELETE
  USING (is_admin());

-- Achievements
DROP POLICY IF EXISTS "Admin can insert achievements" ON achievements;
CREATE POLICY "Admin can insert achievements"
  ON achievements FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can update achievements" ON achievements;
CREATE POLICY "Admin can update achievements"
  ON achievements FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "Admin can delete achievements" ON achievements;
CREATE POLICY "Admin can delete achievements"
  ON achievements FOR DELETE
  USING (is_admin());

-- Posts
DROP POLICY IF EXISTS "Admin can insert posts" ON posts;
CREATE POLICY "Admin can insert posts"
  ON posts FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can update posts" ON posts;
CREATE POLICY "Admin can update posts"
  ON posts FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "Admin can delete posts" ON posts;
CREATE POLICY "Admin can delete posts"
  ON posts FOR DELETE
  USING (is_admin());

DROP POLICY IF EXISTS "Admin can read all posts" ON posts;
CREATE POLICY "Admin can read all posts"
  ON posts FOR SELECT
  USING (is_admin());

-- Messages
DROP POLICY IF EXISTS "Admin can read messages" ON messages;
CREATE POLICY "Admin can read messages"
  ON messages FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "Admin can update messages" ON messages;
CREATE POLICY "Admin can update messages"
  ON messages FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "Admin can delete messages" ON messages;
CREATE POLICY "Admin can delete messages"
  ON messages FOR DELETE
  USING (is_admin());

-- Storage objects
DROP POLICY IF EXISTS "Admin upload to buckets" ON storage.objects;
CREATE POLICY "Admin upload to buckets"
  ON storage.objects FOR INSERT
  WITH CHECK (is_admin() AND bucket_id = ANY(ARRAY['projects', 'certificates', 'posts']));

DROP POLICY IF EXISTS "Admin update in buckets" ON storage.objects;
CREATE POLICY "Admin update in buckets"
  ON storage.objects FOR UPDATE
  USING (is_admin() AND bucket_id = ANY(ARRAY['projects', 'certificates', 'posts']));

DROP POLICY IF EXISTS "Admin delete from buckets" ON storage.objects;
CREATE POLICY "Admin delete from buckets"
  ON storage.objects FOR DELETE
  USING (is_admin() AND bucket_id = ANY(ARRAY['projects', 'certificates', 'posts']));

-- Auto-update profiles.updated_at trigger
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
