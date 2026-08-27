import React, { useState, useMemo } from 'react';
import { useGarments } from './garmentHooks';
import { garmentListingConfig } from './garmentConfig';
import {
  MasterListingPage,
  TopFilterBar,
  FilterToggle,
  useFilterState,
  getNumericPrice,
} from '../shared';
import GarmentFilterSidebar from './components/GarmentFilterSidebar';
import { useLocation } from '../../../store/locationSlice';
import { cities } from '../../../data/locations';

const INITIAL_FILTERS = {
  budgetMin: '',
  budgetMax: '',
  brandTypes: [],
  sizes: [],
  fabrics: [],
  occasions: [],
  discount: '',
  delivery: [],
};

const INITIAL_SECTIONS = {
  budget: true,
  brandTypes: true,
  sizes: true,
  fabrics: false,
  occasions: false,
  discount: false,
  delivery: false,
};

/**
 * Garments, Fashion & Lifestyle Gallery Page
 * Powered by MasterListingPage & TopFilterBar.
 */
export default function GarmentGallery() {
  const { selectedCity, selectCity } = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [trendingOnly, setTrendingOnly] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { filters, openSections, updateFilter, toggleSection, resetFilters } = useFilterState(
    INITIAL_FILTERS,
    INITIAL_SECTIONS
  );

  const { garments, loading, error } = useGarments();

  const cityAreas = selectedCity ? cities[selectedCity]?.areas || [] : [];

  const filteredGarments = useMemo(() => {
    return (garments || []).filter((item) => {
      if (trendingOnly && !item.trending) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const name = (item.name || item.title || '').toLowerCase();
        const brand = (item.brand || '').toLowerCase();
        const cat = (item.category || item.subcategory || '').toLowerCase();
        const fab = (item.fabric || item.material || '').toLowerCase();
        if (!name.includes(q) && !brand.includes(q) && !cat.includes(q) && !fab.includes(q)) return false;
      }

      if (locationInput && item.store?.city && !item.store.city.toLowerCase().includes(locationInput.toLowerCase())) {
        return false;
      }

      const p = getNumericPrice(item.finalPrice || item.price);
      if (filters.budgetMin && p < +filters.budgetMin) return false;
      if (filters.budgetMax && p > +filters.budgetMax) return false;

      if (filters.brandTypes.length > 0 && !filters.brandTypes.includes(item.brandType || item.brand)) return false;
      if (filters.sizes.length > 0 && !(Array.isArray(item.sizes) && filters.sizes.some((s) => item.sizes.includes(s)))) return false;
      if (filters.fabrics.length > 0 && !filters.fabrics.includes(item.fabric)) return false;
      if (filters.occasions.length > 0 && !(Array.isArray(item.occasion) && filters.occasions.some((o) => item.occasion.includes(o)))) return false;

      if (filters.discount) {
        const d = parseInt(filters.discount, 10);
        if ((item.discount || 0) < d) return false;
      }

      return true;
    });
  }, [garments, filters, searchTerm, locationInput, trendingOnly]);

  return (
    <MasterListingPage
      sector="garments"
      config={garmentListingConfig}
      hooks={{
        useItems: () => ({ items: filteredGarments, loading, error }),
      }}
      topBarSlot={() => (
        <div className="flex flex-col sm:flex-row items-center gap-3 my-4">
          <div className="relative flex-1 w-full">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search garments (e.g. Silk Saree, Cotton Kurta, Formal Shirt)..."
              className="w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-10 py-3 text-sm font-semibold text-brand-charcoal outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all shadow-2xs hover:shadow-xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-brand-charcoal hover:bg-gray-100 transition-colors"
                aria-label="Clear search"
              >
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            )}
          </div>
          <Link
            to="/post-requirement"
            className="rounded-2xl bg-brand-blue hover:bg-brand-navy text-white font-bold px-5 py-3 text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 whitespace-nowrap shadow-xs hover:shadow transition-colors duration-200"
          >
            <i className="fa-solid fa-circle-plus text-xs" />
            <span>Post Requirement</span>
          </Link>
        </div>
      )}
      sidebarComponent={() => (
        <GarmentFilterSidebar
          filters={filters}
          openSections={openSections}
          updateFilter={updateFilter}
          toggleSection={toggleSection}
          resetFilters={resetFilters}
          trendingOnly={trendingOnly}
          setTrendingOnly={setTrendingOnly}
        />
      )}
    />
  );
}
