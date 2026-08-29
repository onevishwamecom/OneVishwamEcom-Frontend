import React from 'react';
import { CollapsibleSection, CheckboxGroup } from '../../../../components/ui';
import { FilterShell, getNumericPrice } from '../../shared';
import BudgetRangeSlider from '../../shared/filters/BudgetRangeSlider';

const BUDGET_CHIPS = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹2K', min: 500, max: 2000 },
  { label: '₹2K – ₹5K', min: 2000, max: 5000 },
  { label: '₹5K+', min: 5000, max: Infinity },
];

const BRAND_TYPE_OPTIONS = ['Local Brand', 'National Brand', 'International', 'Handloom', 'Designer'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];
const FABRIC_OPTIONS = ['Cotton', 'Silk', 'Linen', 'Polyester', 'Wool', 'Denim', 'Khadi', 'Chiffon'];
const OCCASION_OPTIONS = ['Casual', 'Formal', 'Party', 'Wedding', 'Festive', 'Sports', 'Daily Wear'];
const DISCOUNT_OPTIONS = [
  { label: 'Any', value: '' },
  { label: '10%+', value: '10' },
  { label: '20%+', value: '20' },
  { label: '30%+', value: '30' },
  { label: '50%+', value: '50' },
];

export default function GarmentFilterSidebar({
  filters,
  openSections,
  updateFilter,
  toggleSection,
  resetFilters,
  items = [],
  trendingOnly = false,
  setTrendingOnly,
}) {
  return (
    <FilterShell filters={filters} onReset={resetFilters}>
      {/* Budget */}
      <CollapsibleSection
        title="Budget"
        isOpen={openSections.budget}
        onToggle={() => toggleSection('budget')}
      >
        <BudgetRangeSlider
          filters={filters}
          updateFilter={updateFilter}
          items={items}
          getPrice={(g) => getNumericPrice(g?.finalPrice || g?.price)}
          defaultMin={0}
          defaultMax={10_000}
          step={100}
          chips={BUDGET_CHIPS}
        />
      </CollapsibleSection>

      {/* Special Highlights */}
      <CollapsibleSection
        title="Highlights"
        isOpen={openSections.trending}
        onToggle={() => toggleSection('trending')}
      >
        <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-semibold text-brand-charcoal pt-1">
          <input
            type="checkbox"
            checked={trendingOnly}
            onChange={(e) => setTrendingOnly && setTrendingOnly(e.target.checked)}
            className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue/30"
          />
          <span>Trending Styles Only</span>
        </label>
      </CollapsibleSection>

      {/* Brand Types */}
      <CollapsibleSection
        title="Brand Type"
        isOpen={openSections.brandTypes}
        onToggle={() => toggleSection('brandTypes')}
      >
        <CheckboxGroup
          options={BRAND_TYPE_OPTIONS}
          selected={filters.brandTypes}
          onChange={(v) => updateFilter('brandTypes', v)}
        />
      </CollapsibleSection>

      {/* Sizes */}
      <CollapsibleSection
        title="Size"
        isOpen={openSections.sizes}
        onToggle={() => toggleSection('sizes')}
      >
        <div className="flex flex-wrap gap-1.5 pt-1">
          {SIZE_OPTIONS.map((size) => {
            const isSelected = (filters.sizes || []).includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => {
                  const current = filters.sizes || [];
                  const updated = isSelected
                    ? current.filter((s) => s !== size)
                    : [...current, size];
                  updateFilter('sizes', updated);
                }}
                className={`rounded-lg border px-2.5 py-1 text-xs font-bold transition-all ${
                  isSelected
                    ? 'border-brand-blue bg-brand-blue text-white shadow-xs'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-brand-blue/40'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Fabrics */}
      <CollapsibleSection
        title="Fabric"
        isOpen={openSections.fabrics}
        onToggle={() => toggleSection('fabrics')}
      >
        <CheckboxGroup
          options={FABRIC_OPTIONS}
          selected={filters.fabrics}
          onChange={(v) => updateFilter('fabrics', v)}
        />
      </CollapsibleSection>

      {/* Occasion */}
      <CollapsibleSection
        title="Occasion"
        isOpen={openSections.occasions}
        onToggle={() => toggleSection('occasions')}
      >
        <CheckboxGroup
          options={OCCASION_OPTIONS}
          selected={filters.occasions}
          onChange={(v) => updateFilter('occasions', v)}
        />
      </CollapsibleSection>

      {/* Minimum Discount */}
      <CollapsibleSection
        title="Min Discount"
        isOpen={openSections.discount}
        onToggle={() => toggleSection('discount')}
      >
        <div className="flex flex-wrap gap-1.5 pt-1">
          {DISCOUNT_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => updateFilter('discount', opt.value)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-bold transition-all ${
                filters.discount === opt.value
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-600/40'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </CollapsibleSection>
    </FilterShell>
  );
}
