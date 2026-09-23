import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { incrementHitCounter, getHitCounterData } from '../utils/hitCounter';

/**
 * HitCounterBanner:
 * Static Banner across all pages capturing and displaying live site hit counter & visitor stats.
 */
export default function HitCounterBanner() {
  const [stats, setStats] = useState(() => getHitCounterData());
  const [minimized, setMinimized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Capture and increment hit count on route change
    const updated = incrementHitCounter();
    setStats(updated);
  }, [location.pathname]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  if (minimized) {
    return (
      <div className="bg-slate-950 border-b border-slate-800 text-slate-300 py-0.5 px-3 text-[10px] flex items-center justify-between z-50">
        <span className="font-semibold text-amber-400 flex items-center gap-1">
          <i className="fa-solid fa-eye text-[9px]" /> Hits: {formatNumber(stats.totalHits)}
        </span>
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="text-slate-400 hover:text-white text-[9px] underline font-medium cursor-pointer"
        >
          Expand Banner
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-950 text-slate-200 border-b border-slate-800 py-1.5 px-3 sm:px-6 text-xs relative z-50 select-none shadow-2xs">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
        
        {/* Left Label */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 bg-brand-blue/30 border border-brand-blue/50 text-blue-300 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Live Analytics
          </span>
          <span className="font-semibold text-slate-300 text-[11px] hidden md:inline">
            OneVishwam Platform Statistics
          </span>
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-3 sm:gap-6 text-[11px] font-medium flex-wrap sm:flex-nowrap">
          {/* Total Hits */}
          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-eye text-emerald-400 text-xs" />
            <span className="text-slate-400">Total Hits:</span>
            <strong className="text-amber-300 font-mono font-bold tracking-tight text-xs">
              {formatNumber(stats.totalHits)}
            </strong>
          </div>

          {/* Hits Today */}
          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-chart-line text-amber-400 text-xs" />
            <span className="text-slate-400">Hits Today:</span>
            <strong className="text-white font-mono font-bold tracking-tight text-xs">
              {formatNumber(stats.hitsToday)}
            </strong>
          </div>

          {/* Active Visitors */}
          <div className="flex items-center gap-1.5 hidden xs:flex">
            <i className="fa-solid fa-users text-blue-400 text-xs" />
            <span className="text-slate-400">Live Visitors:</span>
            <strong className="text-emerald-400 font-mono font-bold tracking-tight text-xs">
              {formatNumber(stats.activeVisitors)}
            </strong>
          </div>
        </div>

        {/* Right Close / Minimize Button */}
        <button
          type="button"
          onClick={() => setMinimized(true)}
          className="text-slate-400 hover:text-white transition-colors text-xs p-1 shrink-0 cursor-pointer"
          title="Minimize Hit Counter Banner"
          aria-label="Minimize Hit Counter Banner"
        >
          <i className="fa-solid fa-chevron-up text-[10px]" />
        </button>
      </div>
    </div>
  );
}

