import React from 'react';

/**
 * FilterShell
 * Provides the "Filters" header and "Reset All" action trigger above collapsible filter sections.
 */
export default function FilterShell({
  filters,
  hasActiveFilters,
  onReset,
  title = 'Filters',
  resetLabel = 'Reset All',
  children,
  className = 'space-y-1',
}) {
  const isActive = hasActiveFilters !== undefined
    ? hasActiveFilters
    : filters
      ? Object.values(filters).some((v) =>
          v !== '' && v !== false && (!Array.isArray(v) || v.length > 0)
        )
      : false;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-brand-charcoal">{title}</span>
        {isActive && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-brand-blue font-semibold hover:underline"
          >
            {resetLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
