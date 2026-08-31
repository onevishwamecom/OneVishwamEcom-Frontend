import { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from '../../store/locationSlice';
import { getCityLabel } from '../../data/locations';
import { useHomepageData } from '../../hooks/useHomepageData';
import BrandLoader from '../../components/ui/BrandLoader';
import { formatFinanceAmount } from '../services/finance/financeConstants';
import { hasPropertyImages, getPropertyCoverImage, getDetailTags } from '../services/property/propertyHelpers';
import ProductCard from '../services/ProductCard';
import { withRupeeSymbol } from '../../utils/priceUtils';
import HeroSection from './HeroSection';
import { PROPERTIES_ONLY } from '../../config/appConfig';
import { heroImage } from '../../utils/imageOptimizer';

const FOOD_CATEGORIES = ['Fruits & Vegetables', 'Grains & Pulses', 'Dairy', 'Beverages', 'Packaged Foods', 'Spices'];

const BTN_PRIMARY = 'inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors';
const BTN_SECONDARY = 'inline-flex items-center justify-center gap-1.5 rounded-xl border border-brand-blue px-6 py-2.5 text-xs font-semibold text-brand-blue hover:bg-brand-blue hover:text-white transition-colors';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedCity } = useLocation();
  const { data, loading } = useHomepageData();

  const filterAvailable = useCallback(
    (list) => (list || []).filter((item) => item && item.availabilityStatus !== 'sold_out' && item.isSoldOut !== true),
    [],
  );

  const rawProperties = useMemo(() => filterAvailable(data?.latestProperties), [data?.latestProperties, filterAvailable]);
  const latestProperties = rawProperties;
  const latestVehicles = useMemo(() => filterAvailable(data?.latestVehicles), [data?.latestVehicles, filterAvailable]);
  const latestGroceries = useMemo(() => filterAvailable(data?.latestGroceries), [data?.latestGroceries, filterAvailable]);
  const latestGarments = useMemo(() => filterAvailable(data?.latestGarments), [data?.latestGarments, filterAvailable]);
  const latestJewellery = useMemo(() => filterAvailable(data?.latestJewellery), [data?.latestJewellery, filterAvailable]);
  const latestFinance = useMemo(() => filterAvailable(data?.latestFinance), [data?.latestFinance, filterAvailable]);
  const financeOfferings = useMemo(() => filterAvailable(data?.financeOfferings), [data?.financeOfferings, filterAvailable]);
  const stats = data?.stats || {};
  const featured = useMemo(() => filterAvailable(data?.featured), [data?.featured, filterAvailable]);

  const foodGrocery = useMemo(() => 
    latestGroceries.filter((g) => FOOD_CATEGORIES.includes(g.category)),
    [latestGroceries]
  );
  
  const heroProp = featured[0] || latestProperties[0] || null;
  const locationName = selectedCity ? getCityLabel(selectedCity) : 'Your Area';

  /* ── Property helpers: images-first priority, best cover image ── */
  const sortPropertiesImagesFirst = useCallback((list) =>
    [...list].sort((a, b) => {
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
  const dreamHomes = useMemo(
    () => sortPropertiesImagesFirst(featured).slice(0, 5),
    [featured, sortPropertiesImagesFirst],
  );

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
    <div className='pt-16 lg:pt-14'>
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {searchQuery && (
        <section className="border-b bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <p className="text-sm text-gray-600">
                {propertyResults.length} propert{propertyResults.length === 1 ? 'y' : 'ies'} found for "<strong>{searchQuery}</strong>"
              </p>
              {propertyResults.length > 0 && (
                <Link to={`/our-services/real-estate-property?q=${encodeURIComponent(searchQuery)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:underline">
                  View All Results <i className="fa-solid fa-arrow-right text-[10px]" />
                </Link>
              )}
            </div>
            {propertyResults.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1 lg:grid lg:gap-4 lg:snap-none lg:overflow-visible lg:grid-cols-3 xl:grid-cols-6">
                {propertyResults.map((p) => (
                  <div key={p.id || p._id} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                    <ProductCard
                      link={`/property/${p.id || p._id}`}
                      image={getPropertyCoverImage(p)}
                      alt={p.title}
                      title={p.title}
                      price={p.price}
                      location={p.location || p.city}
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

      <div className="bg-gray-50 pb-16 sm:pb-20">

        {/* ── Activity Strip ── */}
        <section className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center justify-between gap-6 overflow-x-auto py-3.5 text-xs sm:text-sm flex-nowrap scrollbar-thin">
              <span className="flex items-center gap-1.5 text-gray-600 whitespace-nowrap">
                <i className="fa-solid fa-house-chimney text-brand-blue text-sm" />
                <span className="font-semibold text-brand-charcoal">{stats.totalProperties || latestProperties.length}</span> properties listed
              </span>
              {!PROPERTIES_ONLY && (
                <span className="flex items-center gap-1.5 text-gray-600 whitespace-nowrap">
                  <i className="fa-solid fa-car text-brand-blue text-sm" />
                  <span className="font-semibold text-brand-charcoal">{stats.totalVehicles || latestVehicles.length}</span> vehicles listed
                </span>
              )}
              {!PROPERTIES_ONLY && (
                <span className="flex items-center gap-1.5 text-gray-600 whitespace-nowrap">
                  <i className="fa-solid fa-box text-brand-blue text-sm" />
                  <span className="font-semibold text-brand-charcoal">{stats.totalGroceries || latestGroceries.length}</span> products listed
                </span>
              )}
              <span className="flex items-center gap-1.5 text-gray-600 whitespace-nowrap">
                <i className="fa-solid fa-users text-brand-blue text-sm" />
                <span className="font-semibold text-brand-charcoal">250+</span> people visited today
              </span>
            </div>
          </div>
        </section>

        {/* ── Module 1: Dream Home ── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
              
              <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-navy/80 to-brand-navy/60" />
            </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
                  <i className="fa-solid fa-house-chimney" /> {stats.totalProperties || latestProperties.length} Properties Available
                </p>
                <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Your Dream Home May Be Just Around the Corner</h2>
                <p className="mt-1.5 text-sm text-white/70">Houses, Plot, apartments and rental homes near you.</p>
              </div>
              <Link
                to="/our-services/real-estate-property"
                className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-xl bg-yellow-400 px-5 py-2.5 text-xs font-bold text-brand-navy hover:bg-yellow-300 transition-colors shrink-0"
              >
                Explore Homes <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
            </div>

            <div className="mt-6 flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1 lg:grid lg:gap-4 lg:snap-none lg:overflow-visible lg:grid-cols-3 xl:grid-cols-5">
              {dreamHomes.map((p) => (
                <div key={p.id || p._id} className="group shrink-0 snap-start w-[46vw] lg:w-auto">
                  <ProductCard
                    link={`/property/${p.id || p._id}`}
                    image={getPropertyCoverImage(p)}
                    alt={p.title}
                    title={p.title}
                    price={p.price}
                    priceSuffix={p.priceSuffix}
                    location={p.location || p.city}
                    tags={[p.bhk || '', p.furnishing].filter(Boolean)}
                    badges={[
                      ...(p.recentlyAdded ? [{ label: 'New', className: 'bg-emerald-500 text-white' }] : []),
                      ...(p.loanApproved ? [{ label: 'Loan OK', className: 'bg-blue-500 text-white' }] : []),
                    ]}
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 text-center sm:hidden">
              <Link
                to="/our-services/real-estate-property"
                className={BTN_SECONDARY}
              >
                Explore Homes <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Module 2: Vehicles Corner ── */}
        {!PROPERTIES_ONLY && (
        <section className="pt-14 sm:pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue">
                  <i className="fa-solid fa-car mr-1.5" /> Ready to Ride?
                </p>
                <h2 className="mt-1.5 text-2xl font-bold text-brand-charcoal sm:text-3xl">Cars, bikes and commercial vehicles available nearby.</h2>
              </div>
              <Link
                to="/our-services/automobile"
                className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shrink-0"
              >
                See All Vehicles <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
            </div>

            <div className="mt-6 flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1 lg:grid lg:gap-4 lg:snap-none lg:overflow-visible lg:grid-cols-3 xl:grid-cols-5">
              {latestVehicles.slice(0, 5).map((v) => (
                <div key={v.id || v._id} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                  <ProductCard
                    link={`/vehicle/${v.id || v._id}`}
                    image={v.images?.[0] || v.image}
                    alt={`${v.brand} ${v.model}`}
                    title={`${v.brand} ${v.model}`}
                    price={v.price}
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

            <div className="mt-5 text-center sm:hidden">
              <Link
                to="/our-services/automobile"
                className={BTN_SECONDARY}
              >
                See All Vehicles <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
            </div>
          </div>
        </section>
        )}

        {/* ── Module 3: Finance & Loan Services ── */}
        {!PROPERTIES_ONLY && (
        <section className="pt-14 sm:pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue">
                  <i className="fa-solid fa-building-columns mr-1.5" /> Finance & Loans
                </p>
                <h2 className="mt-1.5 text-2xl font-bold text-brand-charcoal sm:text-3xl">Finance & Loan Services</h2>
                <p className="mt-1 text-sm text-gray-500">Find trusted financial services, loans, insurance, and investment options near you.</p>
              </div>
              <Link
                to="/our-services/finance-lending"
                className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shrink-0"
              >
                Show More <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
            </div>

            <div className="mt-6 flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1 lg:grid lg:gap-4 lg:snap-none lg:overflow-visible lg:grid-cols-3 xl:grid-cols-5">
              {latestFinance.slice(0, 5).map((s) => (
                <div key={s.id || s._id} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                  <ProductCard
                    link={`/finance-service/${s.id || s._id}`}
                    image={s.banner || s.logo}
                    alt={s.serviceName}
                    title={s.serviceName}
                    overline={s.companyName}
                    price={s.interestRate !== 'N/A' && s.interestRate !== 'Varies' ? s.interestRate : undefined}
                    priceSuffix=""
                    priceOverride={s.interestRate !== 'N/A' && s.interestRate !== 'Varies' ? undefined : (
                      <p className="mt-0.5 text-sm font-bold text-brand-blue">{formatFinanceAmount(s.minAmount)} – {formatFinanceAmount(s.maxAmount)}</p>
                    )}
                    location={s.location || s.city}
                    tags={[s.category, s.providerType].filter(Boolean)}
                    badges={[
                      ...(s.featured ? [{ label: 'Featured', className: 'bg-yellow-500 text-white' }] : []),
                      ...(s.availability === 'Available Now' ? [{ label: 'Available', className: 'bg-green-500 text-white' }] : []),
                    ]}
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 text-center sm:hidden">
              <Link
                to="/our-services/finance-lending"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-brand-blue px-6 py-2.5 text-xs font-semibold text-brand-blue hover:bg-brand-blue hover:text-white transition-colors"
              >
                Show More <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
            </div>
          </div>
        </section>
        )}

        {/* ── Module 4: People Are Buying ── */}
        {!PROPERTIES_ONLY && (
        <section className="mt-14 sm:mt-16 bg-gradient-to-br from-white to-gray-50 py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue">
                <i className="fa-solid fa-store mr-1.5" /> What People Are Buying
              </p>
              <h2 className="mt-1.5 text-2xl font-bold text-brand-charcoal sm:text-3xl">Popular in Your Area</h2>
              <p className="mt-1 text-sm text-gray-500">Products people are viewing and buying right now.</p>
            </div>

            <div className="mt-6 flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1 lg:grid lg:gap-4 lg:snap-none lg:overflow-visible lg:grid-cols-3 xl:grid-cols-6">
              {latestGarments.slice(0, 2).map((g) => (
                <div key={`pop-garm-${g.id || g._id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                  <ProductCard
                    link={`/garment/${g.id || g._id}`}
                    image={g.images?.[0] || g.image}
                    alt={g.name}
                    title={`${g.brand || ''} ${g.name || ''}`}
                    price={g.finalPrice || g.price}
                    location={g.store?.city || g.city || ''}
                    badges={[{ label: g.trending ? 'Trending' : 'Popular', className: g.trending ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white' }]}
                  />
                </div>
              ))}
              {foodGrocery.slice(0, 2).map((g) => (
                <div key={`pop-groc-${g.id || g._id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                  <ProductCard
                    link={`/grocery/${g.id || g._id}`}
                    image={g.images?.[0] || g.image}
                    alt={g.name}
                    title={g.name}
                    price={g.pricePerUnit || g.price}
                    priceSuffix={g.unit ? `/ ${g.unit}` : ''}
                    location={g.location || g.city || ''}
                    badges={[g.freshToday ? { label: 'Fresh', className: 'bg-green-500 text-white' } : { label: 'Popular', className: 'bg-amber-500 text-white' }]}
                  />
                </div>
              ))}
              {latestJewellery.slice(0, 1).map((j) => (
                <div key={`pop-jew-${j.id || j._id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                  <ProductCard
                    link={`/jewellery/${j.id || j._id}`}
                    image={j.images?.[0] || j.image}
                    alt={j.name}
                    title={j.name}
                    price={j.price}
                    location={j.store?.city || j.city || ''}
                    badges={[{ label: 'Popular', className: 'bg-amber-500 text-white' }]}
                  />
                </div>
              ))}
              {latestGroceries.slice(0, 1).map((g) => (
                <div key={`pop-elec-${g.id || g._id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                  <ProductCard
                    link={`/grocery/${g.id || g._id}`}
                    image={g.images?.[0] || g.image}
                    alt={g.name}
                    title={g.name}
                    price={g.pricePerUnit || g.price}
                    location={g.location || g.city || ''}
                    badges={[{ label: g.recentlyAdded ? 'New' : 'Trending', className: g.recentlyAdded ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white' }]}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* ── Module 4: Fresh Arrivals ── */}
        <section className="pt-14 sm:pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue">
                  <i className="fa-solid fa-star mr-1.5" /> Fresh Arrivals
                </p>
                <h2 className="mt-1.5 text-2xl font-bold text-brand-charcoal sm:text-3xl">Just Added Today</h2>
                <p className="mt-1 text-sm text-gray-500">New items and services uploaded recently.</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1 lg:grid lg:gap-4 lg:snap-none lg:overflow-visible lg:grid-cols-3">
              {todayListed.map((p) => (
                <Link key={`fresh-prop-${p.id || p._id}`} to={`/property/${p.id || p._id}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow col-span-1 sm:col-span-2 lg:col-span-1 w-[52vw] lg:w-auto shrink-0 snap-start block">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={getPropertyCoverImage(p)} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      <i className="fa-solid fa-clock" /> Added Recently
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-brand-charcoal">{p.title}</h3>
                    <p className="text-sm font-semibold text-brand-blue">{withRupeeSymbol(p.price)} {p.priceSuffix}</p>
                    <p className="text-xs text-gray-500 mt-1">{p.location || p.city} · {p.bhk} · {p.area}</p>
                  </div>
                </Link>
              ))}
              {!PROPERTIES_ONLY && (
                <>
                  {latestVehicles.slice(5, 6).map((v) => (
                    <Link key={`fresh-veh-${v.id || v._id}`} to={`/vehicle/${v.id || v._id}`}
                      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow w-[52vw] lg:w-auto shrink-0 snap-start block">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img src={v.images?.[0] || v.image} alt={`${v.brand} ${v.model}`} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                          <i className="fa-solid fa-clock" /> Added Today
                        </span>
                        <h3 className="mt-1 text-sm font-bold text-brand-charcoal">{v.brand} {v.model}</h3>
                        <p className="text-sm font-semibold text-brand-blue">{withRupeeSymbol(v.price)}</p>
                        <p className="text-xs text-gray-500 mt-1">{v.location || v.city} · {v.fuelType} · {v.year}</p>
                      </div>
                    </Link>
                  ))}
                  {latestGarments.slice(5, 6).map((g) => (
                    <Link key={`fresh-garm-${g.id || g._id}`} to={`/garment/${g.id || g._id}`}
                      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow w-[52vw] lg:w-auto shrink-0 snap-start block">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img src={g.images?.[0] || g.image} alt={g.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-600">
                          <i className="fa-solid fa-clock" /> Added Yesterday
                        </span>
                        <h3 className="mt-1 text-sm font-bold text-brand-charcoal">{g.brand} {g.name}</h3>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm font-bold text-brand-blue">{withRupeeSymbol(g.finalPrice || g.price)}</span>
                          <span className="text-xs text-gray-400 line-through">{withRupeeSymbol(g.originalPrice)}</span>
                          <span className="text-[10px] font-bold text-red-500">{g.discount}% off</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{g.store?.city || g.city || ''} · {g.category}</p>
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Module 6: Available Near You ── */}
        <section className="pt-14 sm:pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue">
                  <i className="fa-solid fa-location-dot mr-1.5" /> Near You
                </p>
                <h2 className="mt-1.5 text-2xl font-bold text-brand-charcoal sm:text-3xl">Available in {locationName}</h2>
                <p className="mt-1 text-sm text-gray-500">Items and services from your area.</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1 lg:grid lg:gap-4 lg:snap-none lg:overflow-visible lg:grid-cols-3 xl:grid-cols-6">
              {availableNearYou.map((item) => (
                <div key={`near-prop-${item.id || item._id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                  <ProductCard
                    link={`/property/${item.id || item._id}`}
                    image={getPropertyCoverImage(item)}
                    alt={item.title}
                    title={item.title}
                    price={item.price}
                    priceSuffix={item.priceSuffix}
                    location={item.location || item.city}
                    tags={[item.bhk || '']}
                  />
                </div>
              ))}
              {!PROPERTIES_ONLY && (
                <>
                  {latestVehicles.slice(3, 5).map((v) => (
                    <div key={`near-veh-${v.id || v._id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                      <ProductCard
                        link={`/vehicle/${v.id || v._id}`}
                        image={v.images?.[0] || v.image}
                        alt={`${v.brand} ${v.model}`}
                        title={`${v.brand} ${v.model}`}
                        price={v.price}
                        location={v.location || v.city}
                        tags={[v.fuelType]}
                      />
                    </div>
                  ))}
                  {foodGrocery.slice(2, 4).map((g) => (
                    <div key={`near-groc-${g.id || g._id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                      <ProductCard
                        link={`/grocery/${g.id || g._id}`}
                        image={g.images?.[0] || g.image}
                        alt={g.name}
                        title={g.name}
                        price={g.pricePerUnit || g.price}
                        priceSuffix={g.unit ? `/ ${g.unit}` : ''}
                        location={g.location || g.city || ''}
                      />
                    </div>
                  ))}
                  {latestGarments.slice(2, 3).map((g) => (
                    <div key={`near-garm-${g.id || g._id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                      <ProductCard
                        link={`/garment/${g.id || g._id}`}
                        image={g.images?.[0] || g.image}
                        alt={g.name}
                        title={`${g.brand || ''} ${g.name || ''}`}
                        price={g.finalPrice || g.price}
                        location={g.store?.city || g.city || ''}
                        badges={[{ label: 'Trending', className: 'bg-rose-500 text-white' }]}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
