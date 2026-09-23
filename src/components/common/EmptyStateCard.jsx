/**
 * Reusable EmptyStateCard component for zero-result search or filter state views.
 *
 * @param {Object} props
 * @param {string} [props.icon] - FontAwesome icon class (e.g. "fa-gem", "fa-shirt")
 * @param {string} [props.title] - Empty state heading
 * @param {string} [props.subtitle] - Empty state description/hint
 * @param {() => void} [props.onReset] - Optional reset action callback
 * @param {string} [props.resetLabel] - Button text for reset action
 * @param {string} [props.className] - Optional container CSS class
 */
function EmptyStateCard({
  icon = 'fa-magnifying-glass',
  title = 'No items found',
  subtitle = 'Try adjusting your filters or search terms.',
  onReset,
  resetLabel = 'Reset Filters',
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/60 py-16 px-4 text-center ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
        <i className={`fa-solid ${icon} text-3xl`} />
      </div>
      <p className="text-lg font-bold text-brand-charcoal">{title}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1 max-w-sm">{subtitle}</p>}
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          <i className="fa-solid fa-rotate-left text-[10px]" />
          {resetLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyStateCard;

