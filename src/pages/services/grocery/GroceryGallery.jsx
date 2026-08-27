import React, { useState, useMemo } from 'react';
import { useGroceries } from './groceryHooks';
import { groceryListingConfig } from './groceryConfig';
import {
  MasterListingPage,
  TopFilterBar,
  FilterToggle,
  useFilterState,
  getNumericPrice,
} from '../shared';
import GroceryFilterSidebar from './components/GroceryFilterSidebar';
import { useLocation } from '../../../store/locationSlice';
import { cities } from '../../../data/locations';

const INITIAL_FILTERS = {
  priceMin: '',
  priceMax: '',
  vendors: [],
  delivery: [],
  availability: '',
  locality: '',
  organicOnly: false,
};

const INITIAL_SECTIONS = {
  price: true,
  vendors: true,
  delivery: true,
  availability: false,
  locality: false,
};

/**
 * Grocery & Consumer Marketplace Gallery Page
 * Powered by MasterListingPage & TopFilterBar.
 */
export default function GroceryGallery() {
  const { selectedCity, selectCity } = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { filters, openSections, updateFilter, toggleSection, resetFilters } = useFilterState(
    INITIAL_FILTERS,
    INITIAL_SECTIONS
  );

  const { groceries, loading, error } = useGroceries();

  const cityAreas = selectedCity ? cities[selectedCity]?.areas || [] : [];

  const filteredGroceries = useMemo(() => {
    return (groceries || []).filter((item) => {
      if (filters.organicOnly && !item.organic) return false;
      if (filters.availability === 'In Stock' && (item.inStock === false || item.stock === 0)) return false;

      if (filters.locality && item.location?.area !== filters.locality && item.area !== filters.locality) {
        return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const name = (item.name || item.title || '').toLowerCase();
        const brand = (item.brand || item.vendorName || '').toLowerCase();
        const cat = (item.category || '').toLowerCase();
        if (!name.includes(q) && !brand.includes(q) && !cat.includes(q)) return false;
      }

      const p = getNumericPrice(item.pricePerUnit || item.price);
      if (filters.priceMin && p < +filters.priceMin) return false;
      if (filters.priceMax && p > +filters.priceMax) return false;
      if (filters.vendors.length > 0 && !filters.vendors.includes(item.vendorType || item.brand)) return false;
      if (filters.delivery.length > 0 && !(Array.isArray(item.deliveryType) && filters.delivery.some((d) => item.deliveryType.includes(d)))) {
        return false;
      }

      return true;
    });
  }, [groceries, filters, searchTerm]);

  return (
    <MasterListingPage
      sector="grocery"
      config={groceryListingConfig}
      hooks={{
        useItems: () => ({ items: filteredGroceries, loading, error }),
      }}
      topBarSlot={() => (
        <div className="flex flex-col sm:flex-row items-center gap-3 my-4">
          <div className="relative flex-1 w-full">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search groceries (e.g. Organic mangoes, fresh milk, spices)..."
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
        <GroceryFilterSidebar
          filters={filters}
          openSections={openSections}
          updateFilter={updateFilter}
          toggleSection={toggleSection}
          resetFilters={resetFilters}
          cityAreas={cityAreas}
        />
      )}
    />
  );
}
