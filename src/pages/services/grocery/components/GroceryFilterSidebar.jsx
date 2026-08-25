import React from 'react';
import { CollapsibleSection, CheckboxGroup } from '../../../../components/ui';
import { FilterShell, BudgetChipGroup } from '../../shared';

const PRICE_CHIPS = [
  { label: 'Under ₹100', min: 0, max: 100 },
  { label: '₹100 – ₹500', min: 100, max: 500 },
  { label: '₹500+', min: 500, max: Infinity },
];

const VENDOR_OPTIONS = ['Local Farm', 'Supermarket', 'Organic Store', 'Wholesale'];
const DELIVERY_OPTIONS = ['Same Day', 'Next Day', 'Scheduled', 'Store Pickup'];

export default function GroceryFilterSidebar({
  filters,
  openSections,
  updateFilter,
  toggleSection,
  resetFilters,
  cityAreas = [],
}) {
  return (
    <FilterShell filters={filters} onReset={resetFilters}>
      {/* Price */}
      <CollapsibleSection
        title="Price Range"
        isOpen={openSections.price}
        onToggle={() => toggleSection('price')}
      >
        <BudgetChipGroup
          presets={PRICE_CHIPS}
          minVal={filters.priceMin}
          maxVal={filters.priceMax}
          onSelectPreset={(min, max) => {
            updateFilter('priceMin', min !== null ? String(min) : '');
            updateFilter('priceMax', max !== null && max !== Infinity ? String(max) : '');
          }}
          onMinChange={(v) => updateFilter('priceMin', v)}
          onMaxChange={(v) => updateFilter('priceMax', v)}
        />
      </CollapsibleSection>

      {/* Vendor Type */}
      <CollapsibleSection
        title="Vendor Type"
        isOpen={openSections.vendors}
        onToggle={() => toggleSection('vendors')}
      >
        <CheckboxGroup
          options={VENDOR_OPTIONS}
          selected={filters.vendors}
          onChange={(v) => updateFilter('vendors', v)}
        />
      </CollapsibleSection>

      {/* Delivery */}
      <CollapsibleSection
        title="Delivery Mode"
        isOpen={openSections.delivery}
        onToggle={() => toggleSection('delivery')}
      >
        <CheckboxGroup
          options={DELIVERY_OPTIONS}
          selected={filters.delivery}
          onChange={(v) => updateFilter('delivery', v)}
        />
      </CollapsibleSection>

      {/* Locality */}
      {cityAreas.length > 0 && (
        <CollapsibleSection
          title="Locality / Area"
          isOpen={openSections.locality}
          onToggle={() => toggleSection('locality')}
        >
          <select
            value={filters.locality}
            onChange={(e) => updateFilter('locality', e.target.value)}
            className="w-full rounded-xl border border-gray-200 p-2.5 text-xs font-semibold text-brand-charcoal outline-none bg-white"
          >
            <option value="">All Localities</option>
            {cityAreas.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </CollapsibleSection>
      )}
    </FilterShell>
  );
}
