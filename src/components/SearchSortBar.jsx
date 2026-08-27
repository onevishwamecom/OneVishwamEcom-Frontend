/**
 * SearchSortBar
 * The repeated search input + mobile filter button + sort dropdown row
 * used across all gallery pages.
 *
 * Props:
 *   searchValue      – controlled value for search input
 *   onSearchChange   – onChange handler
 *   searchPlaceholder – input placeholder string
 *   sortValue        – controlled value for sort select
 *   onSortChange     – onChange handler for select
 *   sortOptions      – array of { value, label } for the select options
 *                      defaults to standard price sort options
 *   onMobileFilter   – called when mobile "Filters" button is clicked
 *   className        – extra wrapper classes
 */

const DEFAULT_SORT_OPTIONS = [
  { value: 'latest',     label: 'Latest' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

export default function SearchSortBar({
  showSearch = true,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  sortValue,
  onSortChange,
  sortOptions = DEFAULT_SORT_OPTIONS,
  onMobileFilter,
  className = '',
}) {
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
      {/* Search input */}
      {showSearch && onSearchChange && (
        <div className="relative flex-1 w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-gray-200 pl-11 pr-4 py-2.5 text-sm outline-none focus:border-brand-blue"
          />
        </div>
      )}

      <div className="flex items-center gap-3 ml-auto w-full sm:w-auto justify-between sm:justify-end">
        {/* Mobile filter trigger */}
        {onMobileFilter && (
          <button
            type="button"
            onClick={onMobileFilter}
            className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <i className="fa-solid fa-sliders text-brand-blue" /> Filters
          </button>
        )}

        {/* Sort select */}
        {onSortChange && (
          <select
            value={sortValue}
            onChange={onSortChange}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold outline-none focus:border-brand-blue bg-white cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
