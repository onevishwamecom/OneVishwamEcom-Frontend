import { Link } from 'react-router-dom';

const DEFAULT_BG = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80';

/**
 * PageHero
 * Premium Deep Brand Navy/Blue Gradient interior page hero with architectural imagery,
 * soft ambient glow lights, and crisp white typography.
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
    <section className={`relative w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] overflow-hidden bg-gradient-to-b from-[#9eb3c9] via-[#b0c4d9] to-[#94abc2] text-white flex items-center ${className}`}>
      {/* ── Ambient Soft Glow Lights (Balanced Slate & Muted Cool Tones matching Home Hero) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[380px] bg-gradient-to-tr from-slate-500/20 via-sky-500/15 to-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 left-10 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl" />
        <div className="absolute -top-10 right-10 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl" />
      </div>

      {/* Background Image Layer with Home Hero Filter Overlay */}
      {image && (
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none opacity-75"
          loading="eager"
        />
      )}

      {/* Balanced Slate Overlay matching Home Hero */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8fa5bc]/40 via-[#a1b7cd]/30 to-[#859cb3]/50 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#859cb3] via-[#859cb3]/50 to-transparent pointer-events-none" />

      {/* Luminous Text Scrim for Guaranteed Razor-Sharp Legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/40 to-transparent pointer-events-none" />

      {/* Subtle Bottom Border Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-slate-300/40 pointer-events-none z-10" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 w-full">
        <div className="max-w-3xl">
          {/* Eyebrow Badge */}
          {eyebrowLabel && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/20 shadow-md mb-2 sm:mb-2.5">
              {eyebrowIcon && <i className={`${eyebrowIcon} text-xs text-[#90dafc]`} />}
              <span className="tracking-wide">{eyebrowLabel}</span>
            </div>
          )}

          {/* Title — capped at 2 lines with crystal clear high contrast & glowing brand highlight */}
          {title && (
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black tracking-tight leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] line-clamp-2 [&_.text-yellow-400]:text-[#90dafc] [&_.text-yellow-400]:font-black [&_.text-yellow-400]:drop-shadow-[0_2px_8px_rgba(144,218,252,0.4)] [&_.text-amber-400]:text-[#90dafc] [&_.text-amber-400]:font-black [&_.text-amber-400]:drop-shadow-[0_2px_8px_rgba(144,218,252,0.4)]">
              {title}
            </h1>
          )}

          {/* Subtitle — capped at 2 lines */}
          {subtitle && (
            <p className="mt-2 text-xs sm:text-sm lg:text-[15px] text-slate-100 font-medium leading-relaxed max-w-2xl line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              {subtitle}
            </p>
          )}

          {/* CTAs */}
          {ctas.length > 0 && (
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-3">
              {ctas.map((cta) => {
                const btnClass = cta.primary
                  ? 'inline-flex items-center gap-2 bg-action-primary hover:bg-action-primary-hover text-action-primary-text px-5 sm:px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer border border-action-primary-border'
                  : 'inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm border border-white/30 backdrop-blur-xs transition-all shadow-xs hover:shadow active:scale-95 cursor-pointer';

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
