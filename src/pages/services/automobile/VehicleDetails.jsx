import { useEffect, useState } from 'react';
import { navigateTo } from '../../../config/navigation';
import { vehicleAPI } from '../../../api';
import cache, { PUBLIC_NAMESPACE, CACHE_TTL } from '../../../services/cache/cacheService';
import ProductCard from '../ProductCard';

function VehicleDetails({ location }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedVehicles, setRelatedVehicles] = useState([]);
  const [error, setError] = useState(null);

  const pathParts = location?.pathname?.split('/').filter(Boolean) || [];
  const vehicleId = pathParts.length > 1 ? pathParts[1] : null;

  const itemKey = `vehicle:item:${vehicleId}`;
  const similarKey = `vehicle:similar:${vehicleId}`;

  const [vehicle, setVehicle] = useState(() => {
    if (!vehicleId) return null;
    return cache.get(PUBLIC_NAMESPACE, itemKey)?.data ?? null;
  });
  const [loading, setLoading] = useState(() => (vehicleId ? !cache.get(PUBLIC_NAMESPACE, itemKey) : false));

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!vehicleId) { setLoading(false); setError('Invalid vehicle ID'); return; }

    let cancelled = false;
    setError(null);
    const cached = cache.get(PUBLIC_NAMESPACE, itemKey);
    setLoading(!cached);
    if (cached) setVehicle(cached.data);

    cache
      .fetch(
        PUBLIC_NAMESPACE,
        itemKey,
        () => vehicleAPI.getById(vehicleId).then((res) => {
          const item = res.data?.data?.item;
          return item ? { ...item, id: item._id } : null;
        }),
        { ttl: CACHE_TTL.detail },
      )
      .then(({ data: item }) => {
        if (cancelled) return;
        setVehicle(item);
        if (item) {
          return cache
            .fetch(
              PUBLIC_NAMESPACE,
              similarKey,
              () => vehicleAPI.getSimilar(item._id).then((simRes) => {
                const items = simRes.data?.data?.items || [];
                return items.map((v) => ({ ...v, id: v._id }));
              }),
              { ttl: CACHE_TTL.similar },
            )
            .then(({ data: items }) => {
              if (!cancelled) setRelatedVehicles(items);
            });
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Vehicle not found');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [vehicleId, itemKey, similarKey]);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-400">Loading vehicle details...</p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="py-32 text-center">
        <i className="fa-solid fa-circle-exclamation text-3xl text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-400">{error || 'Vehicle not found'}</h1>
        <a href="/our-services/automobile" className="mt-4 inline-block text-brand-blue font-semibold">&larr; Back to Vehicles</a>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-8 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigateTo('/our-services/automobile')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline">
          <i className="fa-solid fa-arrow-left" /> Back to Vehicles
        </button>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Images */}
          <div className="lg:col-span-3 space-y-3">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
              <img src={vehicle.images[currentImageIndex]} alt={`${vehicle.brand} ${vehicle.model}`}
                className="h-full w-full object-cover" />
            </div>
            {vehicle.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {vehicle.images.map((img, idx) => (
                  <button key={idx} onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      idx === currentImageIndex ? 'border-brand-blue' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`rounded-lg px-2.5 py-0.5 text-[11px] font-bold ${
                  vehicle.condition === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {vehicle.condition === 'new' ? 'New' : 'Pre-Owned'}
                </span>
                {vehicle.loanApproved && (
                  <span className="rounded-lg bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                    Pre-Approved Loan
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-brand-charcoal">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                <i className="fa-solid fa-location-dot text-brand-blue" />
                {vehicle.location}{vehicle.pincode ? ` — ${vehicle.pincode}` : ''}
              </p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-brand-charcoal">{vehicle.price}</span>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Fuel Type</p>
                <p className="text-sm font-bold text-brand-charcoal mt-0.5">{vehicle.fuelType}</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Year</p>
                <p className="text-sm font-bold text-brand-charcoal mt-0.5">{vehicle.year}</p>
              </div>
              {vehicle.condition === 'old' && vehicle.kmDriven > 0 && (
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">KM Driven</p>
                  <p className="text-sm font-bold text-brand-charcoal mt-0.5">{vehicle.kmDriven.toLocaleString()} km</p>
                </div>
              )}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Category</p>
                <p className="text-sm font-bold text-brand-charcoal mt-0.5 capitalize">{vehicle.category}</p>
              </div>
            </div>

            {/* Showroom */}
            {vehicle.showroom && (
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">Showroom</p>
                <p className="text-sm font-bold text-brand-charcoal">{vehicle.showroom.name}</p>
                <p className="mt-1 text-xs text-gray-500">{vehicle.showroom.address}</p>
                <div className="mt-3 flex gap-2">
                  <a href={vehicle.showroom.mapsLink} target="_blank" rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    <i className="fa-solid fa-map-location-dot text-brand-blue" /> View on Map
                  </a>
                  <a href={`tel:${vehicle.showroom.phone}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-blue px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors">
                    <i className="fa-solid fa-phone" /> Call
                  </a>
                </div>
              </div>
            )}

            {/* Loan CTA */}
            {vehicle.loanApproved && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-circle-check text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-800">Pre-Approved Loan Available</span>
                </div>
                <p className="text-xs text-emerald-600 mb-3">Get instant loan approval for this vehicle.</p>
                <a href="/finance/vehicle-loan"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors">
                  ⚡ Apply for Loan
                </a>
              </div>
            )}

            {/* Contact */}
            <div className="rounded-xl bg-brand-navy text-white p-5">
              <h3 className="text-base font-bold">Interested?</h3>
              <p className="mt-1 text-xs text-gray-400">Contact our team for a test drive or more details.</p>
              <a href="/contact-us/"
                className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                <i className="fa-solid fa-headset" /> Contact Agent
              </a>
            </div>
          </div>
        </div>

        {/* Related Vehicles */}
        {relatedVehicles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-brand-charcoal mb-6">More {vehicle.category}s</h2>
            <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
              {relatedVehicles.map((v) => (
                <ProductCard
                  key={v.id}
                  link={`/vehicle/${v.id}`}
                  image={v.images[0]}
                  alt={`${v.brand} ${v.model}`}
                  title={`${v.brand} ${v.model}`}
                  price={v.price}
                  location={v.location}
                  pincode={v.pincode}
                  tags={[v.fuelType, v.year]}
                  badges={[
                    ...(v.loanApproved ? [{ label: 'Pre-Approved', className: 'bg-emerald-100 text-emerald-700' }] : []),
                    ...(v.condition === 'new' ? [{ label: 'New', className: 'bg-blue-100 text-blue-700' }] : []),
                  ]}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VehicleDetails;