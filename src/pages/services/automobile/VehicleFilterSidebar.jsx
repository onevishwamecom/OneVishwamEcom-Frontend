import { CollapsibleSection, CheckboxGroup } from '../../../components/ui';
import { FilterShell, BudgetChipGroup } from '../shared';

const BUDGET_PRESETS = [
  { label: 'Under ₹1L',  min: 0,       max: 100000    },
  { label: '₹1L – ₹3L',  min: 100000,   max: 300000   },
  { label: '₹3L – ₹10L', min: 300000,   max: 1000000  },
  { label: '₹10L+',       min: 1000000,  max: Infinity },
];

const KM_PRESETS = [
  { label: 'Under 10k km',  min: 0,     max: 10000   },
  { label: '10k – 30k km',  min: 10000,  max: 30000   },
  { label: '30k – 50k km',  min: 30000,  max: 50000   },
  { label: '50k+ km',       min: 50000,  max: Infinity },
];

const FUEL_OPTIONS = ['Petrol', 'Diesel', 'Electric', 'CNG'];
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
}) {
  const updFilter = onUpdateFilter || updateFilter;
  const togSection = onToggleSection || toggleSection;
  const rstFilters = onResetFilters || resetFilters;

  return (
    <FilterShell
      filters={filters}
      hasActiveFilters={activeChips.length > 0}
      onReset={rstFilters}
    >
      <CollapsibleSection id="budget" label="Budget" open={openSections.budget} onToggle={togSection}>
        <BudgetChipGroup
          chips={BUDGET_PRESETS}
          budgetMin={filters.budgetMin}
          budgetMax={filters.budgetMax}
          onBudgetChange={(min, max) => {
            updFilter('budgetMin', min ? String(min) : '');
            updFilter('budgetMax', max ? String(max) : '');
          }}
        />
      </CollapsibleSection>

      <CollapsibleSection id="fuelTypes" label="Fuel Type" open={openSections.fuelTypes} onToggle={togSection}>
        <CheckboxGroup
          options={fuelTypeOptions || FUEL_OPTIONS}
          selected={filters.fuelTypes}
          onChange={(v) => updFilter('fuelTypes', v)}
        />
      </CollapsibleSection>

      <CollapsibleSection id="categories" label="Category" open={openSections.categories} onToggle={togSection}>
        <CheckboxGroup
          options={CATEGORY_OPTIONS}
          selected={filters.categories}
          onChange={(v) => updFilter('categories', v)}
        />
      </CollapsibleSection>

      <CollapsibleSection id="locations" label="Location" open={openSections.locations} onToggle={togSection}>
        <CheckboxGroup
          options={locationOptions || ['Bangalore', 'Mysore', 'Hubli', 'Mangalore']}
          selected={filters.locations}
          onChange={(v) => updFilter('locations', v)}
          search
        />
      </CollapsibleSection>

      {kmOpen && (
        <CollapsibleSection id="kmDriven" label="KM Driven" open={openSections.kmDriven} onToggle={togSection}>
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
        </CollapsibleSection>
      )}
    </FilterShell>
  );
}
