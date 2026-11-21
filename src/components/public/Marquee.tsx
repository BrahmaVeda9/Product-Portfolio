/** Slow champagne ribbon of focus areas. Pure CSS; static for reduced motion. */
export default function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <div className="marquee-track" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center gap-12 whitespace-nowrap">
          <span className="font-display text-3xl sm:text-4xl italic font-light text-parchment-200/90">{item}</span>
          <span className="text-champagne-400 text-xs">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee py-10 border-y border-white/[0.06]">
      {row(false)}
      {row(true)}
    </div>
  );
}
