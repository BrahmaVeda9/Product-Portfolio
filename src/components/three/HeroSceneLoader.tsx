'use client';

import dynamic from 'next/dynamic';

// three.js is client-only and heavy: load it lazily, after first paint.
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

export default function HeroSceneLoader() {
  return <HeroScene />;
}
