import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { marketplaceCategories } from '../data/categoriesData';

/**
 * VerticalRibbonBar:
 * Interactive Ribbon menu bar for all business verticals.
 * Rotates continuously from right to left (RTL).
 * Pauses on hover/click and navigates directly to selected vertical.
 */
export default function VerticalRibbonBar() {
  const [isHovered, setIsHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const location = useLocation();
  const scrollContainerRef = useRef(null);

  // Check if a vertical link is active
  const isVerticalActive = (href) => {
    if (!href) return false;
    return location.pathname === href || (href !== '/' && location.pathname.startsWith(href));
  };

  // Duplicate items 3 times for seamless RTL infinite loop
  const ribbonItems = [...marketplaceCategories, ...marketplaceCategories, ...marketplaceCategories];

  const isPaused = isHovered || userPaused;

  const handleManualScroll = (direction) => {
    if (scrollContainerRef.current) {
      const distance = direction === 'left' ? -240 : 240;
      scrollContainerRef.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-slate-900 border-t border-b border-slate-800 text-white shadow-md relative z-40 select-none overflow-hidden">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-2 sm:px-4 py-1.5 gap-2">
        
        {/* Ribbon Header Tag */}
        <div className="flex items-center gap-1.5 shrink-0 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700/80 shadow-2xs">
          <i className="fa-solid fa-layer-group text-amber-400 text-xs animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-100 hidden sm:inline">
            Verticals Ribbon
          </span>
          <span className="text-[9px] font-extrabold bg-brand-blue/90 text-white px-1.5 py-0.5 rounded tracking-wide">
            RTL
          </span>
        </div>

        {/* Manual Scroll Left Button */}
        <button
          type="button"
          onClick={() => handleManualScroll('left')}
          className="shrink-0 w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-xs border border-slate-700 cursor-pointer"
          title="Scroll Ribbon Left"
          aria-label="Scroll Ribbon Left"
        >
          <i className="fa-solid fa-chevron-left" />
        </button>

        {/* Ribbon Rotator Container */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex-1 overflow-hidden relative py-0.5"
        >
          <div
            className={`flex items-center gap-2 whitespace-nowrap w-max transition-all ${
              isPaused ? 'ribbon-paused' : 'animate-ribbon-rtl'
            }`}
          >
            {ribbonItems.map((cat, idx) => {
              const active = isVerticalActive(cat.href);
              return (
                <Link
                  key={`${cat.id}-${idx}`}
                  to={cat.href}
                  onClick={() => setIsHovered(true)}
                  className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-brand-blue text-white shadow-md ring-2 ring-brand-blue/60 font-bold scale-[1.02]'
                      : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700 hover:text-white hover:scale-[1.02] border border-slate-700/80'
                  }`}
                >
                  <i
                    className={`${cat.icon} text-xs transition-colors ${
                      active ? 'text-amber-300' : 'text-blue-400 group-hover:text-amber-400'
                    }`}
                  />
                  <span className="whitespace-nowrap">{cat.label}</span>
                  {cat.disabled && (
                    <span className="text-[9px] font-bold bg-slate-700/90 text-slate-300 px-1.5 py-0.2 rounded border border-slate-600/50">
                      Soon
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Manual Scroll Right Button */}
        <button
          type="button"
          onClick={() => handleManualScroll('right')}
          className="shrink-0 w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-xs border border-slate-700 cursor-pointer"
          title="Scroll Ribbon Right"
          aria-label="Scroll Ribbon Right"
        >
          <i className="fa-solid fa-chevron-right" />
        </button>

        {/* Auto-Rotation Play/Pause Toggle */}
        <button
          type="button"
          onClick={() => setUserPaused(!userPaused)}
          className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
            isPaused
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
          }`}
          title={isPaused ? 'Resume Rotation' : 'Pause Rotation'}
          aria-label="Toggle Ribbon Rotation"
        >
          <i className={`fa-solid ${isPaused ? 'fa-play text-amber-400' : 'fa-pause text-blue-400'} text-[10px]`} />
          <span className="hidden md:inline">{isPaused ? 'Paused' : 'Rotating'}</span>
        </button>
      </div>
    </div>
  );
}

