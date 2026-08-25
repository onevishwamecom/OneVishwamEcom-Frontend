import { navigateTo } from '../config/navigation';

/**
 * PageHero
 * The dark navy-to-blue gradient hero block used on interior pages.
 *
 * Props:
 *   eyebrow  – small yellow uppercase label
 *   title    – large white h1
 *   subtitle – white/80 paragraph text
 *   ctas     – array of { label, href, primary, icon? }
 *              primary=true  → yellow filled button
 *              primary=false → ghost/outline button
 *   children – optional JSX rendered below subtitle (e.g. stats strip)
 *   centered – if true, text is centered (default false = left-aligned)
 */
export default function PageHero({ eyebrow, title, subtitle, ctas = [], children, centered = false, logo }) {
  const align = centered ? 'text-center mx-auto' : '';

  return (
    <section className="bg-gradient-to-br from-brand-navy via-brand-blue to-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className={`max-w-3xl ${align} flex-1`}>
            {eyebrow && (
              <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
                {eyebrow}
              </p>
            )}
            {title && (
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-4 text-lg text-white/80 max-w-xl">
                {subtitle}
              </p>
            )}
            {ctas.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-4">
                {ctas.map((cta) =>
                  cta.primary ? (
                    <a
                      key={cta.label}
                      href={cta.href}
                      onClick={(e) => { e.preventDefault(); navigateTo(cta.href); }}
                      className="inline-flex items-center gap-2 bg-yellow-400 text-brand-navy px-6 py-3 rounded-xl font-bold text-sm hover:bg-yellow-300 transition-colors"
                    >
                      {cta.icon && <i className={cta.icon} />}
                      {cta.label}
                    </a>
                  ) : (
                    <a
                      key={cta.label}
                      href={cta.href}
                      onClick={(e) => { e.preventDefault(); navigateTo(cta.href); }}
                      className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold text-sm border border-white/20 hover:bg-white/20 transition-colors"
                    >
                      {cta.icon && <i className={cta.icon} />}
                      {cta.label}
                    </a>
                  )
                )}
              </div>
            )}
            {children}
          </div>
          {logo && (
            <div className="flex-shrink-0 max-w-[280px] md:max-w-sm">
              <img src={logo} alt="OneVishwam Logo" className="w-full h-auto object-contain" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
