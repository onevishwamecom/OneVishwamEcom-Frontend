import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation as useRouteLocation } from 'react-router-dom';
import { useLocation } from '../../store/locationSlice';
import { getCityLabel } from '../../constants/locations';
import { useHomepageData } from '../../hooks/useHomepageData';
import { useProperties } from '../../hooks/useProperties';
import { isHomepageStale, clearHomepageStale, MATCH_EVENT_NAME } from '../../utils/matchEvents';
import BrandLoader from '../../components/ui/BrandLoader';
import { formatFinanceAmount } from '../services/finance/financeConstants';
import { hasPropertyImages, getPropertyCoverImage, getDetailTags, sortPropertiesWithPriority, getPriorityScore, formatPropertyAddress, getPropertyTypeLabel } from '../services/property/propertyHelpers';
import ProductCard from '../services/ProductCard';
import { withRupeeSymbol } from '../../utils/priceUtils';
import HeroSection from './HeroSection';
import BangalorePropertyPieMap from '../services/property/components/BangalorePropertyPieMap';
import { PROPERTIES_ONLY } from '../../config/appConfig';
import { heroImage } from '../../utils/imageOptimizer';

const FOOD_CATEGORIES = ['Fruits & Vegetables', 'Grains & Pulses', 'Dairy', 'Beverages', 'Packaged Foods', 'Spices'];

const BTN_PRIMARY = 'inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors';
const BTN_SECONDARY = 'inline-flex items-center justify-center gap-1.5 rounded-xl border border-brand-blue px-6 py-2.5 text-xs font-semibold text-brand-blue hover:bg-brand-blue hover:text-white transition-colors';

function useHorizontalSlider() {
  const ref = useRef(null);

  const scrollBy = useCallback((distance) => {
    if (ref.current) {
      ref.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasMoved = false;

    const handleMouseDown = (e) => {
      if (e.button !== 0) return;
      isDown = true;
      hasMoved = false;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX);
      if (Math.abs(walk) > 4) {
        hasMoved = true;
        el.scrollLeft = scrollLeft - walk;
      }
    };

    const handleMouseUp = () => {
      if (!isDown) return;
      isDown = false;
      if (hasMoved) {
        const stopClick = (ev) => {
          ev.stopPropagation();
          ev.preventDefault();
        };
        window.addEventListener('click', stopClick, { capture: true, once: true });
        setTimeout(() => window.removeEventListener('click', stopClick, { capture: true }), 100);
      }
    };

    const handleMouseLeave = () => {
      isDown = false;
    };

    el.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return [ref, scrollBy];
}

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredRef, scrollFeatured] = useHorizontalSlider();
  const [vehiclesRef, scrollVehicles] = useHorizontalSlider();
  const [freshArrivalsRef, scrollFreshArrivals] = useHorizontalSlider();
  const [searchResultsRef, scrollSearchResults] = useHorizontalSlider();
  const [activeZone, setActiveZone] = useState('All');
  const navigate = useNavigate();
  const routeLocation = useRouteLocation();
  const { selectedCity } = useLocation();
  const { data, loading, refresh } = useHomepageData();
  const { properties: allProperties, refetch: refetchProperties } = useProperties();

  useEffect(() => {
    const handleMatchOrStale = () => {
      if (isHomepageStale()) {
        clearHomepageStale();
      }
      refresh();
      if (typeof refetchProperties === 'function') {
        refetchProperties();
      }
    };

    if (routeLocation.pathname === '/' && isHomepageStale()) {
      handleMatchOrStale();
    }

    const handleWindowCheck = () => {
      if (isHomepageStale()) {
        handleMatchOrStale();
      }
    };

    window.addEventListener(MATCH_EVENT_NAME, handleMatchOrStale);
    window.addEventListener('focus', handleWindowCheck);
    window.addEventListener('pageshow', handleWindowCheck);
    window.addEventListener('popstate', handleWindowCheck);

    return () => {
      window.removeEventListener(MATCH_EVENT_NAME, handleMatchOrStale);
      window.removeEventListener('focus', handleWindowCheck);
      window.removeEventListener('pageshow', handleWindowCheck);
      window.removeEventListener('popstate', handleWindowCheck);
    };
  }, [routeLocation.pathname, refresh, refetchProperties]);

  const filterAvailable = useCallback(
    (arr) => (arr || []).filter((item) => item.status !== 'sold_out'),
    []
  );

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
  
  const heroProp = useMemo(() => {
    const pool = [...(featured || []), ...(rawProperties || []), ...(latestProperties || [])];
    const withImages = pool.filter(hasPropertyImages);
    return withImages[0] || featured[0] || latestProperties[0] || null;
  }, [featured, rawProperties, latestProperties]);

  const locationName = selectedCity ? getCityLabel(selectedCity) : 'Your Area';

  /* ── Property helpers: images-first priority, best cover image ── */
  const sortPropertiesImagesFirst = useCallback((list) =>
    [...list].sort((a, b) => {
      const aImg = hasPropertyImages(a) ? 1 : 0;
      const bImg = hasPropertyImages(b) ? 1 : 0;
      if (aImg !== bImg) return bImg - aImg;

      const aScore = getPriorityScore(a);
      const bScore = getPriorityScore(b);
      if (aScore !== bScore) return bScore - aScore;

      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }), []);

  const dreamHomes = useMemo(() => {
    // Collect all candidates across featured, rawProperties, and latestProperties
    const candidates = [
      ...(featured || []),
      ...(rawProperties || []),
      ...(latestProperties || []),
    ];

    const seen = new Set();
    const uniquePool = [];
    for (const p of candidates) {
      const id = String(p?.id || p?._id || '');
      if (id && !seen.has(id)) {
        seen.add(id);
        uniquePool.push(p);
      }
    }

    // Strictly filter to listings that have real images
    const withImages = uniquePool.filter((p) => hasPropertyImages(p));

    // Sort: featured listings first, then priority score, then recency
    const sorted = [...withImages].sort((a, b) => {
      const aFeat = (a.featured || a.isFeatured) ? 1 : 0;
      const bFeat = (b.featured || b.isFeatured) ? 1 : 0;
      if (aFeat !== bFeat) return bFeat - aFeat;

      const aScore = getPriorityScore(a);
      const bScore = getPriorityScore(b);
      if (aScore !== bScore) return bScore - aScore;

      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    if (sorted.length >= 5) {
      return sorted.slice(0, 5);
    }
    if (sorted.length > 0) {
      return sorted;
    }
    return sortPropertiesImagesFirst(uniquePool).slice(0, 5);
  }, [featured, rawProperties, latestProperties, sortPropertiesImagesFirst]);

  const featuredIds = useMemo(
    () => new Set(dreamHomes.map((p) => String(p.id || p._id || ''))),
    [dreamHomes]
  );

  const todayListed = useMemo(() => {
    // Exclude any properties already displayed in "Discover Our Featured Properties" (dreamHomes)
    const freshPool = [
      ...(latestProperties || []),
      ...(rawProperties || []),
    ];

    const seen = new Set();
    const candidateList = [];
    for (const p of freshPool) {
      const pid = String(p?.id || p?._id || '');
      if (pid && !seen.has(pid) && !featuredIds.has(pid)) {
        seen.add(pid);
        candidateList.push(p);
      }
    }

    return sortPropertiesImagesFirst(candidateList).slice(0, 6);
  }, [latestProperties, rawProperties, featuredIds, sortPropertiesImagesFirst]);

  const availableNearYou = useMemo(() => {
    const pool = [
      ...(latestProperties || []),
      ...(rawProperties || []),
    ].filter((p) => !featuredIds.has(String(p?.id || p?._id || '')));
    return sortPropertiesImagesFirst(pool).slice(0, 6);
  }, [latestProperties, rawProperties, featuredIds, sortPropertiesImagesFirst]);

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
      <div className="relative z-30">
        <HeroSection />
      </div>

      {searchQuery && (
        <section className="relative z-20 border-b bg-gray-50">
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
              <div
                ref={searchResultsRef}
                className="flex gap-3.5 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-2 lg:grid lg:gap-4 lg:snap-none lg:overflow-visible lg:grid-cols-3 xl:grid-cols-6 touch-pan-x touch-pan-y overscroll-x-contain"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {propertyResults.map((p) => (
                  <div key={p.id || p._id} className="shrink-0 snap-start w-[76vw] sm:w-[300px] lg:w-auto">
                    <ProductCard
                      link={`/property/${p.id || p._id}`}
                      image={getPropertyCoverImage(p)}
                      alt={p.title}
                      title={p.title}
                      hidePrice={true}
                      location={formatPropertyAddress(p)}
                      tags={getDetailTags(p)}
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

      <div className="relative z-10 bg-slate-50/70 pb-8 sm:pb-10">

        {/* ── Module 1: Discover Our Featured Properties (Homez style) ── */}
        <section className="pt-8 sm:pt-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 sm:mb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-extrabold uppercase tracking-wider mb-2.5">
                  <i className="fa-solid fa-house-chimney text-xs" /> {stats.totalProperties || latestProperties.length}+ Available
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  Discover Our Featured Properties
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
                  Handpicked verified residential plots, apartments, villas and commercial spaces.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                <div className="flex items-center gap-1.5 lg:hidden">
                  <button
                    type="button"
                    onClick={() => scrollFeatured(-320)}
                    className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 hover:text-brand-blue shadow-2xs transition-all cursor-pointer active:scale-95"
                    aria-label="Previous featured properties"
                  >
                    <i className="fa-solid fa-chevron-left text-xs" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollFeatured(320)}
                    className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 hover:text-brand-blue shadow-2xs transition-all cursor-pointer active:scale-95"
                    aria-label="Next featured properties"
                  >
                    <i className="fa-solid fa-chevron-right text-xs" />
                  </button>
                </div>
                <Link
                  to="/our-services/properties"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-blue border-b-2 border-slate-900 hover:border-brand-blue pb-0.5 transition-all shrink-0"
                >
                  <span>See All Properties</span>
                  <i className="fa-solid fa-arrow-right text-xs" />
                </Link>
              </div>
            </div>

            <div
              ref={featuredRef}
              className="flex gap-3.5 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-3 lg:grid lg:grid-cols-5 lg:gap-5 lg:snap-none lg:overflow-visible touch-pan-x touch-pan-y overscroll-x-contain"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {dreamHomes.map((p) => (
                <div key={p.id || p._id} className="group shrink-0 snap-start w-[76vw] sm:w-[300px] md:w-[320px] lg:w-auto">
                  <ProductCard
                    link={`/property/${p.id || p._id}`}
                    image={getPropertyCoverImage(p)}
                    alt={p.title}
                    title={p.title}
                    overline={getPropertyTypeLabel(p)}
                    hidePrice={true}
                    location={formatPropertyAddress(p)}
                    tags={getDetailTags(p)}
                    badges={p.recentlyAdded ? [{ label: 'New', className: 'bg-emerald-600 text-white' }] : []}
                    trustBadge={p.loanApproved ? 'Bank Approved' : null}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Module 2: Vehicles Corner (Homez style) ── */}
        {!PROPERTIES_ONLY && (
        <section className="pt-10 sm:pt-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 sm:mb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-2.5">
                  <i className="fa-solid fa-car text-xs" /> Certified Transport
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  Discover Certified Automobiles
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
                  Quality verified family cars, two-wheelers &amp; commercial automobiles available nearby.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                <div className="flex items-center gap-1.5 lg:hidden">
                  <button
                    type="button"
                    onClick={() => scrollVehicles(-320)}
                    className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 hover:text-brand-blue shadow-2xs transition-all cursor-pointer active:scale-95"
                    aria-label="Previous vehicles"
                  >
                    <i className="fa-solid fa-chevron-left text-xs" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollVehicles(320)}
                    className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 hover:text-brand-blue shadow-2xs transition-all cursor-pointer active:scale-95"
                    aria-label="Next vehicles"
                  >
                    <i className="fa-solid fa-chevron-right text-xs" />
                  </button>
                </div>
                <Link
                  to="/categories/automobile"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-blue border-b-2 border-slate-900 hover:border-brand-blue pb-0.5 transition-all shrink-0"
                >
                  <span>See All Automobiles</span>
                  <i className="fa-solid fa-arrow-right text-xs" />
                </Link>
              </div>
            </div>

            <div
              ref={vehiclesRef}
              className="flex gap-3.5 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-3 lg:grid lg:grid-cols-5 lg:gap-5 lg:snap-none lg:overflow-visible touch-pan-x touch-pan-y overscroll-x-contain"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {latestVehicles.slice(0, 5).map((v) => (
                <div key={v.id || v._id} className="shrink-0 snap-start w-[76vw] sm:w-[300px] md:w-[320px] lg:w-auto">
                  <ProductCard
                    link={`/vehicle/${v.id || v._id}`}
                    image={v.images?.[0] || v.image}
                    alt={`${v.brand} ${v.model}`}
                    title={`${v.brand} ${v.model}`}
                    hidePrice={true}
                    location={v.location || v.city}
                    tags={[v.fuelType, v.year ? `${v.year}` : ''].filter(Boolean)}
                    badges={[
                      ...(v.condition === 'new' ? [{ label: 'New', className: 'bg-emerald-600 text-white' }] : []),
                      ...(v.condition === 'old' ? [{ label: 'Used', icon: 'fa-solid fa-car text-amber-100', className: 'bg-amber-600 text-white' }] : []),
                    ]}
                    trustBadge={v.loanApproved ? 'Bank Approved' : null}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* ── Module 3: Fresh Arrivals (Homez style) ── */}
        <section className="pt-10 sm:pt-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 sm:mb-5">
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
              <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                <div className="flex items-center gap-1.5 lg:hidden">
                  <button
                    type="button"
                    onClick={() => scrollFreshArrivals(-340)}
                    className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 hover:text-brand-blue shadow-2xs transition-all cursor-pointer active:scale-95"
                    aria-label="Previous fresh arrivals"
                  >
                    <i className="fa-solid fa-chevron-left text-xs" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollFreshArrivals(340)}
                    className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 hover:text-brand-blue shadow-2xs transition-all cursor-pointer active:scale-95"
                    aria-label="Next fresh arrivals"
                  >
                    <i className="fa-solid fa-chevron-right text-xs" />
                  </button>
                </div>
                <Link
                  to="/property?sort=newest"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-blue border-b-2 border-slate-900 hover:border-brand-blue pb-0.5 transition-all shrink-0"
                >
                  <span>Browse All New</span>
                  <i className="fa-solid fa-arrow-right text-xs" />
                </Link>
              </div>
            </div>

            <div
              ref={freshArrivalsRef}
              className="flex gap-3.5 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-3 lg:grid lg:grid-cols-3 lg:gap-5 lg:snap-none lg:overflow-visible touch-pan-x touch-pan-y overscroll-x-contain"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {todayListed.map((p) => (
                <div key={`fresh-prop-${p.id || p._id}`} className="shrink-0 snap-start w-[76vw] sm:w-[320px] md:w-[340px] lg:w-auto">
                  <ProductCard
                    link={`/property/${p.id || p._id}`}
                    image={getPropertyCoverImage(p)}
                    alt={p.title}
                    title={p.title}
                    overline={getPropertyTypeLabel(p)}
                    hidePrice={true}
                    location={formatPropertyAddress(p)}
                    tags={getDetailTags(p)}
                    badges={[
                      { label: 'Added Today', icon: 'fa-solid fa-clock text-emerald-100', className: 'bg-emerald-600 text-white' },
                    ]}
                    trustBadge={p.loanApproved ? 'Bank Approved' : null}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Module 4: Properties by Localities (Bangalore BBMP Distribution) ── */}
        <section className="pt-10 sm:pt-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-brand-blue text-xs font-extrabold uppercase tracking-wider mb-2.5">
                <i className="fa-solid fa-map-location-dot text-xs" /> Regional BBMP Distribution
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Properties by Localities
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
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
        <section className="pt-10 sm:pt-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-gradient-to-b from-[#d9ebfa] via-[#e5f1fc] to-[#d6e9f9] text-slate-900 p-8 sm:p-12 lg:p-14 overflow-hidden shadow-sm border border-sky-200/90 flex flex-col md:flex-row md:items-center justify-between gap-8">
              {/* Ambient Soft Glow Lights Matching Hero Banner */}
              <div className="absolute -top-16 -right-16 w-80 h-80 bg-gradient-to-br from-amber-300/35 via-orange-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-gradient-to-tr from-sky-300/45 via-blue-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-amber-300/70 text-amber-900 text-xs font-black uppercase tracking-wider mb-3 shadow-2xs">
                  <i className="fa-solid fa-headset text-xs text-amber-600" /> Direct Assistance
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Need help? <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700">Talk to our expert.</span>
                </h2>
                <p className="mt-2.5 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
                  Talk to our verified property and vehicle advisors or browse through thousands of curated options across Bengaluru.
                </p>
              </div>

              <div className="relative z-10 flex flex-wrap items-center gap-3.5 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent('onevishwam:open_enquiry_modal', {
                        detail: { title: 'General Property & Marketplace Enquiry' },
                      })
                    )
                  }
                  className="rounded-full bg-action-primary hover:bg-action-primary-hover text-action-primary-text font-black px-7 py-3.5 text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 border border-action-primary-border"
                >
                  <i className="fa-solid fa-phone-volume text-xs" />
                  <span>Contact Us</span>
                </button>
                <Link
                  to="/our-services/properties"
                  className="rounded-full bg-white hover:bg-[#e8f2fb] text-[#0f233a] font-bold px-6 py-3.5 text-xs sm:text-sm border-2 border-[#c0dbf1] hover:border-brand-blue shadow-2xs hover:shadow-xs transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <span>Explore Listings</span>
                  <i className="fa-solid fa-arrow-right text-xs text-brand-blue" />
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
