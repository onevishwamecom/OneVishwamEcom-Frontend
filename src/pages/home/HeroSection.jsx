import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

/* ── Slide Data ── */
const HERO_SLIDES = [
  {
    id: 'properties',
    category: 'Real Estate & Properties',
    title: 'Find Your Ideal Plot, Villa or Apartment',
    subtitle: 'Verified residential plots, luxury flats, gated communities & prime commercial land across Bengaluru.',
    link: '/our-services/real-estate-property',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80',
    badgeIcon: 'fa-solid fa-house-chimney',
    ctaText: 'Explore Properties',
    disabled: false,
    alt: 'Luxury villa and modern real estate property',
  },
  {
    id: 'automobile',
    category: 'Automobiles & Vehicles',
    title: 'Premium Cars, Bikes & Commercial Vehicles',
    subtitle: 'Brand-new and certified pre-owned vehicles with hassle-free loan approvals and verified dealers.',
    link: '/coming-soon?sector=automobile',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80',
    badgeIcon: 'fa-solid fa-car',
    ctaText: 'Coming Soon',
    disabled: true,
    alt: 'Premium luxury vehicle on open road',
  },
  {
    id: 'jewellery',
    category: 'Jewellery & Gold',
    title: 'Exquisite Hallmarked Gold & Diamond Jewellery',
    subtitle: 'Certified pure gold, designer bridal sets, diamond rings & flexible easy EMI options.',
    link: '/coming-soon?sector=jewellery',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=80',
    badgeIcon: 'fa-solid fa-gem',
    ctaText: 'Coming Soon',
    disabled: true,
    alt: 'Exquisite hallmarked gold and diamond jewellery',
  },
  {
    id: 'electronics',
    category: 'Electronics & Gadgets',
    title: 'Latest Smartphones, Laptops & Home Appliances',
    subtitle: 'Top electronics brands, computers, smart 4K TVs & instant easy no-cost EMI payment schemes.',
    link: '/coming-soon?sector=electronics',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1800&q=80',
    badgeIcon: 'fa-solid fa-laptop',
    ctaText: 'Coming Soon',
    disabled: true,
    alt: 'Modern smartphones, tech gadgets and laptops',
  },
];

/* ═══════════════════════════════════════════════════════════
   HeroSection — Full-Width Hero Carousel
   ═══════════════════════════════════════════════════════════ */
export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const touchStartX = useRef(0);

  const total = HERO_SLIDES.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  /* Autoplay — pauses on hover / touch */
  useEffect(() => {
    if (isPaused || total <= 1) return;
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [isPaused, current, next, total]);

  /* Touch swiping */
  const onTouchStart = (e) => { touchStartX.current = e.changedTouches[0].screenX; };
  const onTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].screenX;
    if (diff > 50) next();
    else if (diff < -50) prev();
  };

  return (
    <section
      className="relative w-full bg-brand-navy"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured Categories"
    >
      {/* ── Fixed-height viewport ──
          Desktop ≈ 420–460px  |  Tablet ≈ 380px  |  Mobile ≈ 320px
          Guarantees zero layout shift across slides regardless of content length. */}
      <div className="relative w-full h-[400px] sm:h-[460px] md:h-[520px] lg:h-[560px] overflow-hidden group">

        {/* ── Slides ── */}
        {HERO_SLIDES.map((slide, idx) => {
          const active = idx === current;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                active ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!active}
            >
              <Link
                to={slide.link}
                aria-label={`${slide.title} – ${slide.category}`}
                className="relative block w-full h-full cursor-pointer"
              >
                {/* ── Image ── */}
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out ${
                    !slide.disabled ? 'group-hover:scale-[1.04]' : ''
                  }`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  fetchPriority={idx === 0 ? 'high' : 'auto'}
                  draggable={false}
                />

                {/* ── Gradient Overlay — asymmetric, uses brand-navy ──
                    Left: strong brand-navy for text readability
                    Centre: tapers to medium transparency
                    Right: mostly transparent so image stays bright & vibrant */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(to right,
                      rgba(10,31,63,0.92) 0%,
                      rgba(10,31,63,0.78) 30%,
                      rgba(10,31,63,0.40) 55%,
                      rgba(10,31,63,0.08) 80%,
                      transparent 100%)`
                  }}
                />
                {/* Mobile extra bottom vignette for small-screen readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent sm:from-brand-navy/30 pointer-events-none" />

                {/* ── Content — left-aligned, vertically centred ── */}
                <div className="relative h-full flex flex-col justify-center max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
                  <div className="max-w-lg sm:max-w-xl lg:max-w-2xl pl-10 sm:pl-12 lg:pl-14">

                    {/* Category badge */}
                    <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wide uppercase bg-brand-blue text-white shadow">
                        <i className={slide.badgeIcon} />
                        {slide.category}
                      </span>
                      {slide.disabled ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-yellow-400/15 text-yellow-300 border border-yellow-400/25">
                          <i className="fa-solid fa-clock text-[9px]" /> Soon
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-400/25">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                        </span>
                      )}
                    </div>

                    {/* Title — capped at 2 lines */}
                    <h2 className="text-[22px] leading-snug sm:text-3xl md:text-[34px] lg:text-[40px] font-extrabold text-white sm:leading-[1.18] line-clamp-2 drop-shadow-sm">
                      {slide.title}
                    </h2>

                    {/* Subtitle — capped at 2 lines, slightly muted */}
                    <p className="mt-2 sm:mt-3 text-[13px] sm:text-sm lg:text-[15px] text-white/75 line-clamp-2 leading-relaxed max-w-md lg:max-w-lg">
                      {slide.subtitle}
                    </p>

                    {/* CTA */}
                    <div className="mt-4 sm:mt-5 flex items-center gap-3">
                      {!slide.disabled ? (
                        <span className="inline-flex items-center gap-2 bg-yellow-400 text-brand-navy px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all duration-300 group-hover:bg-yellow-300 group-hover:shadow-yellow-400/20 group-hover:translate-x-0.5">
                          {slide.ctaText}
                          <i className="fa-solid fa-arrow-right text-[11px] transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 bg-white/10 text-white/45 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-semibold border border-white/15 cursor-not-allowed select-none backdrop-blur-sm">
                          <i className="fa-solid fa-lock text-[10px]" />
                          {slide.ctaText}
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              </Link>
            </div>
          );
        })}

        {/* ── Left Arrow ── */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-md"
          aria-label="Previous slide"
        >
          <i className="fa-solid fa-chevron-left text-xs" />
        </button>

        {/* ── Right Arrow ── */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-md"
          aria-label="Next slide"
        >
          <i className="fa-solid fa-chevron-right text-xs" />
        </button>

        {/* ── Indicators (bottom-right) ── */}
        <div className="absolute bottom-3 sm:bottom-5 right-4 sm:right-8 z-30 flex items-center gap-2 bg-brand-navy/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/15">
          <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-white/70 select-none tabular-nums">
            {current + 1}/{total}
          </span>
          <div className="w-px h-3 bg-white/20" />
          <div className="flex items-center gap-1.5">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(i); }}
                className={`h-[6px] rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-5 bg-yellow-400'
                    : 'w-[6px] bg-white/35 hover:bg-white/60'
                }`}
                aria-label={`Slide ${i + 1}: ${s.category}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
