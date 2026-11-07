import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin Dashboard' };

async function getDashboardStats() {
  const supabase = await createServerSupabaseClient();

  const [
    { count: totalProjects },
    { count: publishedProjects },
    { count: draftProjects },
    { count: experienceCount },
    { count: skillsCount },
    profileRes,
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('experience').select('*', { count: 'exact', head: true }),
    supabase.from('skills').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('full_name, headline').limit(1).maybeSingle(),
  ]);

  return {
    totalProjects: totalProjects ?? 0,
    publishedProjects: publishedProjects ?? 0,
    draftProjects: draftProjects ?? 0,
    experienceCount: experienceCount ?? 0,
    skillsCount: skillsCount ?? 0,
    profile: profileRes.data,
  };
}

const quickLinks = [
  { href: '/admin/profile', label: 'Edit Profile', icon: '👤', desc: 'Update headline, bio, and contact info' },
  { href: '/admin/projects/new', label: 'New Project', icon: '➕', desc: 'Create a new case study' },
  { href: '/admin/experience', label: 'Experience', icon: '💼', desc: 'Manage work history' },
  { href: '/admin/skills', label: 'Skills', icon: '🎯', desc: 'Add and organize skills' },
];

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8 pt-16 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">
          Welcome back{stats.profile?.full_name ? `, ${stats.profile.full_name.split(' ')[0]}` : ''}! 👋
        </h1>
        <p className="mt-1 text-zinc-500">
          {stats.profile?.headline ?? 'Manage your portfolio from here.'}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Total Projects</p>
          <p className="text-3xl font-black gradient-text">{stats.totalProjects}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Published</p>
          <p className="text-3xl font-black text-green-400">{stats.publishedProjects}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Drafts</p>
          <p className="text-3xl font-black text-amber-400">{stats.draftProjects}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Skills Listed</p>
          <p className="text-3xl font-black text-accent-400">{stats.skillsCount}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-white">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="glass-card flex flex-col gap-3 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30"
            >
              <span className="text-3xl">{link.icon}</span>
              <div>
                <p className="font-semibold text-white">{link.label}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Content checklist */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-white">Content Checklist</h2>
        <div className="glass-card divide-y divide-brand-900/20 p-0 overflow-hidden">
          {[
            {
              done: !!(stats.profile?.full_name && stats.profile?.headline),
              label: 'Profile configured',
              link: '/admin/profile',
            },
            {
              done: stats.publishedProjects > 0,
              label: 'At least one project published',
              link: '/admin/projects',
            },
            {
              done: stats.experienceCount > 0,
              label: 'Work experience added',
              link: '/admin/experience',
            },
            {
              done: stats.skillsCount > 0,
              label: 'Skills added',
              link: '/admin/skills',
            },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.link}
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-brand-900/20"
            >
              <div className="flex items-center gap-3">
                <span className={`text-lg ${item.done ? 'text-green-400' : 'text-zinc-600'}`}>
                  {item.done ? '✅' : '⭕'}
                </span>
                <span className={`text-sm ${item.done ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  {item.label}
                </span>
              </div>
              <span className="text-xs text-zinc-600">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Portfolio preview link */}
      <div className="glass-card flex items-center justify-between p-5">
        <div>
          <p className="font-semibold text-white">Preview your portfolio</p>
          <p className="text-sm text-zinc-500">See how your portfolio looks to visitors.</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
          Open Portfolio ↗
        </a>
      </div>
    </div>
  );
}
