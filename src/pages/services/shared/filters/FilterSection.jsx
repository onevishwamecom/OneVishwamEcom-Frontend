import React from 'react';

/**
 * FilterSection
 * ─────────────
 * Shared wrapper for a single named filter group inside any sector's filter sidebar.
 * Renders a label row (with optional "Clear" link) and the children below.
 *
 * Used instead of the duplicated `<div className="border-b border-gray-100 pb-4 mb-4">` pattern
 * that previously existed independently in every sector sidebar.
 *
 * Props
 * ─────
 * label    – Section label text (e.g. "Budget", "Property Type")
 * active   – Whether there are active selections in this section (shows Clear)
 * onClear  – () => void — fired when "Clear" is clicked
 * last     – Set true on the last section to suppress the bottom border
 * children – Filter controls
 */
export function FilterSection({ label, active, onClear, last = false, children }) {
  return (
    <div className={`pb-4 mb-4 ${last ? '' : 'border-b border-gray-100'}`}>
      <div className="flex items-center justify-between w-full py-2">
        <span className="text-sm font-bold text-brand-charcoal">{label}</span>
        {active && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] font-semibold text-brand-blue hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export default FilterSection;

