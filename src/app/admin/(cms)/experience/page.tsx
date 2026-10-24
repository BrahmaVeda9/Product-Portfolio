'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { Experience } from '@/types/database.types';

const EMPTY: Omit<Experience, 'id' | 'user_id'> = {
  company: '',
  role: '',
  start_date: '',
  end_date: null,
  description: '',
  achievements: [],
  display_order: 0,
};

export default function AdminExperiencePage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string>('');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<Omit<Experience, 'id' | 'user_id'>>(EMPTY);
  const [achievementsInput, setAchievementsInput] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from('experience')
        .select('*')
        .eq('user_id', user.id)
        .order('display_order', { ascending: true });

      setExperiences((data ?? []) as Experience[]);
      setLoading(false);
    }
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setAchievementsInput('');
  };

  const openEdit = (exp: Experience) => {
    setEditing(exp);
    setForm({
      company: exp.company,
      role: exp.role,
      start_date: exp.start_date,
      end_date: exp.end_date ?? null,
      description: exp.description ?? '',
      achievements: exp.achievements ?? [],
      display_order: exp.display_order,
    });
    setAchievementsInput((exp.achievements ?? []).join('\n'));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company || !form.role || !form.start_date) {
      toast.error('Company, role, and start date are required.');
      return;
    }
    setSaving('save');

    const payload = {
      user_id: userId,
      ...form,
      achievements: achievementsInput
        .split('\n')
        .map((a) => a.trim())
        .filter(Boolean),
    };

    if (editing) {
      const { error } = await supabase.from('experience').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); setSaving(null); return; }
      toast.success('Experience updated!');
      setExperiences((prev) => prev.map((e) => (e.id === editing.id ? { ...editing, ...payload } : e)));
    } else {
      const { data, error } = await supabase.from('experience').insert(payload).select().single();
      if (error) { toast.error(error.message); setSaving(null); return; }
      toast.success('Experience added!');
      setExperiences((prev) => [...prev, data as Experience]);
    }

    setEditing(null);
    setForm(EMPTY);
    setAchievementsInput('');
    setSaving(null);
  };

  const handleDelete = async (exp: Experience) => {
    if (!window.confirm(`Delete "${exp.role} at ${exp.company}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('experience').delete().eq('id', exp.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted');
    setExperiences((prev) => prev.filter((e) => e.id !== exp.id));
    if (editing?.id === exp.id) { setEditing(null); setForm(EMPTY); }
  };

  return (
    <div className="space-y-8 pt-16 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Experience</h1>
          <p className="mt-1 text-zinc-500">Manage your work history and achievements.</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm">+ Add Role</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="glass-card space-y-5 p-6">
          <h2 className="font-bold text-white">
            {editing ? `Editing: ${editing.role}` : 'Add New Role'}
          </h2>

          <form id="admin-experience-form" onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">Company *</label>
              <input className="input" placeholder="Acme Corp" value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })} required />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-400">Role / Title *</label>
              <input className="input" placeholder="Senior Product Manager" value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })} required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">Start Date *</label>
                <input type="date" className="input" value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
              </div>
              <div>
                <label className="mb-2 block text-sm text-zinc-400">End Date</label>
                <input type="date" className="input" value={form.end_date ?? ''}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value || null })} />
                <p className="mt-1 text-xs text-zinc-600">Leave blank for current role.</p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">Description</label>
              <textarea className="textarea" rows={3} placeholder="Brief overview of your responsibilities…"
                value={form.description ?? ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Achievements
                <span className="ml-2 text-xs text-zinc-600">(one per line)</span>
              </label>
              <textarea className="textarea" rows={5}
                placeholder={'Launched X, resulting in Y% improvement\nLed team of Z engineers\nDefined product roadmap for…'}
                value={achievementsInput}
                onChange={(e) => setAchievementsInput(e.target.value)} />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">Display Order</label>
              <input type="number" className="input" min={0} value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
            </div>

            <div className="flex gap-3">
              <button id="experience-save-btn" type="submit" disabled={!!saving} className="btn-primary text-sm disabled:opacity-60">
                {saving ? '…' : editing ? 'Update' : 'Add Role'}
              </button>
              {editing && (
                <button type="button" onClick={openNew} className="btn-secondary text-sm">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="space-y-3">
          <h2 className="font-bold text-white">Your Work History ({experiences.length})</h2>
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            </div>
          ) : experiences.length === 0 ? (
            <div className="glass-card p-8 text-center text-zinc-500">
              No experience added yet.
            </div>
          ) : (
            experiences.map((exp) => (
              <div
                key={exp.id}
                className={`glass-card p-4 transition-all ${editing?.id === exp.id ? 'border-brand-500/40' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{exp.role}</p>
                    <p className="text-sm text-brand-400">{exp.company}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      {exp.start_date} — {exp.end_date ?? 'Present'}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(exp)}
                      className="text-xs text-brand-400 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(exp)}
                      className="text-xs text-red-400 hover:underline">Delete</button>
                  </div>
                </div>
                {exp.achievements?.length > 0 && (
                  <p className="mt-2 text-xs text-zinc-600">
                    {exp.achievements.length} achievement{exp.achievements.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
