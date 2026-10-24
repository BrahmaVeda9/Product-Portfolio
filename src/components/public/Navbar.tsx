'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/skills', label: 'Skills' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
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
          ? 'border-b border-white/[0.07] bg-[#090a0f]/85 backdrop-blur-xl shadow-lg shadow-black/20'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo / Monogram */}
        <Link
          href="/"
          className="group flex items-center gap-3 text-sm font-semibold tracking-tight text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] text-xs font-bold text-white transition-colors group-hover:border-white/30 group-hover:bg-white/10">
            P
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white tracking-tight">Product Leadership</span>
            <span className="text-[10px] font-medium text-zinc-500 -mt-0.5">Portfolio & Case Studies</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1.5 backdrop-blur-md md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all duration-200',
                  isActive
                    ? 'bg-white/[0.1] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/contact"
            className="exec-btn-primary text-xs px-4 py-2 font-semibold shadow-none border border-white/20"
          >
            Get In Touch →
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-300 transition-colors hover:text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={cn(
                'h-0.5 w-4 bg-current transition-all duration-300',
                mobileOpen && 'translate-y-2 rotate-45'
              )}
            />
            <span
              className={cn(
                'h-0.5 w-4 bg-current transition-all duration-300',
                mobileOpen && 'opacity-0'
              )}
            />
            <span
              className={cn(
                'h-0.5 w-4 bg-current transition-all duration-300',
                mobileOpen && '-translate-y-2 -rotate-45'
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-b border-white/[0.08] bg-[#0c0e17]/95 px-6 py-5 backdrop-blur-2xl md:hidden">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                  pathname === link.href
                    ? 'bg-white/[0.1] text-white'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="exec-btn-primary mt-4 justify-center text-xs"
            >
              Get In Touch →
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
