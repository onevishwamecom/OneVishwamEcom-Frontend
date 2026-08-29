import React from 'react';
import { CollapsibleSection, CheckboxGroup } from '../../../../components/ui';
import { FilterShell, getNumericPrice } from '../../shared';
import BudgetRangeSlider from '../../shared/filters/BudgetRangeSlider';

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
  items = [],
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
        <BudgetRangeSlider
          filters={filters}
          updateFilter={(key, val) => {
            const mappedKey = key === 'budgetMin' ? 'priceMin' : key === 'budgetMax' ? 'priceMax' : key;
            updateFilter(mappedKey, val);
          }}
          items={items}
          getPrice={(item) => getNumericPrice(item?.finalPrice || item?.pricePerUnit || item?.price)}
          defaultMin={0}
          defaultMax={2_000}
          step={50}
          chips={PRICE_CHIPS}
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

      {/* Special Preferences */}
      <CollapsibleSection
        title="Special Preferences"
        isOpen={openSections.availability}
        onToggle={() => toggleSection('availability')}
      >
        <div className="space-y-2 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-semibold text-brand-charcoal">
            <input
              type="checkbox"
              checked={filters.organicOnly || false}
              onChange={(e) => updateFilter('organicOnly', e.target.checked)}
              className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue/30"
            />
            <span>Organic Certified Only</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-semibold text-brand-charcoal">
            <input
              type="checkbox"
              checked={filters.availability === 'In Stock'}
              onChange={(e) => updateFilter('availability', e.target.checked ? 'In Stock' : '')}
              className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue/30"
            />
            <span>In Stock Only</span>
          </label>
        </div>
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
