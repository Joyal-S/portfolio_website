-- Create enum types
CREATE TYPE project_category AS ENUM ('web', 'ai', 'hackathon');
CREATE TYPE achievement_type AS ENUM ('hackathon', 'award');
CREATE TYPE post_status AS ENUM ('draft', 'published');

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category project_category NOT NULL DEFAULT 'web',
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  repo_url TEXT,
  live_url TEXT,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Certificates table
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  credential_id TEXT,
  credential_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  type achievement_type NOT NULL DEFAULT 'award',
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Posts table (blog)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  cover_image TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  status post_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  reading_time INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Messages table (contact form)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Public can read certificates"
  ON certificates FOR SELECT
  USING (true);

CREATE POLICY "Public can read achievements"
  ON achievements FOR SELECT
  USING (true);

CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  USING (status = 'published');

-- Admin full access policies (using auth.uid() existence as admin check)
CREATE POLICY "Admin can insert projects"
  ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update projects"
  ON projects FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete projects"
  ON projects FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert certificates"
  ON certificates FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update certificates"
  ON certificates FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete certificates"
  ON certificates FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert achievements"
  ON achievements FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update achievements"
  ON achievements FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete achievements"
  ON achievements FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert posts"
  ON posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update posts"
  ON posts FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete posts"
  ON posts FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can read all posts"
  ON posts FOR SELECT
  USING (auth.role() = 'authenticated');

-- Messages: public can insert, admin can read/update
CREATE POLICY "Public can insert messages"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can read messages"
  ON messages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can update messages"
  ON messages FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete messages"
  ON messages FOR DELETE
  USING (auth.role() = 'authenticated');

-- Storage bucket creation
INSERT INTO storage.buckets (id, name, public) VALUES ('projects', 'projects', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('posts', 'posts', true) ON CONFLICT DO NOTHING;

-- Storage bucket policies — public read, authenticated write
CREATE POLICY "Public read projects bucket" ON storage.objects FOR SELECT USING (bucket_id = ANY(ARRAY['projects', 'certificates', 'posts']));
CREATE POLICY "Admin upload to buckets" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND bucket_id = ANY(ARRAY['projects', 'certificates', 'posts']));
CREATE POLICY "Admin update in buckets" ON storage.objects FOR UPDATE USING (auth.role() = 'authenticated' AND bucket_id = ANY(ARRAY['projects', 'certificates', 'posts']));
CREATE POLICY "Admin delete from buckets" ON storage.objects FOR DELETE USING (auth.role() = 'authenticated' AND bucket_id = ANY(ARRAY['projects', 'certificates', 'posts']));
-- Buckets needed: projects, certificates, posts
-- Public read, admin write

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON certificates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
