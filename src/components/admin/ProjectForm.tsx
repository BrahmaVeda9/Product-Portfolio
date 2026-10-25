'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { Project, ProjectCategory } from '@/types/database.types';
import { slugify } from '@/lib/utils';

const CATEGORIES: ProjectCategory[] = ['AI/GenAI', 'SaaS', 'ERP', 'Automation', 'Other'];

interface ProjectFormProps {
  project?: Project;
  userId: string;
  onSaved: (project: Project) => void;
}

export default function ProjectForm({ project, userId, onSaved }: ProjectFormProps) {
  const supabase = createClient();
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: project?.title ?? '',
    slug: project?.slug ?? '',
    short_desc: project?.short_desc ?? '',
    category: project?.category ?? ('' as ProjectCategory | ''),
    role: project?.role ?? '',
    skills: (project?.skills ?? []).join(', '),
    keywords: (project?.keywords ?? []).join(', '),
    thumbnail_url: project?.thumbnail_url ?? '',
    problem: project?.problem ?? '',
    approach: project?.approach ?? '',
    decisions: project?.decisions ?? '',
    solution: project?.solution ?? '',
    outcomes: project?.outcomes ?? '',
    project_url: project?.project_url ?? '',
    prototype_url: project?.prototype_url ?? '',
    case_study_pdf_url: project?.case_study_pdf_url ?? '',
    featured: project?.featured ?? false,
    status: project?.status ?? 'draft',
    display_order: project?.display_order ?? 0,
    // Case study fields
    cs_content: '',
    cs_meta_title: '',
    cs_meta_description: '',
  });

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: project ? prev.slug : slugify(title),
    }));
  };

  const handleUploadThumbnail = async (file: File) => {
    setUploading(true);
    const path = `${userId}/projects/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('portfolio-assets')
      .upload(path, file, { upsert: true });

    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(data.path);

    setForm((prev) => ({ ...prev, thumbnail_url: publicUrl }));
    toast.success('Thumbnail uploaded!');
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent, saveStatus?: 'draft' | 'published') => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error('Project title is required.');
      return;
    }
    if (!form.slug.trim()) {
      toast.error('Slug is required.');
      return;
    }

    setSaving(true);
    const finalStatus = saveStatus ?? (form.status as 'draft' | 'published');

    const payload = {
      user_id: userId,
      title: form.title.trim(),
      slug: form.slug.trim(),
      short_desc: form.short_desc || null,
      category: (form.category || null) as ProjectCategory | null,
      role: form.role || null,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
      thumbnail_url: form.thumbnail_url || null,
      problem: form.problem || null,
      approach: form.approach || null,
      decisions: form.decisions || null,
      solution: form.solution || null,
      outcomes: form.outcomes || null,
      project_url: form.project_url || null,
      prototype_url: form.prototype_url || null,
      case_study_pdf_url: form.case_study_pdf_url || null,
      featured: form.featured,
      status: finalStatus,
      display_order: Number(form.display_order),
      updated_at: new Date().toISOString(),
    };

    let savedProject: Project;

    if (project) {
      // Update
      const { data, error } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', project.id)
        .select()
        .single();

      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
      savedProject = data as Project;
    } else {
      // Insert
      const { data, error } = await supabase
        .from('projects')
        .insert({ ...payload, created_at: new Date().toISOString() })
        .select()
        .single();

      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
      savedProject = data as Project;
    }

    // Upsert case study if content provided
    if (form.cs_content || form.cs_meta_title || form.cs_meta_description) {
      await supabase.from('case_studies').upsert({
        project_id: savedProject.id,
        content: form.cs_content || null,
        meta_title: form.cs_meta_title || null,
        meta_description: form.cs_meta_description || null,
      });
    }

    toast.success(finalStatus === 'published' ? 'Project published!' : 'Draft saved!');
    onSaved(savedProject);
    setSaving(false);
  };

  return (
    <form id="admin-project-form" className="space-y-6">
      {/* Basic info */}
      <div className="glass-card space-y-5 p-6">
        <h2 className="font-bold text-white">Basic Information</h2>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">Title *</label>
          <input
            className="input"
            placeholder="Project title"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Slug *
            <span className="ml-2 text-xs text-zinc-600">(URL: /projects/your-slug)</span>
          </label>
          <input
            className="input font-mono text-sm"
            placeholder="my-project-slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">Short Description</label>
          <textarea
            className="textarea"
            rows={3}
            placeholder="A brief, compelling description for the project card…"
            value={form.short_desc}
            onChange={(e) => setForm({ ...form, short_desc: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">Category</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ProjectCategory | '' })}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-zinc-400">Your Role</label>
            <input
              className="input"
              placeholder="Lead Product Manager"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Skills Used
            <span className="ml-2 text-xs text-zinc-600">(comma-separated)</span>
          </label>
          <input
            className="input"
            placeholder="AI Strategy, LLM, User Research, Roadmapping"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Keywords
            <span className="ml-2 text-xs text-zinc-600">(for SEO, comma-separated)</span>
          </label>
          <input
            className="input"
            placeholder="AI, Product Management, SaaS"
            value={form.keywords}
            onChange={(e) => setForm({ ...form, keywords: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">Project URL</label>
          <input
            className="input"
            placeholder="https://..."
            value={form.project_url}
            onChange={(e) => setForm({ ...form, project_url: e.target.value })}
          />
        </div>
      </div>

      {/* Links & Resources */}
      <div className="glass-card space-y-5 p-6">
        <h2 className="font-bold text-white">Links & Resources</h2>
        <p className="text-sm text-zinc-500">
          Add links to your live prototype, demo, and a downloadable case study PDF.
        </p>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            🧪 Prototype / Demo URL
            <span className="ml-2 text-xs text-zinc-600">Link to a live demo or Figma prototype</span>
          </label>
          <input
            className="input"
            placeholder="https://figma.com/proto/... or https://demo.example.com"
            value={form.prototype_url}
            onChange={(e) => setForm({ ...form, prototype_url: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            📄 Case Study PDF URL
            <span className="ml-2 text-xs text-zinc-600">Link to a downloadable case study document</span>
          </label>
          <input
            className="input"
            placeholder="https://... (PDF URL or upload to portfolio-assets storage)"
            value={form.case_study_pdf_url}
            onChange={(e) => setForm({ ...form, case_study_pdf_url: e.target.value })}
          />
        </div>
      </div>

      {/* Thumbnail */}
      <div className="glass-card space-y-4 p-6">
        <h2 className="font-bold text-white">Thumbnail Image</h2>
        {form.thumbnail_url && (
          <img
            src={form.thumbnail_url}
            alt="Thumbnail preview"
            className="h-40 rounded-xl object-cover border border-brand-600/10"
          />
        )}
        <div className="flex gap-3">
          <input
            className="input flex-1"
            placeholder="Image URL or upload below"
            value={form.thumbnail_url}
            onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
          />
          <button
            type="button"
            onClick={() => thumbnailRef.current?.click()}
            disabled={uploading}
            className="btn-secondary whitespace-nowrap text-sm"
          >
            {uploading ? 'Uploading…' : 'Upload ↑'}
          </button>
        </div>
        <input
          ref={thumbnailRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUploadThumbnail(file);
          }}
        />
      </div>

      {/* Case Study Sections */}
      <div className="glass-card space-y-5 p-6">
        <h2 className="font-bold text-white">Case Study Content</h2>
        <p className="text-sm text-zinc-500">
          Use double line breaks to separate paragraphs. These sections are displayed on the public project page.
        </p>

        {[
          { key: 'problem', label: '🎯 The Problem', placeholder: 'What problem were you solving? Who was affected?' },
          { key: 'approach', label: '🧭 Approach & Strategy', placeholder: 'How did you approach this problem? What frameworks or methods did you use?' },
          { key: 'decisions', label: '⚖️ Decisions & Trade-offs', placeholder: 'What key decisions did you make? What were the trade-offs?' },
          { key: 'solution', label: '✅ Solution', placeholder: 'What did you build or ship? What was the final solution?' },
          { key: 'outcomes', label: '📊 Outcomes & Metrics', placeholder: 'What were the measurable results? Include metrics, KPIs, and business impact.' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="mb-2 block text-sm font-medium text-zinc-300">{label}</label>
            <textarea
              className="textarea"
              rows={4}
              placeholder={placeholder}
              value={form[key as keyof typeof form] as string}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">📖 Additional Case Study Content</label>
          <textarea
            className="textarea"
            rows={8}
            placeholder="Full narrative, additional context, or longer case study content…"
            value={form.cs_content}
            onChange={(e) => setForm({ ...form, cs_content: e.target.value })}
          />
        </div>
      </div>

      {/* SEO */}
      <div className="glass-card space-y-5 p-6">
        <h2 className="font-bold text-white">SEO / Meta</h2>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Meta Title</label>
          <input
            className="input"
            placeholder={form.title || 'Page title for search engines'}
            value={form.cs_meta_title}
            onChange={(e) => setForm({ ...form, cs_meta_title: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Meta Description</label>
          <textarea
            className="textarea"
            rows={2}
            placeholder="Brief description for search engine results (150-160 chars)"
            value={form.cs_meta_description}
            onChange={(e) => setForm({ ...form, cs_meta_description: e.target.value })}
          />
        </div>
      </div>

      {/* Settings */}
      <div className="glass-card space-y-4 p-6">
        <h2 className="font-bold text-white">Settings</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-3">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              <div className={`h-5 w-9 rounded-full transition-colors ${form.featured ? 'bg-brand-500' : 'bg-zinc-700'}`} />
              <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${form.featured ? 'left-4' : 'left-0.5'}`} />
            </div>
            <span className="text-sm text-zinc-300">Featured on homepage</span>
          </label>
        </div>

        <div className="max-w-xs">
          <label className="mb-2 block text-sm text-zinc-400">Display Order</label>
          <input
            type="number"
            className="input"
            min={0}
            value={form.display_order}
            onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
          />
          <p className="mt-1 text-xs text-zinc-600">Lower numbers appear first.</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <button
            id="project-save-draft"
            type="button"
            disabled={saving}
            onClick={(e) => handleSave(e, 'draft')}
            className="btn-secondary disabled:opacity-60"
          >
            {saving ? '…' : 'Save as Draft'}
          </button>

          {project?.status === 'published' && (
            <a
              href={`/projects/${project.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              Preview Live ↗
            </a>
          )}
        </div>

        <button
          id="project-publish"
          type="button"
          disabled={saving}
          onClick={(e) => handleSave(e, 'published')}
          className="btn-primary disabled:opacity-60"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              Saving…
            </>
          ) : project?.status === 'published' ? (
            'Update & Publish'
          ) : (
            'Publish Project'
          )}
        </button>
      </div>
    </form>
  );
}
