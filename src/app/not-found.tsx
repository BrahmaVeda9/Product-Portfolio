import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center section-dark">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: 'rgba(122,12,10,0.3)' }} />

      <div className="relative">
        <div className="mb-4 text-8xl font-black" style={{ color: '#E8D2B5', opacity: 0.6 }}>404</div>
        <h1 className="mb-4 text-3xl font-black" style={{ color: '#E8D2B5' }}>Page Not Found</h1>
        <p className="mb-8 max-w-md" style={{ color: 'rgba(232,210,181,0.5)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-cream">
            ← Go Home
          </Link>
          <Link href="/projects" className="btn-ghost-dark">
            View Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
