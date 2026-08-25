import React from 'react';
import SearchSortBar from '../../../components/SearchSortBar';
import { ActiveChip } from '../../../components/ui';
import { DEFAULT_SORT_OPTIONS } from './sortBy';

/**
 * Universal Results & Filter Bar component.
 * Displays count, active chips row, search input, sort selector, and mobile filters trigger.
 */
export default function ResultsBar({
  count,
  countLabel = 'Items',
  activeChips = [],
  onRemoveChip,
  onResetChips,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  sortValue = 'latest',
  onSortChange,
  sortOptions = DEFAULT_SORT_OPTIONS,
  onMobileFilter,
  className = 'mt-5',
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Top row: Search input + mobile filter trigger + sort selector */}
      <SearchSortBar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        sortValue={sortValue}
        onSortChange={onSortChange}
        sortOptions={sortOptions}
        onMobileFilter={onMobileFilter}
      />

      {/* Active chips row & count info */}
      {(activeChips.length > 0 || (count !== undefined && count !== null)) && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {/* Active filter chips */}
          {activeChips.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              {activeChips.map((chip, idx) => (
                <ActiveChip
                  key={chip.key ? `${chip.key}-${idx}` : idx}
                  label={chip.label}
                  onRemove={onRemoveChip ? () => onRemoveChip(chip) : undefined}
                />
              ))}
              {onResetChips && (
                <button
                  type="button"
                  onClick={onResetChips}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 hover:underline px-2 py-0.5"
                >
                  Clear all
                </button>
              )}
            </div>
          ) : (
            <div />
          )}

          {/* Result count summary */}
          {count !== undefined && count !== null && (
            <span className="text-xs font-medium text-gray-400 whitespace-nowrap ml-auto">
              {count} {countLabel} {count === 1 ? 'found' : 'found'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
