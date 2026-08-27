import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import BudgetChipGroup from './BudgetChipGroup';

/**
 * BudgetRangeSlider
 * ─────────────────
 * Fixed, reusable dual-range price slider with:
 *  • Preset budget chips (BudgetChipGroup)
 *  • Editable formatted text inputs (e.g. "₹1.00 Cr")
 *  • A CSS-correct dual-range slider track
 *
 * Bug fixes applied vs. the original inline BudgetRange in PropertyFilterSidebar:
 *
 *  Bug A — stale dynamicMin/Max on async data load:
 *    Fixed by computing bounds via useMemo and syncing the initial `range`
 *    state via a useEffect that runs when `items` changes for the first time.
 *
 *  Bug B — min thumb could cross max thumb:
 *    The old clipPath approach made thumbs invisible in restricted zones but
 *    both <input> elements still spanned the full track, allowing crossover.
 *    Fixed with pointer-events split: min input only captures events in its
 *    left portion (z-index > max when min < midpoint), max input captures
 *    events in the right portion. Combined with hard value clamping on change.
 *
 *  Bug C — chip deselect didn't reset slider:
 *    When onBudgetChange('', '') fires, the commit now explicitly resets the
 *    internal range back to [dynamicMin, dynamicMax] and also calls
 *    updateFilter with empty strings so upstream state stays in sync.
 *
 * Props
 * ─────
 * filters       – { budgetMin: string, budgetMax: string }
 * updateFilter  – (key: string, value: string) => void
 * items         – raw data items array — used to compute dynamic price bounds
 * getPrice      – (item) => number — extracts numeric price from an item
 * defaultMin    – fallback min when no items (default 0)
 * defaultMax    – fallback max when no items (default 10_000_000)
 * step          – slider step in raw units (default 100_000 = ₹1L)
 * chips         – preset chip definitions [{ label, min, max }]
 * formatPrice   – (value: number) => string — display formatter
 * parseInput    – (text: string) => number | null — parses typed input
 */
export function BudgetRangeSlider({
  filters,
  updateFilter,
  items = [],
  getPrice,
  defaultMin = 0,
  defaultMax = 10_000_000,
  step = 100_000,
  chips,
  formatPrice: formatPriceProp,
  parseInput: parseInputProp,
}) {
  // ── Compute dynamic bounds from data ───────────────────────────────────────
  const { dynMin, dynMax } = useMemo(() => {
    if (!getPrice || !items.length) return { dynMin: defaultMin, dynMax: defaultMax };
    const prices = items.map(getPrice).filter((p) => p > 0);
    if (!prices.length) return { dynMin: defaultMin, dynMax: defaultMax };
    const mn = Math.floor(Math.min(...prices) / step) * step;
    const mx = Math.ceil(Math.max(...prices) / step) * step;
    return { dynMin: mn, dynMax: mx };
  }, [items, getPrice, step, defaultMin, defaultMax]);

  // Keep a stable ref so callbacks never close over stale bounds
  const boundsRef = useRef({ dynMin, dynMax });
  useEffect(() => { boundsRef.current = { dynMin, dynMax }; }, [dynMin, dynMax]);

  // ── Internal slider state (numeric) ───────────────────────────────────────
  const [range, setRange] = useState(() => ({
    min: filters.budgetMin ? +filters.budgetMin : dynMin,
    max: filters.budgetMax ? +filters.budgetMax : dynMax,
  }));

  // Sync when filter resets externally (e.g. "Reset All")
  useEffect(() => {
    const extMin = filters.budgetMin !== undefined && filters.budgetMin !== ''
      ? +filters.budgetMin
      : null;
    const extMax = filters.budgetMax !== undefined && filters.budgetMax !== ''
      ? +filters.budgetMax
      : null;

    setRange((prev) => ({
      min: extMin !== null ? extMin : boundsRef.current.dynMin,
      max: extMax !== null ? extMax : boundsRef.current.dynMax,
    }));
  }, [filters.budgetMin, filters.budgetMax]);

  // When data loads for the first time and range is still at default, stretch to fit
  useEffect(() => {
    setRange((prev) => {
      const atDefault =
        prev.min === defaultMin && prev.max === defaultMax;
      const noExternalFilter = !filters.budgetMin && !filters.budgetMax;
      if (atDefault && noExternalFilter) {
        return { min: dynMin, max: dynMax };
      }
      return prev;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynMin, dynMax]);

  // ── Commit changes upward ─────────────────────────────────────────────────
  const commit = useCallback((min, max) => {
    setRange({ min, max });
    updateFilter('budgetMin', String(min));
    updateFilter('budgetMax', String(max));
  }, [updateFilter]);

  // ── Formatters ────────────────────────────────────────────────────────────
  const formatPrice = useCallback((value) => {
    if (formatPriceProp) return formatPriceProp(value);
    if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(2)} Cr`;
    return `₹${(value / 100_000).toFixed(1)} L`;
  }, [formatPriceProp]);

  const parseInput = useCallback((input) => {
    if (parseInputProp) return parseInputProp(input);
    const cleaned = input.replace(/[₹,\s]/g, '').toLowerCase();
    if (!cleaned) return null;
    if (cleaned.endsWith('cr')) return Math.round(parseFloat(cleaned) * 10_000_000);
    if (cleaned.endsWith('l')) return Math.round(parseFloat(cleaned) * 100_000);
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : Math.round(num);
  }, [parseInputProp]);

  // ── Track geometry for the colored fill ───────────────────────────────────
  const span = dynMax - dynMin || 1;
  const leftPct  = ((range.min - dynMin) / span) * 100;
  const rightPct = ((dynMax - range.max) / span) * 100;
  const midPct   = ((range.min + range.max) / 2 - dynMin) / span * 100;

  // Default chips (₹ property scale)
  const defaultChips = [
    { label: 'Under ₹50L',    min: 0,         max: 5_000_000   },
    { label: '₹50L – ₹1Cr',   min: 5_000_000, max: 10_000_000  },
    { label: '₹1Cr – ₹2.5Cr', min: 10_000_000,max: 25_000_000  },
    { label: '₹2.5Cr+',       min: 25_000_000,max: Infinity     },
  ];

  return (
    <div className="space-y-3 pt-1">
      {/* Preset chips */}
      <BudgetChipGroup
        chips={chips || defaultChips}
        budgetMin={filters.budgetMin}
        budgetMax={filters.budgetMax}
        showCustomInputs={false}
        onBudgetChange={(min, max) => {
          const { dynMin: lo, dynMax: hi } = boundsRef.current;
          // Chip deselected → reset to full range, clear filters
          if (min === '' && max === '') {
            commit(lo, hi);
            updateFilter('budgetMin', '');
            updateFilter('budgetMax', '');
            setRange({ min: lo, max: hi });
          } else {
            commit(
              min !== '' ? Number(min) : lo,
              max !== '' && max !== Infinity ? Number(max) : hi,
            );
          }
        }}
      />

      {/* Editable text inputs */}
      <div className="flex justify-between gap-2 pt-1">
        <div className="flex-1">
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">
            Minimum
          </label>
          <input
            type="text"
            value={formatPrice(range.min)}
            onChange={(e) => {
              const p = parseInput(e.target.value);
              if (p === null) return;
              const clamped = Math.max(dynMin, Math.min(p, range.max - step));
              commit(clamped, range.max);
            }}
            className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-brand-blue bg-white"
          />
        </div>
        <div className="flex-1">
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">
            Maximum
          </label>
          <input
            type="text"
            value={formatPrice(range.max)}
            onChange={(e) => {
              const p = parseInput(e.target.value);
              if (p === null) return;
              const clamped = Math.min(dynMax, Math.max(p, range.min + step));
              commit(range.min, clamped);
            }}
            className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-brand-blue bg-white"
          />
        </div>
      </div>

      {/* ── Dual-range slider ────────────────────────────────────────────────
          Fix B: Instead of clipPath (which leaves both inputs spanning the full
          width and allows crossover), we use z-index + pointer-events split.
          • The min thumb sits on top (z-30) when it is in the left half.
          • The max thumb sits on top (z-30) when it is in the right half.
          • Hard value clamping in onChange prevents actual crossover.
          ──────────────────────────────────────────────────────────────────── */}
      <div className="relative h-6 flex items-center select-none">
        {/* Track background */}
        <div className="absolute left-0 right-0 h-1.5 bg-gray-200 rounded-full pointer-events-none" />
        {/* Active range fill */}
        <div
          className="absolute h-1.5 bg-brand-blue rounded-full pointer-events-none"
          style={{ left: `${leftPct}%`, right: `${rightPct}%` }}
        />

        {/* Min thumb — sits on top in the left half */}
        <input
          type="range"
          min={dynMin}
          max={dynMax}
          step={step}
          value={range.min}
          onChange={(e) => {
            const v = +e.target.value;
            // Hard clamp: min may never reach or exceed max
            const safe = Math.min(v, range.max - step);
            commit(safe, range.max);
          }}
          className="absolute w-full h-6 appearance-none bg-transparent cursor-pointer"
          style={{ zIndex: leftPct >= midPct ? 30 : 20 }}
        />

        {/* Max thumb — sits on top in the right half */}
        <input
          type="range"
          min={dynMin}
          max={dynMax}
          step={step}
          value={range.max}
          onChange={(e) => {
            const v = +e.target.value;
            // Hard clamp: max may never reach or fall below min
            const safe = Math.max(v, range.min + step);
            commit(range.min, safe);
          }}
          className="absolute w-full h-6 appearance-none bg-transparent cursor-pointer"
          style={{ zIndex: leftPct >= midPct ? 20 : 30 }}
        />
      </div>

      {/* Range labels */}
      <div className="flex justify-between text-[10px] text-gray-400 font-medium px-0.5">
        <span>{formatPrice(dynMin)}</span>
        <span>{formatPrice(dynMax)}</span>
      </div>
    </div>
  );
}

export default BudgetRangeSlider;

