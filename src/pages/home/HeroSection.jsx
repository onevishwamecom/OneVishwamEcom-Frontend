import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cities, getCityLabel } from '../../constants/locations';
import { useLocation } from '../../store/locationSlice';

/* ── Slide Backgrounds for Homez Hero Banner ── */
const HERO_SLIDES = [
  {
    id: 'properties',
    category: 'Properties',
    title: 'Find Your Dream Home',
    subtitle: 'Over 10,000+ verified apartments, residential plots, villas & commercial spaces across Bengaluru.',
    link: '/our-services/properties',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80',
    badgeIcon: 'fa-solid fa-house-chimney',
    ctaText: 'Explore Properties',
  },
  {
    id: 'automobile',
    category: 'Vehicles',
    title: 'Find Your Dream Vehicle',
    subtitle: 'Verified new and certified pre-owned family cars, two-wheelers & commercial transports.',
    link: '/our-services/automobile',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80',
    badgeIcon: 'fa-solid fa-car',
    ctaText: 'Explore Vehicles',
  },
  {
    id: 'bedding',
    category: 'Bedding & Comfort',
    title: 'Find Doctor-Approved Sleep Comfort',
    subtitle: 'Orthopedic memory foam mattresses, pillows & bedsheets at genuine factory-direct prices.',
    link: '/our-services/bedding-comfort',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1800&q=80',
    badgeIcon: 'fa-solid fa-bed',
    ctaText: 'Explore Bedding',
  },
  {
    id: 'electronics',
    category: 'Consumer Electronics',
    title: 'Find Top Brand Appliances & 4K TVs',
    subtitle: 'Energy-saving 5-star ACs, double door refrigerators, washing machines & smart entertainment.',
    link: '/our-services/consumer-electronics',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1800&q=80',
    badgeIcon: 'fa-solid fa-tv',
    ctaText: 'Explore Electronics',
  },
];

/* ── Homez-style Search Tabs ── */
const SEARCH_TABS = [
  { id: 'all',                  label: 'All Categories', icon: 'fa-solid fa-layer-group',       route: '/our-services/properties' },
  { id: 'properties',           label: 'Properties',     icon: 'fa-solid fa-house-chimney',     route: '/our-services/properties' },
  { id: 'automobile',           label: 'Vehicles',       icon: 'fa-solid fa-car',               route: '/our-services/automobile' },
  { id: 'consumer-electronics', label: 'Electronics',    icon: 'fa-solid fa-tv',                route: '/our-services/consumer-electronics' },
  { id: 'bedding-comfort',      label: 'Bedding',        icon: 'fa-solid fa-bed',               route: '/our-services/bedding-comfort' },
  { id: 'finance-lending',      label: 'Finance',        icon: 'fa-solid fa-building-columns',  route: '/our-services/finance-lending' },
];

/* ── Homez-style "Explore Apartment Types" Quick Cards ── */
const CATEGORY_ICON_BOXES = [
  {
    title: 'Houses & Villas',
    count: 'Verified Villas',
    icon: 'fa-solid fa-house',
    link: '/our-services/properties?propertyType=Houses,Villas',
  },
  {
    title: 'Plots & Layouts',
    count: '50+ Available',
    icon: 'fa-solid fa-map-location-dot',
    link: '/our-services/properties?propertyType=Plots',
  },
  {
    title: 'Apartments & Flats',
    count: '20+ Available',
    icon: 'fa-solid fa-building',
    link: '/our-services/properties?propertyType=Flats',
  },
  {
    title: 'Cars & Bikes',
    count: 'Verified Fleet',
    icon: 'fa-solid fa-car',
    link: '/our-services/automobile',
  },
  {
    title: 'Sleep & Mattresses',
    count: 'Factory Direct',
    icon: 'fa-solid fa-bed',
    link: '/our-services/bedding-comfort',
  },
  {
    title: 'Home Appliances',
    count: '200+ Items',
    icon: 'fa-solid fa-tv',
    link: '/our-services/consumer-electronics?subcategory=Home+Appliances,Home+%26+Kitchen+Appliances,Air+Conditioners+%26+Cooling',
  },
];

/* ── Popular Search Chips ── */
const POPULAR_CHIPS = [
  'Gated Plots Bengaluru',
  '3 BHK Whitefield',
  'Maruti Brezza',
  'Orthopedic Mattress',
  '5 Star AC',
  'Home Loan',
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const touchStartX = useRef(0);
  const total = HERO_SLIDES.length;

  const [internalQuery, setInternalQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const cityDropdownRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { selectedCity, selectCity: setLocationCity } = useLocation();

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  /* Autoplay */
  useEffect(() => {
    if (isPaused || total <= 1) return;
    timerRef.current = setInterval(next, 6500);
    return () => clearInterval(timerRef.current);
  }, [isPaused, next, total]);

  /* Touch Swiping */
  const onTouchStart = (e) => { touchStartX.current = e.changedTouches[0].screenX; };
  const onTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].screenX;
    if (diff > 50) next();
    else if (diff < -50) prev();
  };

  /* Close city dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Search submission handler */
  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const q = internalQuery.trim();
    const targetTab = SEARCH_TABS.find((t) => t.id === activeCategory);
    const base = targetTab?.route || '/our-services/properties';
    navigate(`${base}${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  };

  const handleChipClick = (chipText) => {
    setInternalQuery(chipText);
    const targetTab = SEARCH_TABS.find((t) => t.id === activeCategory);
    const base = targetTab?.route || '/our-services/properties';
    navigate(`${base}?q=${encodeURIComponent(chipText)}`);
  };

  const activeSlide = HERO_SLIDES[current];

  return (
    <div className="relative w-full bg-slate-950 overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════
          1. Homez Hero Banner Style (Centered Typography & Cinema Slider)
          ═══════════════════════════════════════════════════════════ */}
      <section
        className="relative w-full min-h-[460px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[620px] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carousel"
        aria-label="Homez Hero Banner"
      >
        {/* Background Image Carousel with Homez Dark Overlay */}
        {HERO_SLIDES.map((slide, idx) => {
          const active = idx === current;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                active ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover scale-105 transition-transform duration-[4000ms] ease-out"
                loading={idx === 0 ? 'eager' : 'lazy'}
                fetchpriority={idx === 0 ? 'high' : 'auto'}
                draggable={false}
              />
              {/* Homez Signature Dark Overlay */}
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
            </div>
          );
        })}

        {/* ── Slide Arrows (Left/Right Chevrons) ── */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); prev(); }}
          className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
          aria-label="Previous slide"
        >
          <i className="fa-solid fa-chevron-left text-sm" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); next(); }}
          className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
          aria-label="Next slide"
        >
          <i className="fa-solid fa-chevron-right text-sm" />
        </button>

        {/* ── Center Banner Content (Homez `inner-banner-style1`) ── */}
        <div className="relative z-10 max-w-4xl mx-auto w-full pt-4 sm:pt-6">
          {/* Eyebrow / Subtitle (Homez `hero-sub-title`) */}
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-amber-400 text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em]">
              THE BEST WAY TO
            </span>
          </div>

          {/* Main Title (Homez `hero-title`) */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none drop-shadow-md">
            {activeSlide.title}
          </h1>

          {/* Subtitle (Homez `hero-text`) */}
          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-normal">
            {activeSlide.subtitle}
          </p>

          {/* ═══════════════════════════════════════════════════════════
              2. Homez Advance Search Tab (`advance-search-tab`)
              ═══════════════════════════════════════════════════════════ */}
          <div className="mt-8 sm:mt-10 w-full max-w-4xl mx-auto">
            {/* Nav Tabs */}
            <div className="flex items-center justify-start sm:justify-center gap-1 sm:gap-1.5 flex-nowrap overflow-x-auto scrollbar-hide mb-[-1px] relative z-10 px-1">
              {SEARCH_TABS.map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id)}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-extrabold rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-slate-950 shadow-md scale-[1.02]'
                        : 'bg-slate-900/80 text-white/80 hover:bg-slate-800 hover:text-white border border-white/10'
                    }`}
                  >
                    <i className={`${tab.icon} text-xs ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Advance Search Box (Homez `advance-content-style1`) */}
            <div className="bg-white rounded-2xl md:rounded-full p-2 sm:p-2.5 shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-2">
              {/* Search input with home icon */}
              <div className="relative flex-1 w-full flex items-center min-w-0 px-2">
                <i className="fa-solid fa-house-chimney text-slate-400 text-sm ml-2 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={internalQuery}
                  onChange={(e) => setInternalQuery(e.target.value)}
                  placeholder="Enter an address, neighborhood, city, or keywords..."
                  className="w-full rounded-full border-0 pl-3 pr-8 py-3 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                />
                {internalQuery && (
                  <button
                    type="button"
                    onClick={() => setInternalQuery('')}
                    className="absolute right-4 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <i className="fa-solid fa-xmark text-[10px]" />
                  </button>
                )}
              </div>

              {/* City / Locality Dropdown Selector */}
              <div className="relative shrink-0 w-full md:w-auto" ref={cityDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="w-full md:w-auto inline-flex items-center justify-between md:justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full px-4 py-3 text-xs sm:text-sm font-bold text-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <i className="fa-solid fa-location-dot text-brand-blue text-xs" />
                    <span>{getCityLabel(selectedCity)}</span>
                  </div>
                  <i
                    className={`fa-solid fa-chevron-down text-slate-400 text-[10px] transition-transform ${
                      showCityDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showCityDropdown && (
                  <div className="absolute left-0 md:right-0 md:left-auto top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl z-50 border border-slate-100 overflow-hidden py-1.5 text-left">
                    {Object.entries(cities).map(([id, city]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => { setLocationCity(id); setShowCityDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                          selectedCity === id
                            ? 'bg-blue-50 text-brand-blue'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{city.label}</span>
                        {selectedCity === id && <i className="fa-solid fa-check text-[10px] text-brand-blue" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Homez Signature Pill Search Button */}
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="w-full md:w-auto rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black px-7 py-3.5 text-xs sm:text-sm shadow-md hover:shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <i className="fa-solid fa-magnifying-glass text-xs" />
                <span>Search</span>
              </button>
            </div>

            {/* Trending Keywords (Homez style) */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <i className="fa-solid fa-fire text-amber-400 text-xs" /> Trending:
              </span>
              {POPULAR_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white px-3 py-1 text-xs font-semibold backdrop-blur-sm border border-white/10 transition-colors cursor-pointer active:scale-95"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Slide Indicators (Bottom of Hero) */}
        <div className="absolute bottom-4 z-20 flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. Homez "Explore Apartment Types" Category Boxes
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-12 sm:py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Homez Section Header (`main-title`) */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Explore Property &amp; Product Types
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Get inspired from 10,000+ verified listings across Bengaluru
              </p>
            </div>
            <Link
              to="/our-services/properties"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-blue border-b-2 border-slate-900 hover:border-brand-blue pb-0.5 transition-all self-start sm:self-auto"
            >
              <span>See All Categories</span>
              <i className="fa-solid fa-arrow-right text-xs" />
            </Link>
          </div>

          {/* 6 Category Icon Boxes (Homez `iconbox-style1`) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORY_ICON_BOXES.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                className="group bg-slate-50 hover:bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-brand-blue/30 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white group-hover:bg-amber-400 text-slate-700 group-hover:text-slate-950 flex items-center justify-center shadow-xs transition-colors duration-300 mb-3 border border-slate-100">
                  <i className={`${item.icon} text-base sm:text-lg`} />
                </div>
                <h3 className="font-extrabold text-slate-900 group-hover:text-brand-blue text-xs sm:text-sm transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                  {item.count}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
