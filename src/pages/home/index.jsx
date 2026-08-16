import { useState, useEffect } from 'react';
import { navigateTo } from '../../config/navigation';
import { useLocation } from '../../store/locationSlice';
import { getCityLabel } from '../../data/locations';
import { dummyAutomobiles } from '../../data/dummyAutomobiles';
import { useProperties } from '../../hooks/useProperties';
import { financeAPI } from '../../api';
import cache, { PUBLIC_NAMESPACE, CACHE_TTL } from '../../services/cache/cacheService';
import { formatFinanceAmount } from '../services/finance/financeConstants';
import ProductCard from '../services/ProductCard';
import HeroSection from './HeroSection';

const FINANCE_ALL_KEY = 'finance:all';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedCity, selectedArea } = useLocation();
  const { properties: dummyProperties } = useProperties();
  const [financeServices, setFinanceServices] = useState(
    () => cache.get(PUBLIC_NAMESPACE, FINANCE_ALL_KEY)?.data ?? [],
  );

  useEffect(() => {
    let cancelled = false;
    // Same key as FinanceGallery → requests are de-duplicated.
    cache
      .fetch(
        PUBLIC_NAMESPACE,
        FINANCE_ALL_KEY,
        () =>
          financeAPI.getAll({ limit: 100 }).then((res) => {
            const raw = res.data?.data?.items || res.data?.items || [];
            return raw.map((s) => ({ ...s, id: s._id || s.id }));
          }),
        { ttl: CACHE_TTL.products },
      )
      .then(({ data }) => {
        if (!cancelled) setFinanceServices(data);
      })
      .catch((err) => { console.error('Home finance fetch error:', err); });
    return () => { cancelled = true; };
  }, []);

  const locationLabel = selectedArea
    ? `${selectedArea}, ${getCityLabel(selectedCity)}`
    : selectedCity
    ? getCityLabel(selectedCity)
    : 'Your Area';

  // Helper to filter items by city/area
  const matchesLocation = (itemLocation) => {
    if (!selectedCity) return true;
    const locStr = String(itemLocation || '').toLowerCase();
    const cityStr = getCityLabel(selectedCity).toLowerCase();
    const areaStr = String(selectedArea || '').toLowerCase();
    return (
      locStr.includes(cityStr) ||
      (areaStr && locStr.includes(areaStr)) ||
      locStr.includes(selectedCity.toLowerCase())
    );
  };

  // Location-filtered arrays with fallback
  const propertiesInLocation = dummyProperties.filter((p) => matchesLocation(p.location));
  const displayProperties = propertiesInLocation.length > 0 ? propertiesInLocation : dummyProperties;

  const vehiclesInLocation = dummyAutomobiles.filter((v) => matchesLocation(v.location));
  const displayVehicles = vehiclesInLocation.length > 0 ? vehiclesInLocation : dummyAutomobiles;

  const financeInLocation = financeServices.filter((s) => matchesLocation(s.location));
  const displayFinance = financeInLocation.length > 0 ? financeInLocation : financeServices;

  return (
    <div>
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="bg-gray-50/60 pb-16 sm:pb-20 space-y-12 pt-8">

        {/* ── Module 1: Featured Properties ── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-blue flex items-center gap-1.5">
                <i className="fa-solid fa-house-chimney" /> Real Estate
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-brand-charcoal sm:text-3xl">
                Properties Available in {locationLabel}
              </h2>
              <p className="mt-1 text-sm text-gray-600 font-medium">
                Houses, plots, apartments and rentals listed near you.
              </p>
            </div>
            <button
              onClick={() => navigateTo('/our-services/real-estate-property')}
              className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shrink-0 shadow-sm"
            >
              Explore All Homes <i className="fa-solid fa-arrow-right text-[10px]" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displayProperties.slice(0, 4).map((p) => (
              <ProductCard
                key={p.id}
                link={`/property/${p.id}`}
                image={p.images[0]}
                alt={p.title}
                title={p.title}
                price={p.price}
                priceSuffix={p.priceSuffix}
                location={p.location}
                tags={[p.bhk || '', p.furnishing].filter(Boolean)}
                badges={[
                  ...(p.recentlyAdded ? [{ label: 'New', className: 'bg-emerald-600 text-white' }] : []),
                  ...(p.loanApproved ? [{ label: 'Loan OK', className: 'bg-brand-blue text-white' }] : []),
                ]}
              />
            ))}
          </div>
        </section>

        {/* ── Module 2: Vehicles Corner ── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-blue flex items-center gap-1.5">
                <i className="fa-solid fa-car" /> Automobiles
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-brand-charcoal sm:text-3xl">
                Vehicles Available in {locationLabel}
              </h2>
              <p className="mt-1 text-sm text-gray-600 font-medium">
                Cars, bikes, and commercial vehicles available nearby.
              </p>
            </div>
            <button
              onClick={() => navigateTo('/our-services/automobile')}
              className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shrink-0 shadow-sm"
            >
              See All Vehicles <i className="fa-solid fa-arrow-right text-[10px]" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displayVehicles.slice(0, 4).map((v) => (
              <ProductCard
                key={v.id}
                link={`/vehicle/${v.id}`}
                image={v.images[0]}
                alt={`${v.brand} ${v.model}`}
                title={`${v.brand} ${v.model}`}
                price={v.price}
                location={v.location}
                tags={[v.fuelType, `${v.year}`]}
                badges={[
                  ...(v.loanApproved ? [{ label: 'Loan OK', className: 'bg-brand-blue text-white' }] : []),
                  ...(v.condition === 'new' ? [{ label: 'New', className: 'bg-emerald-600 text-white' }] : []),
                  ...(v.condition === 'old' ? [{ label: 'Used', className: 'bg-amber-600 text-white' }] : []),
                ]}
              />
            ))}
          </div>
        </section>

        {/* ── Module 3: Finance & Loans ── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-blue flex items-center gap-1.5">
                <i className="fa-solid fa-building-columns" /> Finance
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-brand-charcoal sm:text-3xl">
                Loans & Finance Options in {locationLabel}
              </h2>
              <p className="mt-1 text-sm text-gray-600 font-medium">
                Find financial services, loans, insurance, and investments near you.
              </p>
            </div>
            <button
              onClick={() => navigateTo('/our-services/finance-lending')}
              className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shrink-0 shadow-sm"
            >
              Show All Loans <i className="fa-solid fa-arrow-right text-[10px]" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displayFinance.slice(0, 4).map((s) => (
              <ProductCard
                key={s.id}
                link={`/finance-service/${s.id}`}
                image={s.banner}
                alt={s.serviceName}
                title={s.serviceName}
                overline={s.companyName}
                price={s.interestRate !== 'N/A' && s.interestRate !== 'Varies' ? s.interestRate : undefined}
                priceSuffix=""
                priceOverride={s.interestRate !== 'N/A' && s.interestRate !== 'Varies' ? undefined : (
                  <p className="mt-0.5 text-sm font-bold text-brand-blue">{formatFinanceAmount(s.minAmount)} – {formatFinanceAmount(s.maxAmount)}</p>
                )}
                location={s.location}
                tags={[s.category, s.providerType].filter(Boolean)}
                badges={[
                  ...(s.featured ? [{ label: 'Featured', className: 'bg-amber-500 text-white' }] : []),
                  ...(s.availability === 'Available Now' ? [{ label: 'Available', className: 'bg-emerald-600 text-white' }] : []),
                ]}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default Home;
