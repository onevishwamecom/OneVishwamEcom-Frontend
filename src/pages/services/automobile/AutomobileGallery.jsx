import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
        <div className="flex flex-col sm:flex-row items-center gap-3 my-4">
          <div className="relative flex-1 w-full">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <input
              type="text"
              value={requirementText}
              onChange={(e) => setRequirementText(e.target.value)}
              placeholder="Search vehicles by brand or model (e.g. Verna, Nexon, Altroz)..."
              className="w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-10 py-3 text-sm font-semibold text-brand-charcoal outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all shadow-2xs hover:shadow-xs"
            />
            {requirementText && (
              <button
                type="button"
                onClick={() => setRequirementText('')}
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
        <VehicleFilterSidebar
          filters={filters}
          vehicles={vehicles}
          openSections={openSections}
          fuelTypeOptions={fuelTypeOptions}
          locationOptions={locationOptions}
          onUpdateFilter={updateFilter}
          onToggleSection={toggleSection}
          onResetFilters={resetFilters}
          condition={condition}
          setCondition={setCondition}
          preApprovedMode={preApprovedMode}
          setPreApprovedMode={setPreApprovedMode}
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
