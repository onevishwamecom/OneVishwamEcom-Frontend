import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from '../../store/locationSlice';
import { getCityLabel } from '../../data/locations';
import { dummyAutomobiles } from '../../data/dummyAutomobiles';
import { dummyGrocery } from '../../data/dummyGrocery';
import { dummyGarments } from '../../data/dummyGarments';
import { dummyJewellery } from '../../data/dummyJewellery';
import { useProperties } from '../../hooks/useProperties';
import { financeServices as rawFinanceServices } from '../../data/dummyFinanceServices';
import { formatFinanceAmount } from '../services/finance/financeConstants';
import { hasPropertyImages, getPropertyCoverImage } from '../services/property/propertyHelpers';
import ProductCard from '../services/ProductCard';
import HeroSection from './HeroSection';
import { PROPERTIES_ONLY } from '../../config/appConfig';

const FOOD_CATEGORIES = ['Fruits & Vegetables', 'Grains & Pulses', 'Dairy', 'Beverages', 'Packaged Foods', 'Spices'];

const BTN_PRIMARY = 'inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors';
const BTN_SECONDARY = 'inline-flex items-center justify-center gap-1.5 rounded-xl border border-brand-blue px-6 py-2.5 text-xs font-semibold text-brand-blue hover:bg-brand-blue hover:text-white transition-colors';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedCity } = useLocation();
  const { properties: dummyProperties } = useProperties();
  const [financeServices] = useState(() => rawFinanceServices.map(s => ({ ...s, id: s.id })));

  const foodGrocery = dummyGrocery.filter((g) => FOOD_CATEGORIES.includes(g.category));
  const heroProp = dummyProperties[0];
  const locationName = selectedCity ? getCityLabel(selectedCity) : 'Your Area';

  /* ── Property helpers: images-first priority, best cover image ── */
  const sortPropertiesImagesFirst = (list) =>
    [...list].sort((a, b) => {
      const aImg = hasPropertyImages(a) ? 1 : 0;
      const bImg = hasPropertyImages(b) ? 1 : 0;
      if (aImg !== bImg) return bImg - aImg;
      return b.id - a.id;
    });

  const todayListed = useMemo(
    () => sortPropertiesImagesFirst(dummyProperties.filter((p) => p.recentlyAdded)).slice(0, 3),
    [dummyProperties],
  );
  const availableNearYou = useMemo(
    () => sortPropertiesImagesFirst(dummyProperties).slice(0, 6),
    [dummyProperties],
  );
  const dreamHomes = useMemo(
    () => sortPropertiesImagesFirst(dummyProperties).slice(0, 5),
    [dummyProperties],
  );

  const propertyResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const matched = dummyProperties.filter((p) =>
      [p.title, p.subtitle, p.location, p.bhk, p.area, p.propertyType]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q)),
    );
    return sortPropertiesImagesFirst(matched).slice(0, 6);
  }, [searchQuery, dummyProperties]);

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
                  <div key={p.id} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                    <ProductCard
                      link={`/property/${p.id}`}
                      image={getPropertyCoverImage(p)}
                      alt={p.title}
                      title={p.title}
                      price={p.price}
                      location={p.location}
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
                <span className="font-semibold text-brand-charcoal">{dummyProperties.filter((p) => p.recentlyAdded).length}</span> properties added today
              </span>
              {!PROPERTIES_ONLY && (
                <span className="flex items-center gap-1.5 text-gray-600 whitespace-nowrap">
                  <i className="fa-solid fa-car text-brand-blue text-sm" />
                  <span className="font-semibold text-brand-charcoal">{dummyAutomobiles.length}</span> vehicles added today
                </span>
              )}
              {!PROPERTIES_ONLY && (
                <span className="flex items-center gap-1.5 text-gray-600 whitespace-nowrap">
                  <i className="fa-solid fa-box text-brand-blue text-sm" />
                  <span className="font-semibold text-brand-charcoal">{foodGrocery.length + dummyGrocery.length}</span> products added today
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
          {heroProp && (
            <div className="absolute inset-0">
              <img src={heroProp.images[0]} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-navy/80 to-brand-navy/60" />
            </div>
          )}
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
                  <i className="fa-solid fa-house-chimney" /> {dummyProperties.length} Properties Available
                </p>
                <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Your Dream Home May Be Just Around the Corner</h2>
                <p className="mt-1.5 text-sm text-white/70">Houses, plots, apartments and rental homes near you.</p>
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
                <div key={p.id} className="group shrink-0 snap-start w-[46vw] lg:w-auto">
                  <ProductCard
                    link={`/property/${p.id}`}
                    image={getPropertyCoverImage(p)}
                    alt={p.title}
                    title={p.title}
                    price={p.price}
                    priceSuffix={p.priceSuffix}
                    location={p.location}
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
              {dummyAutomobiles.slice(0, 5).map((v) => (
                <div key={v.id} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                  <ProductCard
                    link={`/vehicle/${v.id}`}
                    image={v.images[0]}
                    alt={`${v.brand} ${v.model}`}
                    title={`${v.brand} ${v.model}`}
                    price={v.price}
                    location={v.location}
                    tags={[v.fuelType, `${v.year}`]}
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
              {financeServices.slice(0, 5).map((s) => (
                <div key={s.id} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                  <ProductCard
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
              {dummyGarments.slice(0, 2).map((g) => (
                <div key={`pop-garm-${g.id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                  <ProductCard
                    link={`/garment/${g.id}`}
                    image={g.images[0]}
                    alt={g.name}
                    title={`${g.brand} ${g.name}`}
                    price={g.finalPrice}
                    location={g.store?.city || ''}
                    badges={[{ label: g.trending ? 'Trending' : 'Popular', className: g.trending ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white' }]}
                  />
                </div>
              ))}
              {foodGrocery.slice(0, 2).map((g) => (
                <div key={`pop-groc-${g.id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                  <ProductCard
                    link={`/grocery/${g.id}`}
                    image={g.images[0]}
                    alt={g.name}
                    title={g.name}
                    price={g.pricePerUnit}
                    priceSuffix={`/ ${g.unit}`}
                    location={`${g.location?.area || ''}, ${g.location?.city || ''}`}
                    badges={[g.freshToday ? { label: 'Fresh', className: 'bg-green-500 text-white' } : { label: 'Popular', className: 'bg-amber-500 text-white' }]}
                  />
                </div>
              ))}
              {dummyJewellery.slice(0, 1).map((j) => (
                <div key={`pop-jew-${j.id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                  <ProductCard
                    link={`/jewellery/${j.id}`}
                    image={j.images[0]}
                    alt={j.name}
                    title={j.name}
                    price={j.price}
                    location={j.store?.city || ''}
                    badges={[{ label: 'Popular', className: 'bg-amber-500 text-white' }]}
                  />
                </div>
              ))}
              {dummyGrocery.slice(0, 1).map((g) => (
                <div key={`pop-elec-${g.id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                  <ProductCard
                    link={`/grocery/${g.id}`}
                    image={g.images[0]}
                    alt={g.name}
                    title={g.name}
                    price={g.pricePerUnit}
                    location=""
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
                <Link key={`fresh-prop-${p.id}`} to={`/property/${p.id}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow col-span-1 sm:col-span-2 lg:col-span-1 w-[52vw] lg:w-auto shrink-0 snap-start block">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={getPropertyCoverImage(p)} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      <i className="fa-solid fa-clock" /> Added Today
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-brand-charcoal">{p.title}</h3>
                    <p className="text-sm font-semibold text-brand-blue">{p.price} {p.priceSuffix}</p>
                    <p className="text-xs text-gray-500 mt-1">{p.location} · {p.bhk} · {p.area}</p>
                  </div>
                </Link>
              ))}
              {!PROPERTIES_ONLY && (
                <>
                  {dummyAutomobiles.slice(5, 6).map((v) => (
                    <Link key={`fresh-veh-${v.id}`} to={`/vehicle/${v.id}`}
                      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow w-[52vw] lg:w-auto shrink-0 snap-start block">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img src={v.images[0]} alt={`${v.brand} ${v.model}`} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                          <i className="fa-solid fa-clock" /> Added Today
                        </span>
                        <h3 className="mt-1 text-sm font-bold text-brand-charcoal">{v.brand} {v.model}</h3>
                        <p className="text-sm font-semibold text-brand-blue">{v.price}</p>
                        <p className="text-xs text-gray-500 mt-1">{v.location} · {v.fuelType} · {v.year}</p>
                      </div>
                    </Link>
                  ))}
                  {dummyGarments.slice(5, 6).map((g) => (
                    <Link key={`fresh-garm-${g.id}`} to={`/garment/${g.id}`}
                      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow w-[52vw] lg:w-auto shrink-0 snap-start block">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img src={g.images[0]} alt={g.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-600">
                          <i className="fa-solid fa-clock" /> Added Yesterday
                        </span>
                        <h3 className="mt-1 text-sm font-bold text-brand-charcoal">{g.brand} {g.name}</h3>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm font-bold text-brand-blue">{g.finalPrice}</span>
                          <span className="text-xs text-gray-400 line-through">{g.originalPrice}</span>
                          <span className="text-[10px] font-bold text-red-500">{g.discount}% off</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{g.store?.city || ''} · {g.category}</p>
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Module 5: Category Selection ── */}
        {/* <section className="mt-14 sm:mt-16 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue">
                <i className="fa-solid fa-circle-info mr-1.5" /> Need Something?
              </p>
              <h2 className="mt-1.5 text-2xl font-bold text-brand-charcoal sm:text-3xl">What Are You Looking For Today?</h2>
              <p className="mt-1 text-sm text-gray-500">Choose a category to get started.</p>
            </div>

            <div className="mt-6 flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1 lg:grid lg:gap-4 lg:snap-none lg:overflow-visible lg:grid-cols-6">
              {[
                { icon: 'fa-house-chimney', label: 'Houses & Land', desc: 'Find houses, plots and rentals', href: '/our-services/real-estate-property' },
                { icon: 'fa-car', label: 'Vehicles', desc: 'Cars, bikes and commercial', href: '/our-services/automobile' },
                { icon: 'fa-shirt', label: 'Garments', desc: 'Clothes and fashion items', href: '/our-services/garments-fashion-lifestyle' },
                { icon: 'fa-basket-shopping', label: 'Groceries', desc: 'Daily essentials near you', href: '/our-services/consumer-marketplace' },
                { icon: 'fa-building-columns', label: 'Loans', desc: 'Financial help and services', href: '/our-services/finance-lending' },
                { icon: 'fa-wrench', label: 'Services', desc: 'Find services near you', href: '/our-services/' },
              ].filter((t) => !PROPERTIES_ONLY || t.label === 'Houses & Land').map((item) => (
                <Link key={item.label}
                  to={item.href}
                  className="group rounded-xl border border-gray-100 bg-white p-3 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all w-[46vw] lg:w-auto shrink-0 snap-start block"
                >
                    <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-brand-blue/5 flex items-center justify-center text-sm text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                      <i className={`fa-solid ${item.icon}`} />
                    </div>
                    <i className="fa-solid fa-arrow-right text-gray-300 text-xs group-hover:text-brand-blue transition-colors" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-brand-charcoal">{item.label}</h3>
                  <p className="mt-1 text-xs text-gray-500">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section> */}

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
                <div key={`near-prop-${item.id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                  <ProductCard
                    link={`/property/${item.id}`}
                    image={getPropertyCoverImage(item)}
                    alt={item.title}
                    title={item.title}
                    price={item.price}
                    priceSuffix={item.priceSuffix}
                    location={item.location}
                    tags={[item.bhk || '']}
                  />
                </div>
              ))}
              {!PROPERTIES_ONLY && (
                <>
                  {dummyAutomobiles.slice(3, 5).map((v) => (
                    <div key={`near-veh-${v.id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                      <ProductCard
                        link={`/vehicle/${v.id}`}
                        image={v.images[0]}
                        alt={`${v.brand} ${v.model}`}
                        title={`${v.brand} ${v.model}`}
                        price={v.price}
                        location={v.location}
                        tags={[v.fuelType]}
                      />
                    </div>
                  ))}
                  {foodGrocery.slice(2, 4).map((g) => (
                    <div key={`near-groc-${g.id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                      <ProductCard
                        link={`/grocery/${g.id}`}
                        image={g.images[0]}
                        alt={g.name}
                        title={g.name}
                        price={g.pricePerUnit}
                        priceSuffix={`/ ${g.unit}`}
                        location={`${g.location?.area || ''}`}
                      />
                    </div>
                  ))}
                  {dummyGarments.slice(2, 3).map((g) => (
                    <div key={`near-garm-${g.id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                      <ProductCard
                        link={`/garment/${g.id}`}
                        image={g.images[0]}
                        alt={g.name}
                        title={`${g.brand} ${g.name}`}
                        price={g.finalPrice}
                        location={g.store?.city || ''}
                        badges={[{ label: 'Trending', className: 'bg-rose-500 text-white' }]}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Module 7: Best Deals ── */}
        {/* <section className="mt-14 sm:mt-16 bg-gradient-to-br from-rose-50 to-orange-50 py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue">
                <i className="fa-solid fa-tag mr-1.5" /> Don't Miss Out
              </p>
              <h2 className="mt-1.5 text-2xl font-bold text-brand-charcoal sm:text-3xl">Don't Miss These Deals</h2>
              <p className="mt-1 text-sm text-gray-500">Great prices and top picks for you.</p>
            </div>

            <div className="mt-6 flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1 lg:grid lg:gap-4 lg:snap-none lg:overflow-visible lg:grid-cols-3 xl:grid-cols-4">
              {dummyProperties.slice(2, 4).map((p) => (
                <div key={`deal-prop-${p.id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                  <ProductCard
                    link={`/property/${p.id}`}
                    image={p.images[0]}
                    alt={p.title}
                    title={p.title}
                    price={p.price}
                    priceSuffix={p.priceSuffix}
                    location={p.location}
                    badges={[{ label: 'Great Price', className: 'bg-red-500 text-white' }]}
                  />
                </div>
              ))}
              {!PROPERTIES_ONLY && (
                <>
                  {dummyAutomobiles.slice(1, 3).map((v) => (
                    <div key={`deal-veh-${v.id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                      <ProductCard
                        link={`/vehicle/${v.id}`}
                        image={v.images[0]}
                        alt={`${v.brand} ${v.model}`}
                        title={`${v.brand} ${v.model}`}
                        price={v.price}
                        location={v.location}
                        badges={[{ label: v.id % 2 === 0 ? 'Hot Deal' : 'Recommended', className: v.id % 2 === 0 ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white' }]}
                      />
                    </div>
                  ))}
                  {dummyGarments.slice(0, 2).map((g) => (
                    <div key={`deal-garm-${g.id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                      <ProductCard
                        link={`/garment/${g.id}`}
                        image={g.images[0]}
                        alt={g.name}
                        title={`${g.brand} ${g.name}`}
                        price={g.finalPrice}
                        location={g.store?.city || ''}
                        badges={[{ label: 'Recommended', className: 'bg-amber-500 text-white' }]}
                      />
                    </div>
                  ))}
                  {foodGrocery.slice(0, 2).map((g) => (
                    <div key={`deal-groc-${g.id}`} className="shrink-0 snap-start w-[46vw] lg:w-auto">
                      <ProductCard
                        link={`/grocery/${g.id}`}
                        image={g.images[0]}
                        alt={g.name}
                        title={g.name}
                        price={g.pricePerUnit}
                        priceSuffix={`/ ${g.unit}`}
                        location={`${g.location?.area || ''}`}
                        badges={[{ label: g.organic ? 'Great Price' : 'Hot Deal', className: g.organic ? 'bg-red-500 text-white' : 'bg-rose-500 text-white' }]}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </section> */}

      </div>
    </div>
  );
}

export default Home;
