import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-950 px-6 text-center">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/10 blur-3xl" />

      <div className="relative">
        <div className="mb-4 text-8xl font-black gradient-text">404</div>
        <h1 className="mb-4 text-3xl font-black text-white">Page Not Found</h1>
        <p className="mb-8 max-w-md text-zinc-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary">
            ← Go Home
          </Link>
          <Link href="/projects" className="btn-secondary">
            View Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
