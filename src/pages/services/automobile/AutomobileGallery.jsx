import React, { useState, useMemo } from 'react';
import { useVehicles } from './automobileHooks';
import { vehicleListingConfig, VEHICLE_TYPE_STRIP } from './vehicleConfig';
import VehicleFilterSidebar from './VehicleFilterSidebar';
import VehicleFinancePanel from './VehicleFinancePanel';
import VehicleQuickMatchModal from './VehicleQuickMatchModal';
import ShowroomModal from './ShowroomModal';
import QuickLoanModal from '../finance/QuickLoanModal';
import { useLocation } from '../../../store/locationSlice';
import { cities } from '../../../data/locations';
import {
  MasterListingPage,
  TopFilterBar,
  FilterToggle,
  useFilterState,
  getNumericPrice,
} from '../shared';

const INITIAL_FILTERS = {
  budgetMin: '',
  budgetMax: '',
  fuelTypes: [],
  categories: [],
  locations: [],
  kmMin: '',
  kmMax: '',
};

const INITIAL_SECTIONS = {
  budget: true,
  fuelTypes: false,
  categories: false,
  locations: false,
  kmDriven: false,
};

/**
 * Automobile & Vehicles Marketplace Gallery Page
 * Powered by MasterListingPage & TopFilterBar.
 */
export default function AutomobileGallery() {
  const { selectedCity, selectCity } = useLocation();
  const [condition, setCondition] = useState('new');
  const [selectedCardType, setSelectedCardType] = useState('All');
  const [locationInput, setLocationInput] = useState('');
  const [requirementText, setRequirementText] = useState('');
  const [showFinance, setShowFinance] = useState(false);
  const [preApprovedMode, setPreApprovedMode] = useState(false);
  const [quickMatchOpen, setQuickMatchOpen] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanModalPrefill, setLoanModalPrefill] = useState(null);
  const [showroomTarget, setShowroomTarget] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { filters, openSections, updateFilter, toggleSection, resetFilters } = useFilterState(
    INITIAL_FILTERS,
    INITIAL_SECTIONS
  );

  const { vehicles, loading, error } = useVehicles();

  const cityAreas = selectedCity ? cities[selectedCity]?.areas || [] : [];

  const fuelTypeOptions = useMemo(() => {
    const set = new Set((vehicles || []).map((v) => v.fuelType).filter(Boolean));
    return Array.from(set);
  }, [vehicles]);

  const locationOptions = useMemo(() => {
    const set = new Set((vehicles || []).map((v) => v.location || v.city).filter(Boolean));
    return Array.from(set);
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    return (vehicles || []).filter((v) => {
      if (condition && v.condition && v.condition !== condition) return false;
      if (selectedCardType !== 'All' && v.category !== selectedCardType) return false;
      if (preApprovedMode && !v.loanApproved) return false;

      const brandStr = (v.brand || v.make || '').toLowerCase();
      const modelStr = (v.model || '').toLowerCase();
      const locStr = (v.location || v.city || '').toLowerCase();

      if (requirementText) {
        const q = requirementText.toLowerCase();
        const matchReq = brandStr.includes(q) || modelStr.includes(q) || (v.category && v.category.toLowerCase().includes(q));
        if (!matchReq) return false;
      }

      if (locationInput) {
        const locFilter = locationInput.toLowerCase();
        const matchLoc = locStr.includes(locFilter) || (v.area && v.area.toLowerCase().includes(locFilter));
        if (!matchLoc) return false;
      }

      const p = getNumericPrice(v.price);
      if (filters.budgetMin && p < +filters.budgetMin) return false;
      if (filters.budgetMax && p > +filters.budgetMax) return false;
      if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(v.fuelType)) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(v.category)) return false;
      if (filters.locations.length > 0 && !filters.locations.includes(v.location || v.city)) return false;
      if (filters.kmMin && (v.kmDriven || 0) < +filters.kmMin) return false;
      if (filters.kmMax && (v.kmDriven || 0) > +filters.kmMax) return false;

      return true;
    });
  }, [vehicles, condition, selectedCardType, preApprovedMode, requirementText, locationInput, filters]);

  return (
    <MasterListingPage
      sector="automobile"
      config={vehicleListingConfig}
      hooks={{
        useItems: () => ({ items: filteredVehicles, loading, error }),
      }}
      topBarSlot={() => (
        <div className="space-y-4">
          <TopFilterBar
            cityValue={selectedCity || 'bengaluru'}
            onCityChange={(c) => selectCity(c)}
            areaValue={locationInput}
            onAreaChange={setLocationInput}
            areasList={cityAreas}
            requirementValue={requirementText}
            onRequirementChange={setRequirementText}
            requirementPlaceholder="e.g. 2-wheeler under 1L, new model"
            onSearch={() => setQuickMatchOpen(true)}
            searchButtonText="Search Vehicles"
            postRequirementLink="/post-requirement"
            postRequirementLabel="Post Requirement"
            isExpanded={isSearchOpen}
            onToggleExpanded={() => setIsSearchOpen((prev) => !prev)}
            customSwitchSlot={
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setCondition('new')}
                    className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                      condition === 'new'
                        ? 'bg-brand-blue text-white shadow-xs'
                        : 'text-gray-600 hover:text-brand-navy'
                    }`}
                  >
                    New
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondition('old')}
                    className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                      condition === 'old'
                        ? 'bg-brand-blue text-white shadow-xs'
                        : 'text-gray-600 hover:text-brand-navy'
                    }`}
                  >
                    Pre-Owned
                  </button>
                </div>

                <FilterToggle
                  checked={preApprovedMode}
                  onChange={setPreApprovedMode}
                  label="Pre-Approved Loans Only"
                />
              </div>
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
            <VehicleFinancePanel
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
        <VehicleFilterSidebar
          filters={filters}
          openSections={openSections}
          fuelTypeOptions={fuelTypeOptions}
          locationOptions={locationOptions}
          onUpdateFilter={updateFilter}
          onToggleSection={toggleSection}
          onResetFilters={resetFilters}
        />
      )}
      cardActionsSlot={(v) => (
        <div className="flex gap-2">
          {v.showroom ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowroomTarget(v);
              }}
              className="flex-1 rounded-lg border border-brand-blue/30 bg-blue-50/50 py-2 text-center text-xs font-bold text-brand-blue hover:bg-brand-blue hover:text-white transition-colors"
            >
              Showroom
            </button>
          ) : null}
          {v.loanApproved && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setLoanModalPrefill(v);
                setShowLoanModal(true);
              }}
              className="flex-1 rounded-lg bg-emerald-600 py-2 text-center text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
            >
              ⚡ Quick Loan
            </button>
          )}
        </div>
      )}
      modalsSlot={() => (
        <>
          {quickMatchOpen && (
            <VehicleQuickMatchModal
              isOpen={quickMatchOpen}
              onClose={() => setQuickMatchOpen(false)}
            />
          )}
          {showroomTarget && (
            <ShowroomModal
              vehicle={showroomTarget}
              onClose={() => setShowroomTarget(null)}
            />
          )}
          {showLoanModal && (
            <QuickLoanModal
              isOpen={showLoanModal}
              onClose={() => {
                setShowLoanModal(false);
                setLoanModalPrefill(null);
              }}
              prefillVehicle={loanModalPrefill}
            />
          )}
        </>
      )}
    />
  );
}
