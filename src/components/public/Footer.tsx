import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  const navLinks = [
    { href: '/',           label: 'Home' },
    { href: '/about',      label: 'About' },
    { href: '/experience', label: 'Experience' },
    { href: '/projects',   label: 'Projects' },
    { href: '/skills',     label: 'Skills' },
    { href: '/contact',    label: 'Contact' },
  ];

  return (
    <footer className="bg-[#A5A79B] border-t border-[#292724]/10 text-[#292724]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 w-fit">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#590907] text-[#E8D2B5] font-black text-xs">
                PM
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold tracking-tight text-[#292724]">Product Portfolio</span>
                <span className="text-[10px] font-semibold text-[#590907]">AI · SaaS · Product Architecture</span>
              </div>
            </Link>

            <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-[#292724]/75">
              Executive product portfolio showcasing product strategy, architectural decisions, and delivered impact across high-growth ventures and enterprise systems.
            </p>

            <div className="badge-available bg-[#ffffff]/60 border-[#292724]/15">
              <span className="h-1.5 w-1.5 rounded-full bg-[#590907]" />
              <span className="text-xs font-semibold text-[#292724]">Available for Executive Leadership</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#590907]">
              Navigation
            </h3>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs sm:text-sm font-medium text-[#292724]/80 hover:text-[#590907] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#590907]">
              Get In Touch
            </h3>
            <div className="flex flex-col gap-2 text-xs sm:text-sm">
              <Link href="/contact" className="font-semibold text-[#590907] hover:underline">
                Start a Conversation →
              </Link>
              <Link href="/experience" className="text-[#292724]/80 hover:text-[#590907] transition-colors">
                Review Career History
              </Link>
              <Link href="/projects" className="text-[#292724]/80 hover:text-[#590907] transition-colors">
                Explore Case Studies
              </Link>
              <a
                href="/admin"
                className="text-[11px] text-[#292724]/50 hover:text-[#590907] transition-colors mt-3"
              >
                Admin Portal ↗
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-[#292724]/12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#292724]/60">
          <p>© {year} Product Portfolio. All rights reserved.</p>
          <p className="font-mono text-[11px]">Personal Product Brand · 60% Cream / 30% Sage / 10% Burgundy</p>
        </div>
      </div>
    </footer>
  );
}
