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
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-ink-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_120%,rgba(201,169,110,0.10),transparent_70%)]" />
      <div className="relative lux-container pt-24 pb-10">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Sign-off */}
          <div className="lg:col-span-6">
            <span className="eyebrow">Open to executive leadership roles</span>
            <p className="font-display mt-8 text-5xl sm:text-6xl font-light leading-[1.02] text-parchment-100">
              Let&apos;s build what<br />
              <span className="italic text-champagne">comes next.</span>
            </p>
            <Link href="/contact" className="btn-lux mt-10">
              Start a conversation <span className="btn-arrow">→</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3 lg:col-start-8">
            <h3 className="label">Navigation</h3>
            <ul className="mt-6 space-y-3.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-lux text-sm text-taupe-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h3 className="label">Elsewhere</h3>
            <ul className="mt-6 space-y-3.5 text-sm">
              <li><Link href="/contact" className="link-lux text-taupe-300">Send a message</Link></li>
              <li><Link href="/experience" className="link-lux text-taupe-300">Career history</Link></li>
              <li><Link href="/projects" className="link-lux text-taupe-300">Case studies</Link></li>
            </ul>
          </div>
        </div>

        {/* Oversized wordmark */}
        <div className="mt-24 select-none overflow-hidden" aria-hidden="true">
          <p className="font-display whitespace-nowrap text-[10.5vw] xl:text-[9.4rem] leading-[0.9] font-light italic text-transparent [-webkit-text-stroke:1px_rgba(201,169,110,0.22)]">
            Product Portfolio
          </p>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-4 border-t border-white/[0.06] pt-8 text-xs text-taupe-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Product Leadership Portfolio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="uppercase tracking-[0.22em] text-[0.62rem]">AI · GenAI · Enterprise SaaS</span>
            <a href="/admin" className="transition-colors hover:text-taupe-300">Admin ↗</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
