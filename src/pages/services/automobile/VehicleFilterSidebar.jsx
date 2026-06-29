import { CollapsibleSection, CheckboxGroup } from '../GalleryComponents';

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
  filters, updateFilter, openSections, toggleSection,
  activeChips, resetFilters,
  kmOpen,
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-brand-charcoal">Filters</span>
        {activeChips.length > 0 && (
          <button onClick={resetFilters} className="text-xs text-brand-blue font-semibold hover:underline">
            Reset All
          </button>
        )}
      </div>

      <CollapsibleSection id="budget" label="Budget" open={openSections.budget} onToggle={toggleSection}>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {BUDGET_PRESETS.map((r) => {
            const active = +filters.budgetMin === r.min && +filters.budgetMax === r.max;
            return (
              <button key={r.label}
                onClick={() => {
                  if (active) { updateFilter('budgetMin', ''); updateFilter('budgetMax', ''); }
                  else { updateFilter('budgetMin', String(r.min)); updateFilter('budgetMax', String(r.max)); }
                }}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                  active ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >{r.label}</button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.budgetMin}
            onChange={(e) => updateFilter('budgetMin', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-blue" />
          <input type="number" placeholder="Max" value={filters.budgetMax}
            onChange={(e) => updateFilter('budgetMax', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-blue" />
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="fuelTypes" label="Fuel Type" open={openSections.fuelTypes} onToggle={toggleSection}>
        <CheckboxGroup options={FUEL_OPTIONS} selected={filters.fuelTypes}
          onChange={(v) => updateFilter('fuelTypes', v)} />
      </CollapsibleSection>

      <CollapsibleSection id="categories" label="Category" open={openSections.categories} onToggle={toggleSection}>
        <CheckboxGroup options={CATEGORY_OPTIONS} selected={filters.categories}
          onChange={(v) => updateFilter('categories', v)} />
      </CollapsibleSection>

      <CollapsibleSection id="locations" label="Location" open={openSections.locations} onToggle={toggleSection}>
        <CheckboxGroup options={['Bangalore', 'Mysore', 'Hubli', 'Mangalore']} selected={filters.locations}
          onChange={(v) => updateFilter('locations', v)} search />
      </CollapsibleSection>

      {kmOpen && (
        <CollapsibleSection id="kmDriven" label="KM Driven" open={openSections.kmDriven} onToggle={toggleSection}>
          <div className="flex flex-wrap gap-1.5">
            {KM_PRESETS.map((r) => {
              const active = +filters.kmMin === r.min && +filters.kmMax === r.max;
              return (
                <button key={r.label}
                  onClick={() => {
                    if (active) { updateFilter('kmMin', ''); updateFilter('kmMax', ''); }
                    else { updateFilter('kmMin', String(r.min)); updateFilter('kmMax', String(r.max)); }
                  }}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                    active ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >{r.label}</button>
              );
            })}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}
