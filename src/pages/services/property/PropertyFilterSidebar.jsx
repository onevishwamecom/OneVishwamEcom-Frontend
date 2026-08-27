import { CollapsibleSection, CheckboxGroup } from '../GalleryComponents';
import {
  BUDGET_RANGES, SIZE_OPTIONS, BEDROOM_OPTIONS, FURNISHING_OPTIONS,
  POSTED_BY_OPTIONS, POSSESSION_OPTIONS, AMENITIES_LIST, FACING_OPTIONS,
  AGE_OPTIONS, AVAILABILITY_OPTIONS, LISTED_WITHIN_OPTIONS,
} from './propertyConstants';

/**
 * Reusable filter sidebar — used by both desktop aside and mobile drawer.
 */
export default function PropertyFilterSidebar({
  filters, updateFilter, openSections, toggleSection,
  activeChips, resetFilters, cityAreas, noCityMessage,
}) {
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

      {/* Budget */}
      <CollapsibleSection id="budget" label="Budget" open={openSections.budget} onToggle={toggleSection}>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {BUDGET_RANGES.map((r) => {
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

      {/* Posted By */}
      <CollapsibleSection id="postedBy" label="Posted By" open={openSections.postedBy} onToggle={toggleSection}>
        <CheckboxGroup options={POSTED_BY_OPTIONS} selected={filters.postedBy}
          onChange={(v) => updateFilter('postedBy', v)} />
      </CollapsibleSection>

      {/* Possession Status */}
      <CollapsibleSection id="possessionStatus" label="Possession Status" open={openSections.possessionStatus} onToggle={toggleSection}>
        {(() => {
          const propertyTypes = filters.propertyType || [];
          const isAll = propertyTypes.length === 0;
          const hasSitesPlots = propertyTypes.some(t => ['Sites', 'Plots', 'Lands'].includes(t));
          const hasFlatsVillas = propertyTypes.some(t => ['Flats', 'Flat', 'Villas', 'Villa', 'Commercial', 'Houses'].includes(t));

          let dynamicPossessionOptions = [];
          if (isAll || hasSitesPlots) dynamicPossessionOptions.push('Ready for Registration');
          if (isAll || hasFlatsVillas) {
            dynamicPossessionOptions.push('Ready for Occupy');
          }

          return (
            <CheckboxGroup options={dynamicPossessionOptions} selected={filters.possessionStatus}
              onChange={(v) => updateFilter('possessionStatus', v)} />
          );
        })()}
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

      {/* Listed Within */}
      <CollapsibleSection id="listedWithin" label="Listed Within" open={openSections.listedWithin} onToggle={toggleSection}>
        <div className="space-y-1.5">
          {LISTED_WITHIN_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="listedWithin"
                checked={filters.listedWithin === opt}
                onChange={() => updateFilter('listedWithin', filters.listedWithin === opt ? '' : opt)}
                className="border-gray-300 text-brand-blue focus:ring-brand-blue/30" />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}
