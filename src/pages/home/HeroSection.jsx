import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cities, getCityLabel } from '../../data/locations';
import { useLocation } from '../../store/locationSlice';
import { PROPERTIES_ONLY } from '../../config/appConfig';

const categoryCards = [
  { icon: 'fa-solid fa-house-chimney', label: 'Real Estate', bg: 'bg-blue-100', iconColor: 'text-blue-600', href: '/our-services/real-estate-property' },
  { icon: 'fa-solid fa-car', label: 'Vehicles', bg: 'bg-green-100', iconColor: 'text-green-600', href: '/our-services/automobile' },
  { icon: 'fa-solid fa-gem', label: 'Jewellery', bg: 'bg-purple-100', iconColor: 'text-purple-600', href: '/our-services/jewellery-gold' },
  { icon: 'fa-solid fa-briefcase', label: 'Jobs', bg: 'bg-amber-100', iconColor: 'text-amber-600', href: '/our-services/hr-staffing' },
  { icon: 'fa-solid fa-wrench', label: 'Services', bg: 'bg-teal-100', iconColor: 'text-teal-600', href: '/our-services/' },
  { icon: 'fa-solid fa-laptop', label: 'Electronics', bg: 'bg-rose-100', iconColor: 'text-rose-600', href: '/our-services/consumer-marketplace' },
  { icon: 'fa-solid fa-store', label: 'More Categories', bg: 'bg-gray-100', iconColor: 'text-gray-600', href: '/our-services/' },
];

function HeroSection({ searchQuery, setSearchQuery }) {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityDropdownRef = useRef(null);
  const { selectedCity, selectCity: setLocationCity } = useLocation();

  useEffect(() => {
    if (!showCityDropdown) return;
    const handler = (e) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showCityDropdown]);

  return (
    <section className="relative bg-gradient-to-br from-brand-navy via-brand-blue to-brand-navy overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
            Find Your Dream Home{' '}
            <span className="text-yellow-400">Near You</span>
          </h1>

          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {PROPERTIES_ONLY
              ? 'Houses, plots, apartments and rental homes near you. See what is available or share your property.'
              : 'Find houses, cars, jewellery, jobs, services, and more near you. See what is available or share your item.'}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={PROPERTIES_ONLY ? "/our-services/real-estate-property" : "/our-services/"}
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-brand-navy px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-yellow-300 transition-colors whitespace-nowrap"
            >
              <i className="fa-solid fa-list" /> {PROPERTIES_ONLY ? 'See Available Properties' : 'See Available Items'}
            </Link>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-stretch gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full rounded-xl border-0 pl-11 pr-4 py-3.5 text-sm shadow-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>
            <div className="relative shrink-0" ref={cityDropdownRef}>
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="w-full sm:w-auto inline-flex items-center gap-2 bg-white rounded-xl px-4 py-3.5 text-sm shadow-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <i className="fa-solid fa-location-dot text-brand-blue" />
                <span>{getCityLabel(selectedCity)}</span>
                <i className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showCityDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-20 border border-gray-100 overflow-hidden">
                  {Object.entries(cities).map(([id, city]) => (
                    <button
                      key={id}
                      onClick={() => { setLocationCity(id); setShowCityDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${selectedCity === id ? 'bg-brand-blue/5 text-brand-blue font-semibold' : 'text-gray-700'}`}
                    >
                      {city.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {!PROPERTIES_ONLY && (
            <div className="mt-10">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {categoryCards.map((cat) => (
                  <Link key={cat.label} to={cat.href}
                    className={`flex flex-col items-center gap-2 ${cat.bg} rounded-2xl px-3 py-5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer`}
                  >
                    <i className={`${cat.icon} text-2xl ${cat.iconColor}`} />
                    <span className="text-xs font-semibold text-center leading-tight text-gray-800">{cat.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <p className="mt-10 text-sm text-white/70 max-w-xl mx-auto">
            <i className="fa-solid fa-shield-halved mr-1.5 text-yellow-400/80" />
            Buy, sell, or rent. Find everything you need near you.
          </p>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;

