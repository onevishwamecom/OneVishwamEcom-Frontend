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

import { useLocation } from '../store/locationSlice';
import { cities } from '../data/locations';

const DEFAULT_SORT_OPTIONS = [
  { value: 'latest',     label: 'Latest' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

export default function SearchSortBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  sortValue,
  onSortChange,
  sortOptions = DEFAULT_SORT_OPTIONS,
  onMobileFilter,
  className = '',
}) {
  const { selectedCity, selectCity } = useLocation();

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      {/* Search input */}
      <div className="relative flex-1">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          className="w-full rounded-xl border border-gray-200 pl-11 pr-4 py-2.5 text-sm outline-none focus:border-brand-blue"
        />
      </div>

      <div className="flex gap-2">
        {/* Location filter dropdown */}
        <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 shadow-2xs shrink-0">
          <i className="fa-solid fa-location-dot text-brand-blue" />
          <select
            value={selectedCity || ''}
            onChange={(e) => selectCity(e.target.value)}
            className="bg-transparent outline-none cursor-pointer text-xs font-semibold text-brand-charcoal"
          >
            <option value="">All Cities</option>
            {Object.entries(cities).map(([id, c]) => (
              <option key={id} value={id}>{c.label}</option>
            ))}
          </select>
        </div>
        {/* Mobile filter trigger */}
        {onMobileFilter && (
          <button
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
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue bg-white"
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
