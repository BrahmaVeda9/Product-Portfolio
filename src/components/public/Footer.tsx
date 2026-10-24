import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.06] bg-[#07080d]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 text-base font-semibold text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] text-xs font-bold text-white">
                P
              </span>
              <span className="tracking-tight">Product Leadership Portfolio</span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-zinc-400">
              Executive product portfolio showcasing product strategy, architectural decisions, and shipped outcomes across AI/GenAI, Enterprise SaaS, and scalable platforms.
            </p>
            <div className="pt-2">
              <span className="exec-badge-emerald text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available for Executive Leadership & Board Advisory
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Navigation
            </h3>
            <div className="flex flex-col gap-2.5">
              {[
                { href: '/', label: 'Executive Overview' },
                { href: '/about', label: 'Leadership Profile' },
                { href: '/experience', label: 'Career History' },
                { href: '/projects', label: 'Case Studies' },
                { href: '/skills', label: 'Competencies' },
                { href: '/contact', label: 'Direct Inquiries' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-zinc-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Channels
            </h3>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/contact"
                className="text-xs text-zinc-400 transition-colors hover:text-white"
              >
                Send Direct Message →
              </Link>
              <Link
                href="/experience"
                className="text-xs text-zinc-400 transition-colors hover:text-white"
              >
                View Track Record →
              </Link>
              <a
                href="/admin"
                className="text-xs text-zinc-600 transition-colors hover:text-zinc-400 pt-4"
              >
                Admin Portal ↗
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/[0.05] pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row text-xs text-zinc-400">
          <p>© {year} Executive Product Portfolio. All rights reserved.</p>
          <p className="text-zinc-400">Strategic Product Leadership & Engineering Execution</p>
        </div>
      </div>
    </footer>
  );
}
