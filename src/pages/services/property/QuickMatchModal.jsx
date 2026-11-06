import { useState, useMemo } from 'react';
import { navigateTo } from '../../../config/navigation';
import { useProperties } from '../../../hooks/useProperties';
import { cities, CITY_OPTIONS, resolveCityId } from '../../../constants/locations';
import { getTotalPropertyPrice, getNumericPrice, matchesBudgetRange, getCardType } from './propertyHelpers';
import { QuickMatchModalShell } from '../shared';
import { signalHomepageRefresh } from '../../../utils/matchEvents';

function getBedroomNumber(bhk) {
  if (typeof bhk === 'number') return bhk;
  const m = String(bhk || '').match(/(\d+(\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

function matchesBedroom(bhk, selected) {
  if (!selected) return true;
  const num = getBedroomNumber(bhk);
  if (selected === '4BHK+' || selected === '4 BHK+') return num >= 4;
  return num === getBedroomNumber(selected);
}

const PROPERTY_TYPES = [
  'Residential',
  'Flat',
  'Independent House',
  'Plot',
  'Land',
  'Agricultural',
  'Commercial',
  'Industrial',
];
const BEDROOM_OPTIONS = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', '4BHK+'];

/* ── Component ── */

function QuickMatchModal({ onClose }) {
  const { properties } = useProperties();
  const [step, setStep] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  /* All filter fields are optional */
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const resolvedCityId = city ? resolveCityId(city) : '';
  const areas = resolvedCityId ? (cities[resolvedCityId]?.areas || []) : [];
  const hasAnyFilter = Boolean(budgetMin || budgetMax || propertyType || city || location || bedrooms);
  const availableCount = (properties || []).filter((p) => p && p.status !== 'closed' && p.availabilityStatus !== 'sold_out').length;

  const handleFindMatch = () => {
    signalHomepageRefresh();
    setStep(2);
  };

  const handleBrowseAll = () => {
    onClose();
    navigateTo('/property');
  };

  const handleClose = () => {
    if (step === 3) { onClose(); return; }
    if (step === 2) { setStep(3); return; }
    onClose();
  };

  /* ── Step 2: Compute filtered buckets ── */
  const buckets = useMemo(() => {
    const preApproved = [];
    const matched = [];
    const closed = [];

    (properties || []).forEach((p) => {
      if (!p) return;
      const cardType = getCardType(p);

      const budgetMatch = matchesBudgetRange(
        p,
        budgetMin ? +budgetMin * 100000 : null,
        budgetMax ? +budgetMax * 100000 : null
      );
      const rawProp = String(p.propertyType || p.subcategory || p.category || '').toLowerCase();
      const cardTypeLower = String(cardType || '').toLowerCase();
      const typeMatch = !propertyType || (
        propertyType === 'Flat'
          ? (cardTypeLower.includes('flat') || cardTypeLower.includes('villa') || rawProp.includes('flat') || rawProp.includes('villa') || rawProp.includes('apartment'))
          : propertyType === 'Plot'
          ? (cardTypeLower.includes('site') || cardTypeLower.includes('plot') || rawProp.includes('plot') || rawProp.includes('layout') || rawProp.includes('plat'))
          : propertyType === 'Land'
          ? (rawProp.includes('land') && !rawProp.includes('agri'))
          : propertyType === 'Independent House'
          ? (rawProp.includes('house') || rawProp.includes('independent'))
          : propertyType === 'Agricultural'
          ? (rawProp.includes('agri') || rawProp.includes('farm'))
          : propertyType === 'Commercial'
          ? (rawProp.includes('commercial') || cardTypeLower.includes('commercial'))
          : propertyType === 'Industrial'
          ? (rawProp.includes('industrial') || cardTypeLower.includes('industrial'))
          : (rawProp.includes(propertyType.toLowerCase()) || cardTypeLower.includes(propertyType.toLowerCase()))
      );

      const cityMatch = !city || resolveCityId(p.city) === resolvedCityId;
      const locationMatch = !location ||
        String(p.zone || '').toLowerCase() === location.toLowerCase() ||
        String(p.location || '').toLowerCase().includes(location.toLowerCase()) ||
        String(p.area || '').toLowerCase().includes(location.toLowerCase()) ||
        String(p.locality || '').toLowerCase().includes(location.toLowerCase());

      const bedroomMatch = matchesBedroom(p.bhk, bedrooms);
      const allMatch = budgetMatch && typeMatch && cityMatch && locationMatch && bedroomMatch;

      if (p.status === 'closed' || p.availabilityStatus === 'sold_out') {
        if (allMatch) closed.push(p);
      } else if ((p.loanApproved || p.bankLoanDetails) && allMatch) {
        preApproved.push(p);
      } else if (allMatch) {
        matched.push(p);
      }
    });

    return { preApproved, matched, closed };
  }, [properties, budgetMin, budgetMax, propertyType, city, resolvedCityId, location, bedrooms]);

  const totalResults = buckets.preApproved.length + buckets.matched.length;

  const title =
    step === 1 ? 'Find Your Property' :
    step === 2 ? `${totalResults} Properties Found` :
    "You're All Set!";

  return (
    <QuickMatchModalShell title={title} onClose={handleClose}>
      {/* ═══ Step 1 — Browse first, optional filters ═══ */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Primary CTA — browse without filling any form */}
          <div className="rounded-xl bg-brand-blue/5 border border-brand-blue/15 p-4">
            <p className="text-sm font-bold text-brand-charcoal mb-1">
              <i className="fa-solid fa-building-user text-brand-blue mr-2" />
              {availableCount} Properties Available
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Browse all listings now, or use the optional filters below to narrow your search.
            </p>
            <button
              type="button"
              onClick={handleBrowseAll}
              className="w-full rounded-xl bg-brand-blue py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-arrow-right" />
              Browse All Properties
            </button>
          </div>

          {/* Optional filters toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-sliders text-brand-blue" />
              {showFilters ? 'Hide Filters' : 'Refine with Filters'}
              <span className="text-xs font-normal text-gray-400">(optional)</span>
            </span>
            <i className={`fa-solid fa-chevron-down text-xs transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Collapsible filter form */}
          {showFilters && (
            <div className="space-y-4 pt-1">
              <p className="text-xs text-gray-400 text-center">
                All fields below are optional — fill only what matters to you
              </p>

              {/* Budget Range */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">
                  Budget (₹ in Lakhs)
                  <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Min (e.g. 50)"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
                  />
                  <input
                    type="number"
                    placeholder="Max (e.g. 150)"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">
                  Property Type
                  <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((pt) => (
                    <label
                      key={pt}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm cursor-pointer transition-colors ${
                        propertyType === pt
                          ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="qmPropertyType"
                        checked={propertyType === pt}
                        onChange={() => setPropertyType(propertyType === pt ? '' : pt)}
                        className="sr-only"
                      />
                      {pt}
                    </label>
                  ))}
                </div>
              </div>

              {/* City */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">
                  City
                  <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => { setCity(e.target.value); setLocation(''); }}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue bg-white cursor-pointer"
                >
                  <option value="">Any City</option>
                  {CITY_OPTIONS.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Location — only appears after city is chosen */}
              {city && areas.length > 0 && (
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">
                    Area / Locality
                    <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue bg-white cursor-pointer"
                  >
                    <option value="">Any Area</option>
                    {areas.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Bedrooms */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">
                  Bedrooms
                  <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {BEDROOM_OPTIONS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBedrooms(bedrooms === b ? '' : b)}
                      className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
                        bedrooms === b
                          ? 'border-brand-blue bg-brand-blue/5 text-brand-blue'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {hasAnyFilter && (
                <button
                  type="button"
                  onClick={() => { setBudgetMin(''); setBudgetMax(''); setPropertyType(''); setCity(''); setLocation(''); setBedrooms(''); }}
                  className="text-xs text-red-500 font-semibold hover:underline cursor-pointer block"
                >
                  Clear All Filters
                </button>
              )}

              <button
                type="button"
                onClick={handleFindMatch}
                className="w-full rounded-xl bg-brand-blue py-3 text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-magnifying-glass" />
                Find Matching Properties
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ Step 2 — Results ═══ */}
      {step === 2 && (
        <div className="space-y-6">
          {totalResults === 0 && (
            <div className="text-center py-10 text-gray-400">
              <i className="fa-solid fa-building text-4xl mb-3" />
              <p className="text-lg font-medium">No matching properties found.</p>
              <p className="text-sm mt-1">Try adjusting your filters.</p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-4 text-sm text-brand-blue font-semibold hover:underline cursor-pointer"
              >
                ← Adjust Filters
              </button>
            </div>
          )}

          {/* Pre-Approved bucket */}
          {buckets.preApproved.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-3">
                <i className="fa-solid fa-circle-check" />
                Pre-Approved Loan ({buckets.preApproved.length})
              </h3>
              <div className="space-y-2">
                {buckets.preApproved.map((p) => {
                  const pId = p._id || p.id;
                  return (
                    <div key={pId} className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-brand-charcoal truncate">{p.title || p.name}</p>
                        <p className="text-xs text-gray-500 truncate">{p.location || p.city || 'Bangalore'}</p>
                        <p className="text-xs font-semibold text-emerald-700 mt-0.5">{p.price || 'Price on Request'}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { onClose(); navigateTo(`/property/${pId}`); }}
                        className="ml-3 shrink-0 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available bucket */}
          {buckets.matched.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-brand-charcoal mb-3">
                <i className="fa-solid fa-house" />
                Available Properties ({buckets.matched.length})
              </h3>
              <div className="space-y-2">
                {buckets.matched.slice(0, 8).map((p) => {
                  const pId = p._id || p.id;
                  return (
                    <div key={pId} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-brand-charcoal truncate">{p.title || p.name}</p>
                        <p className="text-xs text-gray-500 truncate">{p.location || p.city || 'Bangalore'}</p>
                        <p className="text-xs font-semibold text-emerald-700 mt-0.5">{p.price || 'Price on Request'}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { onClose(); navigateTo(`/property/${pId}`); }}
                        className="ml-3 shrink-0 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  );
                })}
                {buckets.matched.length > 8 && (
                  <p className="text-xs text-center text-gray-400 pt-1">
                    +{buckets.matched.length - 8} more — browse all below
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              ← Adjust Filters
            </button>
            <button
              type="button"
              onClick={handleBrowseAll}
              className="flex-1 rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Browse All
            </button>
          </div>
        </div>
      )}

      {/* ═══ Step 3 — Success CTA ═══ */}
      {step === 3 && (
        <div className="text-center py-6 space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <i className="fa-solid fa-check text-2xl text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-brand-charcoal">Properties Matched!</p>
            <p className="mt-1 text-sm text-gray-500">
              {buckets.preApproved.length} pre-approved · {buckets.matched.length} available
            </p>
          </div>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => { onClose(); navigateTo('/contact-us/'); }}
              className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Contact Agent
            </button>
            <button
              type="button"
              onClick={handleBrowseAll}
              className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Browse All Listings
            </button>
          </div>
        </div>
      )}
    </QuickMatchModalShell>
  );
}

export default QuickMatchModal;
