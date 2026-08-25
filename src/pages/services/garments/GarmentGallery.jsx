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
        <div className="space-y-4">
          <TopFilterBar
            cityValue={selectedCity || 'bengaluru'}
            onCityChange={(c) => selectCity(c)}
            areaValue={locationInput}
            onAreaChange={setLocationInput}
            areasList={cityAreas}
            requirementValue={searchTerm}
            onRequirementChange={setSearchTerm}
            requirementPlaceholder="e.g. Silk Saree, Cotton Kurta, Formal Shirt"
            searchButtonText="Search Fashion"
            postRequirementLink="/post-requirement"
            postRequirementLabel="Post Requirement"
            isExpanded={isSearchOpen}
            onToggleExpanded={() => setIsSearchOpen((prev) => !prev)}
            customSwitchSlot={
              <div className="flex flex-wrap items-center gap-4">
                <FilterToggle
                  checked={filters.discount === '20'}
                  onChange={(v) => updateFilter('discount', v ? '20' : '')}
                  label="On Sale (20%+ OFF)"
                  icon="fa-solid fa-tag"
                />
                <FilterToggle
                  checked={trendingOnly}
                  onChange={setTrendingOnly}
                  label="Trending Styles Only"
                  icon="fa-solid fa-fire"
                />
              </div>
            }
          />
        </div>
      )}
      sidebarComponent={() => (
        <GarmentFilterSidebar
          filters={filters}
          openSections={openSections}
          updateFilter={updateFilter}
          toggleSection={toggleSection}
          resetFilters={resetFilters}
        />
      )}
    />
  );
}
