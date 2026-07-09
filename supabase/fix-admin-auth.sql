-- Run this in your Supabase SQL Editor if migrations haven't been applied.
-- This creates the profiles table, admin-check functions, and sets up your admin user.

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create admin-check functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_admin_status()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create trigger to auto-create profile on signup
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

-- 4. Backfill profiles for existing auth users
INSERT INTO profiles (id, email, role, name)
SELECT id, email, 'user', NULL FROM auth.users
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

UPDATE profiles
SET role = 'admin', name = 'Joyal Siby'
WHERE email = 'joyalsiby123@gmail.com';

-- 5. Profile RLS policies
CREATE POLICY IF NOT EXISTS "Users can read own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY IF NOT EXISTS "Admin can read all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

CREATE POLICY IF NOT EXISTS "Admin can update profiles"
  ON profiles FOR UPDATE
  USING (is_admin());

-- 6. Verification query
SELECT p.id, p.email, p.role, p.name
FROM profiles p
WHERE p.role = 'admin';
