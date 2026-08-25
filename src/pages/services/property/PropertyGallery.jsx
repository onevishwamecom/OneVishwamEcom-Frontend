import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocation } from '../../../store/locationSlice';
import { cities, getCityLabel } from '../../../data/locations';
import { useProperties } from '../../../hooks/useProperties';
import QuickMatchModal from './QuickMatchModal';
import {
  PROPERTY_CARD_TYPES,
  CITY_OPTIONS,
  INITIAL_FILTERS,
  INITIAL_SECTIONS,
} from './propertyConstants';
import {
  useCardTypeStats,
  useActiveChips,
  useFilteredProperties,
} from './propertyHooks';
import PropertyFinancePanel from './PropertyFinancePanel';
import PropertyFilterSidebar from './PropertyFilterSidebar';
import { propertyListingConfig } from './propertyConfig';
import {
  MasterListingPage,
  TopFilterBar,
  FilterToggle,
  loadSessionState,
  saveSessionState,
} from '../shared';

const RESTORE_KEY = 'vishwam.propertyGalleryState';

/**
 * Real Estate & Properties Marketplace Gallery Page
 * Powered by MasterListingPage & TopFilterBar.
 */
export default function PropertyGallery() {
  const { selectedCity, selectCity } = useLocation();
  const { properties, loading, error } = useProperties();

  const [selectedCardType, setSelectedCardType] = useState('All');
  const [locationInput, setLocationInput] = useState('');
  const [requirementText, setRequirementText] = useState('');
  const [showFinance, setShowFinance] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [filters, setFilters] = useState({ ...INITIAL_FILTERS });
  const [openSections, setOpenSections] = useState({ ...INITIAL_SECTIONS });
  const [quickMatchOpen, setQuickMatchOpen] = useState(false);
  const [familyLocationsOnly, setFamilyLocationsOnly] = useState(false);
  const [preApprovedMode, setPreApprovedMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const restoredRef = useRef(false);

  useEffect(() => {
    const q = (searchParams.get('q') || '').trim();
    if (q) setSearchTerm(q);
  }, [searchParams]);

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const s = loadSessionState(RESTORE_KEY, {});
    if (s.searchTerm) setSearchTerm(s.searchTerm);
    if (s.requirementText) setRequirementText(s.requirementText);
    if (s.selectedCardType) setSelectedCardType(s.selectedCardType);
    if (s.locationInput) setLocationInput(s.locationInput);
    if (s.sortBy) setSortBy(s.sortBy);
    if (s.filters) setFilters({ ...INITIAL_FILTERS, ...s.filters });
  }, []);

  useEffect(() => {
    if (!restoredRef.current) return;
    saveSessionState(RESTORE_KEY, {
      searchTerm,
      requirementText,
      selectedCardType,
      locationInput,
      sortBy,
      filters,
    });
  }, [searchTerm, requirementText, selectedCardType, locationInput, sortBy, filters]);

  const cityAreas = selectedCity ? cities[selectedCity]?.areas || [] : [];
  const noCityMessage = !selectedCity;

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const toggleSection = (id) => setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  const resetFilters = () => setFilters({ ...INITIAL_FILTERS });

  const activeChips = useActiveChips(filters);
  const filteredProperties = useFilteredProperties({
    properties,
    selectedCardType,
    searchTerm,
    requirementText,
    sortBy,
    filters,
    selectedCity,
    locationInput,
    familyLocationsOnly,
    preApprovedMode,
  });

  return (
    <MasterListingPage
      sector="property"
      config={propertyListingConfig}
      hooks={{
        useItems: () => ({ items: filteredProperties, loading, error }),
      }}
      topBarSlot={() => (
        <div className="space-y-4">
          <TopFilterBar
            cityValue={selectedCity || 'bengaluru'}
            onCityChange={(c) => selectCity(c)}
            citiesList={CITY_OPTIONS}
            areaValue={locationInput}
            onAreaChange={setLocationInput}
            areasList={cityAreas}
            requirementValue={requirementText}
            onRequirementChange={setRequirementText}
            requirementPlaceholder="e.g. 3 BHK ready to move, budget 50L"
            onSearch={() => setQuickMatchOpen(true)}
            searchButtonText="Search Properties"
            postRequirementLink="/post-requirement"
            postRequirementLabel="Post Requirement"
            isExpanded={isSearchOpen}
            onToggleExpanded={() => setIsSearchOpen((prev) => !prev)}
            customSwitchSlot={
              <FilterToggle
                checked={familyLocationsOnly}
                onChange={setFamilyLocationsOnly}
                label="Family Locations Only"
              />
            }
            financeSlot={
              <button
                type="button"
                onClick={() => setShowFinance(!showFinance)}
                className="text-xs font-semibold text-brand-blue hover:underline inline-flex items-center gap-1.5"
              >
                <i
                  className={`fa-solid fa-chevron-down text-[10px] transition-transform ${
                    showFinance ? 'rotate-180' : ''
                  }`}
                />
                View Finance Options
              </button>
            }
          />

          {showFinance && (
            <PropertyFinancePanel
              show={showFinance}
              onToggle={() => setShowFinance(!showFinance)}
              onPreApproved={() => {
                setPreApprovedMode(true);
                setShowFinance(false);
              }}
              panelOnly
            />
          )}
        </div>
      )}
      sidebarComponent={() => (
        <PropertyFilterSidebar
          filters={filters}
          updateFilter={updateFilter}
          openSections={openSections}
          toggleSection={toggleSection}
          activeChips={activeChips}
          resetFilters={resetFilters}
          cityAreas={cityAreas}
          noCityMessage={noCityMessage}
        />
      )}
      modalsSlot={() => (
        <>
          {quickMatchOpen && (
            <QuickMatchModal
              isOpen={quickMatchOpen}
              onClose={() => setQuickMatchOpen(false)}
            />
          )}
        </>
      )}
    />
  );
}
