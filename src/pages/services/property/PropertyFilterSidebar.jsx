import { CollapsibleSection, CheckboxGroup } from '../../../components/ui';
import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  BUDGET_RANGES, SIZE_OPTIONS, BEDROOM_OPTIONS, FURNISHING_OPTIONS,
  POSTED_BY_OPTIONS, POSSESSION_OPTIONS, AMENITIES_LIST, FACING_OPTIONS,
  AGE_OPTIONS, AVAILABILITY_OPTIONS,
  TENANT_TYPE_OPTIONS, PETS_OPTIONS,
} from './propertyConstants';
import { getNumericPrice, formatINR, parseIndianPrice } from '../shared';

/**
 * Reusable filter sidebar — used by both desktop aside and mobile drawer.
 */
export default function PropertyFilterSidebar({
  filters, updateFilter, openSections, toggleSection,
  activeChips, resetFilters, cityAreas, noCityMessage,
  properties = [],
}) {
  // Compute dynamic budget min/max from properties
  const { budgetMin: dynamicMin, budgetMax: dynamicMax } = useMemo(() => {
    const prices = properties
      .map((p) => getNumericPrice(p.price))
      .filter((p) => p > 0);
    if (prices.length === 0) return { budgetMin: 0, budgetMax: 10000000 };
    const min = Math.floor(Math.min(...prices) / 100000) * 100000;
    const max = Math.ceil(Math.max(...prices) / 100000) * 100000;
    return { budgetMin: min, budgetMax: max };
  }, [properties]);

  // Single source of truth for budget range
  const [budgetRange, setBudgetRange] = useState({
    min: filters.budgetMin ? +filters.budgetMin : dynamicMin,
    max: filters.budgetMax ? +filters.budgetMax : dynamicMax,
  });

  // Sync with external filters (e.g., URL changes)
  useEffect(() => {
    if (filters.budgetMin !== undefined && +filters.budgetMin !== budgetRange.min) {
      setBudgetRange(prev => ({ ...prev, min: +filters.budgetMin }));
    }
    if (filters.budgetMax !== undefined && +filters.budgetMax !== budgetRange.max) {
      setBudgetRange(prev => ({ ...prev, max: +filters.budgetMax }));
    }
  }, [filters.budgetMin, filters.budgetMax]);

  const handleBudgetChange = useCallback((min, max) => {
    setBudgetRange({ min, max });
    updateFilter('budgetMin', String(min));
    updateFilter('budgetMax', String(max));
  }, [updateFilter]);

  const formatPrice = (value) => formatINR(value, { compact: true });
  const parsePriceInput = (input) => parseIndianPrice(input);

  // Handle manual input change
  const handleInputChange = (type, value) => {
    const parsed = parsePriceInput(value);
    if (parsed === null) return;

    const clampedMin = Math.max(dynamicMin, Math.min(parsed, dynamicMax));
    const clampedMax = Math.max(dynamicMin, Math.min(parsed, dynamicMax));

    if (type === 'min') {
      const newMin = Math.min(clampedMin, budgetRange.max - 100000);
      if (newMin >= dynamicMin) handleBudgetChange(newMin, budgetRange.max);
    } else {
      const newMax = Math.max(clampedMax, budgetRange.min + 100000);
      if (newMax <= dynamicMax) handleBudgetChange(budgetRange.min, newMax);
    }
  };

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-brand-charcoal">Filters</span>
        {activeChips.length > 0 && (
          <button onClick={resetFilters} className="text-xs text-brand-blue font-semibold hover:underline">
            Reset All
          </button>
        )}
      </div>

      {/* Budget - Dual Range Slider */}
      <CollapsibleSection id="budget" label="Budget" open={openSections.budget} onToggle={toggleSection}>
        <div className="mb-3">
          {/* Editable min/max inputs above slider */}
          <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
            <div className="flex-1 pr-2">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Minimum Price</label>
              <input
                type="text"
                value={formatPrice(budgetRange.min)}
                onChange={(e) => handleInputChange('min', e.target.value)}
                onBlur={(e) => handleInputChange('min', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-blue bg-white text-brand-charcoal cursor-text"
                placeholder="Min Price"
              />
            </div>
            <div className="flex-1 pl-2">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Maximum Price</label>
              <input
                type="text"
                value={formatPrice(budgetRange.max)}
                onChange={(e) => handleInputChange('max', e.target.value)}
                onBlur={(e) => handleInputChange('max', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-blue bg-white text-brand-charcoal cursor-text"
                placeholder="Max Price"
              />
            </div>
          </div>

          {/* Dual range slider */}
          <div className="relative h-5 flex items-center">
            {/* Track background */}
            <div className="absolute left-0 right-0 h-1.5 bg-gray-200 rounded-full" />
            {/* Active track fill */}
            <div
              className="absolute h-1.5 bg-brand-blue rounded-full"
              style={{
                left: `${((budgetRange.min - dynamicMin) / (dynamicMax - dynamicMin)) * 100}%`,
                right: `${((dynamicMax - budgetRange.max) / (dynamicMax - dynamicMin)) * 100}%`,
              }}
            />
            {/* Min slider — clickable only on left portion up to max thumb */}
            <input
              type="range"
              min={dynamicMin}
              max={dynamicMax}
              step={100000}
              value={budgetRange.min}
              onChange={(e) => {
                const val = +e.target.value;
                if (val <= budgetRange.max - 100000) handleBudgetChange(val, budgetRange.max);
              }}
              className="absolute w-full h-5 appearance-none bg-transparent z-20 cursor-pointer range-thumb-blue"
              style={{
                pointerEvents: 'auto',
                clipPath: `polygon(0 0, ${((budgetRange.max - dynamicMin) / (dynamicMax - dynamicMin)) * 100}% 0, ${((budgetRange.max - dynamicMin) / (dynamicMax - dynamicMin)) * 100}% 100%, 0 100%)`,
              }}
            />
            {/* Max slider — clickable only on right portion from min thumb */}
            <input
              type="range"
              min={dynamicMin}
              max={dynamicMax}
              step={100000}
              value={budgetRange.max}
              onChange={(e) => {
                const val = +e.target.value;
                if (val >= budgetRange.min + 100000) handleBudgetChange(budgetRange.min, val);
              }}
              className="absolute w-full h-5 appearance-none bg-transparent z-10 cursor-pointer range-thumb-blue"
              style={{
                pointerEvents: 'auto',
                clipPath: `polygon(${((budgetRange.min - dynamicMin) / (dynamicMax - dynamicMin)) * 100}% 0, 100% 0, 100% 100%, ${((budgetRange.min - dynamicMin) / (dynamicMax - dynamicMin)) * 100}% 100%)`,
              }}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Property Size */}
      <CollapsibleSection id="size" label="Property Size" open={openSections.size} onToggle={toggleSection}>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {SIZE_OPTIONS.map((s) => {
            const active = +filters.sizeMin === s && +filters.sizeMax === s;
            return (
              <button key={s}
                onClick={() => {
                  if (active) { updateFilter('sizeMin', ''); updateFilter('sizeMax', ''); }
                  else { updateFilter('sizeMin', String(s)); updateFilter('sizeMax', String(s)); }
                }}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                  active ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >{s} sq.ft</button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <input type="number" placeholder="Min sq.ft" value={filters.sizeMin}
            onChange={(e) => updateFilter('sizeMin', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-blue" />
          <input type="number" placeholder="Max sq.ft" value={filters.sizeMax}
            onChange={(e) => updateFilter('sizeMax', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-blue" />
        </div>
      </CollapsibleSection>

      {/* Building Type */}
      <CollapsibleSection id="buildingType" label="Building Type" open={openSections.buildingType} onToggle={toggleSection}>
        <CheckboxGroup options={['Residential', 'Commercial']} selected={filters.buildingType}
          onChange={(v) => updateFilter('buildingType', v)} />
      </CollapsibleSection>

      {/* Property Type */}
      <CollapsibleSection id="propertyType" label="Property Type" open={openSections.propertyType} onToggle={toggleSection}>
        <CheckboxGroup options={['Flats', 'Houses', 'Villas', 'Plots', 'Commercial']} selected={filters.propertyType}
          onChange={(v) => updateFilter('propertyType', v)} />
      </CollapsibleSection>

      {/* Bedrooms */}
      <CollapsibleSection id="bedrooms" label="Bedrooms" open={openSections.bedrooms} onToggle={toggleSection}>
        <div className="flex flex-wrap gap-1.5">
          {BEDROOM_OPTIONS.map((b) => {
            const active = filters.bedrooms.includes(b);
            return (
              <button key={b}
                onClick={() => {
                  const next = active ? filters.bedrooms.filter((x) => x !== b) : [...filters.bedrooms, b];
                  updateFilter('bedrooms', next);
                }}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                  active ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >{b}</button>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Localities */}
      <CollapsibleSection id="localities" label="Localities" open={openSections.localities} onToggle={toggleSection}>
        {noCityMessage
          ? <p className="text-xs text-gray-400">Please select a city to view available localities.</p>
          : <CheckboxGroup options={cityAreas} selected={filters.localities}
              onChange={(v) => updateFilter('localities', v)} search />
        }
      </CollapsibleSection>

      {/* Furnishing */}
      <CollapsibleSection id="furnishing" label="Furnishing Status" open={openSections.furnishing} onToggle={toggleSection}>
        <CheckboxGroup options={FURNISHING_OPTIONS} selected={filters.furnishing}
          onChange={(v) => updateFilter('furnishing', v)} />
      </CollapsibleSection>

      {/* Gated Community */}
      <CollapsibleSection id="gatedCommunity" label="Gated Community" open={openSections.gatedCommunity} onToggle={toggleSection}>
        <label className="flex items-center gap-3 cursor-pointer">
          <button
            onClick={() => updateFilter('gatedCommunity', !filters.gatedCommunity)}
            className={`relative w-10 h-5 rounded-full transition-colors ${filters.gatedCommunity ? 'bg-brand-blue' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${filters.gatedCommunity ? 'translate-x-5' : ''}`} />
          </button>
          <span className="text-sm text-gray-700">Only gated communities</span>
        </label>
      </CollapsibleSection>

      {/* Loan Availability */}
      <CollapsibleSection id="loanAvailability" label="Loan Availability" open={openSections.loanAvailability} onToggle={toggleSection}>
        <label className="flex items-center gap-3 cursor-pointer">
          <button
            onClick={() => updateFilter('loanApprovedOnly', !filters.loanApprovedOnly)}
            className={`relative w-10 h-5 rounded-full transition-colors ${filters.loanApprovedOnly ? 'bg-emerald-500' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${filters.loanApprovedOnly ? 'translate-x-5' : ''}`} />
          </button>
          <span className="text-sm text-gray-700">Pre‑approved loan only</span>
        </label>
      </CollapsibleSection>

      {/* Tenant Type */}
      <CollapsibleSection id="tenantType" label="Tenant Type" open={openSections.tenantType} onToggle={toggleSection}>
        <CheckboxGroup options={TENANT_TYPE_OPTIONS} selected={filters.tenantType}
          onChange={(v) => updateFilter('tenantType', v)} />
      </CollapsibleSection>

      {/* Pets */}
      <CollapsibleSection id="pets" label="Pets" open={openSections.pets} onToggle={toggleSection}>
        <CheckboxGroup options={PETS_OPTIONS} selected={filters.pets}
          onChange={(v) => updateFilter('pets', v)} />
      </CollapsibleSection>

      {/* Posted By */}
      <CollapsibleSection id="postedBy" label="Posted By" open={openSections.postedBy} onToggle={toggleSection}>
        <CheckboxGroup options={POSTED_BY_OPTIONS} selected={filters.postedBy}
          onChange={(v) => updateFilter('postedBy', v)} />
      </CollapsibleSection>

      {/* Possession Status */}
      <CollapsibleSection id="possessionStatus" label="Possession Status" open={openSections.possessionStatus} onToggle={toggleSection}>
        <CheckboxGroup options={POSSESSION_OPTIONS} selected={filters.possessionStatus}
          onChange={(v) => updateFilter('possessionStatus', v)} />
      </CollapsibleSection>

      {/* Amenities */}
      <CollapsibleSection id="amenities" label="Amenities" open={openSections.amenities} onToggle={toggleSection}>
        <CheckboxGroup options={AMENITIES_LIST} selected={filters.amenities}
          onChange={(v) => updateFilter('amenities', v)} />
      </CollapsibleSection>

      {/* Facing */}
      <CollapsibleSection id="facing" label="Facing" open={openSections.facing} onToggle={toggleSection}>
        <div className="grid grid-cols-2 gap-1">
          {FACING_OPTIONS.map((f) => {
            const active = filters.facing.includes(f);
            return (
              <label key={f} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={active}
                  onChange={() => {
                    const next = active ? filters.facing.filter((x) => x !== f) : [...filters.facing, f];
                    updateFilter('facing', next);
                  }}
                  className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue/30" />
                <span className="text-sm text-gray-700">{f}</span>
              </label>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Property Age */}
      <CollapsibleSection id="propertyAge" label="Property Age" open={openSections.propertyAge} onToggle={toggleSection}>
        <CheckboxGroup options={AGE_OPTIONS} selected={filters.propertyAge}
          onChange={(v) => updateFilter('propertyAge', v)} />
      </CollapsibleSection>

      {/* Availability */}
      <CollapsibleSection id="availability" label="Availability" open={openSections.availability} onToggle={toggleSection}>
        <CheckboxGroup options={AVAILABILITY_OPTIONS} selected={filters.availability}
          onChange={(v) => updateFilter('availability', v)} />
      </CollapsibleSection>
    </div>
  );
}
