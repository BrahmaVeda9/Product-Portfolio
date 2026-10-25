-- ============================================================
-- Migration 003: Add new portfolio fields for hybrid redesign
-- ============================================================

-- Profiles: add home_tagline, about_approach, and impact_stats
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS home_tagline text,
  ADD COLUMN IF NOT EXISTS about_approach text,
  ADD COLUMN IF NOT EXISTS impact_stats jsonb DEFAULT '[]';

-- Projects: add prototype_url (live demo / prototype) and case_study_pdf_url (downloadable PDF)
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS prototype_url text,
  ADD COLUMN IF NOT EXISTS case_study_pdf_url text;

COMMENT ON COLUMN public.profiles.home_tagline IS 'Short hero punchline displayed on the Home page';
COMMENT ON COLUMN public.profiles.about_approach IS 'Detailed PM approach/philosophy displayed on the About page';
COMMENT ON COLUMN public.profiles.impact_stats IS 'Custom highlight metrics and numbers shown across Home page impact strip';
COMMENT ON COLUMN public.projects.prototype_url IS 'Direct URL to interactive prototype (Figma, Streamlit, web app)';
COMMENT ON COLUMN public.projects.case_study_pdf_url IS 'Direct URL to downloadable case study PDF';
