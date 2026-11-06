import React, { useState } from 'react';
import { useVehicles } from './automobileHooks';
import { UniversalCategoryGallery } from '../../../components/common/templates';
import { mapVehicleToEntityItem } from '../../../components/common/templates/adapters';
import VehicleQuickMatchModal from './VehicleQuickMatchModal';
import { signalHomepageRefresh } from '../../../utils/matchEvents';
import ShowroomModal from './ShowroomModal';
import QuickLoanModal from '../finance/QuickLoanModal';
import { parseIndianPrice } from '../../../utils/priceUtils';

/* ── Automobile Domain Resolution Helpers (Data-Driven, No Hardcoded Models) ── */

export function getVehicleFuelTypes(v) {
  if (!v) return [];
  const fuels = new Set();

  if (v.fuelType) fuels.add(v.fuelType);
  if (v.fuel) fuels.add(v.fuel);

  // Check overviewHighlights
  if (Array.isArray(v.overviewHighlights)) {
    const fuelItem = v.overviewHighlights.find(
      (h) => h?.label && h.label.toLowerCase().includes('fuel')
    );
    if (fuelItem?.value) fuels.add(fuelItem.value);
  }

  // Generic keyword detection across description, title, cardPills, features
  const textPool = [
    v.title,
    v.subtitle,
    v.description,
    Array.isArray(v.features) ? v.features.join(' ') : '',
    Array.isArray(v.cardPills) ? v.cardPills.join(' ') : '',
  ].filter(Boolean).join(' ').toLowerCase();

  if (/\b(petrol)\b/.test(textPool)) fuels.add('Petrol');
  if (/\b(diesel)\b/.test(textPool)) fuels.add('Diesel');
  if (/\b(electric|ev)\b/.test(textPool)) fuels.add('Electric');
  if (/\b(cng)\b/.test(textPool)) fuels.add('CNG');
  if (/\b(hybrid)\b/.test(textPool)) fuels.add('Hybrid');

  if (fuels.size === 0) {
    fuels.add('Petrol');
  }

  // Canonicalize to title case
  const canonical = [];
  fuels.forEach((f) => {
    const fl = String(f).toLowerCase().trim();
    if (fl === 'petrol') canonical.push('Petrol');
    else if (fl === 'diesel') canonical.push('Diesel');
    else if (fl === 'electric' || fl === 'ev') canonical.push('Electric');
    else if (fl === 'cng') canonical.push('CNG');
    else if (fl === 'hybrid') canonical.push('Hybrid');
    else if (f) canonical.push(f);
  });

  return Array.from(new Set(canonical));
}

export function getVehicleWheelerType(v) {
  if (!v) return '4-Wheeler';
  const cat = String(v.wheelerType || v.category || '').toLowerCase();
  const textPool = [v.title, v.subtitle, v.subcategory, v.category, v.wheelerType].filter(Boolean).join(' ').toLowerCase();

  if (cat.includes('2-wheeler') || /\b(bike|motorcycle|scooter|2-wheeler|twowheeler)\b/.test(textPool)) return '2-Wheeler';
  if (cat.includes('3-wheeler') || /\b(rickshaw|3-wheeler|threewheeler|three-wheeler)\b/.test(textPool)) return '3-Wheeler';
  if (cat.includes('commercial') || /\b(truck|commercial|pickup|van|cargo|loader)\b/.test(textPool)) return 'Commercial';
  return '4-Wheeler';
}

export function getVehicleBodyTypes(v) {
  if (!v) return [];
  const types = new Set();

  if (v.bodyType) {
    const raw = String(v.bodyType).trim();
    if (raw) types.add(raw);
  }
  if (v.subcategory) {
    const sub = String(v.subcategory).trim();
    if (sub) types.add(sub);
  }

  const textPool = [
    v.bodyType,
    v.subcategory,
    v.category,
    v.wheelerType,
    v.title,
    v.subtitle,
    v.description,
    Array.isArray(v.features) ? v.features.join(' ') : '',
  ].filter(Boolean).join(' ').toLowerCase();

  if (/\b(suv|crossover|compact-suv|compact suv|muv)\b/.test(textPool)) types.add('SUV');
  if (/\b(sedan|saloon|notchback)\b/.test(textPool)) types.add('Sedan');
  if (/\b(hatchback|hatch)\b/.test(textPool)) types.add('Hatchback');
  if (/\b(bike|motorcycle|cruiser|scooter|2-wheeler|two-wheeler)\b/.test(textPool)) types.add('Cruiser / Bike');
  if (/\b(commercial|truck|pickup|van|cargo|loader|lorry|tipper)\b/.test(textPool)) types.add('Commercial');

  const wheeler = getVehicleWheelerType(v);
  if (wheeler === '2-Wheeler') types.add('Cruiser / Bike');
  if (wheeler === 'Commercial' || wheeler === '3-Wheeler') types.add('Commercial');

  if (types.size === 0) {
    if (wheeler === '4-Wheeler') {
      types.add('SUV');
    }
  }

  return Array.from(types);
}

export function getVehicleTransmissions(v) {
  if (!v) return ['Manual'];
  const list = new Set();

  if (v.transmission) {
    const raw = String(v.transmission).toLowerCase();
    if (raw.includes('auto') || raw.includes('amt') || raw.includes('cvt') || raw.includes('dct') || raw.includes('at')) list.add('Automatic');
    if (raw.includes('manual') || raw.includes('mt')) list.add('Manual');
  }

  // Check overviewHighlights
  if (Array.isArray(v.overviewHighlights)) {
    const transItem = v.overviewHighlights.find(
      (h) => h?.label && h.label.toLowerCase().includes('transmission')
    );
    if (transItem?.value) {
      const val = String(transItem.value).toLowerCase();
      if (val.includes('auto') || val.includes('amt') || val.includes('cvt') || val.includes('dct') || val.includes('at')) list.add('Automatic');
      if (val.includes('manual') || val.includes('mt')) list.add('Manual');
    }
  }

  // Generic keyword check in textPool
  const textPool = [
    v.title,
    v.subtitle,
    v.description,
    Array.isArray(v.features) ? v.features.join(' ') : '',
    Array.isArray(v.cardPills) ? v.cardPills.join(' ') : '',
  ].filter(Boolean).join(' ').toLowerCase();

  if (/\b(automatic|amt|cvt|dct|dsg|auto)\b/.test(textPool)) list.add('Automatic');
  if (/\b(manual|5-speed|6-speed|mt)\b/.test(textPool)) list.add('Manual');

  const wheeler = getVehicleWheelerType(v);
  const fuel = String(v.fuelType || '').toLowerCase();

  // Electric vehicles and scooters are single-speed / automatic drive
  if (wheeler === '2-Wheeler' || fuel.includes('electric') || /\b(scooter|ev)\b/.test(textPool)) {
    list.add('Automatic');
  }

  // Passenger 4-wheelers with multi-variants (or unspecified) support both Manual & Automatic
  if (wheeler === '4-Wheeler' && !fuel.includes('electric')) {
    list.add('Manual');
    const variantCount = typeof v.variants === 'number' ? v.variants : (Array.isArray(v.variants) ? v.variants.length : 1);
    if (variantCount > 1 || !v.transmission) {
      list.add('Automatic');
    }
  }

  // Fallback
  if (list.size === 0) {
    list.add('Manual');
  }

  return Array.from(list);
}

export function getVehicleCondition(v) {
  if (!v) return 'Brand New';
  const c = String(v.condition || '').toLowerCase();
  return (c === 'new' || c === 'brand-new' || c === 'brand new') ? 'Brand New' : 'Pre-Owned';
}

const FILTER_GROUPS = [
  {
    id: 'fuelType',
    title: 'Fuel Type',
    options: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'],
    field: (v) => getVehicleFuelTypes(v),
    matches: (v, selectedSet) => {
      const fuels = getVehicleFuelTypes(v);
      return fuels.some((f) => {
        const fLower = f.toLowerCase();
        return selectedSet.has(fLower) || Array.from(selectedSet).some((s) => fLower.includes(s) || s.includes(fLower));
      });
    },
  },
  {
    id: 'wheelerType',
    title: 'Vehicle Type',
    options: ['4-Wheeler', '2-Wheeler', 'Commercial', '3-Wheeler'],
    field: (v) => getVehicleWheelerType(v),
    matches: (v, selectedSet) => {
      const w = getVehicleWheelerType(v).toLowerCase();
      return selectedSet.has(w) || Array.from(selectedSet).some((s) => w.includes(s) || s.includes(w));
    },
  },
  {
    id: 'bodyType',
    title: 'Body Type',
    options: ['SUV', 'Sedan', 'Hatchback', 'Cruiser / Bike', 'Commercial'],
    field: (v) => getVehicleBodyTypes(v),
    matches: (v, selectedSet) => {
      const bodies = getVehicleBodyTypes(v);
      return bodies.some((b) => {
        const bLower = b.toLowerCase();
        return selectedSet.has(bLower) || Array.from(selectedSet).some((s) => bLower.includes(s) || s.includes(bLower));
      });
    },
  },
  {
    id: 'transmission',
    title: 'Transmission',
    options: ['Automatic', 'Manual'],
    field: (v) => getVehicleTransmissions(v),
    matches: (v, selectedSet) => {
      const trans = getVehicleTransmissions(v);
      return trans.some((t) => {
        const tLower = t.toLowerCase();
        return selectedSet.has(tLower) || Array.from(selectedSet).some((s) => tLower.includes(s) || s.includes(tLower));
      });
    },
  },
  {
    id: 'condition',
    title: 'Condition & Ownership',
    options: ['Brand New', 'Pre-Owned'],
    field: (v) => getVehicleCondition(v),
    matches: (v, selectedSet) => {
      const c = getVehicleCondition(v).toLowerCase();
      return selectedSet.has(c) || Array.from(selectedSet).some((s) => c.includes(s) || s.includes(c));
    },
  },
];

const RANGE_FILTERS = [
  {
    id: 'budget',
    title: 'Budget Range',
    field: (v) => v.priceValue || v.numericPrice || parseIndianPrice(v.price),
    min: 0,
    max: 6000000,
    step: 50000,
    maxLabel: '₹ 60 L+',
    unitLabel: '₹',
  },
];

/**
 * AutomobileGallery
 * Powered by UniversalCategoryGallery - purely declarative configuration.
 */
export default function AutomobileGallery() {
  const [quickMatchOpen, setQuickMatchOpen] = useState(false);
  const [showroomTarget, setShowroomTarget] = useState(null);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanModalPrefill, setLoanModalPrefill] = useState(null);

  return (
    <UniversalCategoryGallery
      categoryTitle="Explore Verified Automobiles"
      categorySubtitle="Discover brand-new cars, verified pre-owned vehicles, bikes, and commercial fleets with full inspection reports."
      breadcrumb="Automobiles"
      useItems={useVehicles}
      hidePrice={true}
      searchPlaceholder="Search vehicles by brand, model, fuel, or transmission..."
      onQuickMatch={() => {
        signalHomepageRefresh();
        setQuickMatchOpen(true);
      }}
      quickMatchLabel="Vehicle Match"
      mapping={{
        id: (v) => v._id || v.id,
        title: (v) => (v.brand && v.model ? `${v.brand} ${v.model}` : v.title),
        image: (v) => v.images?.[0] || v.image,
        price: (v) => v.price,
        priceSuffix: (v) => v.priceSuffix || (v.condition === 'new' ? 'Ex-Showroom' : 'Pre-Owned'),
        location: (v) => v.location || v.showroom?.city || 'Bangalore',
        pincode: (v) => v.pincode || v.showroom?.pincode,
        overline: (v) => (v.brand ? `${v.brand} · ${getVehicleBodyTypes(v)[0] || v.category}` : v.category),
        badges: (v) => [
          v.loanApproved && { label: 'Loan Approved', className: 'bg-blue-600 text-white' },
          v.condition && {
            label: v.condition === 'new' ? 'Brand New' : 'Certified Pre-Owned',
            className: v.condition === 'new' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white',
          },
          v.featured && { label: 'Featured', className: 'bg-amber-500 text-white' },
        ].filter(Boolean),
        pills: (v) => [
          getVehicleFuelTypes(v)[0] || v.fuelType,
          getVehicleTransmissions(v)[0] || v.transmission,
          v.year ? `${v.year}` : null,
        ].filter(Boolean),
        highlightBanner: (v) => (v.loanApproved ? '100% Pre-Approved Loan Available' : null),
        detailUrl: (v) => `/vehicle/${v._id || v.id}`,
      }}
      filterGroups={FILTER_GROUPS}
      rangeFilters={RANGE_FILTERS}
      customModals={
        <>
          {showroomTarget && (
            <ShowroomModal vehicle={showroomTarget} onClose={() => setShowroomTarget(null)} />
          )}
          {quickMatchOpen && (
            <VehicleQuickMatchModal isOpen={quickMatchOpen} onClose={() => setQuickMatchOpen(false)} />
          )}
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
      }
    />
  );
}
