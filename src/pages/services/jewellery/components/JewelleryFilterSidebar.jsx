import React from 'react';
import { CollapsibleSection, CheckboxGroup } from '../../../../components/ui';
import { FilterShell, BudgetChipGroup } from '../../shared';

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
}) {
  return (
    <FilterShell filters={filters} onReset={resetFilters}>
      {/* Budget */}
      <CollapsibleSection
        title="Budget"
        isOpen={openSections.budget}
        onToggle={() => toggleSection('budget')}
      >
        <BudgetChipGroup
          presets={BUDGET_CHIPS}
          minVal={filters.budgetMin}
          maxVal={filters.budgetMax}
          onSelectPreset={(min, max) => {
            updateFilter('budgetMin', min !== null ? String(min) : '');
            updateFilter('budgetMax', max !== null && max !== Infinity ? String(max) : '');
          }}
          onMinChange={(v) => updateFilter('budgetMin', v)}
          onMaxChange={(v) => updateFilter('budgetMax', v)}
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
