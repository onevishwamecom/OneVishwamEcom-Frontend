import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { marketplaceCategories } from '../data/categoriesData';

/**
 * VerticalRibbonBar:
 * Clean, lightweight rotating ribbon menu for all business verticals.
 * Rotates continuously from right to left (RTL), pauses on hover/click.
 */
export default function VerticalRibbonBar() {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const scrollRef = useRef(null);

  const isVerticalActive = (href) => {
    if (!href) return false;
    return location.pathname === href || (href !== '/' && location.pathname.startsWith(href));
  };

  // Triple the items for a smooth infinite marquee loop
  const ribbonItems = [...marketplaceCategories, ...marketplaceCategories, ...marketplaceCategories];

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-white/95 border-t border-b border-gray-200/80 shadow-2xs select-none relative z-30">
      <div className="max-w-[1400px] mx-auto flex items-center px-2 sm:px-4 py-1.5 gap-2">

        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="shrink-0 w-6 h-6 rounded-md bg-gray-100 hover:bg-brand-blue hover:text-white text-gray-500 flex items-center justify-center transition-colors text-[10px] cursor-pointer"
          title="Scroll Left"
          aria-label="Scroll Ribbon Left"
        >
          <i className="fa-solid fa-chevron-left" />
        </button>

        {/* Ribbon Marquee Track */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex-1 overflow-hidden relative py-0.5"
        >
          <div
            className={`flex items-center gap-2 whitespace-nowrap w-max transition-all ${
              isHovered ? 'ribbon-paused' : 'animate-ribbon-rtl'
            }`}
          >
            {ribbonItems.map((cat, idx) => {
              const active = isVerticalActive(cat.href);
              return (
                <Link
                  key={`${cat.id}-${idx}`}
                  to={cat.href}
                  onClick={() => setIsHovered(true)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    active
                      ? 'bg-brand-blue text-white shadow-xs font-bold'
                      : 'bg-gray-100/90 text-gray-700 hover:bg-brand-blue/10 hover:text-brand-blue border border-gray-200/60'
                  }`}
                >
                  <i className={`${cat.icon} text-[11px] ${active ? 'text-amber-300' : 'text-brand-blue'}`} />
                  <span>{cat.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="shrink-0 w-6 h-6 rounded-md bg-gray-100 hover:bg-brand-blue hover:text-white text-gray-500 flex items-center justify-center transition-colors text-[10px] cursor-pointer"
          title="Scroll Right"
          aria-label="Scroll Ribbon Right"
        >
          <i className="fa-solid fa-chevron-right" />
        </button>
      </div>
    </div>
  );
}
