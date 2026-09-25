import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CategoryListingCard from './CategoryListingCard';
import { CollapsibleSection, CheckboxGroup, ActiveChip } from '../../ui';
import { useLocation } from '../../../store/locationSlice';
import { cities } from '../../../data/locations';
import PageContainer from '../PageContainer';

function formatCurrency(val, unit = 'L') {
  const num = Number(val);
  if (!num || isNaN(num) || num <= 0) return '₹ 0';
  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
    return `₹ ${cr} Cr`;
  }
  if (num >= 100000) {
    const lakh = (num / 100000).toFixed(1).replace(/\.0$/, '');
    return `₹ ${lakh} L`;
  }
  return `₹ ${num.toLocaleString('en-IN')}`;
}

/**
 * DualRangeSlider matching PropertyFilterSidebar exactly:
 * - Top blue pill chips showing active Min/Max ranges
 * - Dual-thumb range slider track
 * - Twin input boxes underneath for Min (₹) and Max (₹)
 */
export function DualRangeSlider({
  min = 0,
  max = 50000000,
  step = 100000,
  minVal = '',
  maxVal = '',
  onChange,
  formatLabel = formatCurrency,
  maxLabel = 'Max',
  unitLabel = '₹',
}) {
  const currentMin = minVal !== '' && !isNaN(minVal) ? Number(minVal) : min;
  const currentMax = maxVal !== '' && !isNaN(maxVal) ? Number(maxVal) : max;

  const minPercent = Math.max(0, Math.min(100, ((currentMin - min) / (max - min)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((currentMax - min) / (max - min)) * 100));

  return (
    <div className="my-2.5 px-1">
      <div className="flex items-center justify-between text-xs font-bold text-brand-blue mb-2">
        <span className="bg-brand-blue/10 px-2 py-0.5 rounded-md">{formatLabel(currentMin)}</span>
        <span className="text-gray-400 font-normal text-[10px]">to</span>
        <span className="bg-brand-blue/10 px-2 py-0.5 rounded-md">
          {currentMax >= max ? maxLabel : formatLabel(currentMax)}
        </span>
      </div>

      <div className="relative w-full h-5 flex items-center">
        <div className="h-2 w-full rounded-full bg-gray-200 relative">
          <div
            className="absolute h-2 rounded-full bg-brand-blue"
            style={{
              left: `${minPercent}%`,
              width: `${Math.max(0, maxPercent - minPercent)}%`,
            }}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentMin}
          onChange={(e) => {
            const val = Math.min(Number(e.target.value), currentMax - step);
            onChange(val <= min ? '' : String(val), maxVal);
          }}
          className="pointer-events-none absolute left-0 w-full h-2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-blue [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-blue [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentMax}
          onChange={(e) => {
            const val = Math.max(Number(e.target.value), currentMin + step);
            onChange(minVal, val >= max ? '' : String(val));
          }}
          className="pointer-events-none absolute left-0 w-full h-2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-blue [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-blue [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>

      <div className="flex gap-2 mt-3">
        <input
          type="number"
          placeholder={`Min (${unitLabel})`}
          value={minVal}
          onChange={(e) => onChange(e.target.value, maxVal)}
          className="w-1/2 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-brand-blue"
        />
        <input
          type="number"
          placeholder={`Max (${unitLabel})`}
          value={maxVal}
          onChange={(e) => onChange(minVal, e.target.value)}
          className="w-1/2 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-brand-blue"
        />
      </div>
    </div>
  );
}

/**
 * MarketplaceCategoryGallery:
 * Master reusable template extracted directly from the Real Estate / Housing gallery page.
 * Strictly preserves 100% of the visual styling, CSS classes, DOM hierarchy, and topology:
 * 1. Top Navigation & Action Header (Breadcrumb, Post Requirement, Quick Match, Count badge)
 * 2. Stretched Modern Unified Search Bar with blue Search button
 * 3. Left Sticky Filter Sidebar with accordion sections and dual range sliders
 * 4. 3-Column Card Grid using CategoryListingCard
 * 5. Modern Pagination Bar (< Prev, 1, 2, ..., Next >)
 */
export default function MarketplaceCategoryGallery({
  categoryTitle = 'Verified Inventory',
  categorySubtitle = 'Explore our verified inventory with complete documentation and loan assistance.',
  breadcrumbCategory = 'Marketplace',
  items = [],
  filterGroups = [],
  rangeFilters = [],
  activeFilters = {},
  onFilterChange,
  activeChips = [],
  onRemoveChip,
  onResetFilters,
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Search inventory by title, brand, locality, or keyword...',
  postRequirementLink = '/property/requirement',
  onQuickMatch,
  quickMatchLabel = 'Quick Match',
  customSidebar,
  customCardRenderer,
  perPage = 9,
}) {
  const navigate = useNavigate();
  const { selectedCity, selectCity } = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [openSections, setOpenSections] = useState(() => {
    const initial = {};
    filterGroups.forEach((g) => { initial[g.id] = g.defaultOpen !== false; });
    rangeFilters.forEach((r) => { initial[r.id] = r.defaultOpen !== false; });
    return initial;
  });

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  // Pagination calculation
  const totalPages = Math.ceil(items.length / perPage) || 1;
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, currentPage, perPage]);

  const goToPage = (n) => {
    setCurrentPage(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Sidebar JSX ── */
  const renderSidebarContent = () => (
    <div className="space-y-4 text-xs">
      {/* Range Filters */}
      {rangeFilters.map((range) => (
        <CollapsibleSection
          key={range.id}
          id={range.id}
          label={range.title}
          open={openSections[range.id]}
          onToggle={toggleSection}
        >
          <DualRangeSlider
            min={range.min || 0}
            max={range.max || 50000000}
            step={range.step || 100000}
            minVal={activeFilters[`${range.id}Min`] || ''}
            maxVal={activeFilters[`${range.id}Max`] || ''}
            onChange={(minV, maxV) => {
              setCurrentPage(1);
              if (onFilterChange) {
                onFilterChange(`${range.id}Min`, minV);
                onFilterChange(`${range.id}Max`, maxV);
              }
            }}
            formatLabel={range.formatLabel || formatCurrency}
            maxLabel={range.maxLabel || 'Max'}
            unitLabel={range.unitLabel || '₹'}
          />
        </CollapsibleSection>
      ))}

      {/* Checkbox Group Filters */}
      {filterGroups.map((group) => {
        const selected = activeFilters[group.id] || [];
        return (
          <CollapsibleSection
            key={group.id}
            id={group.id}
            label={group.title}
            open={openSections[group.id]}
            onToggle={toggleSection}
          >
            <CheckboxGroup
              options={group.options || []}
              selected={selected}
              onChange={(newSelected) => {
                setCurrentPage(1);
                if (onFilterChange) {
                  onFilterChange(group.id, newSelected);
                }
              }}
              search={group.search}
            />
          </CollapsibleSection>
        );
      })}
    </div>
  );

  return (
    <PageContainer className="min-h-screen bg-[#f8fafc] pb-24 relative">

        {/* ── Top Navigation & Title Bar ── */}
        <div className="pt-4 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 font-bold text-brand-blue hover:underline cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left" /> Back
              </button>
              <span>/</span>
              <Link to="/home" className="hover:text-brand-blue">Home</Link>
              <span>/</span>
              <span className="text-brand-charcoal font-semibold">{breadcrumbCategory}</span>
            </div>

            <div className="flex items-center gap-2">
              {postRequirementLink && (
                <Link
                  to={postRequirementLink}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-gray-200 px-3.5 py-1.5 text-xs font-bold text-brand-blue hover:bg-brand-blue/5 hover:border-brand-blue/30 transition-colors shadow-2xs"
                >
                  <i className="fa-solid fa-circle-plus text-brand-blue" />
                  <span>Post Requirement</span>
                </Link>
              )}
              {onQuickMatch && (
                <button
                  type="button"
                  onClick={onQuickMatch}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue px-3.5 py-1.5 text-xs font-bold text-white hover:bg-brand-navy transition-colors shadow-xs"
                >
                  <i className="fa-solid fa-bolt text-yellow-400" />
                  <span>{quickMatchLabel}</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-charcoal">
                {categoryTitle}
              </h1>
              {categorySubtitle && (
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {categorySubtitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200/80 px-3 py-1.5 rounded-xl shadow-2xs">
                <i className="fa-solid fa-layer-group mr-1.5 text-brand-blue" />
                {items.length} Listing{items.length !== 1 ? 's' : ''} Available
              </span>
            </div>
          </div>
        </div>

        {/* ── Stretched Modern Unified Search & Location Bar ── */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1 flex items-center w-full bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:border-brand-blue/40 focus-within:border-brand-blue focus-within:ring-4 focus-within:ring-brand-blue/10 transition-all duration-200">
            <i className="fa-solid fa-magnifying-glass absolute left-4 text-gray-400 text-sm pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setCurrentPage(1);
                if (onSearchChange) onSearchChange(e.target.value);
              }}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent pl-11 pr-28 py-3.5 text-sm font-medium text-brand-charcoal placeholder:text-gray-400 outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setCurrentPage(1);
                  if (onSearchChange) onSearchChange('');
                }}
                className="absolute right-14 text-gray-400 hover:text-gray-600 p-1 text-xs transition-colors"
                title="Clear search"
              >
                <i className="fa-solid fa-circle-xmark text-sm" />
              </button>
            )}
            <div className="absolute right-3.5 hidden sm:flex items-center">
              <span className="text-[11px] font-bold text-white bg-brand-blue px-3 py-1.5 rounded-xl shadow-xs">
                Search
              </span>
            </div>
          </div>

          {/* Top Location Filter Dropdown */}
          <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-200/90 px-4 py-3 text-sm shadow-sm hover:border-brand-blue/40 transition-all shrink-0">
            <i className="fa-solid fa-location-dot text-brand-blue text-sm shrink-0" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">Location:</span>
              <select
                value={selectedCity || ''}
                onChange={(e) => {
                  setCurrentPage(1);
                  selectCity(e.target.value);
                }}
                className="bg-transparent text-xs sm:text-sm font-semibold text-brand-charcoal outline-none cursor-pointer pr-1"
              >
                <option value="">All Cities</option>
                {Object.entries(cities).map(([id, c]) => (
                  <option key={id} value={id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Active Filters & Mobile Trigger Bar ── */}
        <div className="mt-4 flex items-center justify-between gap-3 pb-1">
          <div className="flex-1 flex flex-wrap items-center gap-1.5 min-w-0">
            {activeChips.map((chip, idx) => (
              <ActiveChip
                key={idx}
                label={chip.label}
                onRemove={() => {
                  setCurrentPage(1);
                  if (onRemoveChip) onRemoveChip(chip);
                }}
              />
            ))}
            {activeChips.length > 0 && onResetFilters && (
              <button
                type="button"
                onClick={() => {
                  setCurrentPage(1);
                  onResetFilters();
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-700 ml-1.5 px-1 py-0.5 cursor-pointer"
              >
                <i className="fa-solid fa-rotate-left" /> Reset All Filters
              </button>
            )}
          </div>

          <div className="lg:hidden flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-brand-charcoal hover:bg-gray-50 transition-colors shadow-2xs"
            >
              <i className="fa-solid fa-sliders text-brand-blue" />
              <span>Filters</span>
              {activeChips.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-brand-blue text-white text-[10px] flex items-center justify-center font-bold">
                  {activeChips.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Main Layout: Sidebar + Grid ── */}
        <div className="mt-4 flex gap-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="lg:sticky lg:top-[132px] lg:self-start max-h-[calc(100vh-9.5rem)] overflow-y-auto rounded-3xl border border-gray-200/80 bg-white p-5 shadow-xs scrollbar-hide">
              {customSidebar || renderSidebarContent()}
            </div>
          </aside>

          {/* Product Grid Container */}
          <div className="flex-1 min-w-0">
            {pageItems.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
                {pageItems.map((item) => (
                  <div key={item.id}>
                    {customCardRenderer ? (
                      customCardRenderer(item)
                    ) : (
                      <CategoryListingCard item={item} />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-white border border-gray-200/80 p-8 sm:p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto mb-4 text-2xl">
                  <i className="fa-solid fa-layer-group" />
                </div>
                <h3 className="text-lg font-bold text-brand-charcoal">
                  No Matching {breadcrumbCategory} Found
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-6 max-w-md mx-auto">
                  We couldn't find any listings matching your current search or filter criteria. Try adjusting your filters or search terms.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {onResetFilters && (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage(1);
                        onResetFilters();
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-brand-charcoal hover:bg-gray-50 transition-colors shadow-2xs"
                    >
                      <i className="fa-solid fa-rotate-left" />
                      Reset All Filters
                    </button>
                  )}
                  {postRequirementLink && (
                    <Link
                      to={postRequirementLink}
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-navy transition-colors shadow-xs"
                    >
                      <i className="fa-solid fa-circle-plus" />
                      Post Custom Requirement
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* ── Modern Pagination Controls ── */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-brand-charcoal hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
                >
                  <i className="fa-solid fa-chevron-left text-[10px]" /> Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                  const show =
                    n === 1 ||
                    n === totalPages ||
                    Math.abs(n - currentPage) <= 1;
                  const prevShown =
                    n === 1 || Math.abs(n - 1 - currentPage) <= 1;
                  if (!show) {
                    if (prevShown) {
                      return (
                        <span key={n} className="px-1 text-gray-400 text-xs font-semibold">
                          …
                        </span>
                      );
                    }
                    return null;
                  }
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => goToPage(n)}
                      className={`min-w-10 h-9 rounded-xl text-xs font-bold transition-all ${
                        n === currentPage
                          ? 'bg-brand-blue text-white shadow-md scale-105'
                          : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-2xs'
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-brand-charcoal hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
                >
                  Next <i className="fa-solid fa-chevron-right text-[10px]" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile Filter Drawer ── */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setShowMobileFilters(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-xs sm:max-w-sm bg-white shadow-2xl overflow-y-auto flex flex-col">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
                <span className="font-bold text-brand-charcoal text-base">Filters</span>
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i className="fa-solid fa-xmark text-gray-500" />
                </button>
              </div>
              <div className="p-5 flex-1">
                {customSidebar || renderSidebarContent()}
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full rounded-xl bg-brand-blue py-3 text-xs font-bold text-white shadow-sm hover:bg-brand-navy transition-colors"
                >
                  Apply Filters ({items.length} Available)
                </button>
              </div>
            </div>
          </div>
        )}
    </PageContainer>
  );
}
