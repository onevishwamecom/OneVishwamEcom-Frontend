import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { incrementHitCounter, getHitCounterData } from '../utils/hitCounter';

/**
 * HitCounterBanner:
 * Catchy, concise visitor counter bar above footer.
 */
export default function HitCounterBanner() {
  const [stats, setStats] = useState(() => getHitCounterData());
  const location = useLocation();

  useEffect(() => {
    const updated = incrementHitCounter();
    setStats(updated);
  }, [location.pathname]);

  const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(num || 0);

  return (
    <div className="w-full bg-slate-900/95 text-slate-300 border-t border-slate-800 py-2 px-4 text-xs select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        {/* Left Label */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-semibold text-white tracking-wide text-xs">
            OneVishwam Activity
          </span>
        </div>

        {/* Catchy Stats */}
        <div className="flex items-center gap-4 text-xs font-medium flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-users text-amber-400 text-xs" />
            <span className="text-slate-400">Total Visits:</span>
            <strong className="text-white font-semibold">{formatNumber(stats.totalHits)}</strong>
          </div>

          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-bolt text-amber-300 text-xs" />
            <span className="text-slate-400">Visits Today:</span>
            <strong className="text-white font-semibold">{formatNumber(stats.hitsToday)}</strong>
          </div>

          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-circle text-emerald-400 text-[8px]" />
            <span className="text-slate-400">Online Now:</span>
            <strong className="text-emerald-400 font-semibold">{formatNumber(stats.activeVisitors)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

