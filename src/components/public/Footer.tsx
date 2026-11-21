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
    <footer className="section-dark border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-5 lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 w-fit">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-br from-gold-300 to-gold-500 opacity-90" />
                <span className="relative text-sm font-black text-navy-950 leading-none">PM</span>
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-white tracking-tight">Product Portfolio</span>
                <span className="text-[10px] font-medium text-zinc-500 tracking-wide">AI · GenAI · Enterprise SaaS</span>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
              Executive product portfolio showcasing product strategy, architectural decisions, and shipped outcomes across AI/GenAI, Enterprise SaaS, and scalable platforms.
            </p>

            {/* Available badge */}
            <div className="badge-available w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Open to Executive Leadership Roles
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Navigation
            </h3>
            <div className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Get In Touch
            </h3>
            <div className="flex flex-col gap-2.5">
              <Link href="/contact" className="text-sm text-zinc-400 transition-colors hover:text-white">
                Send a Message →
              </Link>
              <Link href="/experience" className="text-sm text-zinc-400 transition-colors hover:text-white">
                View Career History →
              </Link>
              <Link href="/projects" className="text-sm text-zinc-400 transition-colors hover:text-white">
                Browse Case Studies →
              </Link>
              <a
                href="/admin"
                className="text-xs text-zinc-600 transition-colors hover:text-zinc-400 mt-4"
              >
                Admin Portal ↗
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {year} Product Leadership Portfolio. All rights reserved.</p>
          <p className="text-zinc-600">Strategic Product Leadership · AI/GenAI · Enterprise SaaS</p>
        </div>
      </div>
    </footer>
  );
}
