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
        <div className="space-y-4">
          <TopFilterBar
            cityValue={selectedCity || 'bengaluru'}
            onCityChange={(c) => selectCity(c)}
            areaValue={filters.locality}
            onAreaChange={(a) => updateFilter('locality', a)}
            areasList={cityAreas}
            requirementValue={searchTerm}
            onRequirementChange={setSearchTerm}
            requirementPlaceholder="e.g. Organic mangoes, fresh milk, spices"
            searchButtonText="Search Groceries"
            postRequirementLink="/post-requirement"
            postRequirementLabel="Post Requirement"
            isExpanded={isSearchOpen}
            onToggleExpanded={() => setIsSearchOpen((prev) => !prev)}
            customSwitchSlot={
              <div className="flex flex-wrap items-center gap-4">
                <FilterToggle
                  checked={filters.organicOnly}
                  onChange={(v) => updateFilter('organicOnly', v)}
                  label="Organic Certified Only"
                  icon="fa-solid fa-leaf"
                />
                <FilterToggle
                  checked={filters.availability === 'In Stock'}
                  onChange={(v) => updateFilter('availability', v ? 'In Stock' : '')}
                  label="In Stock Only"
                  icon="fa-solid fa-boxes-stacked"
                />
              </div>
            }
          />
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
