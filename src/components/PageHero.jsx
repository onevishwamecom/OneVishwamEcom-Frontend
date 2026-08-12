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
    <section className="bg-gradient-to-br from-brand-navy via-[#102a52] to-brand-navy text-white relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className={`max-w-3xl ${align} flex-1`}>
            {eyebrow && (
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-400 mb-2">
                {eyebrow}
              </p>
            )}
            {title && (
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight text-white">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-4 text-base sm:text-lg text-white/90 max-w-xl font-normal leading-relaxed">
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
