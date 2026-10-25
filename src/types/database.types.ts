// ============================================================
// Database Types — matches Supabase schema exactly
// ============================================================

export type ProjectStatus = 'draft' | 'published';
export type ProjectCategory = 'AI/GenAI' | 'SaaS' | 'ERP' | 'Automation' | 'Other';
export type SkillCategory = 'Core PM' | 'Technical' | 'AI/ML' | 'Tools' | 'Leadership' | 'Other';

export interface Profile {
  id: string;
  full_name: string | null;
  headline: string | null;
  /** Used as the hero tagline / short intro on the Home page */
  home_tagline: string | null;
  summary: string | null;
  /** PM approach / philosophy shown on the About page */
  about_approach: string | null;
  avatar_url: string | null;
  location: string | null;
  email: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  resume_url: string | null;
  keywords: string[];
  /** Custom highlight metrics shown on Home page impact strip */
  impact_stats?: Array<{ value: string; label: string }> | null;
  updated_at: string | null;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  short_desc: string | null;
  category: ProjectCategory | null;
  role: string | null;
  skills: string[];
  keywords: string[];
  thumbnail_url: string | null;
  gallery_urls: string[];
  problem: string | null;
  approach: string | null;
  decisions: string | null;
  solution: string | null;
  outcomes: string | null;
  project_url: string | null;
  /** URL to live prototype or demo */
  prototype_url: string | null;
  /** URL to downloadable case study PDF */
  case_study_pdf_url: string | null;
  featured: boolean;
  status: ProjectStatus;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CaseStudy {
  id: string;
  project_id: string;
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
}

export interface Experience {
  id: string;
  user_id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  achievements: string[];
  display_order: number;
}

export interface Skill {
  id: string;
  user_id: string;
  name: string;
  category: SkillCategory | null;
  proficiency: number | null;
  display_order: number;
}

// Joined types
export interface ProjectWithCaseStudy extends Project {
  case_studies: CaseStudy | null;
}

// Form types (for create/update)
export type ProjectFormData = Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type ExperienceFormData = Omit<Experience, 'id' | 'user_id'>;
export type SkillFormData = Omit<Skill, 'id' | 'user_id'>;
export type ProfileFormData = Omit<Profile, 'id' | 'updated_at'>;

// API response types
export interface ApiResponse<T = void> {
  data?: T;
  error?: string;
}
