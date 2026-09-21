import React, { useState, useMemo } from 'react';
import { useVehicles } from './automobileHooks';
import MarketplaceCategoryGallery from '../../../components/common/templates/MarketplaceCategoryGallery';
import CategoryListingCard from '../../../components/common/templates/CategoryListingCard';
import { mapVehicleToEntityItem } from '../../../components/common/templates/adapters';
import VehicleQuickMatchModal from './VehicleQuickMatchModal';
import ShowroomModal from './ShowroomModal';
import QuickLoanModal from '../finance/QuickLoanModal';

const FILTER_GROUPS = [
  {
    id: 'fuelTypes',
    title: 'Fuel Type',
    options: ['Petrol', 'Diesel', 'Electric', 'CNG'],
    defaultOpen: true,
  },
  {
    id: 'transmissions',
    title: 'Transmission',
    options: ['Automatic', 'Manual'],
    defaultOpen: true,
  },
  {
    id: 'bodyTypes',
    title: 'Body Type & Category',
    options: ['SUV', 'Sedan', 'Hatchback', 'Cruiser / Bike', 'Commercial'],
    defaultOpen: true,
  },
  {
    id: 'conditions',
    title: 'Condition & Ownership',
    options: ['Brand New', '1st Owner', 'Pre-Owned'],
    defaultOpen: false,
  },
];

const RANGE_FILTERS = [
  {
    id: 'budget',
    title: 'Budget Range',
    min: 0,
    max: 6000000,
    step: 50000,
    maxLabel: '₹ 60 L+',
    unitLabel: '₹',
    defaultOpen: true,
  },
];

function parseNumericPrice(str) {
  if (!str) return 0;
  const cleaned = String(str).replace(/[^\d.]/g, '');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  if (/cr/i.test(str)) return num * 10000000;
  if (/lakh|lac|l/i.test(str)) return num * 100000;
  return num;
}

export default function AutomobileGallery() {
  const { vehicles = [], loading, error } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    budgetMin: '',
    budgetMax: '',
    fuelTypes: [],
    transmissions: [],
    bodyTypes: [],
    conditions: [],
  });

  const [quickMatchOpen, setQuickMatchOpen] = useState(false);
  const [showroomTarget, setShowroomTarget] = useState(null);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanModalPrefill, setLoanModalPrefill] = useState(null);

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setActiveFilters({
      budgetMin: '',
      budgetMax: '',
      fuelTypes: [],
      transmissions: [],
      bodyTypes: [],
      conditions: [],
    });
    setSearchTerm('');
  };

  // Active chips calculation
  const activeChips = useMemo(() => {
    const chips = [];
    if (activeFilters.budgetMin) {
      chips.push({ key: 'budgetMin', label: `Min ₹${(+activeFilters.budgetMin / 100000).toFixed(1)}L` });
    }
    if (activeFilters.budgetMax) {
      chips.push({ key: 'budgetMax', label: `Max ₹${(+activeFilters.budgetMax / 100000).toFixed(1)}L` });
    }
    (activeFilters.fuelTypes || []).forEach((f) => {
      chips.push({ key: 'fuelTypes', label: f, value: f });
    });
    (activeFilters.transmissions || []).forEach((t) => {
      chips.push({ key: 'transmissions', label: t, value: t });
    });
    (activeFilters.bodyTypes || []).forEach((b) => {
      chips.push({ key: 'bodyTypes', label: b, value: b });
    });
    (activeFilters.conditions || []).forEach((c) => {
      chips.push({ key: 'conditions', label: c, value: c });
    });
    return chips;
  }, [activeFilters]);

  const handleRemoveChip = (chip) => {
    if (chip.key === 'budgetMin' || chip.key === 'budgetMax') {
      handleFilterChange(chip.key, '');
    } else {
      const currentList = activeFilters[chip.key] || [];
      handleFilterChange(chip.key, currentList.filter((x) => x !== chip.value));
    }
  };

  // Filtering vehicles
  const filteredVehicles = useMemo(() => {
    const list = Array.isArray(vehicles) ? vehicles : [];
    return list.filter((v) => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchTitle = (v.title || '').toLowerCase().includes(q);
        const matchBrand = (v.brand || '').toLowerCase().includes(q);
        const matchModel = (v.model || '').toLowerCase().includes(q);
        const matchLocation = (v.location || v.city || '').toLowerCase().includes(q);
        const matchFuel = (v.fuelType || '').toLowerCase().includes(q);
        if (!matchTitle && !matchBrand && !matchModel && !matchLocation && !matchFuel) {
          return false;
        }
      }

      // Budget
      const numPrice = parseNumericPrice(v.price);
      if (activeFilters.budgetMin && numPrice < Number(activeFilters.budgetMin)) {
        return false;
      }
      if (activeFilters.budgetMax && numPrice > Number(activeFilters.budgetMax)) {
        return false;
      }

      // Fuel Types
      if (activeFilters.fuelTypes.length > 0) {
        if (!v.fuelType || !activeFilters.fuelTypes.some((f) => f.toLowerCase() === v.fuelType.toLowerCase())) {
          return false;
        }
      }

      // Transmissions
      if (activeFilters.transmissions.length > 0) {
        if (!v.transmission || !activeFilters.transmissions.some((t) => t.toLowerCase() === v.transmission.toLowerCase())) {
          return false;
        }
      }

      // Body Types
      if (activeFilters.bodyTypes.length > 0) {
        if (!v.bodyType || !activeFilters.bodyTypes.some((b) => b.toLowerCase() === v.bodyType.toLowerCase())) {
          return false;
        }
      }

      // Conditions
      if (activeFilters.conditions.length > 0) {
        const matchesCondition = activeFilters.conditions.some((c) => {
          if (c === 'Brand New' && v.condition === 'new') return true;
          if (c === 'Pre-Owned' && v.condition === 'old') return true;
          if (c === '1st Owner' && (v.statusBadges || []).some((sb) => sb.label === '1st Owner')) return true;
          return false;
        });
        if (!matchesCondition) return false;
      }

      return true;
    });
  }, [vehicles, searchTerm, activeFilters]);

  return (
    <>
      <MarketplaceCategoryGallery
        categoryTitle="Explore Verified Automobiles & Vehicles"
        categorySubtitle="Discover brand-new cars, verified pre-owned vehicles, bikes, and commercial fleets with full inspection reports."
        breadcrumbCategory="Automobiles & Vehicles"
        items={filteredVehicles}
        filterGroups={FILTER_GROUPS}
        rangeFilters={RANGE_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        activeChips={activeChips}
        onRemoveChip={handleRemoveChip}
        onResetFilters={handleResetFilters}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search vehicles by brand, model, fuel, or locality (e.g. Creta Petrol, Thar, Whitefield)..."
        postRequirementLink="/property/requirement"
        onQuickMatch={() => setQuickMatchOpen(true)}
        quickMatchLabel="Vehicle Match"
        customCardRenderer={(vehicle) => {
          const mapped = mapVehicleToEntityItem(vehicle);
          const vId = vehicle.id || vehicle._id;
          return (
            <CategoryListingCard
              key={vId}
              item={mapped || vehicle}
              link={`/vehicle/${vId}`}
              title={mapped?.title || vehicle.title}
              price={mapped?.price || vehicle.price}
              location={mapped?.location || vehicle.location}
              pincode={mapped?.pincode || vehicle.pincode}
              statusBadges={mapped?.badges || vehicle.statusBadges}
              keyAttributes={mapped?.keyAttributes || vehicle.keyAttributes}
              highlightBanner={vehicle.highlightBanner || (vehicle.loanApproved ? '100% Pre-Approved Loan Available' : null)}
            />
          );
        }}
      />

      {/* Showroom Target Modal */}
      {showroomTarget && (
        <ShowroomModal
          vehicle={showroomTarget}
          onClose={() => setShowroomTarget(null)}
        />
      )}

      {/* Quick Match Modal */}
      {quickMatchOpen && (
        <VehicleQuickMatchModal
          isOpen={quickMatchOpen}
          onClose={() => setQuickMatchOpen(false)}
        />
      )}

      {/* Quick Loan Modal */}
      {showLoanModal && (
        <QuickLoanModal
          open={showLoanModal}
          onClose={() => {
            setShowLoanModal(false);
            setLoanModalPrefill(null);
          }}
          prefill={loanModalPrefill}
        />
      )}
    </>
  );
}
