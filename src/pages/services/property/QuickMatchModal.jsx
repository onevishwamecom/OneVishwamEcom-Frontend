import { useState, useMemo } from 'react';
import { navigateTo } from '../../../config/navigation';
import { useProperties } from '../../../hooks/useProperties';
import { cities } from '../../../data/locations';
import { getNumericPrice } from '../GalleryComponents';
import { withRupeeSymbol } from '../../../utils/priceUtils';

function getCardType(property) {
  const s = property.subtitle.toLowerCase();
  const b = property.bhk.toLowerCase();
  if (s.includes('villa') || s.includes('farmhouse')) return 'Villa';
  if (b.includes('office') || b.includes('shop') || b.includes('commercial') ||
      s.includes('office') || s.includes('shop') || s.includes('commercial')) return 'Flat';
  if (s.includes('plot') || s.includes('site') || s.includes('land')) return 'Sites';
  if (s.includes('flat') || s.includes('apartment') || s.includes('penthouse') || b.includes('bhk')) return 'Flat';
  if (s.includes('house')) return 'Independent House';
  return 'Flat';
}

function getBedroomNumber(bhk) {
  const m = bhk?.match(/(\d+(\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

function matchesBedroom(bhk, selected) {
  if (!selected) return true;
  if (selected === '4BHK+') return getBedroomNumber(bhk) >= 4;
  const num = getBedroomNumber(bhk);
  const selNum = getBedroomNumber(selected);
  return num === selNum;
}

const CITY_OPTIONS = [
  { id: 'bengaluru', label: 'Bangalore' },
];

const PROPERTY_TYPES = ['Sites', 'Flat', 'Villa', 'Independent House'];

const BEDROOM_OPTIONS = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', '4BHK+'];

/* ── Component ── */

function QuickMatchModal({ onClose }) {
  const { properties } = useProperties();
  const [step, setStep] = useState(1);

  /* Step 1 state */
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const areas = city ? (cities[city]?.areas || []) : [];

  const handleFindMatch = () => setStep(2);

  const handleClose = () => {
    if (step === 3) { onClose(); return; }
    if (step === 2) { setStep(3); return; }
    onClose();
  };

  /* ── Step 2: Compute buckets ── */

  const buckets = useMemo(() => {
    const preApproved = [];
    const shortlisted = [];
    const closed = [];

    properties.forEach((p) => {
      const price = getNumericPrice(p.price);
      const cardType = getCardType(p);

      const budgetMatch = (!budgetMin || price >= +budgetMin * 100000) &&
        (!budgetMax || price <= +budgetMax * 100000);
      const typeMatch = !propertyType || cardType === propertyType;
      const cityMatch = !city || p.city === city;
      const locationMatch = !location || p.zone === location;
      const bedroomMatch = matchesBedroom(p.bhk, bedrooms);

      if (p.status === 'closed') {
        closed.push(p);
      } else if (p.loanApproved && budgetMatch && typeMatch && cityMatch && locationMatch && bedroomMatch) {
        preApproved.push(p);
      } else if (typeMatch || locationMatch) {
        shortlisted.push(p);
      }
    });

    return { preApproved, shortlisted, closed };
  }, [properties, budgetMin, budgetMax, propertyType, city, location, bedrooms]);

  const hasAnyResults = buckets.preApproved.length > 0 || buckets.shortlisted.length > 0 || buckets.closed.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-brand-charcoal">
            {step === 1 && 'Find My Property'}
            {step === 2 && 'Matching Properties'}
            {step === 3 && "You're All Set!"}
          </h2>
          <button onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <i className="fa-solid fa-xmark text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* ═══ Step 1 — Requirement Form ═══ */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Budget */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Budget Range (₹ in Lakhs)</label>
                <div className="flex gap-3">
                  <input type="number" placeholder="Min" value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue" />
                  <input type="number" placeholder="Max" value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue" />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((pt) => (
                    <label key={pt} className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                      propertyType === pt
                        ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                      <input type="radio" name="qmPropertyType" checked={propertyType === pt}
                        onChange={() => setPropertyType(pt)}
                        className="sr-only" />
                      {pt}
                    </label>
                  ))}
                </div>
              </div>

              {/* City */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">City</label>
                <select value={city} onChange={(e) => { setCity(e.target.value); setLocation(''); }}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue bg-white">
                  <option value="">Select City</option>
                  {CITY_OPTIONS.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Location</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)}
                  disabled={!city}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue bg-white disabled:bg-gray-50 disabled:text-gray-300">
                  <option value="">{city ? 'Select Area' : 'Select city first'}</option>
                  {areas.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Bedrooms</label>
                <div className="flex flex-wrap gap-2">
                  {BEDROOM_OPTIONS.map((b) => (
                    <button key={b} onClick={() => setBedrooms(bedrooms === b ? '' : b)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                        bedrooms === b
                          ? 'border-brand-blue bg-brand-blue/5 text-brand-blue'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleFindMatch}
                className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                Find Match
              </button>
            </div>
          )}

          {/* ═══ Step 2 — Results ═══ */}
          {step === 2 && (
            <div className="space-y-6">
              {!hasAnyResults && (
                <div className="text-center py-10 text-gray-400">
                  <i className="fa-solid fa-building text-4xl mb-3" />
                  <p className="text-lg font-medium">No matching properties found.</p>
                  <p className="text-sm mt-1">Try adjusting your criteria.</p>
                </div>
              )}

              {/* Bucket A — Pre-Approved */}
              {buckets.preApproved.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-3">
                    <i className="fa-solid fa-circle-check" />
                    Pre-Approved ({buckets.preApproved.length})
                  </h3>
                  <div className="space-y-2">
                    {buckets.preApproved.map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-brand-charcoal truncate">{p.title}</p>
                          <p className="text-xs text-gray-500">{p.location}</p>
                          <p className="text-xs font-bold text-brand-blue mt-0.5">{withRupeeSymbol(p.price)}</p>
                        </div>
                        <button onClick={() => navigateTo(`/property/${p.id}`)}
                          className="ml-3 shrink-0 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bucket B — Shortlisted */}
              {buckets.shortlisted.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-amber-700 mb-3">
                    <i className="fa-solid fa-clock" />
                    Shortlisted ({buckets.shortlisted.length})
                  </h3>
                  <div className="space-y-2">
                    {buckets.shortlisted.map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-brand-charcoal truncate">{p.title}</p>
                          <p className="text-xs text-gray-500">{p.location}</p>
                          <p className="text-xs font-bold text-brand-blue mt-0.5">{withRupeeSymbol(p.price)}</p>
                        </div>
                        <button onClick={() => navigateTo(`/property/${p.id}`)}
                          className="ml-3 shrink-0 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bucket C — Closed */}
              {buckets.closed.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-red-700 mb-3">
                    <i className="fa-solid fa-circle-xmark" />
                    Closed / Unavailable ({buckets.closed.length})
                  </h3>
                  <div className="space-y-2">
                    {buckets.closed.map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50/50 p-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-brand-charcoal truncate">{p.title}</p>
                          <p className="text-xs text-gray-500">{p.location}</p>
                          <p className="text-xs font-bold text-brand-blue mt-0.5">{withRupeeSymbol(p.price)}</p>
                          <span className="mt-1 inline-block rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">Closed</span>
                        </div>
                        <button onClick={() => navigateTo(`/property/${p.id}`)}
                          className="ml-3 shrink-0 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => setStep(3)}
                className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                Continue
              </button>
            </div>
          )}

          {/* ═══ Step 3 — CTA ═══ */}
          {step === 3 && (
            <div className="text-center py-6 space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <i className="fa-solid fa-check text-2xl text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-brand-charcoal">Properties Matched!</p>
                <p className="mt-1 text-sm text-gray-500">
                  {buckets.preApproved.length} pre-approved, {buckets.shortlisted.length} shortlisted
                </p>
              </div>
              <div className="space-y-3">
                <button onClick={() => navigateTo('/contact-us/')}
                  className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                  Contact Agent for Pre-Approved Properties
                </button>
                <button onClick={onClose}
                  className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Browse All Listings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuickMatchModal;
