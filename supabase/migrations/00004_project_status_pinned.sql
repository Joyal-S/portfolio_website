-- Add status and pinned columns to projects table

-- Create project_status enum
CREATE TYPE project_status AS ENUM ('draft', 'published', 'archived');

-- Add columns
ALTER TABLE projects
  ADD COLUMN status project_status NOT NULL DEFAULT 'draft',
  ADD COLUMN pinned BOOLEAN NOT NULL DEFAULT false;

-- Backfill status based on existing published_at values
UPDATE projects
SET status = CASE
  WHEN published_at IS NOT NULL THEN 'published'::project_status
  ELSE 'draft'::project_status
END;

-- Add index for common queries
CREATE INDEX idx_projects_status ON projects (status);
CREATE INDEX idx_projects_pinned ON projects (pinned) WHERE pinned = true;

-- Update RLS policy comment — no policy changes needed since admin auth is unchanged
