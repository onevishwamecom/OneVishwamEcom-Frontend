import React from 'react';
import { CollapsibleSection, CheckboxGroup } from '../../../../components/ui';
import { FilterShell, getNumericPrice } from '../../shared';
import BudgetRangeSlider from '../../shared/filters/BudgetRangeSlider';

const BUDGET_CHIPS = [
  { label: 'Under ₹25K', min: 0, max: 25000 },
  { label: '₹25K – ₹1L', min: 25000, max: 100000 },
  { label: '₹1L – ₹5L', min: 100000, max: 500000 },
  { label: '₹5L+', min: 500000, max: Infinity },
];

const METAL_OPTIONS = [
  'Gold 24K',
  'Gold 22K',
  'Gold 18K',
  'Silver',
  'Platinum',
  'White Gold',
  'Rose Gold',
];
const GENDER_OPTIONS = ['Women', 'Men', 'Kids', 'Unisex'];
const OCCASION_OPTIONS = [
  'Wedding',
  'Engagement',
  'Festival',
  'Daily Wear',
  'Office Wear',
  'Gift',
  'Anniversary',
];
const AVAILABILITY_OPTIONS = ['Store Pickup', 'Home Delivery', 'Try At Home'];

export default function JewelleryFilterSidebar({
  filters,
  openSections,
  updateFilter,
  toggleSection,
  resetFilters,
  items = [],
  certifiedOnly = false,
  setCertifiedOnly,
}) {
  return (
    <FilterShell filters={filters} onReset={resetFilters}>
      {/* Certification */}
      <CollapsibleSection
        title="Certification"
        isOpen={openSections.certified}
        onToggle={() => toggleSection('certified')}
      >
        <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-semibold text-brand-charcoal pt-1">
          <input
            type="checkbox"
            checked={certifiedOnly}
            onChange={(e) => setCertifiedOnly && setCertifiedOnly(e.target.checked)}
            className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue/30"
          />
          <span>Certified / Hallmarked Only</span>
        </label>
      </CollapsibleSection>

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
          getPrice={(j) => getNumericPrice(j?.price)}
          defaultMin={0}
          defaultMax={500_000}
          step={5_000}
          chips={BUDGET_CHIPS}
        />
      </CollapsibleSection>

      {/* Metal & Purity */}
      <CollapsibleSection
        title="Metal & Purity"
        isOpen={openSections.metals}
        onToggle={() => toggleSection('metals')}
      >
        <CheckboxGroup
          options={METAL_OPTIONS}
          selected={filters.metals}
          onChange={(v) => updateFilter('metals', v)}
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

      {/* Gender */}
      <CollapsibleSection
        title="Gender"
        isOpen={openSections.genders}
        onToggle={() => toggleSection('genders')}
      >
        <CheckboxGroup
          options={GENDER_OPTIONS}
          selected={filters.genders}
          onChange={(v) => updateFilter('genders', v)}
        />
      </CollapsibleSection>

      {/* Availability */}
      <CollapsibleSection
        title="Availability / Services"
        isOpen={openSections.availability}
        onToggle={() => toggleSection('availability')}
      >
        <CheckboxGroup
          options={AVAILABILITY_OPTIONS}
          selected={filters.availability}
          onChange={(v) => updateFilter('availability', v)}
        />
      </CollapsibleSection>
    </FilterShell>
  );
}
