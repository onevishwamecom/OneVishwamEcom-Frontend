import React from 'react';

/**
 * PillGroup
 * ─────────
 * Shared pill button multi-select (or single-select) component.
 * Previously a private function inside PropertyFilterSidebar — now shared
 * across all sector sidebars.
 *
 * Props
 * ─────
 * options  – string[] — list of option labels
 * selected – string[] (multi) or string (single)
 * onChange – (newSelected: string[] | string) => void
 * multi    – default true; set false for single-select (radio-style)
 * size     – 'sm' (default) | 'xs' — controls padding/font-size
 *
 * Example
 * ───────
 * <PillGroup
 *   options={['Flat', 'Houses', 'Villa', 'Plot']}
 *   selected={filters.buildingType}
 *   onChange={(v) => updateFilter('buildingType', v)}
 * />
 */
export function PillGroup({ options = [], selected, onChange, multi = true, size = 'sm' }) {
  const pillCls =
    size === 'xs'
      ? 'text-[11px] px-2 py-1'
      : 'text-xs px-2.5 py-1.5';

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = multi
          ? Array.isArray(selected) && selected.includes(opt)
          : selected === opt;

        const toggle = () => {
          if (!multi) {
            onChange(active ? '' : opt);
            return;
          }
          onChange(
            active
              ? (selected || []).filter((x) => x !== opt)
              : [...(selected || []), opt],
          );
        };

        return (
          <button
            key={opt}
            type="button"
            onClick={toggle}
            className={`rounded-lg border font-semibold transition-all ${pillCls} ${
              active
                ? 'border-brand-blue bg-brand-blue text-white shadow-xs'
                : 'border-gray-200 bg-white text-gray-600 hover:border-brand-blue/40 hover:text-brand-blue'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default PillGroup;

