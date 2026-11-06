import { useState, useMemo, useEffect } from 'react';
import { navigateTo } from '../../../config/navigation';
import { vehicleAPI } from '../../../api';
import { withRupeeSymbol } from '../../../utils/priceUtils';
import { QuickMatchModalShell, getNumericPrice } from '../shared';
import { signalHomepageRefresh } from '../../../utils/matchEvents';
import { cities, CITY_OPTIONS, resolveCityId } from '../../../constants/locations';
import { useVehicles } from './automobileHooks';

const VEHICLE_TYPES = ['2-wheeler', '3-wheeler', '4-wheeler', 'commercial'];
const CONDITION_OPTIONS = ['New', 'Old'];

export default function VehicleQuickMatchModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [condition, setCondition] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [allVehicles, setAllVehicles] = useState([]);

  const { items: hookVehicles = [] } = useVehicles();

  useEffect(() => {
    if (hookVehicles && hookVehicles.length > 0) {
      setAllVehicles(hookVehicles);
      return;
    }
    let cancelled = false;
    vehicleAPI.getAll({ limit: 100 })
      .then((res) => {
        if (!cancelled) {
          const list = res?.data?.data?.items || res?.data?.items || [];
          setAllVehicles(list);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [hookVehicles]);

  const resolvedCityId = city ? resolveCityId(city) : '';
  const areas = resolvedCityId ? (cities[resolvedCityId]?.areas || []) : [];

  const handleFindMatch = () => {
    signalHomepageRefresh();
    setStep(2);
  };

  const handleClose = () => {
    if (step === 3) { onClose(); return; }
    if (step === 2) { setStep(3); return; }
    onClose();
  };

  const buckets = useMemo(() => {
    const preApproved = [];
    const shortlisted = [];
    const closed = [];

    (allVehicles || []).forEach((v) => {
      if (!v) return;
      const price = getNumericPrice(v.price || v.numericPrice || 0);
      const budgetMatch = (!budgetMin || price >= +budgetMin * 100000) &&
        (!budgetMax || price <= +budgetMax * 100000);
      const typeMatch = !vehicleType || String(v.category || v.wheelerType || '').toLowerCase() === vehicleType.toLowerCase();
      const conditionMatch = !condition || String(v.condition || '').toLowerCase() === condition.toLowerCase();
      const cityMatch = !city || resolveCityId(v.city) === resolvedCityId;
      const locationMatch = !location || String(v.location || '').toLowerCase().includes(location.toLowerCase());

      if (v.status === 'closed' || v.availabilityStatus === 'sold_out') {
        closed.push(v);
      } else if (v.loanApproved && budgetMatch && typeMatch && conditionMatch && cityMatch && locationMatch) {
        preApproved.push(v);
      } else if (typeMatch || conditionMatch || budgetMatch) {
        shortlisted.push(v);
      }
    });

    return { preApproved, shortlisted, closed };
  }, [allVehicles, budgetMin, budgetMax, vehicleType, condition, city, resolvedCityId, location]);

  const hasAnyResults = buckets.preApproved.length > 0 || buckets.shortlisted.length > 0 || buckets.closed.length > 0;

  const title = step === 1 ? 'Find My Vehicle' : step === 2 ? 'Matching Vehicles' : "You're All Set!";

  return (
    <QuickMatchModalShell title={title} onClose={handleClose}>
      {step === 1 && (
        <div className="space-y-5">
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

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Vehicle Type</label>
            <div className="flex flex-wrap gap-2">
              {VEHICLE_TYPES.map((vt) => (
                <label key={vt} className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                  vehicleType === vt
                    ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                  <input type="radio" name="qmVehicleType" checked={vehicleType === vt}
                    onChange={() => setVehicleType(vt)}
                    className="sr-only" />
                  {vt}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Condition</label>
            <div className="flex gap-3">
              {CONDITION_OPTIONS.map((c) => (
                <label key={c} className={`flex-1 flex items-center justify-center rounded-xl border py-2.5 text-sm cursor-pointer transition-colors ${
                  condition === c
                    ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                  <input type="radio" name="qmCondition" checked={condition === c}
                    onChange={() => setCondition(c)}
                    className="sr-only" />
                  {c}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">City</label>
            <select value={city} onChange={(e) => { setCity(e.target.value); setLocation(''); }}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue bg-white cursor-pointer">
              <option value="">Select City</option>
              {CITY_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Area <span className="text-gray-400 font-normal">(optional)</span></label>
            <select value={location} onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue bg-white disabled:opacity-50 cursor-pointer"
              disabled={!city}>
              <option value="">{city ? 'Select Area' : 'Select city first'}</option>
              {areas.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleFindMatch}
            className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Find Match
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {!hasAnyResults && (
            <div className="text-center py-10 text-gray-400">
              <i className="fa-solid fa-car text-4xl mb-3" />
              <p className="text-lg font-medium">No matching vehicles found.</p>
              <p className="text-sm mt-1">Try adjusting your criteria.</p>
            </div>
          )}

          {buckets.preApproved.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-3">
                <i className="fa-solid fa-circle-check" />
                Pre-Approved ({buckets.preApproved.length})
              </h3>
              <div className="space-y-2">
                {buckets.preApproved.map((v) => {
                  const vId = v._id || v.id;
                  return (
                    <div key={vId} className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-brand-charcoal truncate">{v.brand} {v.model}</p>
                        <p className="text-xs text-gray-500">{v.location || v.city}</p>
                        <p className="text-xs font-semibold text-emerald-700 mt-0.5">{v.price || 'Price on Request'}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { onClose(); navigateTo(`/automobile/${vId}`); }}
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

          {buckets.shortlisted.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-amber-700 mb-3">
                <i className="fa-solid fa-clock" />
                Shortlisted ({buckets.shortlisted.length})
              </h3>
              <div className="space-y-2">
                {buckets.shortlisted.map((v) => {
                  const vId = v._id || v.id;
                  return (
                    <div key={vId} className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-brand-charcoal truncate">{v.brand} {v.model}</p>
                        <p className="text-xs text-gray-500">{v.location || v.city}</p>
                        <p className="text-xs font-semibold text-emerald-700 mt-0.5">{v.price || 'Price on Request'}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { onClose(); navigateTo(`/automobile/${vId}`); }}
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

          <button
            type="button"
            onClick={() => setStep(3)}
            className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Continue
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-6 space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <i className="fa-solid fa-check text-2xl text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-brand-charcoal">Vehicles Matched!</p>
            <p className="mt-1 text-sm text-gray-500">
              {buckets.preApproved.length} pre-approved, {buckets.shortlisted.length} shortlisted
            </p>
          </div>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => { onClose(); navigateTo('/contact-us/'); }}
              className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Contact Agent for Pre-Approved Vehicles
            </button>
            <button
              type="button"
              onClick={onClose}
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
