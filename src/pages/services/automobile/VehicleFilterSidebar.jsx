import { CollapsibleSection, CheckboxGroup } from '../../../components/ui';
import { FilterShell, FilterSection, PillGroup, BudgetChipGroup } from '../shared';

const BUDGET_PRESETS = [
  { label: 'Under ₹1L',  min: 0,        max: 100_000  },
  { label: '₹1L – ₹3L',  min: 100_000,  max: 300_000  },
  { label: '₹3L – ₹10L', min: 300_000,  max: 1_000_000 },
  { label: '₹10L+',       min: 1_000_000,max: Infinity  },
];

const KM_PRESETS = [
  { label: 'Under 10k km',  min: 0,      max: 10_000  },
  { label: '10k – 30k km',  min: 10_000, max: 30_000  },
  { label: '30k – 50k km',  min: 30_000, max: 50_000  },
  { label: '50k+ km',       min: 50_000, max: Infinity },
];

const FUEL_OPTIONS     = ['Petrol', 'Diesel', 'Electric', 'CNG'];
const CATEGORY_OPTIONS = ['2-wheeler', '3-wheeler', '4-wheeler', 'commercial'];

export default function VehicleFilterSidebar({
  filters,
  updateFilter,
  onUpdateFilter,
  openSections,
  toggleSection,
  onToggleSection,
  activeChips = [],
  resetFilters,
  onResetFilters,
  fuelTypeOptions,
  locationOptions,
  kmOpen,
  condition = 'new',
  setCondition,
  preApprovedMode = false,
  setPreApprovedMode,
}) {
  const updFilter  = onUpdateFilter || updateFilter;
  const togSection = onToggleSection || toggleSection;
  const rstFilters = onResetFilters  || resetFilters;

  return (
    <FilterShell
      filters={filters}
      hasActiveFilters={activeChips.length > 0}
      onReset={rstFilters}
    >
      {/* Vehicle Condition — using shared PillGroup */}
      <FilterSection label="Vehicle Condition">
        <PillGroup
          options={['New', 'Used / Old']}
          selected={condition === 'new' ? 'New' : 'Used / Old'}
          multi={false}
          onChange={(v) => setCondition && setCondition(v === 'New' ? 'new' : 'old')}
        />
      </FilterSection>

      {/* Pre-Approved Loan */}
      <FilterSection
        label="Loan Approval"
        active={preApprovedMode}
        onClear={() => setPreApprovedMode && setPreApprovedMode(false)}
      >
        <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-semibold text-brand-charcoal pt-1">
          <input
            type="checkbox"
            checked={preApprovedMode}
            onChange={(e) => setPreApprovedMode && setPreApprovedMode(e.target.checked)}
            className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue/30"
          />
          <span>Pre-Approved Loan Only</span>
        </label>
      </FilterSection>

      {/* Budget */}
      <FilterSection
        label="Budget"
        active={!!(filters.budgetMin || filters.budgetMax)}
        onClear={() => {
          updFilter('budgetMin', '');
          updFilter('budgetMax', '');
        }}
      >
        <BudgetChipGroup
          chips={BUDGET_PRESETS}
          budgetMin={filters.budgetMin}
          budgetMax={filters.budgetMax}
          onBudgetChange={(min, max) => {
            updFilter('budgetMin', min ? String(min) : '');
            updFilter('budgetMax', max ? String(max) : '');
          }}
        />
      </FilterSection>

      {/* Fuel Type */}
      <FilterSection
        label="Fuel Type"
        active={(filters.fuelTypes || []).length > 0}
        onClear={() => updFilter('fuelTypes', [])}
      >
        <CheckboxGroup
          options={fuelTypeOptions || FUEL_OPTIONS}
          selected={filters.fuelTypes}
          onChange={(v) => updFilter('fuelTypes', v)}
        />
      </FilterSection>

      {/* Category */}
      <FilterSection
        label="Category"
        active={(filters.categories || []).length > 0}
        onClear={() => updFilter('categories', [])}
      >
        <CheckboxGroup
          options={CATEGORY_OPTIONS}
          selected={filters.categories}
          onChange={(v) => updFilter('categories', v)}
        />
      </FilterSection>

      {/* Location */}
      <FilterSection
        label="Location"
        active={(filters.locations || []).length > 0}
        onClear={() => updFilter('locations', [])}
        last={!kmOpen}
      >
        <CheckboxGroup
          options={locationOptions || ['Bangalore', 'Mysore', 'Hubli', 'Mangalore']}
          selected={filters.locations}
          onChange={(v) => updFilter('locations', v)}
          search
        />
      </FilterSection>

      {/* KM Driven (only for Used vehicles) */}
      {kmOpen && (
        <FilterSection
          label="KM Driven"
          active={!!(filters.kmMin || filters.kmMax)}
          onClear={() => { updFilter('kmMin', ''); updFilter('kmMax', ''); }}
          last
        >
          <BudgetChipGroup
            chips={KM_PRESETS}
            budgetMin={filters.kmMin}
            budgetMax={filters.kmMax}
            showCustomInputs={false}
            onBudgetChange={(min, max) => {
              updFilter('kmMin', min ? String(min) : '');
              updFilter('kmMax', max ? String(max) : '');
            }}
          />
        </FilterSection>
      )}
    </FilterShell>
  );
}
