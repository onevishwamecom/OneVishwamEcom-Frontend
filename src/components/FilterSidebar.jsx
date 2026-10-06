/**
 * FilterSidebar
 * Wrapper that renders the "Filters / Reset All" header above any filter
 * section content (passed as children). Used in the desktop aside and the
 * mobile drawer across all gallery pages.
 *
 * Props:
 *   filters     – current filters object (used to detect if any are active)
 *   hasActiveFilters – if true, shows the "Reset All" button (optional, computed internally if omitted)
 *   onReset     – callback to reset all filters
 *   children    – CollapsibleSection elements to render inside
 */
export default function FilterSidebar({ filters, hasActiveFilters, onReset, children }) {
  // Compute active filter count
  const activeCount = filters
    ? Object.values(filters).filter((v) => v !== '' && v !== null && (!Array.isArray(v) || v.length > 0)).length
    : 0;

  const isActive = hasActiveFilters !== undefined ? hasActiveFilters : activeCount > 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-brand-charcoal">Filters</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center bg-brand-blue text-white text-[10px] font-bold w-5 h-5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {isActive && onReset && (
          <button
            onClick={onReset}
            className="text-xs text-brand-blue font-semibold hover:text-brand-navy hover:underline cursor-pointer transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
