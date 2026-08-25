import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import CategoryPillStrip from '../CategoryPillStrip';
import ResultsBar from '../ResultsBar';
import TopFilterBar from '../filters/TopFilterBar';
import ListingGrid from './ListingGrid';
import Fab from '../Fab';
import Pagination from '../Pagination';
import MobileFilterDrawer from '../../../../components/MobileFilterDrawer';
import { LoadingSpinner, ErrorState } from '../LoadingError';

/**
 * Universal Master Listing Page Engine
 * Powers listing and search gallery views across all OneVishwam sectors.
 */
export default function MasterListingPage({
  sector = 'property',
  config = {},
  hooks = {},
  customHeader,
  topBarSlot,
  sidebarComponent: SidebarComponent,
  cardActionsSlot,
  renderCard,
  modalsSlot,
  itemsPerPage = 12,
}) {
  const {
    eyebrow = 'OneVishwam · Marketplace',
    title = 'Find Listings',
    categories = [],
    emptyState = {},
    backUrl = '/',
    backLabel = 'Home',
  } = config;

  // Data fetching
  const { items = [], loading = false, error = null } = hooks.useItems ? hooks.useItems() : {};

  // Local UI State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Filter items by category & search term if standard
  const filteredItems = useMemo(() => {
    let list = Array.isArray(items) ? items : [];

    // Category filter
    if (selectedCategory && selectedCategory !== 'All') {
      list = list.filter((item) => {
        const cat = (item.category || item.cardType || item.type || item.propertyType || '').toLowerCase();
        return cat.includes(selectedCategory.toLowerCase());
      });
    }

    // Keyword search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((item) => {
        const name = (item.name || item.title || `${item.brand || ''} ${item.model || ''}`).toLowerCase();
        const loc = (item.location || item.city || item.address || '').toLowerCase();
        return name.includes(q) || loc.includes(q);
      });
    }

    return list;
  }, [items, selectedCategory, searchTerm]);

  // Paginated slice
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, page, itemsPerPage]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-16 lg:pt-14 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        {customHeader ? (
          customHeader({ total: filteredItems.length, items })
        ) : (
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <Link
                to={backUrl}
                className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-blue transition-colors"
              >
                <i className="fa-solid fa-arrow-left" /> {backLabel}
              </Link>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-1">
                {eyebrow}
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl">
                {title}
              </h1>
            </div>
            <span className="hidden sm:block text-xs text-gray-400 pb-1">
              {filteredItems.length} listing{filteredItems.length !== 1 ? 's' : ''} available
            </span>
          </div>
        )}

        {/* Category Pill Strip */}
        {Array.isArray(categories) && categories.length > 0 && (
          <CategoryPillStrip
            types={categories}
            selected={selectedCategory}
            onSelect={(cat) => {
              setPage(1);
              setSelectedCategory(cat);
            }}
          />
        )}

        {/* Top Search / Filter Bar Slot */}
        {topBarSlot ? (
          topBarSlot({ searchTerm, setSearchTerm, sortBy, setSortBy, setMobileFilterOpen })
        ) : (
          <ResultsBar
            count={filteredItems.length}
            searchValue={searchTerm}
            onSearchChange={(e) => {
              setPage(1);
              setSearchTerm(e.target.value);
            }}
            sortValue={sortBy}
            onSortChange={(e) => setSortBy(e.target.value)}
            onMobileFilter={SidebarComponent ? () => setMobileFilterOpen(true) : undefined}
          />
        )}

        {/* Loading / Error States */}
        {loading && <LoadingSpinner text="Loading listings..." className="py-24" />}
        {error && <ErrorState error={error} className="py-24" />}

        {/* Main Content Layout */}
        {!loading && !error && (
          <div className="mt-6 grid gap-8 lg:grid-cols-12 items-start">
            {/* Desktop Filter Sidebar */}
            {SidebarComponent && (
              <aside className="hidden lg:block lg:col-span-3 rounded-2xl bg-white border border-gray-100 p-5 shadow-xs">
                <SidebarComponent />
              </aside>
            )}

            {/* Listings Grid */}
            <main className={SidebarComponent ? 'lg:col-span-9' : 'lg:col-span-12'}>
              <ListingGrid
                items={paginatedItems}
                sector={sector}
                renderCard={renderCard}
                renderActions={cardActionsSlot}
                emptyIcon={emptyState.icon}
                emptyTitle={emptyState.title}
                emptySubtitle={emptyState.subtitle}
                onResetFilters={() => {
                  setSelectedCategory('All');
                  setSearchTerm('');
                  setPage(1);
                }}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(p) => {
                      setPage(p);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                  />
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      {SidebarComponent && (
        <MobileFilterDrawer
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          resultCount={filteredItems.length}
        >
          <SidebarComponent />
        </MobileFilterDrawer>
      )}

      {/* Floating Action Button for Mobile */}
      {SidebarComponent && (
        <Fab onClick={() => setMobileFilterOpen(true)} />
      )}

      {/* Modals Slot */}
      {modalsSlot && modalsSlot()}
    </div>
  );
}
