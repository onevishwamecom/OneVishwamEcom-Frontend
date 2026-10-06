import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cities, getCityLabel } from '../../data/locations';
import { useLocation } from '../../store/locationSlice';
import { dummyProperties } from '../../data/dummyProperties';
import { dummyAutomobiles } from '../../data/dummyAutomobiles';
import { dummyElectronics } from '../../data/dummyElectronics';
import { dummyBedding } from '../../data/dummyBedding';
import { financeServices } from '../../data/dummyFinanceServices';
import { matchesSearch } from '../../utils/searchUtils';

const CATEGORY_TABS = [
  { id: 'all',                    label: 'All',          icon: 'fa-solid fa-layer-group' },
  { id: 'real-estate-property',   label: 'Houses & Land', icon: 'fa-solid fa-house-chimney', href: '/our-services/real-estate-property' },
  { id: 'automobile',             label: 'Vehicles',      icon: 'fa-solid fa-car',            href: '/our-services/automobile' },
  { id: 'consumer-electronics',   label: 'Electronics',   icon: 'fa-solid fa-tv',             href: '/our-services/consumer-electronics' },
  { id: 'bedding-comfort',        label: 'Bedding',       icon: 'fa-solid fa-bed',            href: '/our-services/bedding-comfort' },
  { id: 'finance-lending',        label: 'Finance',       icon: 'fa-solid fa-building-columns', href: '/our-services/finance-lending' },
];

const POPULAR_CHIPS = [
  'Gated Plots Bengaluru',
  'Maruti Brezza',
  'Orthopedic Mattress',
  '5 Star AC',
  'Home Loan',
];

/* Badge colour map per category */
const BADGE_CLS = {
  'Houses & Land':  'bg-blue-100 text-blue-800 border-blue-200',
  Vehicles:         'bg-emerald-100 text-emerald-800 border-emerald-200',
  Electronics:      'bg-rose-100 text-rose-800 border-rose-200',
  Bedding:          'bg-purple-100 text-purple-800 border-purple-200',
  'Finance & Loans': 'bg-amber-100 text-amber-900 border-amber-200',
};

export default function CategorySearchHero() {
  const [internalQuery, setInternalQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);

  const cityDropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { selectedCity, selectCity: setLocationCity } = useLocation();

  /* ── Click-outside closes both dropdowns ── */
  useEffect(() => {
    const handler = (e) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
        setShowCityDropdown(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowResultsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Universal Cross-Catalog Search ── */
  const searchResults = useMemo(() => {
    const q = internalQuery.trim();
    if (q.length < 2) return [];

    const results = [];

    if (activeCategory === 'all' || activeCategory === 'real-estate-property') {
      dummyProperties.forEach((p) => {
        if (matchesSearch(q, p.title, p.subtitle, p.location, p.bhk, p.propertyType, p.zone)) {
          results.push({
            id: `prop-${p.id}`,
            title: p.title,
            subtitle: `${p.location || 'Bengaluru'} · ${p.bhk || p.propertyType || 'Real Estate'}`,
            categoryLabel: 'Houses & Land',
            price: p.price === 'This is negotiable' ? null : p.price,
            image: p.images?.[0] || p.image,
            link: `/property/${p.id}`,
          });
        }
      });
    }

    if (activeCategory === 'all' || activeCategory === 'automobile') {
      dummyAutomobiles.forEach((v) => {
        if (matchesSearch(q, v.title, v.brand, v.model, v.location, v.fuelType, v.transmission, v.category)) {
          results.push({
            id: `veh-${v.id}`,
            title: v.title || `${v.brand} ${v.model}`,
            subtitle: `${v.location || 'Bengaluru'} · ${v.fuelType || ''} ${v.transmission || ''}`.trim(),
            categoryLabel: 'Vehicles',
            price: null, // hidden per user request
            image: v.images?.[0],
            link: `/vehicle/${v.id}`,
          });
        }
      });
    }

    if (activeCategory === 'all' || activeCategory === 'consumer-electronics') {
      dummyElectronics.forEach((e) => {
        if (matchesSearch(q, e.title, e.brand, e.model, e.location, e.category)) {
          results.push({
            id: `elec-${e.id}`,
            title: e.title,
            subtitle: `${e.location || 'Bengaluru'} · ${e.brand}`,
            categoryLabel: 'Electronics',
            price: e.price,
            image: e.images?.[0],
            link: `/electronics/${e.id}`,
          });
        }
      });
    }

    if (activeCategory === 'all' || activeCategory === 'bedding-comfort') {
      dummyBedding.forEach((b) => {
        if (matchesSearch(q, b.title, b.brand, b.location, b.category)) {
          results.push({
            id: `bed-${b.id}`,
            title: b.title,
            subtitle: `${b.location || 'Bengaluru'} · ${b.brand || 'Bedding'}`,
            categoryLabel: 'Bedding',
            price: b.price,
            image: b.images?.[0],
            link: `/bedding/${b.id}`,
          });
        }
      });
    }

    if (activeCategory === 'all' || activeCategory === 'finance-lending') {
      financeServices.forEach((f) => {
        if (matchesSearch(q, f.serviceName, f.category, f.interestRate, f.location)) {
          results.push({
            id: `fin-${f.id}`,
            title: f.serviceName,
            subtitle: `${f.location || 'Bengaluru'} · Interest ${f.interestRate || 'Competitive'}`,
            categoryLabel: 'Finance & Loans',
            price: 'Quick Approval',
            image: f.banner || f.logo,
            link: `/finance/${f.id}`,
          });
        }
      });
    }

    return results.slice(0, 8);
  }, [internalQuery, activeCategory]);

  const handleInputChange = (e) => {
    setInternalQuery(e.target.value);
    setShowResultsDropdown(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowResultsDropdown(false);
    const q = internalQuery.trim();
    const routeMap = {
      automobile: '/our-services/automobile',
      'consumer-electronics': '/our-services/consumer-electronics',
      'bedding-comfort': '/our-services/bedding-comfort',
      'finance-lending': '/our-services/finance-lending',
    };
    const base = routeMap[activeCategory] || '/our-services/real-estate-property';
    navigate(`${base}${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  };

  const handleChipClick = (chipText) => {
    setInternalQuery(chipText);
    setShowResultsDropdown(true);
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setInternalQuery('');
    setShowResultsDropdown(false);
    inputRef.current?.focus();
  };

  const isDropdownOpen = showResultsDropdown && internalQuery.trim().length >= 2;

  return (
    /* NOTE: NO overflow-hidden here — the results dropdown must escape this section */
    <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 sm:py-24 lg:py-28 border-t border-b border-slate-800/80 shadow-2xl">
      {/* Rich Glowing Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 10%, rgba(30,58,138,0.45) 0%, rgba(15,23,42,0.85) 60%, transparent 100%)' }}
      />
      {/* Ambient Highlight Glow behind Search */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"
      />
      {/* Subtle Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 border border-blue-500/30 px-3.5 py-1 text-[11px] font-extrabold text-blue-300 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Universal Marketplace Search
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight max-w-3xl mx-auto">
            Find Anything You Need{' '}
            <span className="text-amber-400 underline decoration-amber-400/40 decoration-4 underline-offset-4">
              Near You
            </span>
          </h2>

          {/* Subline */}
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Search verified properties, vehicles, electronics, bedding &amp; loans in{' '}
            <strong className="text-white">{getCityLabel(selectedCity)}</strong> — instantly.
          </p>

          {/* ── Search block — stretched wide ── */}
          <div className="mt-8 space-y-4 max-w-4xl mx-auto">

            {/* Category pills */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-extrabold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25 scale-[1.03]'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/70'
                    }`}
                  >
                    <i className={`${tab.icon} text-[10px] ${isActive ? 'text-slate-900' : 'text-amber-400'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search form + dropdown wrapper — overflow visible so dropdown escapes */}
            <div ref={searchContainerRef} className="relative">
              <form
                onSubmit={handleSearchSubmit}
                className={`bg-white flex flex-col sm:flex-row items-stretch gap-2 p-2 sm:p-2.5 rounded-2xl shadow-2xl transition-all ${
                  isDropdownOpen
                    ? 'ring-4 ring-amber-400/30 rounded-b-none border border-b-0 border-slate-200/80'
                    : 'border border-slate-200/60'
                }`}
              >
                {/* Search input */}
                <div className="relative flex-1 flex items-center min-w-0">
                  <i className="fa-solid fa-magnifying-glass absolute left-4 text-slate-400 text-sm pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={internalQuery}
                    onChange={handleInputChange}
                    onFocus={() => setShowResultsDropdown(true)}
                    placeholder="Search properties, cars, ACs, mattresses, loans…"
                    className="w-full rounded-xl border-0 pl-11 pr-10 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                  />
                  {internalQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                      aria-label="Clear search"
                    >
                      <i className="fa-solid fa-xmark text-[10px]" />
                    </button>
                  )}
                </div>

                {/* City selector */}
                <div
                  className="relative shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-2"
                  ref={cityDropdownRef}
                >
                  <button
                    type="button"
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-2 bg-slate-100 hover:bg-slate-200 rounded-xl px-3.5 py-3 text-xs font-extrabold text-slate-800 transition-colors cursor-pointer"
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
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl z-50 border border-slate-100 overflow-hidden py-1 text-left">
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

                {/* Submit button */}
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 px-6 py-3 text-sm font-black shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  <i className="fa-solid fa-magnifying-glass text-xs" />
                  Search
                </button>
              </form>

              {/* ── Results dropdown (attaches flush to search form bottom) ── */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full bg-white border border-slate-200/80 border-t-0 rounded-b-2xl shadow-2xl z-50 overflow-hidden text-left">
                  {/* Header */}
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-bolt text-amber-500 text-[10px]" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        Instant Results
                      </span>
                      {searchResults.length > 0 && (
                        <span className="bg-brand-blue text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                          {searchResults.length}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold cursor-pointer transition-colors"
                    >
                      Clear <i className="fa-solid fa-xmark ml-0.5" />
                    </button>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
                      {searchResults.map((item) => (
                        <Link
                          key={item.id}
                          to={item.link}
                          onClick={() => setShowResultsDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50/60 group transition-colors cursor-pointer"
                        >
                          {/* Thumbnail */}
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                              <i className="fa-solid fa-box-open text-sm" />
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span
                                className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold border shrink-0 ${
                                  BADGE_CLS[item.categoryLabel] || 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                {item.categoryLabel}
                              </span>
                              <span className="text-[13px] font-bold text-slate-900 truncate group-hover:text-brand-blue transition-colors">
                                {item.title}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                          </div>

                          {/* Price / CTA */}
                          <div className="shrink-0 flex items-center gap-2">
                            {item.price ? (
                              <span className="text-xs font-extrabold text-slate-800 whitespace-nowrap">
                                {item.price}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full transition-colors whitespace-nowrap">
                                Visit for Info
                                <i className="fa-solid fa-arrow-right text-[9px]" />
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}

                      {/* See all footer */}
                      <button
                        type="button"
                        onClick={handleSearchSubmit.bind(null, { preventDefault: () => {} })}
                        className="w-full px-4 py-3 text-xs font-bold text-brand-blue hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        See all results for "{internalQuery}"
                        <i className="fa-solid fa-arrow-right text-[10px]" />
                      </button>
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                        <i className="fa-solid fa-magnifying-glass text-slate-400 text-sm" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No matches found</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Try <em>Brezza</em>, <em>Flat</em>, <em>AC</em>, <em>Plot</em>, or <em>Home Loan</em>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Popular chip tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <i className="fa-solid fa-fire text-amber-400 text-[10px]" /> Trending:
              </span>
              {POPULAR_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1 text-[11px] font-semibold border border-slate-700/60 transition-all cursor-pointer active:scale-95"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Trust bar */}
          <div className="mt-10 pt-6 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-circle-check text-emerald-400" />
              100% Verified Sellers
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-shield-halved text-amber-400" />
              Direct Showroom Pricing
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-headset text-blue-400" />
              Instant Support
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
