import { CollapsibleSection, CheckboxGroup } from '../GalleryComponents';
import {
  SIZE_OPTIONS, BEDROOM_OPTIONS, FURNISHING_OPTIONS,
  POSTED_BY_OPTIONS, POSSESSION_OPTIONS, AMENITIES_LIST, FACING_OPTIONS,
  AGE_OPTIONS, AVAILABILITY_OPTIONS, LISTED_WITHIN_OPTIONS,
} from './propertyConstants';

function formatPriceLabel(val) {
  const num = Number(val);
  if (!num || isNaN(num) || num <= 0) return '₹ 0';
  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(1).replace(/\.0$/, '');
    return `₹ ${cr} Cr`;
  }
  if (num >= 100000) {
    const lakh = (num / 100000).toFixed(1).replace(/\.0$/, '');
    return `₹ ${lakh} L`;
  }
  return `₹ ${num.toLocaleString('en-IN')}`;
}

function DualRangeSlider({ min = 0, max = 50000000, step = 500000, minVal, maxVal, onChange }) {
  const currentMin = minVal !== '' && !isNaN(minVal) ? Number(minVal) : min;
  const currentMax = maxVal !== '' && !isNaN(maxVal) ? Number(maxVal) : max;

  const minPercent = Math.max(0, Math.min(100, ((currentMin - min) / (max - min)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((currentMax - min) / (max - min)) * 100));

  return (
    <div className="my-3 px-1">
      <div className="flex items-center justify-between text-xs font-semibold text-brand-blue mb-2">
        <span>{formatPriceLabel(currentMin)}</span>
        <span>{currentMax >= max ? '₹ 5 Cr+' : formatPriceLabel(currentMax)}</span>
      </div>

      <div className="relative w-full h-5 flex items-center">
        <div className="h-2 w-full rounded-full bg-gray-200 relative">
          <div
            className="absolute h-2 rounded-full bg-brand-blue"
            style={{
              left: `${minPercent}%`,
              width: `${Math.max(0, maxPercent - minPercent)}%`,
            }}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentMin}
          onChange={(e) => {
            const val = Math.min(Number(e.target.value), currentMax - step);
            onChange(val === min ? '' : String(val), maxVal);
          }}
          className="pointer-events-none absolute left-0 w-full h-2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-blue [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-blue [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentMax}
          onChange={(e) => {
            const val = Math.max(Number(e.target.value), currentMin + step);
            onChange(minVal, val === max ? '' : String(val));
          }}
          className="pointer-events-none absolute left-0 w-full h-2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-blue [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-blue [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
}

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
        {/* Dual Range Budget Slider */}
        <DualRangeSlider
          min={0}
          max={50000000}
          step={500000}
          minVal={filters.budgetMin}
          maxVal={filters.budgetMax}
          onChange={(minVal, maxVal) => {
            updateFilter('budgetMin', minVal);
            updateFilter('budgetMax', maxVal);
          }}
        />

        <div className="flex gap-2">
          <input type="number" placeholder="Min (₹)" value={filters.budgetMin}
            onChange={(e) => updateFilter('budgetMin', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-blue" />
          <input type="number" placeholder="Max (₹)" value={filters.budgetMax}
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
        <CheckboxGroup options={POSSESSION_OPTIONS} selected={filters.possessionStatus}
          onChange={(v) => updateFilter('possessionStatus', v)} />
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
