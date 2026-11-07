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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-[#A5A79B]/35 bg-[#E8D2B5]/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* ── Brand Logo ── */}
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#590907] text-[#E8D2B5] font-black text-xs tracking-wider shadow-sm transition-transform duration-200 group-hover:scale-105">
            PM
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight text-[#292724]">
              Portfolio
            </span>
            <span className="text-[11px] font-medium text-[#292724]/60">
              Product Leadership
            </span>
          </div>
        </Link>

        {/* ── Desktop Navigation ── */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-[#A5A79B]/40 bg-[#E8D2B5]/60 p-1.5 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200',
                  isActive
                    ? 'bg-[#590907] text-[#E8D2B5] shadow-sm'
                    : 'text-[#292724]/75 hover:text-[#590907] hover:bg-[#A5A79B]/20'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Desktop CTAs ── */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/about#resume"
            className="rounded-full border border-[#A5A79B]/45 bg-[#E8D2B5]/50 px-4 py-2 text-xs font-semibold text-[#292724] hover:border-[#590907] hover:text-[#590907] transition-all"
          >
            Resume
          </Link>
          <Link
            href="/contact"
            className="btn-burgundy text-xs py-2 px-5"
          >
            Get In Touch
          </Link>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#A5A79B]/50 bg-[#E8D2B5] text-[#292724] transition-colors md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <div className="flex flex-col gap-1.5">
            <span className={cn('h-0.5 w-4 bg-current transition-all duration-300', mobileOpen && 'translate-y-2 rotate-45')} />
            <span className={cn('h-0.5 w-4 bg-current transition-all duration-300', mobileOpen && 'opacity-0')} />
            <span className={cn('h-0.5 w-4 bg-current transition-all duration-300', mobileOpen && '-translate-y-2 -rotate-45')} />
          </div>
        </button>
      </div>

      {/* ── Mobile Dropdown ── */}
      {mobileOpen && (
        <div className="border-b border-[#A5A79B]/30 bg-[#E8D2B5] px-6 py-5 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-xl px-4 py-2.5 text-sm font-semibold transition-all',
                  pathname === link.href
                    ? 'bg-[#590907] text-[#E8D2B5]'
                    : 'text-[#292724]/80 hover:bg-[#A5A79B]/20 hover:text-[#590907]'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-[#A5A79B]/30 flex flex-col gap-2">
              <Link
                href="/about#resume"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-[#A5A79B]/40 bg-[#A5A79B]/15 px-4 py-2.5 text-center text-sm font-semibold text-[#292724]"
              >
                Resume / CV
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="btn-burgundy justify-center text-sm py-2.5"
              >
                Get In Touch
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
