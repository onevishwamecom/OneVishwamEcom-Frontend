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
        <div className="space-y-4">
          <TopFilterBar
            cityValue={selectedCity || 'bengaluru'}
            onCityChange={(c) => selectCity(c)}
            areaValue={locationInput}
            onAreaChange={setLocationInput}
            areasList={cityAreas}
            requirementValue={searchTerm}
            onRequirementChange={setSearchTerm}
            requirementPlaceholder="e.g. 22K Gold Necklace, Diamond Solitaire, Silver Coins"
            searchButtonText="Search Jewellery"
            postRequirementLink="/post-requirement"
            postRequirementLabel="Post Requirement"
            isExpanded={isSearchOpen}
            onToggleExpanded={() => setIsSearchOpen((prev) => !prev)}
            customSwitchSlot={
              <div className="flex flex-wrap items-center gap-4">
                <FilterToggle
                  checked={certifiedOnly}
                  onChange={setCertifiedOnly}
                  label="Certified Hallmarked Only"
                  icon="fa-solid fa-certificate"
                />
                <FilterToggle
                  checked={filters.availability.includes('Try At Home')}
                  onChange={(v) => updateFilter('availability', v ? ['Try At Home'] : [])}
                  label="Try At Home Available"
                  icon="fa-solid fa-house"
                />
              </div>
            }
          />
        </div>
      )}
      sidebarComponent={() => (
        <JewelleryFilterSidebar
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