import { useState, useMemo, useEffect } from 'react';
import { navigateTo } from '../../../config/navigation';
import { vehicleAPI } from '../../../api';
import cache, { PUBLIC_NAMESPACE, CACHE_TTL } from '../../../services/cache/cacheService';
import { CollapsibleSection, CheckboxGroup, ActiveChip, getNumericPrice } from '../GalleryComponents';
import ProductCard from '../ProductCard';
import VehicleTypeStrip from './VehicleTypeStrip';
import VehicleFilterSidebar from './VehicleFilterSidebar';
import VehicleFinancePanel from './VehicleFinancePanel';
import VehicleQuickMatchModal from './VehicleQuickMatchModal';
import ShowroomModal from './ShowroomModal';
import QuickLoanModal from '../finance/QuickLoanModal';

const VEHICLE_TYPE_STRIP = [
  { id: 'All',        icon: 'fa-layer-group', label: 'All' },
  { id: '2-wheeler',  icon: 'fa-motorcycle',   label: '2-Wheeler' },
  { id: '3-wheeler',  icon: 'fa-truck-pickup', label: '3-Wheeler' },
  { id: '4-wheeler',  icon: 'fa-car',          label: '4-Wheeler' },
  { id: 'commercial', icon: 'fa-truck',        label: 'Commercial' },
];

const INITIAL_FILTERS = {
  budgetMin: '', budgetMax: '',
  fuelTypes: [], categories: [], locations: [],
  kmMin: '', kmMax: '',
};

const INITIAL_SECTIONS = {
  budget: true, fuelTypes: false, categories: false, locations: false, kmDriven: false,
};

function AutomobileGallery() {
  const WHEELER_OPTIONS = ['All', '2-wheeler', '3-wheeler', '4-wheeler', 'Commercial'];

  const [condition, setCondition] = useState('new');
  const [selectedCardType, setSelectedCardType] = useState('All');
  const [locationInput, setLocationInput] = useState('');
  const [pincodeInput, setPincodeInput] = useState('');
  const [requirementText, setRequirementText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [filters, setFilters] = useState({ ...INITIAL_FILTERS });
  const [openSections, setOpenSections] = useState({ ...INITIAL_SECTIONS });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showFinance, setShowFinance] = useState(false);
  const [preApprovedMode, setPreApprovedMode] = useState(false);
  const [wheelerType, setWheelerType] = useState('All');
  const [quickMatchOpen, setQuickMatchOpen] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanModalPrefill, setLoanModalPrefill] = useState(null);
  const [showroomTarget, setShowroomTarget] = useState(null);
  const [vehicles, setVehicles] = useState(
    () => cache.get(PUBLIC_NAMESPACE, 'vehicles:all')?.data ?? [],
  );
  const [loading, setLoading] = useState(() => !cache.get(PUBLIC_NAMESPACE, 'vehicles:all'));
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    cache
      .fetch(
        PUBLIC_NAMESPACE,
        'vehicles:all',
        () =>
          vehicleAPI.getAll({ limit: 100 }).then((res) => {
            const raw = res.data?.data?.items || res.data?.items || [];
            return raw.map((v) => ({ ...v, id: v._id || v.id }));
          }),
        { ttl: CACHE_TTL.products },
      )
      .then(({ data }) => {
        if (!cancelled) setVehicles(data);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Vehicle fetch error:', err);
          const msg = err.response?.data?.message || err.message || 'Failed to load vehicles';
          setError(msg.includes('Network Error') ? 'Cannot reach server. Please check your connection.' : msg);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const toggleSection = (id) => setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  const resetFilters = () => setFilters({ ...INITIAL_FILTERS });

  const cardTypeStats = useMemo(() => {
    const pool = vehicles.filter((v) => v.condition === condition);
    const stats = {};
    VEHICLE_TYPE_STRIP.forEach((ct) => {
      if (ct.id === 'All') stats.All = pool.length;
      else stats[ct.id] = pool.filter((v) => v.category === ct.id).length;
    });
    return stats;
  }, [condition, vehicles]);

  const activeChips = useMemo(() => {
    const chips = [];
    if (filters.budgetMin) chips.push({ key: 'budget', label: `Min ₹${(+filters.budgetMin / 100000).toFixed(1)}L` });
    if (filters.budgetMax) chips.push({ key: 'budget', label: `Max ₹${(+filters.budgetMax / 100000).toFixed(1)}L` });
    filters.fuelTypes.forEach((f) => chips.push({ key: 'fuel', label: f }));
    filters.categories.forEach((c) => chips.push({ key: 'category', label: c }));
    filters.locations.forEach((l) => chips.push({ key: 'location', label: l }));
    if (filters.kmMin) chips.push({ key: 'km', label: `Min ${+filters.kmMin / 1000}k km` });
    if (filters.kmMax) chips.push({ key: 'km', label: `Max ${+filters.kmMax / 1000}k km` });
    if (wheelerType !== 'All') chips.push({ key: 'wheeler', label: wheelerType });
    return chips;
  }, [filters, wheelerType]);

  const removeChip = (chip) => {
    if (chip.key === 'budget') { updateFilter('budgetMin', ''); updateFilter('budgetMax', ''); }
    else if (chip.key === 'fuel') updateFilter('fuelTypes', filters.fuelTypes.filter((x) => x !== chip.label));
    else if (chip.key === 'category') updateFilter('categories', filters.categories.filter((x) => x !== chip.label));
    else if (chip.key === 'location') updateFilter('locations', filters.locations.filter((x) => x !== chip.label));
    else if (chip.key === 'km') { updateFilter('kmMin', ''); updateFilter('kmMax', ''); }
    else if (chip.key === 'wheeler') setWheelerType('All');
  };

  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        if (v.condition !== condition) return false;
        if (selectedCardType !== 'All' && v.category !== selectedCardType) return false;
        if (preApprovedMode && !v.loanApproved) return false;
        if (wheelerType !== 'All' && v.wheelerType !== wheelerType) return false;

        const q = searchTerm.toLowerCase();
        const matchSearch = !q ||
          v.brand.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q);

        const np = getNumericPrice(v.price);
        const matchBudget =
          (!filters.budgetMin || np >= +filters.budgetMin) &&
          (!filters.budgetMax || np <= +filters.budgetMax);

        const matchCategory =
          filters.categories.length === 0 || filters.categories.includes(v.category);
        const matchFuel =
          filters.fuelTypes.length === 0 || filters.fuelTypes.includes(v.fuelType);
        const matchLocation =
          filters.locations.length === 0 || filters.locations.includes(v.location);
        const matchKm =
          (!filters.kmMin || v.kmDriven >= +filters.kmMin) &&
          (!filters.kmMax || v.kmDriven <= +filters.kmMax);

        return matchSearch && matchBudget && matchCategory && matchFuel && matchLocation && matchKm;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return getNumericPrice(a.price) - getNumericPrice(b.price);
        if (sortBy === 'price-high') return getNumericPrice(b.price) - getNumericPrice(a.price);
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [condition, selectedCardType, searchTerm, sortBy, filters, preApprovedMode, wheelerType, vehicles]);

  const sidebarProps = { filters, updateFilter, openSections, toggleSection, activeChips, resetFilters, kmOpen: condition === 'old' };

  return (
    <div className="pb-24 pt-6 sm:pt-10 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ── Page Header ── */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-1">
              OneVishwam · Vehicles
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl">
              Find Your Vehicle
            </h1>
          </div>
          <span className="hidden sm:block text-xs text-gray-400 pb-1">
            {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} available
          </span>
        </div>

        {/* ── Vehicle Type Pill Strip ── */}
        <VehicleTypeStrip
          types={VEHICLE_TYPE_STRIP}
          selected={selectedCardType}
          stats={cardTypeStats}
          onSelect={setSelectedCardType}
        />

        {/* ── Unified Search Card ── */}
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            <div className="flex-1 flex flex-col px-4 py-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                <i className="fa-solid fa-city mr-1 text-brand-blue/60" />
                City
              </label>
              <select
                value={locationInput.includes(',') ? locationInput.split(',')[0] : 'bengaluru'}
                onChange={(e) => {}}
                className="flex-1 text-sm font-medium text-brand-charcoal outline-none bg-transparent cursor-pointer"
              >
                <option value="bengaluru">Bangalore</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col px-4 py-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                <i className="fa-solid fa-location-dot mr-1 text-brand-blue/60" />
                Location
              </label>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="e.g. MG Road, Whitefield"
                className="flex-1 text-sm font-medium text-brand-charcoal outline-none bg-transparent placeholder:text-gray-300"
              />
            </div>

            <div className="flex-1 flex flex-col px-4 py-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                <i className="fa-solid fa-map-pin mr-1 text-brand-blue/60" />
                Pincode
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit code"
                className="flex-1 text-sm font-medium text-brand-charcoal outline-none bg-transparent placeholder:text-gray-300"
              />
            </div>

            <div className="flex-[2] flex flex-col px-4 py-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                <i className="fa-solid fa-pen mr-1 text-brand-blue/60" />
                Requirement
              </label>
              <input
                type="text"
                value={requirementText}
                onChange={(e) => setRequirementText(e.target.value)}
                placeholder="e.g. 2-wheeler under 1L, new model"
                className="flex-1 text-sm font-medium text-brand-charcoal outline-none bg-transparent placeholder:text-gray-300"
              />
            </div>

            <div className="flex items-center px-3 py-2 sm:py-0">
              <button
                onClick={() => setQuickMatchOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                <i className="fa-solid fa-magnifying-glass" />
                <span>Search</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-gray-100 bg-gray-50/60 px-4 py-2.5">
            <div className="flex gap-2">
              <button
                onClick={() => { setCondition('new'); setSelectedCardType('All'); }}
                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-colors ${
                  condition === 'new' ? 'bg-brand-blue text-white shadow-sm' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                New Vehicle
              </button>
              <button
                onClick={() => { setCondition('old'); setSelectedCardType('All'); }}
                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-colors ${
                  condition === 'old' ? 'bg-brand-blue text-white shadow-sm' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                Old Vehicle
              </button>
            </div>

            <button
              onClick={() => setShowFinance(!showFinance)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline"
            >
              <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${showFinance ? 'rotate-180' : ''}`} />
              View Finance Options
            </button>
          </div>
        </div>

        {/* Finance Panel */}
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

        {/* ── Wheeler Type Filter Row ── */}
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 flex-nowrap scrollbar-thin">
          {WHEELER_OPTIONS.map((w) => (
            <button key={w}
              onClick={() => setWheelerType(w)}
              className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                wheelerType === w ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >{w === 'All' ? 'All Types' : w}</button>
          ))}
        </div>

        {/* ── Results Bar ── */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 flex flex-wrap items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
              {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''}
            </span>
            {activeChips.map((chip) => (
              <ActiveChip key={chip.key + chip.label} label={chip.label} onRemove={() => removeChip(chip)} />
            ))}
            {activeChips.length > 0 && (
              <button onClick={resetFilters} className="text-xs text-red-500 font-semibold hover:underline">
                Clear All
              </button>
            )}
          </div>

          <div className="flex gap-2 shrink-0">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vehicles..."
                className="w-44 rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-xs outline-none focus:border-brand-blue focus:w-56 transition-all"
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <i className="fa-solid fa-sliders text-brand-blue" /> Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-brand-blue bg-white"
            >
              <option value="latest">Latest</option>
              <option value="price-low">Price ↑</option>
              <option value="price-high">Price ↓</option>
            </select>
          </div>
        </div>

        {/* Pre-Approved Mode Banner */}
        {preApprovedMode && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-circle-check text-emerald-600 text-lg" />
              <div>
                <p className="text-sm font-bold text-emerald-800">
                  100% Pre-Approved Vehicle Loan at 8%+
                </p>
                <p className="text-xs text-emerald-600">
                  Showing {filteredVehicles.length} qualifying vehicle{filteredVehicles.length !== 1 ? 's' : ''} — all with loan approval
                </p>
              </div>
            </div>
            <button
              onClick={() => setPreApprovedMode(false)}
              className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              Browse All
            </button>
          </div>
        )}

        {/* ── Loading State ── */}
        {loading && (
          <div className="mt-8 flex flex-col items-center justify-center py-20 text-gray-400">
            <i className="fa-solid fa-spinner fa-spin text-3xl mb-4" />
            <p className="text-sm font-medium">Loading vehicles...</p>
          </div>
        )}

        {/* ── Error State ── */}
        {error && !loading && (
          <div className="mt-8 flex flex-col items-center justify-center py-20 text-red-400">
            <i className="fa-solid fa-circle-exclamation text-3xl mb-4" />
            <p className="text-sm font-medium">{error}</p>
            <button onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-brand-blue px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* ── Main Layout: Sidebar + Grid ── */}
        {!loading && !error && <div className="mt-5 flex gap-6">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="lg:sticky lg:top-24 lg:self-start max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-gray-100 bg-white p-4">
              <VehicleFilterSidebar {...sidebarProps} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {filteredVehicles.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredVehicles.map((v) => (
                  <ProductCard
                    key={v.id}
                    link={`/vehicle/${v.id}`}
                    image={v.images[0]}
                    alt={`${v.brand} ${v.model}`}
                    title={`${v.brand} ${v.model}`}
                    price={v.price}
                    location={v.location}
                    pincode={v.pincode}
                    tags={[
                      v.fuelType,
                      v.year,
                      ...(v.condition === 'old' && v.kmDriven > 0 ? [`${v.kmDriven.toLocaleString()} km`] : []),
                    ]}
                    badges={[
                      ...(v.loanApproved ? [{ label: 'Pre-Approved Loan', className: 'bg-emerald-100 text-emerald-700' }] : []),
                      ...(v.condition === 'new' ? [{ label: 'New', className: 'bg-blue-100 text-blue-700' }] : []),
                      ...(v.condition === 'old' ? [{ label: 'Pre-Owned', className: 'bg-gray-100 text-gray-600' }] : []),
                    ]}
                  >
                    {v.loanApproved && (
                      <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1">
                        <i className="fa-solid fa-circle-check text-[10px] text-blue-600" />
                        <span className="text-[10px] font-semibold text-blue-700">Loan Pre‑Approved</span>
                      </div>
                    )}
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowroomTarget(v); }}
                        className="flex-1 rounded-xl bg-brand-blue px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                      >
                        View at Showroom
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowLoanModal(true); setLoanModalPrefill(v); }}
                        className="flex-1 rounded-xl border border-brand-blue px-3 py-2 text-xs font-semibold text-brand-blue hover:bg-brand-blue hover:text-white transition-colors"
                      >
                        Apply for Loan
                      </button>
                    </div>
                  </ProductCard>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <i className="fa-solid fa-car text-4xl mb-4" />
                <p className="text-lg font-medium">No vehicles found.</p>
                <p className="text-sm mt-1">Try a different category or condition.</p>
              </div>
            )}
          </div>
        </div>}

      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
              <span className="font-bold text-brand-charcoal">Filters</span>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <i className="fa-solid fa-xmark text-gray-500" />
              </button>
            </div>
            <div className="px-5 py-4">
              <VehicleFilterSidebar {...sidebarProps} />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-brand-blue text-white rounded-xl py-3 text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Show {filteredVehicles.length} Vehicles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Showroom Modal */}
      {showroomTarget && (
        <ShowroomModal
          vehicle={showroomTarget}
          onOpenLoan={() => { setShowLoanModal(true); setLoanModalPrefill(showroomTarget); }}
          onClose={() => setShowroomTarget(null)}
        />
      )}

      {/* Quick Loan Modal */}
      {showLoanModal && (
        <QuickLoanModal
          prefill={loanModalPrefill}
          onClose={() => { setShowLoanModal(false); setLoanModalPrefill(null); }}
        />
      )}

      {/* Quick Match FAB */}
      <button
        onClick={() => setQuickMatchOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 transition-all"
      >
        <i className="fa-solid fa-bolt" /> Find My Vehicle
      </button>

      {/* Quick Match Modal */}
      {quickMatchOpen && (
        <VehicleQuickMatchModal onClose={() => setQuickMatchOpen(false)} />
      )}

      
    </div>
  );
}

export default AutomobileGallery;
