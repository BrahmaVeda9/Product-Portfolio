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
    <footer className="section-dark border-t border-[#E8D2B5]/08">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-5 lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 w-fit">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden">
                <span className="absolute inset-0 bg-[#E8D2B5]" />
                <span className="relative text-sm font-black text-[#590907] leading-none">PM</span>
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-[#E8D2B5] tracking-tight">Product Portfolio</span>
                <span className="text-[10px] font-medium text-[#E8D2B5]/40 tracking-wide">AI · GenAI · Enterprise SaaS</span>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-[#E8D2B5]/55">
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
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#E8D2B5]/40">
              Navigation
            </h3>
            <div className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#E8D2B5]/55 transition-colors hover:text-[#E8D2B5]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#E8D2B5]/40">
              Get In Touch
            </h3>
            <div className="flex flex-col gap-2.5">
              <Link href="/contact" className="text-sm text-[#E8D2B5]/55 transition-colors hover:text-[#E8D2B5]">
                Send a Message →
              </Link>
              <Link href="/experience" className="text-sm text-[#E8D2B5]/55 transition-colors hover:text-[#E8D2B5]">
                View Career History →
              </Link>
              <Link href="/projects" className="text-sm text-[#E8D2B5]/55 transition-colors hover:text-[#E8D2B5]">
                Browse Case Studies →
              </Link>
              <a
                href="/admin"
                className="text-xs text-[#E8D2B5]/25 transition-colors hover:text-[#E8D2B5]/45 mt-4"
              >
                Admin Portal ↗
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-[#E8D2B5]/06 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8D2B5]/35">
          <p>© {year} Product Leadership Portfolio. All rights reserved.</p>
          <p className="text-[#E8D2B5]/25">Strategic Product Leadership · AI/GenAI · Enterprise SaaS</p>
        </div>
      </div>
    </footer>
  );
}
