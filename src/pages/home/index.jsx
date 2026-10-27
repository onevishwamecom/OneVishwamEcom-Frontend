import { useMemo, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from '../../store/locationSlice';
import { getCityLabel } from '../../constants/locations';
import { useHomepageData } from '../../hooks/useHomepageData';
import { useProperties } from '../../hooks/useProperties';
import BrandLoader from '../../components/ui/BrandLoader';
import { formatFinanceAmount } from '../services/finance/financeConstants';
import { hasPropertyImages, getPropertyCoverImage, getDetailTags, sortPropertiesWithPriority, getPriorityScore, formatPropertyAddress } from '../services/property/propertyHelpers';
import ProductCard from '../services/ProductCard';
import { withRupeeSymbol } from '../../utils/priceUtils';
import HeroSection from './HeroSection';
import BangalorePropertyPieMap from '../services/property/components/BangalorePropertyPieMap';
import { PROPERTIES_ONLY } from '../../config/appConfig';
import { heroImage } from '../../utils/imageOptimizer';

const FOOD_CATEGORIES = ['Fruits & Vegetables', 'Grains & Pulses', 'Dairy', 'Beverages', 'Packaged Foods', 'Spices'];

const BTN_PRIMARY = 'inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors';
const BTN_SECONDARY = 'inline-flex items-center justify-center gap-1.5 rounded-xl border border-brand-blue px-6 py-2.5 text-xs font-semibold text-brand-blue hover:bg-brand-blue hover:text-white transition-colors';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeZone, setActiveZone] = useState('All');
  const navigate = useNavigate();
  const { selectedCity } = useLocation();
  const { data, loading } = useHomepageData();

  const filterAvailable = useCallback(
    (arr) => (arr || []).filter((item) => item.status !== 'sold_out'),
    []
  );

  const { properties: allProperties } = useProperties();
  const rawProperties = useMemo(() => {
    const list = [...(allProperties || [])];
    const existingIds = new Set(list.map((p) => String(p.id || p._id)));
    (data?.latestProperties || []).forEach((p) => {
      const pid = String(p?.id || p?._id || '');
      if (pid && !existingIds.has(pid)) {
        list.unshift(p);
        existingIds.add(pid);
      }
    });
    return filterAvailable(list.length > 0 ? list : (data?.latestProperties || []));
  }, [allProperties, data?.latestProperties, filterAvailable]);
  const latestProperties = useMemo(() => sortPropertiesWithPriority(rawProperties), [rawProperties]);
  const mapProperties = useMemo(() => {
    return (allProperties && allProperties.length > 0) ? allProperties : latestProperties;
  }, [allProperties, latestProperties]);
  const latestVehicles = useMemo(() => filterAvailable(data?.latestVehicles), [data?.latestVehicles, filterAvailable]);
  const latestGroceries = useMemo(() => filterAvailable(data?.latestGroceries), [data?.latestGroceries, filterAvailable]);
  const latestGarments = useMemo(() => filterAvailable(data?.latestGarments), [data?.latestGarments, filterAvailable]);
  const latestJewellery = useMemo(() => filterAvailable(data?.latestJewellery), [data?.latestJewellery, filterAvailable]);
  const latestFinance = useMemo(() => filterAvailable(data?.latestFinance), [data?.latestFinance, filterAvailable]);
  const financeOfferings = useMemo(() => filterAvailable(data?.financeOfferings), [data?.financeOfferings, filterAvailable]);
  const stats = data?.stats || {};
  const featured = useMemo(
    () => filterAvailable(data?.featured || data?.featuredProperties),
    [data?.featured, data?.featuredProperties, filterAvailable]
  );

  const foodGrocery = useMemo(() => 
    latestGroceries.filter((g) => FOOD_CATEGORIES.includes(g.category)),
    [latestGroceries]
  );
  
  const heroProp = featured[0] || latestProperties[0] || null;
  const locationName = selectedCity ? getCityLabel(selectedCity) : 'Your Area';

  /* ── Property helpers: images-first priority, best cover image ── */
  const sortPropertiesImagesFirst = useCallback((list) =>
    [...list].sort((a, b) => {
      const aScore = getPriorityScore(a);
      const bScore = getPriorityScore(b);
      if (aScore !== bScore) return bScore - aScore;

      const aImg = hasPropertyImages(a) ? 1 : 0;
      const bImg = hasPropertyImages(b) ? 1 : 0;
      if (aImg !== bImg) return bImg - aImg;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }), []);

  const todayListed = useMemo(
    () => sortPropertiesImagesFirst(latestProperties).slice(0, 3),
    [latestProperties, sortPropertiesImagesFirst],
  );
  const availableNearYou = useMemo(
    () => sortPropertiesImagesFirst(latestProperties).slice(0, 6),
    [latestProperties, sortPropertiesImagesFirst],
  );
  const dreamHomes = useMemo(() => {
    let combined = featured.length > 0 ? [...featured] : [];
    if (combined.length < 5 && latestProperties.length > 0) {
      const existingIds = new Set(combined.map((p) => p.id || p._id));
      for (const prop of latestProperties) {
        if (!existingIds.has(prop.id || prop._id)) {
          combined.push(prop);
          if (combined.length >= 5) break;
        }
      }
    }
    return sortPropertiesImagesFirst(combined).slice(0, 5);
  }, [featured, latestProperties, sortPropertiesImagesFirst]);

  const propertyResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const matched = latestProperties.filter((p) =>
      [p.title, p.subtitle, p.location, p.bhk, p.area]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q)),
    );
    return sortPropertiesImagesFirst(matched).slice(0, 6);
  }, [searchQuery, latestProperties, sortPropertiesImagesFirst]);

  if (loading && !data) {
    return <BrandLoader />;
  }

  return (
    <div>
      <HeroSection />

      {searchQuery && (
        <section className="border-b bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <p className="text-sm text-gray-600">
                {propertyResults.length} propert{propertyResults.length === 1 ? 'y' : 'ies'} found for "<strong>{searchQuery}</strong>"
              </p>
              {propertyResults.length > 0 && (
                <Link to={`/property?q=${encodeURIComponent(searchQuery)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:underline">
                  View All Results <i className="fa-solid fa-arrow-right text-[10px]" />
                </Link>
              )}
            </div>
            {propertyResults.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1 lg:grid lg:gap-4 lg:snap-none lg:overflow-visible lg:grid-cols-3 xl:grid-cols-6 touch-pan-y">
                {propertyResults.map((p) => (
                  <div key={p.id || p._id} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                    <ProductCard
                      link={`/property/${p.id || p._id}`}
                      image={getPropertyCoverImage(p)}
                      alt={p.title}
                      title={p.title}
                      hidePrice={true}
                      location={formatPropertyAddress(p)}
                      tags={[p.bhk || '', p.area || ''].filter(Boolean)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                No properties match "<strong>{searchQuery}</strong>". Try a different search.
              </p>
            )}
          </div>
        </section>
      )}

      <div className="bg-slate-50/70 pb-16 sm:pb-24">

        {/* ── Module 1: Discover Our Featured Listings (Homez style) ── */}
        <section className="pt-12 sm:pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-extrabold uppercase tracking-wider mb-2.5">
                  <i className="fa-solid fa-house-chimney text-xs" /> {stats.totalProperties || latestProperties.length}+ Available
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  Discover Our Featured Listings
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
                  Handpicked verified residential plots, apartments, villas and commercial spaces.
                </p>
              </div>
              <Link
                to="/our-services/properties"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-blue border-b-2 border-slate-900 hover:border-brand-blue pb-0.5 transition-all shrink-0 self-start sm:self-auto"
              >
                <span>See All Properties</span>
                <i className="fa-solid fa-arrow-right text-xs" />
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 lg:grid lg:gap-5 lg:snap-none lg:overflow-visible lg:grid-cols-3 xl:grid-cols-5 touch-pan-y">
              {dreamHomes.map((p) => (
                <div key={p.id || p._id} className="group shrink-0 snap-start w-[72vw] sm:w-[48vw] lg:w-auto">
                  <ProductCard
                    link={`/property/${p.id || p._id}`}
                    image={getPropertyCoverImage(p)}
                    alt={p.title}
                    title={p.title}
                    hidePrice={true}
                    location={formatPropertyAddress(p)}
                    tags={getDetailTags(p)}
                    badges={[
                      ...(p.recentlyAdded ? [{ label: 'New', className: 'bg-emerald-500 text-white' }] : []),
                      ...(p.loanApproved ? [{ label: 'Loan OK', className: 'bg-blue-500 text-white' }] : []),
                    ]}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Module 2: Vehicles Corner (Homez style) ── */}
        {!PROPERTIES_ONLY && (
        <section className="pt-16 sm:pt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-2.5">
                  <i className="fa-solid fa-car text-xs" /> Certified Transport
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  Discover Certified Vehicles
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
                  Quality verified family cars, two-wheelers &amp; commercial vehicles available nearby.
                </p>
              </div>
              <Link
                to="/our-services/automobile"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-blue border-b-2 border-slate-900 hover:border-brand-blue pb-0.5 transition-all shrink-0 self-start sm:self-auto"
              >
                <span>See All Vehicles</span>
                <i className="fa-solid fa-arrow-right text-xs" />
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 lg:grid lg:gap-5 lg:snap-none lg:overflow-visible lg:grid-cols-3 xl:grid-cols-5 touch-pan-y">
              {latestVehicles.slice(0, 5).map((v) => (
                <div key={v.id || v._id} className="shrink-0 snap-start w-[72vw] sm:w-[48vw] lg:w-auto">
                  <ProductCard
                    link={`/vehicle/${v.id || v._id}`}
                    image={v.images?.[0] || v.image}
                    alt={`${v.brand} ${v.model}`}
                    title={`${v.brand} ${v.model}`}
                    hidePrice={true}
                    location={v.location || v.city}
                    tags={[v.fuelType, v.year ? `${v.year}` : ''].filter(Boolean)}
                    badges={[
                      ...(v.loanApproved ? [{ label: 'Loan OK', className: 'bg-blue-500 text-white' }] : []),
                      ...(v.condition === 'new' ? [{ label: 'New', className: 'bg-emerald-500 text-white' }] : []),
                      ...(v.condition === 'old' ? [{ label: 'Used', className: 'bg-amber-500 text-white' }] : []),
                    ]}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* ── Module 3: Fresh Arrivals (Homez style) ── */}
        <section className="pt-16 sm:pt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-extrabold uppercase tracking-wider mb-2.5">
                  <i className="fa-solid fa-clock text-xs" /> Just Uploaded
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  Fresh Arrivals Across Bengaluru
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
                  Brand new verified residential plots, apartments, and prime listings added today.
                </p>
              </div>
              <Link
                to="/property?sort=newest"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-blue border-b-2 border-slate-900 hover:border-brand-blue pb-0.5 transition-all shrink-0 self-start sm:self-auto"
              >
                <span>Browse All New</span>
                <i className="fa-solid fa-arrow-right text-xs" />
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 lg:grid lg:gap-5 lg:snap-none lg:overflow-visible lg:grid-cols-3 touch-pan-y">
              {todayListed.map((p) => (
                <div key={`fresh-prop-${p.id || p._id}`} className="shrink-0 snap-start w-[72vw] sm:w-[52vw] lg:w-auto">
                  <ProductCard
                    link={`/property/${p.id || p._id}`}
                    image={getPropertyCoverImage(p)}
                    alt={p.title}
                    title={p.title}
                    hidePrice={true}
                    location={formatPropertyAddress(p)}
                    tags={getDetailTags(p)}
                    badges={[
                      { label: 'Added Today', className: 'bg-emerald-500 text-white' },
                      ...(p.loanApproved ? [{ label: 'Loan OK', className: 'bg-blue-500 text-white' }] : []),
                    ]}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Module 4: Properties by Localities (Bangalore BBMP Distribution) ── */}
        <section className="pt-16 sm:pt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-brand-blue text-xs font-extrabold uppercase tracking-wider mb-3">
                <i className="fa-solid fa-map-location-dot text-xs" /> Regional BBMP Distribution
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Properties by Localities
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                Click any administrative zone on the official BBMP map below to inspect verified listings, price trends, and availability.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80">
              <BangalorePropertyPieMap
                properties={mapProperties}
                activeZone={activeZone}
                onSelectZone={(zone) => {
                  setActiveZone(zone);
                  if (zone && zone !== 'All') {
                    navigate(`/property?zone=${encodeURIComponent(zone)}`);
                  } else {
                    navigate('/property');
                  }
                }}
              />
            </div>
          </div>
        </section>

        {/* ── Homez Expert CTA Banner (`Need help? Talk to our expert.`) ── */}
        <section className="pt-16 sm:pt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-slate-950 text-white p-8 sm:p-14 overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="relative z-10 max-w-2xl">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 mb-2">
                  <i className="fa-solid fa-headset text-xs" /> Direct Assistance
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  Need help? Talk to our expert.
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Talk to our verified property and vehicle advisors or browse through thousands of curated options.
                </p>
              </div>
              <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent('onevishwam:open_enquiry_modal', {
                        detail: { title: 'General Property & Marketplace Enquiry' },
                      })
                    )
                  }
                  className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black px-7 py-3 text-xs sm:text-sm shadow-md hover:shadow-xl active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <i className="fa-solid fa-envelope" />
                  <span>Contact Us</span>
                </button>
                <Link
                  to="/our-services/properties"
                  className="rounded-full bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2 backdrop-blur-sm"
                >
                  <span>Explore Listings</span>
                  <i className="fa-solid fa-arrow-right text-xs" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
