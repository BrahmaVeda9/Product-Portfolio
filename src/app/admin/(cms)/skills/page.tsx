'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { Skill, SkillCategory } from '@/types/database.types';

const CATEGORIES: SkillCategory[] = ['Core PM', 'Technical', 'AI/ML', 'Tools', 'Leadership', 'Other'];
const EMPTY: Omit<Skill, 'id' | 'user_id'> = {
  name: '',
  category: null,
  proficiency: 3,
  display_order: 0,
};

export default function AdminSkillsPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string>('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState<Omit<Skill, 'id' | 'user_id'>>(EMPTY);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id)
        .order('display_order', { ascending: true });
      setSkills((data ?? []) as Skill[]);
      setLoading(false);
    }
    load();
  }, []);

  const openEdit = (skill: Skill) => {
    setEditing(skill);
    setForm({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      display_order: skill.display_order,
    });
  };

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Skill name is required.'); return; }
    setSaving(true);

    const payload = { user_id: userId, ...form };

    if (editing) {
      const { error } = await supabase.from('skills').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success('Skill updated!');
      setSkills((prev) => prev.map((s) => (s.id === editing.id ? { ...editing, ...payload } : s)));
    } else {
      const { data, error } = await supabase.from('skills').insert(payload).select().single();
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success('Skill added!');
      setSkills((prev) => [...prev, data as Skill]);
    }

    setEditing(null);
    setForm(EMPTY);
    setSaving(false);
  };

  const handleDelete = async (skill: Skill) => {
    if (!window.confirm(`Delete "${skill.name}"?`)) return;
    const { error } = await supabase.from('skills').delete().eq('id', skill.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Skill deleted');
    setSkills((prev) => prev.filter((s) => s.id !== skill.id));
    if (editing?.id === skill.id) { setEditing(null); setForm(EMPTY); }
  };

  // Group for display
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    const cat = s.category ?? 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-8 pt-16 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Skills</h1>
          <p className="mt-1 text-zinc-500">{skills.length} skills · organize by category and proficiency.</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm">+ Add Skill</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="glass-card space-y-5 p-6">
          <h2 className="font-bold text-white">
            {editing ? `Editing: ${editing.name}` : 'Add Skill'}
          </h2>

          <form id="admin-skills-form" onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">Skill Name *</label>
              <input className="input" placeholder="e.g. Product Roadmapping" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">Category</label>
              <select className="input" value={form.category ?? ''}
                onChange={(e) => setForm({ ...form, category: (e.target.value || null) as SkillCategory | null })}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Proficiency: {form.proficiency}/5
              </label>
              <input type="range" min={1} max={5} step={1}
                className="w-full accent-brand-500"
                value={form.proficiency ?? 3}
                onChange={(e) => setForm({ ...form, proficiency: parseInt(e.target.value) })} />
              <div className="mt-1 flex justify-between text-xs text-zinc-600">
                <span>Beginner</span><span>Expert</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">Display Order</label>
              <input type="number" className="input" min={0} value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
            </div>

            <div className="flex gap-3">
              <button id="skill-save-btn" type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-60">
                {saving ? '…' : editing ? 'Update Skill' : 'Add Skill'}
              </button>
              {editing && (
                <button type="button" onClick={openNew} className="btn-secondary text-sm">Cancel</button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="space-y-4">
          <h2 className="font-bold text-white">All Skills ({skills.length})</h2>
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            </div>
          ) : skills.length === 0 ? (
            <div className="glass-card p-8 text-center text-zinc-500">No skills added yet.</div>
          ) : (
            Object.entries(grouped).map(([cat, catSkills]) => (
              <div key={cat}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">{cat}</p>
                <div className="space-y-2">
                  {catSkills.map((skill) => (
                    <div key={skill.id}
                      className={`glass-card flex items-center gap-3 p-3 transition-all ${editing?.id === skill.id ? 'border-brand-500/40' : ''}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{skill.name}</p>
                        {skill.proficiency && (
                          <div className="mt-1 flex gap-1">
                            {[1,2,3,4,5].map((d) => (
                              <div key={d} className={`h-1.5 w-1.5 rounded-full ${d <= skill.proficiency! ? 'bg-brand-400' : 'bg-zinc-700'}`} />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => openEdit(skill)} className="text-xs text-brand-400 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(skill)} className="text-xs text-red-400 hover:underline">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
