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

interface NavbarProps {
  resumeUrl?: string | null;
}

export default function Navbar({ resumeUrl }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href));

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-700',
        scrolled || mobileOpen
          ? 'border-b border-white/[0.06] bg-ink-950/75 backdrop-blur-2xl'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className={cn('lux-container flex items-center justify-between transition-all duration-700', scrolled ? 'py-4' : 'py-6 sm:py-7')}>
        {/* ── Monogram ── */}
        <Link href="/" className="group flex items-center gap-3.5" onClick={() => setMobileOpen(false)}>
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-champagne-400/50 transition-colors duration-500 group-hover:border-champagne-300">
            <span className="font-display text-[1.05rem] italic text-champagne-300 leading-none tracking-tight">PM</span>
          </span>
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-parchment-100">Product Portfolio</span>
            <span className="mt-1 text-[0.62rem] uppercase tracking-[0.22em] text-taupe-400">AI · GenAI · Enterprise SaaS</span>
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] transition-colors duration-500',
                isActive(link.href) ? 'text-champagne-300' : 'text-taupe-300 hover:text-parchment-100'
              )}
            >
              {link.label}
              <span
                className={cn(
                  'absolute -bottom-1 left-0 h-px w-full origin-left bg-champagne-400 transition-transform duration-700',
                  isActive(link.href) ? 'scale-x-100' : 'scale-x-0'
                )}
              />
            </Link>
          ))}
        </nav>

        {/* ── Desktop CTA ── */}
        <div className="hidden items-center gap-7 lg:flex">
          {resumeUrl ? (
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="link-lux text-[0.68rem] font-semibold uppercase tracking-[0.24em]">
              Résumé ↗
            </a>
          ) : (
            <Link href="/about#resume" className="link-lux text-[0.68rem] font-semibold uppercase tracking-[0.24em]">
              Résumé
            </Link>
          )}
          <Link href="/contact" className="btn-lux-ghost !px-5 !py-2.5">
            Get in touch
          </Link>
        </div>

        {/* ── Mobile toggle ── */}
        <button
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-parchment-100 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <span className="relative block h-3 w-5">
            <span className={cn('absolute left-0 top-0 h-px w-5 bg-current transition-all duration-500', mobileOpen && 'top-1.5 rotate-45')} />
            <span className={cn('absolute left-0 bottom-0 h-px w-5 bg-current transition-all duration-500', mobileOpen && 'bottom-1.5 -rotate-45')} />
          </span>
        </button>
      </div>

      {/* ── Mobile overlay ── */}
      <div
        className={cn(
          'absolute inset-x-0 top-full h-[100dvh] bg-ink-950 transition-all duration-700 lg:hidden',
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
      >
        <nav className="lux-container flex h-full flex-col pt-10 pb-28" aria-label="Mobile">
          <div className="flex flex-col">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-baseline justify-between border-b border-white/[0.06] py-4 font-display text-4xl font-light transition-all duration-700',
                  isActive(link.href) ? 'text-champagne-300' : 'text-parchment-100',
                  mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                )}
                style={{ transitionDelay: mobileOpen ? `${80 + i * 50}ms` : '0ms' }}
              >
                {link.label}
                <span className="text-sm text-taupe-500">→</span>
              </Link>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3">
            {resumeUrl ? (
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="btn-lux-ghost">
                Download résumé ↗
              </a>
            ) : (
              <Link href="/about#resume" onClick={() => setMobileOpen(false)} className="btn-lux-ghost">
                Résumé
              </Link>
            )}
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="btn-lux">
              Get in touch <span className="btn-arrow">→</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
