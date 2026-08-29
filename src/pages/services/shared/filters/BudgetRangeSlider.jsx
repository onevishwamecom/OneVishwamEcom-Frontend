import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import BudgetChipGroup from './BudgetChipGroup';
import DualRangeSlider from '../../../../components/ui/DualRangeSlider';
import { formatINR, parseIndianPrice } from '../priceUtils';

/**
 * BudgetRangeSlider
 * ─────────────────
 * Master reusable dual-range price slider with a single unified source of truth.
 * Supports:
 *  • Presets (BudgetChipGroup)
 *  • Editable formatted text inputs (e.g. "₹50 L", "₹1 Cr")
 *  • Synchronized DualRangeSlider primitive (zero thumb crossover / zero z-index conflicts)
 *  • Automatic numerical parsing and clamping (min <= max)
 */
export function BudgetRangeSlider({
  filters = {},
  updateFilter,
  items = [],
  getPrice,
  defaultMin = 0,
  defaultMax = 10_000_000, // ₹1 Cr default fallback
  step = 100_000,          // ₹1 L step
  chips,
  formatPrice: formatPriceProp,
  parseInput: parseInputProp,
}) {
  // ── 1. Calculate dynamic normalized bounds ─────────────────────────────
  const { sliderMin, sliderMax } = useMemo(() => {
    let minVal = defaultMin;
    let maxVal = defaultMax;

    if (getPrice && Array.isArray(items) && items.length > 0) {
      const prices = items.map(getPrice).filter((p) => typeof p === 'number' && !isNaN(p) && p > 0);
      if (prices.length > 0) {
        const dataMin = Math.floor(Math.min(...prices) / step) * step;
        const dataMax = Math.ceil(Math.max(...prices) / step) * step;
        minVal = Math.min(defaultMin, dataMin);
        maxVal = Math.max(defaultMax, dataMax);
      }
    }
    return { sliderMin: Math.max(0, minVal), sliderMax: Math.max(step, maxVal) };
  }, [items, getPrice, step, defaultMin, defaultMax]);

  const boundsRef = useRef({ sliderMin, sliderMax });
  useEffect(() => {
    boundsRef.current = { sliderMin, sliderMax };
  }, [sliderMin, sliderMax]);

  // ── 2. Helper formatters & parsers ────────────────────────────────────
  const formatPrice = useCallback((val) => {
    if (formatPriceProp) return formatPriceProp(val);
    return formatINR(val, { compact: true });
  }, [formatPriceProp]);

  const parseInput = useCallback((input) => {
    if (parseInputProp) return parseInputProp(input);
    return parseIndianPrice(input);
  }, [parseInputProp]);

  // ── 3. Internal numeric range state tuple: [min, max] ──────────────────
  const [rangeTuple, setRangeTuple] = useState(() => {
    const rawMin = filters.budgetMin !== undefined && filters.budgetMin !== '' ? parseIndianPrice(filters.budgetMin) : sliderMin;
    const rawMax = filters.budgetMax !== undefined && filters.budgetMax !== '' ? parseIndianPrice(filters.budgetMax) : sliderMax;
    const safeMin = Math.max(sliderMin, Math.min(rawMin, sliderMax));
    const safeMax = Math.max(safeMin, Math.min(rawMax, sliderMax));
    return [safeMin, safeMax];
  });

  const [minInputText, setMinInputText] = useState('');
  const [maxInputText, setMaxInputText] = useState('');
  const [isMinFocused, setIsMinFocused] = useState(false);
  const [isMaxFocused, setIsMaxFocused] = useState(false);

  // Sync internal tuple whenever external filters change (e.g. Reset or Chip click)
  useEffect(() => {
    const sMin = boundsRef.current.sliderMin;
    const sMax = boundsRef.current.sliderMax;

    const extMin = filters.budgetMin !== undefined && filters.budgetMin !== ''
      ? parseIndianPrice(filters.budgetMin)
      : sMin;
    const extMax = filters.budgetMax !== undefined && filters.budgetMax !== ''
      ? parseIndianPrice(filters.budgetMax)
      : sMax;

    const safeMin = Math.max(sMin, Math.min(extMin, sMax));
    const safeMax = Math.max(safeMin, Math.min(extMax, sMax));

    setRangeTuple([safeMin, safeMax]);
    if (!isMinFocused) setMinInputText(formatPrice(safeMin));
    if (!isMaxFocused) setMaxInputText(formatPrice(safeMax));
  }, [filters.budgetMin, filters.budgetMax, formatPrice, isMinFocused, isMaxFocused]);

  // Commit changes upward to parent filter state
  const commit = useCallback((minVal, maxVal) => {
    const sMin = boundsRef.current.sliderMin;
    const sMax = boundsRef.current.sliderMax;

    const safeMin = Math.max(sMin, Math.min(minVal, sMax));
    const safeMax = Math.max(safeMin, Math.min(maxVal, sMax));

    setRangeTuple([safeMin, safeMax]);
    if (!isMinFocused) setMinInputText(formatPrice(safeMin));
    if (!isMaxFocused) setMaxInputText(formatPrice(safeMax));

    const parentMin = safeMin === sMin && (!filters.budgetMin && !filters.budgetMax) ? '' : String(safeMin);
    const parentMax = safeMax === sMax && (!filters.budgetMin && !filters.budgetMax) ? '' : String(safeMax);

    updateFilter('budgetMin', parentMin);
    updateFilter('budgetMax', parentMax);
  }, [updateFilter, filters.budgetMin, filters.budgetMax, formatPrice, isMinFocused, isMaxFocused]);

  const handleSliderChange = (newTuple) => {
    if (!Array.isArray(newTuple) || newTuple.length !== 2) return;
    commit(newTuple[0], newTuple[1]);
  };

  // Default preset chips
  const defaultChips = useMemo(() => [
    { label: 'Under ₹50L',    min: 0,          max: 5_000_000   },
    { label: '₹50L – ₹1Cr',   min: 5_000_000,  max: 10_000_000  },
    { label: '₹1Cr – ₹2.5Cr', min: 10_000_000, max: 25_000_000  },
    { label: '₹2.5Cr+',       min: 25_000_000, max: Infinity    },
  ], []);

  // Preset chip handler
  const handleChipChange = (chipMin, chipMax) => {
    const sMin = boundsRef.current.sliderMin;
    const sMax = boundsRef.current.sliderMax;

    if (chipMin === '' && chipMax === '') {
      setRangeTuple([sMin, sMax]);
      setMinInputText(formatPrice(sMin));
      setMaxInputText(formatPrice(sMax));
      updateFilter('budgetMin', '');
      updateFilter('budgetMax', '');
    } else {
      const targetMin = chipMin !== '' && chipMin !== undefined ? Number(chipMin) : sMin;
      const targetMax = chipMax !== '' && chipMax !== undefined && chipMax !== Infinity ? Number(chipMax) : sMax;

      const safeMin = Math.max(sMin, Math.min(targetMin, sMax));
      const safeMax = Math.max(safeMin, Math.min(targetMax, sMax));

      setRangeTuple([safeMin, safeMax]);
      setMinInputText(formatPrice(safeMin));
      setMaxInputText(formatPrice(safeMax));
      updateFilter('budgetMin', String(safeMin));
      updateFilter('budgetMax', String(safeMax));
    }
  };

  return (
    <div className="space-y-3 pt-1">
      {/* Preset chips */}
      <BudgetChipGroup
        chips={chips || defaultChips}
        budgetMin={filters.budgetMin}
        budgetMax={filters.budgetMax}
        showCustomInputs={false}
        onBudgetChange={handleChipChange}
      />

      {/* Editable text inputs */}
      <div className="flex justify-between gap-2 pt-1">
        <div className="flex-1">
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">
            Minimum
          </label>
          <input
            type="text"
            value={isMinFocused ? minInputText : formatPrice(rangeTuple[0])}
            onFocus={() => {
              setIsMinFocused(true);
              setMinInputText(String(rangeTuple[0]));
            }}
            onChange={(e) => setMinInputText(e.target.value)}
            onBlur={() => {
              setIsMinFocused(false);
              const parsed = parseInput(minInputText);
              const safe = Math.max(sliderMin, Math.min(parsed, rangeTuple[1] - step));
              commit(safe, rangeTuple[1]);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              }
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
            value={isMaxFocused ? maxInputText : formatPrice(rangeTuple[1])}
            onFocus={() => {
              setIsMaxFocused(true);
              setMaxInputText(String(rangeTuple[1]));
            }}
            onChange={(e) => setMaxInputText(e.target.value)}
            onBlur={() => {
              setIsMaxFocused(false);
              const parsed = parseInput(maxInputText);
              const safe = Math.min(sliderMax, Math.max(parsed, rangeTuple[0] + step));
              commit(rangeTuple[0], safe);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              }
            }}
            className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-brand-blue bg-white"
          />
        </div>
      </div>

      {/* Dual Range Slider Primitive */}
      <DualRangeSlider
        value={rangeTuple}
        onValueChange={handleSliderChange}
        min={sliderMin}
        max={sliderMax}
        step={step}
        minStepsBetweenThumbs={1}
      />

      {/* Range labels */}
      <div className="flex justify-between text-[10px] text-gray-400 font-medium px-0.5">
        <span>{formatPrice(sliderMin)}</span>
        <span>{formatPrice(sliderMax)}</span>
      </div>
    </div>
  );
}

export default BudgetRangeSlider;

