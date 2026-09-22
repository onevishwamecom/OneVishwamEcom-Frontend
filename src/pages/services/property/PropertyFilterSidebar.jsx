import { CollapsibleSection, CheckboxGroup } from '../../../components/ui';
import {
  BEDROOM_OPTIONS, FURNISHING_OPTIONS,
  POSTED_BY_OPTIONS, POSSESSION_OPTIONS, AMENITIES_LIST, FACING_OPTIONS,
  AGE_OPTIONS, AVAILABILITY_OPTIONS,
} from './propertyConstants';

function formatSizeLabel(val) {
  const num = Number(val);
  if (!num || isNaN(num) || num <= 0) return '0 sq.ft';
  return `${num.toLocaleString('en-IN')} sq.ft`;
}

function DualRangeSlider({
  min = 600,
  max = 10000,
  step = 50,
  minVal,
  maxVal,
  onChange,
  formatLabel = formatSizeLabel,
  maxLabel,
}) {
  const currentMin = minVal !== '' && !isNaN(minVal) ? Number(minVal) : min;
  const currentMax = maxVal !== '' && !isNaN(maxVal) ? Number(maxVal) : max;

  const rangeSpan = Math.max(1, max - min);
  const minPercent = Math.max(0, Math.min(100, ((currentMin - min) / rangeSpan) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((currentMax - min) / rangeSpan) * 100));

  return (
    <div className="my-2.5 px-1">
      <div className="flex items-center justify-between text-xs font-bold text-brand-blue mb-2">
        <span className="bg-brand-blue/10 px-2 py-0.5 rounded-md">{formatLabel(currentMin)}</span>
        <span className="text-gray-400 font-normal text-[10px]">to</span>
        <span className="bg-brand-blue/10 px-2 py-0.5 rounded-md">
          {currentMax >= max && maxLabel ? maxLabel : formatLabel(currentMax)}
        </span>
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
            onChange(val <= min ? '' : String(val), maxVal);
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
            onChange(minVal, val >= max ? '' : String(val));
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
  sizeBounds = { min: 600, max: 10000 },
}) {
  const sizeStep = Math.max(10, (sizeBounds.max - sizeBounds.min) > 5000 ? 100 : 50);

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

      {/* Property Size */}
      <CollapsibleSection id="size" label="Property Size" open={openSections.size} onToggle={toggleSection}>
        {/* Dual Range Size Slider */}
        <DualRangeSlider
          min={sizeBounds.min}
          max={sizeBounds.max}
          step={sizeStep}
          minVal={filters.sizeMin}
          maxVal={filters.sizeMax}
          formatLabel={formatSizeLabel}
          maxLabel={formatSizeLabel(sizeBounds.max)}
          onChange={(minVal, maxVal) => {
            updateFilter('sizeMin', minVal);
            updateFilter('sizeMax', maxVal);
          }}
        />

        <div className="flex gap-2 mt-3">
          <div className="w-full">
            <input
              type="number"
              placeholder={`Min (${formatSizeLabel(sizeBounds.min)})`}
              value={filters.sizeMin}
              onChange={(e) => updateFilter('sizeMin', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-brand-blue"
            />
            {filters.sizeMin > 0 && (
              <span className="text-[10px] text-brand-blue font-semibold block mt-0.5 pl-1">
                {formatSizeLabel(filters.sizeMin)}
              </span>
            )}
          </div>

          <div className="w-full">
            <input
              type="number"
              placeholder={`Max (${formatSizeLabel(sizeBounds.max)})`}
              value={filters.sizeMax}
              onChange={(e) => updateFilter('sizeMax', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-brand-blue"
            />
            {filters.sizeMax > 0 && (
              <span className="text-[10px] text-brand-blue font-semibold block mt-0.5 pl-1">
                {formatSizeLabel(filters.sizeMax)}
              </span>
            )}
          </div>
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
      <CollapsibleSection id="localities" label="Localities / Zones" open={openSections.localities} onToggle={toggleSection}>
        {cityAreas.length === 0 ? (
          <p className="text-xs text-gray-400 italic">{noCityMessage}</p>
        ) : (
          <CheckboxGroup options={cityAreas} selected={filters.localities}
            onChange={(v) => updateFilter('localities', v)} />
        )}
      </CollapsibleSection>

      {/* Furnishing */}
      <CollapsibleSection id="furnishing" label="Furnishing" open={openSections.furnishing} onToggle={toggleSection}>
        <CheckboxGroup options={FURNISHING_OPTIONS} selected={filters.furnishing}
          onChange={(v) => updateFilter('furnishing', v)} />
      </CollapsibleSection>

      {/* Gated Community */}
      <CollapsibleSection id="gatedCommunity" label="Gated Community" open={openSections.gatedCommunity} onToggle={toggleSection}>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
          <input type="checkbox" checked={filters.gatedCommunity}
            onChange={(e) => updateFilter('gatedCommunity', e.target.checked)}
            className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
          <span>Gated Community Only</span>
        </label>
      </CollapsibleSection>

      {/* Pre-Approved Loan Only */}
      <CollapsibleSection id="loanAvailability" label="Loan Availability" open={openSections.loanAvailability} onToggle={toggleSection}>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
          <input type="checkbox" checked={filters.loanApprovedOnly}
            onChange={(e) => updateFilter('loanApprovedOnly', e.target.checked)}
            className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
          <span>Pre-Approved Loan Only</span>
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
        <CheckboxGroup options={FACING_OPTIONS} selected={filters.facing}
          onChange={(v) => updateFilter('facing', v)} />
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
    </div>
  );
}
