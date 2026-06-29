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
  // Fall back to computing active state from filters object if not explicitly provided
  const isActive = hasActiveFilters !== undefined
    ? hasActiveFilters
    : filters
      ? Object.values(filters).some((v) =>
          v !== '' && (!Array.isArray(v) || v.length > 0)
        )
      : false;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-brand-charcoal">Filters</span>
        {isActive && onReset && (
          <button
            onClick={onReset}
            className="text-xs text-brand-blue font-semibold hover:underline"
          >
            Reset All
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
