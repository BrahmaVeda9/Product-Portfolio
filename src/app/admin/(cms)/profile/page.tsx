'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { Profile } from '@/types/database.types';

export default function AdminProfilePage() {
  const supabase = createClient();
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userId,    setUserId]    = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Omit<Profile, 'id' | 'updated_at'>>({
    full_name:      '',
    headline:       '',
    home_tagline:   '',
    summary:        '',
    about_approach: '',
    avatar_url:     '',
    location:       '',
    email:          '',
    linkedin_url:   '',
    github_url:     '',
    twitter_url:    '',
    resume_url:     '',
    keywords:       [],
  });
  const [keywordsInput, setKeywordsInput] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (data) {
        setForm({
          full_name:      data.full_name      ?? '',
          headline:       data.headline       ?? '',
          home_tagline:   data.home_tagline   ?? '',
          summary:        data.summary        ?? '',
          about_approach: data.about_approach ?? '',
          avatar_url:     data.avatar_url     ?? '',
          location:       data.location       ?? '',
          email:          data.email          ?? '',
          linkedin_url:   data.linkedin_url   ?? '',
          github_url:     data.github_url     ?? '',
          twitter_url:    data.twitter_url    ?? '',
          resume_url:     data.resume_url     ?? '',
          keywords:       data.keywords       ?? [],
        });
        setKeywordsInput((data.keywords ?? []).join(', '));
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);

    const keywords = keywordsInput.split(',').map((k) => k.trim()).filter(Boolean);

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      ...form,
      keywords,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Profile saved!');
    }
    setSaving(false);
  };

  const handleUpload = async (
    file: File,
    bucket: string,
    path: string,
    field: keyof typeof form
  ) => {
    setUploading(true);
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });

    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
    setForm((prev) => ({ ...prev, [field]: publicUrl }));
    toast.success('File uploaded!');
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center pt-16 lg:pt-0">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pt-16 lg:pt-0">
      <div>
        <h1 className="text-3xl font-black text-white">Edit Profile</h1>
        <p className="mt-1 text-zinc-500">Update your public portfolio information across all sections.</p>
      </div>

      <form id="admin-profile-form" onSubmit={handleSave} className="space-y-6">

        {/* ─── IDENTITY ─────────────────────────────────────────── */}
        <div className="glass-card space-y-5 p-6">
          <h2 className="font-bold text-white text-lg border-b border-brand-900/20 pb-3">Identity</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">Full Name</label>
              <input
                className="input"
                placeholder="Jane Smith"
                value={form.full_name ?? ''}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-400">Location</label>
              <input
                className="input"
                placeholder="San Francisco, CA"
                value={form.location ?? ''}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Headline
              <span className="ml-2 text-xs text-zinc-600">Shown in Experience page header & hero subtitle</span>
            </label>
            <input
              className="input"
              placeholder="Senior Product Manager | AI/GenAI | SaaS"
              value={form.headline ?? ''}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Keywords / Focus Areas
              <span className="ml-2 text-xs text-zinc-600">Comma-separated — shown as badge tags</span>
            </label>
            <input
              className="input"
              placeholder="AI/GenAI, SaaS, ERP, Workflow Automation, Product Strategy"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
            />
          </div>
        </div>

        {/* ─── HOME PAGE CONTENT ────────────────────────────────── */}
        <div className="glass-card space-y-5 p-6">
          <div className="border-b border-brand-900/20 pb-3">
            <h2 className="font-bold text-white text-lg">🏠 Home Page Content</h2>
            <p className="text-xs text-zinc-500 mt-1">Controls what appears in the hero section of your home page.</p>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Hero Summary
              <span className="ml-2 text-xs text-zinc-600">Main description paragraph below your name in the hero</span>
            </label>
            <textarea
              className="textarea"
              rows={4}
              placeholder="Driving product vision, technical architecture, and cross-functional execution to scale AI/GenAI platforms, enterprise SaaS, and automated workflow systems."
              value={form.summary ?? ''}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </div>
        </div>

        {/* ─── ABOUT PAGE CONTENT ───────────────────────────────── */}
        <div className="glass-card space-y-5 p-6">
          <div className="border-b border-brand-900/20 pb-3">
            <h2 className="font-bold text-white text-lg">👤 About Page Content</h2>
            <p className="text-xs text-zinc-500 mt-1">Controls the bio and PM approach shown on your About page.</p>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              About Description / Bio
              <span className="ml-2 text-xs text-zinc-600">Use double line breaks (Enter twice) to separate paragraphs</span>
            </label>
            <textarea
              className="textarea"
              rows={8}
              placeholder={`Senior Product Leader with deep expertise spanning 0→1 innovation...\n\nThroughout my career, I have operated at the intersection of business strategy...`}
              value={form.about_approach ?? ''}
              onChange={(e) => setForm({ ...form, about_approach: e.target.value })}
            />
            <p className="mt-1.5 text-xs text-zinc-600">
              Tip: This is your detailed bio for the About page. The Hero Summary above is used for the home page.
            </p>
          </div>
        </div>

        {/* ─── CONTACT & SOCIAL ─────────────────────────────────── */}
        <div className="glass-card space-y-5 p-6">
          <h2 className="font-bold text-white text-lg border-b border-brand-900/20 pb-3">Contact & Social</h2>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">Email</label>
            <input
              type="email"
              className="input"
              placeholder="you@example.com"
              value={form.email ?? ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">LinkedIn URL</label>
              <input
                className="input"
                placeholder="https://linkedin.com/in/..."
                value={form.linkedin_url ?? ''}
                onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-400">GitHub URL</label>
              <input
                className="input"
                placeholder="https://github.com/..."
                value={form.github_url ?? ''}
                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">Twitter / X URL</label>
            <input
              className="input"
              placeholder="https://twitter.com/..."
              value={form.twitter_url ?? ''}
              onChange={(e) => setForm({ ...form, twitter_url: e.target.value })}
            />
          </div>
        </div>

        {/* ─── FILES & MEDIA ────────────────────────────────────── */}
        <div className="glass-card space-y-6 p-6">
          <h2 className="font-bold text-white text-lg border-b border-brand-900/20 pb-3">Files & Media</h2>

          {/* Avatar */}
          <div>
            <label className="mb-2 block text-sm text-zinc-400">Profile Photo</label>
            {form.avatar_url && (
              <div className="mb-3">
                <img
                  src={form.avatar_url}
                  alt="Avatar preview"
                  className="h-20 w-20 rounded-full object-cover border border-brand-600/20"
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              <input
                type="text"
                className="input flex-1"
                placeholder="Avatar URL or upload below"
                value={form.avatar_url ?? ''}
                onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
              />
              <button
                type="button"
                onClick={() => avatarRef.current?.click()}
                disabled={uploading}
                className="btn-secondary whitespace-nowrap text-sm px-4 py-3"
              >
                {uploading ? 'Uploading…' : 'Upload ↑'}
              </button>
            </div>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && userId)
                  handleUpload(file, 'portfolio-assets', `${userId}/avatar/${file.name}`, 'avatar_url');
              }}
            />
          </div>

          {/* Resume */}
          <div>
            <label className="mb-2 block text-sm text-zinc-400">Resume PDF</label>
            {form.resume_url && (
              <a
                href={form.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-3 inline-flex text-sm text-brand-400 hover:underline"
              >
                Current resume ↗
              </a>
            )}
            <div className="flex items-center gap-3">
              <input
                type="text"
                className="input flex-1"
                placeholder="Resume URL or upload below"
                value={form.resume_url ?? ''}
                onChange={(e) => setForm({ ...form, resume_url: e.target.value })}
              />
              <button
                type="button"
                onClick={() => resumeRef.current?.click()}
                disabled={uploading}
                className="btn-secondary whitespace-nowrap text-sm px-4 py-3"
              >
                {uploading ? 'Uploading…' : 'Upload ↑'}
              </button>
            </div>
            <input
              ref={resumeRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && userId)
                  handleUpload(file, 'portfolio-assets', `${userId}/resume/${file.name}`, 'resume_url');
              }}
            />
          </div>
        </div>

        {/* ─── SAVE ─────────────────────────────────────────────── */}
        <div className="flex justify-end">
          <button
            id="admin-profile-save"
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Saving…
              </>
            ) : (
              'Save Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
