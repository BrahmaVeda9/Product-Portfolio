'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/',           label: 'Home' },
  { href: '/about',      label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects',   label: 'Projects' },
  { href: '/skills',     label: 'Skills' },
  { href: '/contact',    label: 'Contact' },
];

export default function Navbar() {
  const pathname  = usePathname();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-white/[0.06] bg-[#090e1c]/90 backdrop-blur-2xl shadow-lg shadow-black/20'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* ── Logo ── */}
        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          {/* Monogram */}
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-br from-gold-300 to-gold-500 opacity-90" />
            <span className="relative text-sm font-black text-navy-950 leading-none">PM</span>
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-white tracking-tight">Product Portfolio</span>
            <span className="text-[10px] font-medium text-zinc-400 tracking-wide">AI · GenAI · Enterprise SaaS</span>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden items-center gap-0.5 rounded-full border border-white/[0.07] bg-white/[0.03] p-1.5 backdrop-blur-md md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all duration-200',
                  isActive
                    ? 'bg-white/[0.12] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── CTA ── */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/about#resume"
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            Resume / CV
          </Link>
          <Link
            href="/contact"
            className="btn-gold text-xs px-5 py-2"
          >
            Get In Touch →
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition-colors hover:text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5">
            <span className={cn('h-0.5 w-4 bg-current transition-all duration-300', mobileOpen && 'translate-y-2 rotate-45')} />
            <span className={cn('h-0.5 w-4 bg-current transition-all duration-300', mobileOpen && 'opacity-0')} />
            <span className={cn('h-0.5 w-4 bg-current transition-all duration-300', mobileOpen && '-translate-y-2 -rotate-45')} />
          </div>
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {mobileOpen && (
        <div className="border-b border-white/[0.07] bg-[#0e1628]/97 px-6 py-5 backdrop-blur-2xl md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
                  pathname === link.href
                    ? 'bg-white/[0.08] text-white'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-white/[0.08] flex flex-col gap-2">
              <Link
                href="/about#resume"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-center text-sm font-medium text-zinc-300 hover:text-white"
              >
                Resume / CV
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="btn-gold justify-center text-xs py-2.5"
              >
                Get In Touch →
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
