-- ============================================================
-- Migration 002: Row Level Security Policies
-- ============================================================

-- -------------------------------------------------------
-- Enable RLS on all tables
-- -------------------------------------------------------
ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills      ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES
-- ============================================================

-- Anyone can read profile (public portfolio data)
CREATE POLICY "Public can read profiles"
  ON public.profiles FOR SELECT
  USING (true);

-- Only the profile owner can update their own profile
CREATE POLICY "Owner can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profile is auto-inserted by trigger (no INSERT policy for users needed)

-- ============================================================
-- PROJECTS
-- ============================================================

-- Public visitors can only see published projects
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  USING (status = 'published');

-- Authenticated owner can see ALL their projects (including drafts)
CREATE POLICY "Owner can view all own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

-- Owner can insert projects
CREATE POLICY "Owner can insert projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Owner can update their projects
CREATE POLICY "Owner can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Owner can delete their projects
CREATE POLICY "Owner can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- CASE STUDIES
-- ============================================================

-- Public can read case studies for published projects
CREATE POLICY "Public can view case studies of published projects"
  ON public.case_studies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = case_studies.project_id
        AND p.status = 'published'
    )
  );

-- Owner can view all case studies for their projects
CREATE POLICY "Owner can view all own case studies"
  ON public.case_studies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = case_studies.project_id
        AND p.user_id = auth.uid()
    )
  );

-- Owner can insert case studies
CREATE POLICY "Owner can insert case studies"
  ON public.case_studies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = case_studies.project_id
        AND p.user_id = auth.uid()
    )
  );

-- Owner can update case studies
CREATE POLICY "Owner can update case studies"
  ON public.case_studies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = case_studies.project_id
        AND p.user_id = auth.uid()
    )
  );

-- Owner can delete case studies
CREATE POLICY "Owner can delete case studies"
  ON public.case_studies FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = case_studies.project_id
        AND p.user_id = auth.uid()
    )
  );

-- ============================================================
-- EXPERIENCE
-- ============================================================

-- Anyone can read experience
CREATE POLICY "Public can read experience"
  ON public.experience FOR SELECT
  USING (true);

-- Owner can insert
CREATE POLICY "Owner can insert experience"
  ON public.experience FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Owner can update
CREATE POLICY "Owner can update experience"
  ON public.experience FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Owner can delete
CREATE POLICY "Owner can delete experience"
  ON public.experience FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- SKILLS
-- ============================================================

-- Anyone can read skills
CREATE POLICY "Public can read skills"
  ON public.skills FOR SELECT
  USING (true);

-- Owner can insert
CREATE POLICY "Owner can insert skills"
  ON public.skills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Owner can update
CREATE POLICY "Owner can update skills"
  ON public.skills FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Owner can delete
CREATE POLICY "Owner can delete skills"
  ON public.skills FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- STORAGE: portfolio-assets bucket
-- ============================================================
-- Run these in Supabase Dashboard > Storage > Policies
-- or via the Supabase CLI after creating the bucket.
--
-- Public read on portfolio-assets bucket:
--   CREATE POLICY "Public read portfolio assets"
--     ON storage.objects FOR SELECT
--     USING (bucket_id = 'portfolio-assets');
--
-- Authenticated write (upload/delete):
--   CREATE POLICY "Auth users can upload assets"
--     ON storage.objects FOR INSERT
--     WITH CHECK (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');
--
--   CREATE POLICY "Auth users can update assets"
--     ON storage.objects FOR UPDATE
--     USING (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');
--
--   CREATE POLICY "Auth users can delete assets"
--     ON storage.objects FOR DELETE
--     USING (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');
