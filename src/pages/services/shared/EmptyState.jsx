import React from 'react';

/**
 * Standard EmptyState component for galleries when no items match the filter/search criteria.
 */
export default function EmptyState({
  icon = 'fa-solid fa-box-open',
  title = 'No items found',
  subtitle = 'Try adjusting your filters or search term.',
  onReset,
  resetLabel = 'Reset All Filters',
  action,
  className = 'py-16 text-center text-gray-400',
}) {
  return (
    <div className={className}>
      <i className={`${icon} text-4xl mb-4 text-gray-300`} />
      <h3 className="text-lg font-bold text-brand-charcoal">{title}</h3>
      {subtitle && <p className="text-sm mt-1 mb-6 text-gray-500 max-w-sm mx-auto">{subtitle}</p>}
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
          >
            <i className="fa-solid fa-rotate-left" />
            {resetLabel}
          </button>
        )}
        {action}
      </div>
    </div>
  );
}
