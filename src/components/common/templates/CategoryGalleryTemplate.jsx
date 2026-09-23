import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import ListingCard from './ListingCard';

/**
 * Unified CategoryGalleryTemplate for Category Gallery / Listing Pages.
 * Supports instant search, pill-based filtering, responsive grid layout,
 * and pluggable sidebar filters while preserving all existing custom UI.
 */
export default function CategoryGalleryTemplate({
  categoryTitle = 'Browse Listings',
  categorySubtitle,
  filterPills = [],
  selectedPill,
  onSelectPill,
  items = [],
  onSelectItem,
  searchTerm: controlledSearch,
  onSearchChange: controlledOnSearchChange,
  searchPlaceholder = 'Search by keyword, locality, or title...',
  sidebarFilter,
  headerActions,
  statsBanner,
  emptyState,
  customCardRenderer,
  children,
}) {
  const [internalSearch, setInternalSearch] = useState('');
  const [internalPill, setInternalPill] = useState(filterPills[0]?.id || 'All');

  const currentPill = selectedPill !== undefined ? selectedPill : internalPill;
  const handlePillClick = (id) => {
    if (onSelectPill) onSelectPill(id);
    else setInternalPill(id);
  };

  const currentSearch = controlledSearch !== undefined ? controlledSearch : internalSearch;
  const handleSearchChange = (e) => {
    if (controlledOnSearchChange) controlledOnSearchChange(e);
    else setInternalSearch(e.target.value);
  };

  // Instant local search filter when items are not externally filtered
  const displayedItems = useMemo(() => {
    if (controlledSearch !== undefined || selectedPill !== undefined) {
      return items;
    }
    return items.filter((item) => {
      const q = currentSearch.toLowerCase().trim();
      const matchSearch = !q ||
        item.title?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q);

      const matchPill = currentPill === 'All' || !item.raw?.propertyType ||
        item.raw?.propertyType?.toLowerCase() === currentPill.toLowerCase();

      return matchSearch && matchPill;
    });
  }, [items, currentSearch, currentPill, controlledSearch, selectedPill]);

  return (
    <div className="pb-24 bg-slate-50/50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Header Area ── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 sm:py-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
              {categoryTitle}
            </h1>
            {categorySubtitle && (
              <p className="mt-1 text-sm text-slate-500 max-w-2xl">
                {categorySubtitle}
              </p>
            )}
          </div>

          {headerActions && (
            <div className="flex items-center gap-3 shrink-0">
              {headerActions}
            </div>
          )}
        </div>

        {/* Stats / Info Banner */}
        {statsBanner}

        {/* ── Filter Pills Strip ── */}
        {filterPills.length > 0 && (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filterPills.map((pill) => {
              const isSelected = currentPill === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => handlePillClick(pill.id)}
                  className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                    isSelected
                      ? 'bg-brand-blue text-white shadow-sm shadow-blue-500/20 ring-1 ring-brand-blue'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {pill.icon && <i className={`${pill.icon} text-xs`} />}
                  <span>{pill.label}</span>
                  {pill.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {pill.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Search Bar ── */}
        <div className="mt-4 relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={currentSearch}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all shadow-xs"
            />
          </div>
        </div>

        {/* ── Main Layout: Sidebar + Grid ── */}
        <div className="mt-6 flex gap-8 items-start">
          {/* Optional Pluggable Sidebar Filter */}
          {sidebarFilter && (
            <aside className="hidden lg:block w-72 shrink-0 sticky top-20">
              {sidebarFilter}
            </aside>
          )}

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0">
            {displayedItems.length > 0 ? (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {displayedItems.map((item) => (
                  <div key={item.id}>
                    {customCardRenderer ? (
                      customCardRenderer(item)
                    ) : (
                      <ListingCard
                        item={item}
                        onSelect={onSelectItem}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : emptyState ? (
              emptyState
            ) : (
              <div className="text-center py-20 rounded-2xl border border-dashed border-slate-200 bg-white p-8">
                <SlidersHorizontal className="mx-auto w-10 h-10 text-slate-300 mb-3" />
                <h3 className="text-base font-semibold text-slate-700">
                  No listings found
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                  Try adjusting your search terms or filter selection to find what you're looking for.
                </p>
              </div>
            )}

            {/* Custom content appended below grid (e.g. pagination) */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
