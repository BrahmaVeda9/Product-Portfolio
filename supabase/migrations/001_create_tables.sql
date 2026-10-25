-- ============================================================
-- Migration 001: Create all portfolio tables
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------
-- profiles
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       text,
  headline        text,
  home_tagline    text,
  summary         text,
  about_approach  text,
  avatar_url      text,
  location        text,
  email           text,
  linkedin_url    text,
  github_url      text,
  twitter_url     text,
  resume_url      text,
  keywords        text[] DEFAULT '{}',
  impact_stats    jsonb DEFAULT '[]',
  updated_at      timestamptz DEFAULT now()
);

-- -------------------------------------------------------
-- projects
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title               text NOT NULL,
  slug                text NOT NULL,
  short_desc          text,
  category            text CHECK (category IN ('AI/GenAI','SaaS','ERP','Automation','Other')),
  role                text,
  skills              text[] DEFAULT '{}',
  keywords            text[] DEFAULT '{}',
  thumbnail_url       text,
  gallery_urls        text[] DEFAULT '{}',
  problem             text,
  approach            text,
  decisions           text,
  solution            text,
  outcomes            text,
  project_url         text,
  prototype_url       text,
  case_study_pdf_url  text,
  featured            boolean NOT NULL DEFAULT false,
  status              text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  display_order       integer NOT NULL DEFAULT 0,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, slug)
);

CREATE INDEX IF NOT EXISTS projects_user_id_idx      ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS projects_status_idx       ON public.projects(status);
CREATE INDEX IF NOT EXISTS projects_featured_idx     ON public.projects(featured);
CREATE INDEX IF NOT EXISTS projects_display_order_idx ON public.projects(display_order);

-- -------------------------------------------------------
-- case_studies
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.case_studies (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  content          text,
  meta_title       text,
  meta_description text,
  og_image_url     text,
  UNIQUE (project_id)
);

-- -------------------------------------------------------
-- experience
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experience (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company         text NOT NULL,
  role            text NOT NULL,
  start_date      date NOT NULL,
  end_date        date,
  description     text,
  achievements    text[] DEFAULT '{}',
  display_order   integer NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS experience_user_id_idx ON public.experience(user_id);

-- -------------------------------------------------------
-- skills
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name            text NOT NULL,
  category        text CHECK (category IN ('Core PM','Technical','AI/ML','Tools','Leadership','Other')),
  proficiency     integer CHECK (proficiency BETWEEN 1 AND 5),
  display_order   integer NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS skills_user_id_idx ON public.skills(user_id);

-- -------------------------------------------------------
-- Auto-update updated_at trigger
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -------------------------------------------------------
-- Auto-create profile on auth sign-up
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
