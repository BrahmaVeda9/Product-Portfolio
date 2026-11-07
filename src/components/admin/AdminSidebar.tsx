'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { User } from '@supabase/supabase-js';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '🏠', exact: true },
  { href: '/admin/profile', label: 'Profile', icon: '👤', exact: false },
  { href: '/admin/projects', label: 'Projects', icon: '🚀', exact: false },
  { href: '/admin/experience', label: 'Experience', icon: '💼', exact: false },
  { href: '/admin/skills', label: 'Skills', icon: '🎯', exact: false },
];

interface AdminSidebarProps {
  user: User;
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    toast.success('Logged out');
    router.push('/admin/login');
  };

  const isActive = (item: { href: string; exact: boolean }) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="border-b border-brand-900/20 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-sm font-black text-white shadow-glow-brand">
            A
          </div>
          <div>
            <div className="text-sm font-bold text-white">Admin CMS</div>
            <div className="text-xs text-zinc-500 truncate max-w-[140px]">{user.email}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'admin-nav-link',
              isActive(item) && 'active'
            )}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
            {isActive(item) && (
              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-400" />
            )}
          </Link>
        ))}
      </nav>

      {/* View Public Site link */}
      <div className="px-4 pb-2">
        <Link
          href="/"
          target="_blank"
          className="admin-nav-link"
          onClick={() => setMobileOpen(false)}
        >
          <span className="text-lg">🌐</span>
          View Public Site ↗
        </Link>
      </div>

      {/* Logout */}
      <div className="border-t border-brand-900/20 px-4 py-4">
        <button
          id="admin-logout-btn"
          onClick={handleLogout}
          disabled={loggingOut}
          className="admin-nav-link w-full text-red-400 hover:bg-red-900/20 hover:text-red-300"
        >
          <span className="text-lg">{loggingOut ? '⏳' : '🚪'}</span>
          {loggingOut ? 'Logging out…' : 'Log Out'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-brand-900/20 bg-surface-900 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-brand-900/20 bg-surface-900 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand text-xs font-black text-white">
            A
          </span>
          Admin CMS
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-zinc-400"
          aria-label="Toggle admin menu"
        >
          <span className="text-xl">{mobileOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-brand-900/20 bg-surface-900">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
