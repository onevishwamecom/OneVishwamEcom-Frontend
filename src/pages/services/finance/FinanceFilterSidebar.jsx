import { CollapsibleSection, CheckboxGroup } from '../GalleryComponents';
import { LOAN_TYPE_OPTIONS, FINANCE_PROVIDER_TYPES, FINANCE_SERVICE_MODES, FINANCE_POSTED_BY, FINANCE_AVAILABILITY, FINANCE_TENURE_OPTIONS } from './financeConstants';
import MobileFilterDrawer from '../../../components/MobileFilterDrawer';

export default function FinanceFilterSidebar({
  filters, updateFilter, openSections, toggleSection,
  activeChips, resetFilters, cityAreas, noCityMessage,
  resultCount, resultLabel = 'Services',
  mobile, open, onClose,
}) {
  const content = (
    <div className="space-y-1">
      {/* Loan Type */}
      <CollapsibleSection id="loanType" title="Loan Type" open={openSections.loanType} onToggle={toggleSection}>
        <CheckboxGroup options={LOAN_TYPE_OPTIONS} selected={filters.loanTypes}
          onChange={(v) => updateFilter('loanTypes', v)} />
      </CollapsibleSection>

      {/* Loan Amount */}
      <CollapsibleSection id="amount" title="Loan Amount" open={openSections.amount} onToggle={toggleSection}>
        <div className="space-y-2">
          <input type="number" placeholder="Minimum Amount (₹)" value={filters.amountMin}
            onChange={(e) => updateFilter('amountMin', e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue" />
          <input type="number" placeholder="Maximum Amount (₹)" value={filters.amountMax}
            onChange={(e) => updateFilter('amountMax', e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue" />
        </div>
      </CollapsibleSection>

      {/* Interest Rate */}
      <CollapsibleSection id="interestRate" title="Interest Rate" open={openSections.interestRate} onToggle={toggleSection}>
        <div className="space-y-2">
          <input type="number" placeholder="Min (%)" step="0.1" value={filters.interestMin}
            onChange={(e) => updateFilter('interestMin', e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue" />
          <input type="number" placeholder="Max (%)" step="0.1" value={filters.interestMax}
            onChange={(e) => updateFilter('interestMax', e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue" />
        </div>
      </CollapsibleSection>

      {/* Loan Tenure */}
      <CollapsibleSection id="tenure" title="Loan Tenure" open={openSections.tenure} onToggle={toggleSection}>
        <div className="flex flex-wrap gap-2">
          {FINANCE_TENURE_OPTIONS.map((t) => (
            <button key={t}
              onClick={() => updateFilter('tenure', filters.tenure === t ? '' : t)}
              className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                filters.tenure === t
                  ? 'border-brand-blue bg-brand-blue text-white'
                  : 'border-gray-200 text-gray-600 hover:border-brand-blue/40 hover:text-brand-blue'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Provider Type */}
      <CollapsibleSection id="providerType" title="Provider Type" open={openSections.providerType} onToggle={toggleSection}>
        <CheckboxGroup options={FINANCE_PROVIDER_TYPES} selected={filters.providerTypes}
          onChange={(v) => updateFilter('providerTypes', v)} />
      </CollapsibleSection>

      {/* Service Mode */}
      <CollapsibleSection id="serviceMode" title="Service Mode" open={openSections.serviceMode} onToggle={toggleSection}>
        <CheckboxGroup options={FINANCE_SERVICE_MODES} selected={filters.serviceModes}
          onChange={(v) => updateFilter('serviceModes', v)} />
      </CollapsibleSection>

      {/* City */}
      <CollapsibleSection id="city" title="City" open={openSections.city} onToggle={toggleSection}>
        <select value={filters.city} onChange={(e) => { updateFilter('city', e.target.value); updateFilter('localities', []); }}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue bg-white">
          <option value="">All Cities</option>
          <option value="bengaluru">Bengaluru</option>
        </select>
      </CollapsibleSection>

      {/* Area / Locality */}
      <CollapsibleSection id="localities" title="Area / Locality" open={openSections.localities} onToggle={toggleSection}>
        {noCityMessage || !filters.city ? (
          <p className="text-xs text-gray-400">Select a city to view available localities.</p>
        ) : (
          <div className="max-h-40 overflow-y-auto">
            <CheckboxGroup options={cityAreas} selected={filters.localities}
              onChange={(v) => updateFilter('localities', v)} />
          </div>
        )}
      </CollapsibleSection>

      {/* PIN Code */}
      <CollapsibleSection id="pincode" title="PIN Code" open={openSections.pincode} onToggle={toggleSection}>
        <input type="text" placeholder="Enter PIN Code" maxLength={6} value={filters.pincode}
          onChange={(e) => updateFilter('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue" />
      </CollapsibleSection>

      {/* Posted By */}
      <CollapsibleSection id="postedBy" title="Posted By" open={openSections.postedBy} onToggle={toggleSection}>
        <CheckboxGroup options={FINANCE_POSTED_BY} selected={filters.postedBy}
          onChange={(v) => updateFilter('postedBy', v)} />
      </CollapsibleSection>

      {/* Availability */}
      <CollapsibleSection id="availability" title="Availability" open={openSections.availability} onToggle={toggleSection}>
        <CheckboxGroup options={FINANCE_AVAILABILITY} selected={filters.availability}
          onChange={(v) => updateFilter('availability', v)} />
      </CollapsibleSection>

      {/* Action Buttons */}
      <div className="pt-4 space-y-2">
        <button onClick={resetFilters}
          className="w-full rounded-xl border border-gray-200 py-3 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          Reset Filters
        </button>
        {mobile && (
          <button onClick={onClose}
            className="w-full rounded-xl bg-brand-blue py-3 text-xs font-semibold text-white hover:bg-blue-700 transition-colors">
            Show {resultCount} {resultLabel}
          </button>
        )}
      </div>
    </div>
  );

  if (mobile) {
    return (
      <MobileFilterDrawer open={open} onClose={onClose} resultCount={resultCount} resultLabel={resultLabel}>
        {content}
      </MobileFilterDrawer>
    );
  }

  return (
    <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-brand-charcoal">Filters</h3>
        {activeChips.length > 0 && (
          <button onClick={resetFilters} className="text-xs font-semibold text-brand-blue hover:underline">Reset All</button>
        )}
      </div>
      {content}
    </aside>
  );
}
