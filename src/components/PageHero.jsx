import { Link } from 'react-router-dom';

const DEFAULT_BG = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80';

/**
 * PageHero
 * Compact interior page hero with background architectural imagery and rich brand-navy gradient overlays.
 *
 * Uses a sleek, reduced interior page height scale:
 *   Mobile  (<640px)   → 280px
 *   Tablet  (640-768px) → 320px
 *   Tablet+ (768-1024px)→ 360px
 *   Desktop (≥1024px)  → 400px
 *
 * Props:
 *   eyebrow   – string or { icon?: string, label: string }
 *   title     – string or JSX (supports <span className="text-yellow-400">...</span>)
 *   subtitle  – string paragraph description
 *   image     – optional background image URL
 *   ctas      – array of { label, href, primary?: boolean, icon?: string, external?: boolean }
 *   children  – optional JSX rendered below or alongside
 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image = DEFAULT_BG,
  ctas = [],
  children,
  className = '',
}) {
  const eyebrowLabel = typeof eyebrow === 'object' ? eyebrow?.label : eyebrow;
  const eyebrowIcon = typeof eyebrow === 'object' ? eyebrow?.icon : 'fa-solid fa-circle-info';

  return (
    <section className={`relative w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] overflow-hidden bg-brand-navy text-white flex items-center ${className}`}>
      {/* Background Image Layer — strictly covers full viewport without affecting container height */}
      {image && (
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
          loading="eager"
        />
      )}

      {/* Strong Bluish Shade Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-navy/90 to-brand-blue/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-brand-navy/40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 w-full">
        <div className="max-w-3xl">
          {/* Eyebrow Badge */}
          {eyebrowLabel && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-xs font-semibold text-yellow-400 backdrop-blur-md border border-white/15 mb-2 sm:mb-2.5">
              {eyebrowIcon && <i className={`${eyebrowIcon} text-xs`} />}
              <span>{eyebrowLabel}</span>
            </div>
          )}

          {/* Title — capped at 2 lines */}
          {title && (
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight line-clamp-2">
              {title}
            </h1>
          )}

          {/* Subtitle — capped at 2 lines */}
          {subtitle && (
            <p className="mt-2 text-xs sm:text-sm lg:text-[15px] text-white/90 leading-relaxed text-justify max-w-2xl line-clamp-2">
              {subtitle}
            </p>
          )}

          {/* CTAs */}
          {ctas.length > 0 && (
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-3">
              {ctas.map((cta) => {
                const btnClass = cta.primary
                  ? 'inline-flex items-center gap-2 bg-yellow-400 text-brand-navy px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-yellow-300 transition-all shadow-lg hover:shadow-yellow-400/25'
                  : 'inline-flex items-center gap-2 bg-white/10 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm';

                if (cta.external) {
                  return (
                    <a
                      key={cta.label}
                      href={cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={btnClass}
                    >
                      {cta.icon && <i className={cta.icon} />}
                      {cta.label}
                    </a>
                  );
                }

                return (
                  <Link key={cta.label} to={cta.href} className={btnClass}>
                    {cta.icon && <i className={cta.icon} />}
                    {cta.label}
                  </Link>
                );
              })}
            </div>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
