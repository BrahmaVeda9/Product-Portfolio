interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children?: React.ReactNode;
}

/** Shared editorial header for inner pages. */
export default function PageHeader({ eyebrow, title, intro, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden pt-40 pb-20 sm:pt-48 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 page-glow" />
      <div className="relative lux-container">
        <span className="eyebrow rise">{eyebrow}</span>
        <h1 className="rise rise-1 font-display mt-8 max-w-5xl text-[2.9rem] leading-[1.02] sm:text-7xl lg:text-[5.5rem] font-light text-parchment-100">
          {title}
        </h1>
        {intro && (
          <p className="rise rise-2 mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-taupe-300 font-light">
            {intro}
          </p>
        )}
        {children && <div className="rise rise-3 mt-10">{children}</div>}
        <div className="hairline mt-16 sm:mt-20" />
      </div>
    </section>
  );
}
