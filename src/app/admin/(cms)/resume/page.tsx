'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminResumePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingUrl, setSavingUrl] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [manualUrl, setManualUrl] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from('profiles')
        .select('full_name, resume_url')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setResumeUrl(data.resume_url ?? '');
        setManualUrl(data.resume_url ?? '');
        setFullName(data.full_name ?? '');
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleUploadFile = async (file: File) => {
    if (!userId) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a PDF file (.pdf).');
      return;
    }

    // Limit size to 15MB
    if (file.size > 15 * 1024 * 1024) {
      toast.error('File size exceeds 15MB limit.');
      return;
    }

    setUploading(true);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${userId}/resume/${Date.now()}-${sanitizedName}`;

    const { data, error } = await supabase.storage
      .from('portfolio-assets')
      .upload(path, file, { upsert: true });

    if (error) {
      toast.error(`Upload error: ${error.message}`);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(data.path);

    // Save directly to profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ resume_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (profileError) {
      toast.error(`Error updating profile: ${profileError.message}`);
      setUploading(false);
      return;
    }

    setResumeUrl(publicUrl);
    setManualUrl(publicUrl);
    toast.success('Resume uploaded & published to portfolio!');
    setUploading(false);
  };

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSavingUrl(true);
    const trimmed = manualUrl.trim();

    const { error } = await supabase
      .from('profiles')
      .update({ resume_url: trimmed || null, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      toast.error(`Failed to save: ${error.message}`);
    } else {
      setResumeUrl(trimmed);
      toast.success(trimmed ? 'Resume link updated!' : 'Resume link removed!');
    }
    setSavingUrl(false);
  };

  const handleRemoveResume = async () => {
    if (!userId) return;
    if (!confirm('Are you sure you want to remove the resume from your portfolio?')) return;

    const { error } = await supabase
      .from('profiles')
      .update({ resume_url: null, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      toast.error(`Error: ${error.message}`);
    } else {
      setResumeUrl('');
      setManualUrl('');
      toast.success('Resume removed from portfolio.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center pt-16 lg:pt-0">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pt-16 lg:pt-0">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <span>Resume / CV Management</span>
            <span className="text-2xl">📄</span>
          </h1>
          <p className="mt-1 text-zinc-400">
            Upload your Executive CV PDF to display direct download links across your portfolio.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs self-start sm:self-auto"
        >
          View Live Portfolio ↗
        </a>
      </div>

      {/* ── Status Card ── */}
      <div className={`glass-card p-6 border ${resumeUrl ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-amber-500/30 bg-amber-950/10'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border text-2xl ${
              resumeUrl
                ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                : 'border-amber-500/30 bg-amber-500/15 text-amber-400'
            }`}>
              📄
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  resumeUrl ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${resumeUrl ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {resumeUrl ? 'Active on Portfolio' : 'No Resume Published'}
                </span>
              </div>
              <h3 className="font-bold text-white text-base">
                {resumeUrl ? `${fullName || 'Executive'} CV PDF` : 'Upload your resume to activate download buttons'}
              </h3>
              {resumeUrl && (
                <p className="text-xs text-zinc-400 font-mono truncate max-w-md sm:max-w-xl mt-1">
                  {resumeUrl}
                </p>
              )}
            </div>
          </div>

          {resumeUrl && (
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <span>View / Test PDF</span>
                <span>↗</span>
              </a>
              <button
                type="button"
                onClick={handleRemoveResume}
                className="btn-ghost-dark text-xs py-2 px-3 text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-red-900/30"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Upload & Replace Card ── */}
      <div className="glass-card space-y-6 p-6">
        <div>
          <h2 className="font-bold text-white text-lg border-b border-brand-900/20 pb-3">
            {resumeUrl ? 'Replace or Upload New Resume' : 'Upload Resume PDF'}
          </h2>
          <p className="text-xs text-zinc-500 mt-2">
            Upload your latest PDF resume. Once uploaded, it is automatically updated everywhere on your portfolio in real time.
          </p>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 text-center ${
            dragActive
              ? 'border-brand-400 bg-brand-500/10 scale-[1.01]'
              : 'border-zinc-700/60 bg-zinc-900/30 hover:border-brand-500/50 hover:bg-zinc-900/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUploadFile(file);
            }}
          />

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-2xl text-zinc-300 mb-3 border border-zinc-700">
            {uploading ? (
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            ) : (
              '⬆'
            )}
          </div>

          <p className="text-sm font-semibold text-white">
            {uploading ? 'Uploading resume to Supabase Storage…' : 'Click to upload or drag & drop PDF here'}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Supports PDF format up to 15MB.
          </p>
        </div>

        {/* Or Paste Direct Link */}
        <div className="pt-2">
          <form onSubmit={handleManualSave} className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Or provide an external PDF link (Google Drive, Dropbox, Custom Domain)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                className="input flex-1 text-sm font-mono"
                placeholder="https://.../resume.pdf"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
              />
              <button
                type="submit"
                disabled={savingUrl}
                className="btn-secondary whitespace-nowrap text-xs px-4"
              >
                {savingUrl ? 'Saving…' : 'Save URL'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Where it appears on Portfolio ── */}
      <div className="glass-card space-y-4 p-6">
        <h2 className="font-bold text-white text-lg border-b border-brand-900/20 pb-3">
          Portfolio Integration Points
        </h2>
        <p className="text-xs text-zinc-400">
          When a resume is uploaded, the following interactive touchpoints automatically light up on your live portfolio:
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/06 bg-white/[0.02] p-4 flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400 font-bold text-xs flex-shrink-0">
              01
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Header Navigation Bar</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                The top-right &ldquo;Resume / CV&rdquo; button directly opens your resume in a new tab.
              </p>
              <Link href="/" target="_blank" className="text-xs text-brand-400 hover:underline mt-2 inline-block">
                Preview in Navbar ↗
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-white/06 bg-white/[0.02] p-4 flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500/20 text-gold-400 font-bold text-xs flex-shrink-0">
              02
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Home Page Hero</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Displays the prominent &ldquo;Download CV ↓&rdquo; action button right next to &ldquo;View Case Studies&rdquo;.
              </p>
              <Link href="/" target="_blank" className="text-xs text-gold-400 hover:underline mt-2 inline-block">
                Preview Home Hero ↗
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-white/06 bg-white/[0.02] p-4 flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400 font-bold text-xs flex-shrink-0">
              03
            </div>
            <div>
              <p className="text-sm font-semibold text-white">About Page</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Displays &ldquo;Download Executive CV&rdquo; in the leadership profile card sidebar.
              </p>
              <Link href="/about" target="_blank" className="text-xs text-teal-400 hover:underline mt-2 inline-block">
                Preview About Page ↗
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-white/06 bg-white/[0.02] p-4 flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 font-bold text-xs flex-shrink-0">
              04
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Contact Page</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Shows a dedicated &ldquo;Download Executive CV PDF ↓&rdquo; documentation card.
              </p>
              <Link href="/contact" target="_blank" className="text-xs text-purple-400 hover:underline mt-2 inline-block">
                Preview Contact Page ↗
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── PM Resume Strategy Guide ── */}
      <div className="glass-card p-6 border border-brand-500/20 bg-brand-950/20">
        <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
          <span>💡</span>
          <span>Is it recommended to keep a Resume in a Product Manager Portfolio?</span>
        </h3>
        <p className="text-xs text-zinc-300 leading-relaxed">
          <strong>Yes, absolutely.</strong> Recruiters, VPs of Product, and C-level hiring managers frequently need an ATS-ready PDF to forward to interview panels or committee reviews. While case studies prove your strategic and execution depth, your CV provides a fast, standardized timeline of titles, company scale, ARR, and tenure.
        </p>
      </div>
    </div>
  );
}
