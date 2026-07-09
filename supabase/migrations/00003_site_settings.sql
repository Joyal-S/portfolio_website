-- Site settings table (single-row configuration)
CREATE TABLE IF NOT EXISTS site_settings (
  id BIGINT PRIMARY KEY DEFAULT 1,
  -- Personal
  name TEXT NOT NULL DEFAULT 'Joyal Siby',
  profession TEXT NOT NULL DEFAULT 'MCA Student | Full Stack Developer | AI Enthusiast',
  bio TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT 'joyalsiby123@gmail.com',
  phone TEXT DEFAULT '',
  -- Social
  github_url TEXT DEFAULT 'https://github.com/Joyal-S',
  linkedin_url TEXT DEFAULT 'https://www.linkedin.com/in/joyalsiby123/',
  twitter_url TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  portfolio_url TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  -- Media
  profile_image_url TEXT DEFAULT '',
  logo TEXT DEFAULT '',
  favicon TEXT DEFAULT '',
  -- Hero
  hero_title TEXT NOT NULL DEFAULT 'Hi, I''m',
  hero_description TEXT NOT NULL DEFAULT 'I build modern, scalable, and user-focused web applications using modern technologies. Passionate about full-stack development, AI-powered solutions, and creating premium digital experiences.',
  -- SEO
  seo_title TEXT NOT NULL DEFAULT 'MCA Student | Full Stack Developer | AI Enthusiast',
  seo_description TEXT NOT NULL DEFAULT 'I build modern, scalable, and user-focused web applications using modern technologies.',
  -- Footer
  footer_text TEXT NOT NULL DEFAULT 'Built with Next.js & Supabase',
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_single_row CHECK (id = 1)
);

-- Seed the default settings row
INSERT INTO site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read, only admin can update
CREATE POLICY "Public can read site_settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admin can update site_settings"
  ON site_settings FOR UPDATE
  USING (is_admin());

-- Auto-update timestamp
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
