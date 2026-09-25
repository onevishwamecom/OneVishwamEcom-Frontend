import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { marketplaceCategories } from '../data/categoriesData';

/**
 * VerticalRibbonBar:
 * Premium marquee rotating banner for all active business verticals.
 * Shows ONLY categories with live products.
 * Pauses smoothly in-place on hover without jumping or restarting.
 */
export default function VerticalRibbonBar() {
  const location = useLocation();
  const scrollRef = useRef(null);

  // Render exclusively on the Home page
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  if (!isHomePage) {
    return null;
  }

  const isVerticalActive = (href) => {
    if (!href) return false;
    return location.pathname === href || (href !== '/' && location.pathname.startsWith(href));
  };

  // Filter to show ONLY categories with live products
  const activeProductCategories = marketplaceCategories.filter((cat) => !cat.disabled);

  // Repeat items enough times for seamless continuous marquee loop
  const ribbonItems = Array.from({ length: 6 }, () => activeProductCategories).flat();

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-slate-900 border-t border-b border-slate-800 shadow-sm select-none relative z-30">
      <div className="max-w-[1500px] mx-auto flex items-center px-1.5 sm:px-3 py-2 gap-2">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="shrink-0 h-10 w-7 sm:w-8 rounded-xl bg-slate-800/90 hover:bg-brand-blue hover:text-white text-slate-300 flex items-center justify-center transition-colors text-xs cursor-pointer border border-slate-700/60 shadow-xs z-10"
          title="Scroll Left"
          aria-label="Scroll Ribbon Left"
        >
          <i className="fa-solid fa-chevron-left text-[11px]" />
        </button>

        {/* Ribbon Marquee Track Container */}
        <div
          ref={scrollRef}
          className="ribbon-track flex-1 overflow-hidden relative"
        >
          <div className="flex items-center gap-2.5 whitespace-nowrap w-max animate-ribbon-rtl py-0.5">
            {ribbonItems.map((cat, idx) => {
              const active = isVerticalActive(cat.href);

              return (
                <Link
                  key={`${cat.id}-${idx}`}
                  to={cat.href}
                  className={`group relative overflow-hidden shrink-0 flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all duration-300 cursor-pointer w-[210px] sm:w-[240px] h-[52px] sm:h-[56px] border ${
                    active
                      ? 'border-amber-400 ring-2 ring-amber-400/80 shadow-md scale-[1.02]'
                      : 'border-white/15 hover:border-white/40 shadow-xs'
                  }`}
                >
                  {/* Background Picture */}
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 pointer-events-none"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-800" />
                  )}

                  {/* Dark Gradient Overlay for High Contrast White Text */}
                  <div
                    className={`absolute inset-0 transition-colors duration-300 ${
                      active
                        ? 'bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-amber-950/70'
                        : 'bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-900/60 group-hover:from-slate-950/80 group-hover:to-slate-900/50'
                    }`}
                  />

                  {/* Active Gold Glow Accent */}
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />
                  )}

                  {/* Icon Glass Badge */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs backdrop-blur-md border transition-all ${
                      active
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-xs'
                        : 'bg-white/15 text-white border-white/20 group-hover:bg-white/25'
                    }`}
                  >
                    <i className={cat.icon} />
                  </div>

                  {/* Caption & Subtitle in Clean White */}
                  <div className="relative z-10 flex-1 min-w-0 flex flex-col justify-center">
                    <h4
                      className={`text-xs sm:text-[13px] font-extrabold tracking-tight truncate leading-tight ${
                        active
                          ? 'text-amber-300'
                          : 'text-white group-hover:text-amber-200 transition-colors'
                      }`}
                    >
                      {cat.label}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-200/85 font-medium truncate mt-0.5 leading-none">
                      {cat.shortDesc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="shrink-0 h-10 w-7 sm:w-8 rounded-xl bg-slate-800/90 hover:bg-brand-blue hover:text-white text-slate-300 flex items-center justify-center transition-colors text-xs cursor-pointer border border-slate-700/60 shadow-xs z-10"
          title="Scroll Right"
          aria-label="Scroll Ribbon Right"
        >
          <i className="fa-solid fa-chevron-right text-[11px]" />
        </button>
      </div>
    </div>
  );
}
