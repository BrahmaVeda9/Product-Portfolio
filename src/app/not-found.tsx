import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
};

export default function NotFound() {
  return (
    <div className="lux relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_50%_50%,rgba(201,169,110,0.12),transparent_70%)]" />
      <div className="relative">
        <p className="font-display text-[9rem] sm:text-[12rem] leading-none font-light italic text-champagne">404</p>
        <h1 className="font-display mt-4 text-4xl font-light text-parchment-100">This page has moved on.</h1>
        <p className="mx-auto mt-5 max-w-md text-taupe-300">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-lux">← Go home</Link>
          <Link href="/projects" className="btn-lux-ghost">View projects</Link>
        </div>
      </div>
    </div>
  );
}
