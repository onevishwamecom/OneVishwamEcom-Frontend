import React, { useState, useMemo } from 'react';
import { useJewellery } from './jewelleryHooks';
import { jewelleryListingConfig } from './jewelleryConfig';
import {
  MasterListingPage,
  TopFilterBar,
  FilterToggle,
  useFilterState,
  getNumericPrice,
} from '../shared';
import JewelleryFilterSidebar from './components/JewelleryFilterSidebar';
import { useLocation } from '../../../store/locationSlice';
import { cities } from '../../../data/locations';

const INITIAL_FILTERS = {
  budgetMin: '',
  budgetMax: '',
  metals: [],
  weightMin: '',
  weightMax: '',
  genders: [],
  availability: [],
  occasions: [],
};

const INITIAL_SECTIONS = {
  budget: true,
  metals: true,
  weight: false,
  occasions: false,
  genders: false,
  availability: false,
};

/**
 * Jewellery & Precious Metals Gallery Page
 * Powered by MasterListingPage & TopFilterBar.
 */
export default function JewelleryGallery() {
  const { selectedCity, selectCity } = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { filters, openSections, updateFilter, toggleSection, resetFilters } = useFilterState(
    INITIAL_FILTERS,
    INITIAL_SECTIONS
  );

  const { jewellery, loading, error } = useJewellery();

  const cityAreas = selectedCity ? cities[selectedCity]?.areas || [] : [];

  const filteredJewellery = useMemo(() => {
    return (jewellery || []).filter((item) => {
      if (certifiedOnly && !item.certified) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const name = (item.name || item.title || '').toLowerCase();
        const metal = (item.metalType || '').toLowerCase();
        const cat = (item.category || '').toLowerCase();
        if (!name.includes(q) && !metal.includes(q) && !cat.includes(q)) return false;
      }

      if (locationInput && item.store?.city && !item.store.city.toLowerCase().includes(locationInput.toLowerCase())) {
        return false;
      }

      const p = getNumericPrice(item.price);
      if (filters.budgetMin && p < +filters.budgetMin) return false;
      if (filters.budgetMax && p > +filters.budgetMax) return false;

      if (filters.metals.length > 0 && !filters.metals.some((m) => `${item.metalType} ${item.purity}`.includes(m))) {
        return false;
      }

      if (filters.genders.length > 0 && !filters.genders.includes(item.gender)) return false;
      if (filters.occasions.length > 0 && !(Array.isArray(item.occasion) && filters.occasions.some((o) => item.occasion.includes(o)))) {
        return false;
      }

      if (filters.availability.includes('Try At Home') && !item.tryAtHome) return false;

      return true;
    });
  }, [jewellery, filters, searchTerm, locationInput, certifiedOnly]);

  return (
    <MasterListingPage
      sector="jewellery"
      config={jewelleryListingConfig}
      hooks={{
        useItems: () => ({ items: filteredJewellery, loading, error }),
      }}
      topBarSlot={() => (
        <div className="flex flex-col sm:flex-row items-center gap-3 my-4">
          <div className="relative flex-1 w-full">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jewellery (e.g. 22K Gold Necklace, Diamond Solitaire, Silver Coins)..."
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
        <JewelleryFilterSidebar
          filters={filters}
          openSections={openSections}
          updateFilter={updateFilter}
          toggleSection={toggleSection}
          resetFilters={resetFilters}
          certifiedOnly={certifiedOnly}
          setCertifiedOnly={setCertifiedOnly}
        />
      )}
    />
  );
}