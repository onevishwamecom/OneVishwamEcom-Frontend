import { useCallback } from 'react';
import {
  BEDROOM_OPTIONS,
  FURNISHING_OPTIONS,
  POSTED_BY_OPTIONS,
  POSSESSION_OPTIONS,
  AMENITIES_LIST,
  FACING_OPTIONS,
  AGE_OPTIONS,
  AVAILABILITY_OPTIONS,
  TENANT_TYPE_OPTIONS,
  PETS_OPTIONS,
} from './propertyConstants';
import { getNumericPrice } from './propertyHelpers';
import FilterShell from '../shared/filters/FilterShell';
import { FilterSection } from '../shared/filters/FilterSection';
import { PillGroup } from '../shared/filters/PillGroup';
import { BudgetRangeSlider } from '../shared/filters/BudgetRangeSlider';
import { CollapsibleSection, CheckboxGroup } from '../../../components/ui';

/* Toggle pill used for boolean filters (Gated Community, Loan, etc.) */
function ToggleSwitch({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none py-1">
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-blue" />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
  );
}

/* Localities: city-aware, with a search */
function LocalitiesFilter({ filters, updateFilter, cityAreas, noCityMessage }) {
  if (noCityMessage) {
    return (
      <p className="text-xs text-gray-400">Please select a city to view available localities.</p>
    );
  }
  if (!cityAreas.length) {
    return <p className="text-xs text-gray-400">No localities available.</p>;
  }
  return (
    <CheckboxGroup
      options={cityAreas}
      selected={filters.localities}
      onChange={(v) => updateFilter('localities', v)}
      search
    />
  );
}

/* Compact range input block for Property Size (sqft) */
function SizeRange({ filters, updateFilter }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        placeholder="Min sq.ft"
        value={filters.sizeMin}
        onChange={(e) => updateFilter('sizeMin', e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-brand-blue"
      />
      <input
        type="number"
        placeholder="Max sq.ft"
        value={filters.sizeMax}
        onChange={(e) => updateFilter('sizeMax', e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-brand-blue"
      />
    </div>
  );
}

/* ── PropertyFilterSidebar ─────────────────────────────────────────────────
 * Uses shared components:
 *   • FilterShell   – outer header (Filters label + Reset All)
 *   • FilterSection – individual section row (label + Clear + border)
 *   • PillGroup     – pill multi-select (from shared/filters)
 *   • BudgetRangeSlider – fixed dual-range slider with chip + input sync
 *   • CollapsibleSection, CheckboxGroup – from components/ui
 */
export default function PropertyFilterSidebar({
  filters,
  updateFilter,
  openSections,
  toggleSection,
  activeChips,
  resetFilters,
  cityAreas,
  noCityMessage,
  properties = [],
  variant = 'desktop',
}) {
  return (
    <FilterShell
      filters={filters}
      onReset={resetFilters}
      title={variant === 'mobile' ? 'All Filters' : 'Filters'}
    >
      {/* ── Budget ── */}
      <FilterSection
        label="Budget"
        active={!!(filters.budgetMin || filters.budgetMax)}
        onClear={() => {
          updateFilter('budgetMin', '');
          updateFilter('budgetMax', '');
        }}
      >
        <BudgetRangeSlider
          filters={filters}
          updateFilter={updateFilter}
          items={properties}
          getPrice={getNumericPrice}
          step={100_000}
          chips={[
            { label: 'Under ₹50L',    min: 0,          max: 5_000_000   },
            { label: '₹50L – ₹1Cr',   min: 5_000_000,  max: 10_000_000  },
            { label: '₹1Cr – ₹2.5Cr', min: 10_000_000, max: 25_000_000  },
            { label: '₹2.5Cr+',       min: 25_000_000, max: Infinity    },
          ]}
        />
      </FilterSection>

      {/* ── Bedrooms ── */}
      <FilterSection
        label="Bedrooms"
        active={filters.bedrooms.length > 0}
        onClear={() => updateFilter('bedrooms', [])}
      >
        <PillGroup
          options={BEDROOM_OPTIONS}
          selected={filters.bedrooms}
          onChange={(v) => updateFilter('bedrooms', v)}
          size="xs"
        />
      </FilterSection>

      {/* ── Localities ── */}
      <FilterSection
        label="Localities"
        active={filters.localities.length > 0}
        onClear={() => updateFilter('localities', [])}
        last
      >
        <LocalitiesFilter
          filters={filters}
          updateFilter={updateFilter}
          cityAreas={cityAreas}
          noCityMessage={noCityMessage}
        />

        {/* ── Advanced / More Filters (collapsed) ── */}
        <CollapsibleSection
          id="moreFilters"
          label={openSections.moreFilters ? '− Less Filters' : '+ More Filters'}
          open={!!openSections.moreFilters}
          onToggle={toggleSection}
        >
          <div className="space-y-4 pt-2">
            {/* Property Size */}
            <div>
              <h4 className="text-xs font-bold text-brand-charcoal mb-2">Property Size (sq.ft)</h4>
              <SizeRange filters={filters} updateFilter={updateFilter} />
            </div>

            {/* Building Type */}
            <div>
              <h4 className="text-xs font-bold text-brand-charcoal mb-2">Building Type</h4>
              <PillGroup
                options={['Residential', 'Commercial']}
                selected={filters.buildingType}
                onChange={(v) => updateFilter('buildingType', v)}
              />
            </div>

            {/* Furnishing */}
            <div>
              <h4 className="text-xs font-bold text-brand-charcoal mb-2">Furnishing</h4>
              <PillGroup
                options={FURNISHING_OPTIONS}
                selected={filters.furnishing}
                onChange={(v) => updateFilter('furnishing', v)}
              />
            </div>

            {/* Gated Community + Loan */}
            <div className="space-y-2 pt-1">
              <ToggleSwitch
                checked={!!filters.gatedCommunity}
                onChange={(v) => updateFilter('gatedCommunity', v)}
                label="Only gated communities"
              />
              <ToggleSwitch
                checked={!!filters.loanApprovedOnly}
                onChange={(v) => updateFilter('loanApprovedOnly', v)}
                label="Pre‑approved loan only"
              />
            </div>

            {/* Posted By */}
            <div>
              <h4 className="text-xs font-bold text-brand-charcoal mb-2">Posted By</h4>
              <PillGroup
                options={POSTED_BY_OPTIONS}
                selected={filters.postedBy}
                onChange={(v) => updateFilter('postedBy', v)}
                size="xs"
              />
            </div>

            {/* Possession */}
            <div>
              <h4 className="text-xs font-bold text-brand-charcoal mb-2">Possession Status</h4>
              <PillGroup
                options={POSSESSION_OPTIONS}
                selected={filters.possessionStatus}
                onChange={(v) => updateFilter('possessionStatus', v)}
                size="xs"
              />
            </div>

            {/* Property Age */}
            <div>
              <h4 className="text-xs font-bold text-brand-charcoal mb-2">Property Age</h4>
              <PillGroup
                options={AGE_OPTIONS}
                selected={filters.propertyAge}
                onChange={(v) => updateFilter('propertyAge', v)}
                size="xs"
              />
            </div>

            {/* Availability */}
            <div>
              <h4 className="text-xs font-bold text-brand-charcoal mb-2">Availability</h4>
              <PillGroup
                options={AVAILABILITY_OPTIONS}
                selected={filters.availability}
                onChange={(v) => updateFilter('availability', v)}
              />
            </div>

            {/* Facing */}
            <div>
              <h4 className="text-xs font-bold text-brand-charcoal mb-2">Facing</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {FACING_OPTIONS.map((f) => (
                  <label
                    key={f}
                    className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-brand-blue"
                  >
                    <input
                      type="checkbox"
                      checked={filters.facing.includes(f)}
                      onChange={() => {
                        const next = filters.facing.includes(f)
                          ? filters.facing.filter((x) => x !== f)
                          : [...filters.facing, f];
                        updateFilter('facing', next);
                      }}
                      className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue/30"
                    />
                    {f}
                  </label>
                ))}
              </div>
            </div>

            {/* Tenant / Pets */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-brand-charcoal mb-2">Tenant Type</h4>
                <PillGroup
                  options={TENANT_TYPE_OPTIONS}
                  selected={filters.tenantType}
                  onChange={(v) => updateFilter('tenantType', v)}
                  size="xs"
                />
              </div>
              <div>
                <h4 className="text-xs font-bold text-brand-charcoal mb-2">Pets</h4>
                <PillGroup
                  options={PETS_OPTIONS}
                  selected={filters.pets}
                  onChange={(v) => updateFilter('pets', v)}
                  size="xs"
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="text-xs font-bold text-brand-charcoal mb-2">Amenities</h4>
              <CheckboxGroup
                options={AMENITIES_LIST}
                selected={filters.amenities}
                onChange={(v) => updateFilter('amenities', v)}
              />
            </div>
          </div>
        </CollapsibleSection>
      </FilterSection>
    </FilterShell>
  );
}
