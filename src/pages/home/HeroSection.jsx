import { useState, useRef, useEffect, useCallback } from 'react';
import { navigateTo } from '../../config/navigation';
import { cities, getCityLabel } from '../../data/locations';
import { useLocation } from '../../store/locationSlice';
import { detectCurrentLocation } from '../../utils/detectLocation';

function HeroSection({ searchQuery, setSearchQuery }) {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityDropdownRef = useRef(null);
  const { selectedCity, selectedArea, selectCity: setLocationCity, selectArea, detectStatus, setDetectStatus } = useLocation();

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

  const handleDetectGPS = useCallback(async () => {
    setDetectStatus('detecting');
    try {
      const result = await detectCurrentLocation();
      if (result) {
        selectArea(result.cityId, result.area);
        setShowCityDropdown(false);
      } else {
        setDetectStatus('unsupported');
      }
    } catch {
      setDetectStatus('error');
    }
  }, [selectArea, setDetectStatus]);

  return (
    <section className="relative bg-gradient-to-br from-brand-navy via-[#1d4c93] to-brand-navy overflow-hidden py-16 sm:py-20 lg:py-24">
      {/* Decorative background overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50 pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
            Find Anything You Need{' '}
            <span className="text-yellow-400">Near You</span>
          </h1>

          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed font-normal">
            Find houses, cars, jewellery, jobs, services, and more near you. See what is available or share your item.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/our-services/"
              onClick={(e) => { e.preventDefault(); navigateTo('/our-services/'); }}
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-brand-navy px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-yellow-300 shadow-md transition-all whitespace-nowrap"
            >
              <i className="fa-solid fa-list" /> See Available Items
            </a>
            {/* <a href="/add-listing/" onClick={(e) => { e.preventDefault(); navigateTo('/add-listing/'); }}
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-brand-navy px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-yellow-300 shadow-md transition-all whitespace-nowrap"
            >
              <i className="fa-solid fa-plus" /> Post Your Listing
            </a> */}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-stretch gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full rounded-xl border-0 pl-11 pr-4 py-3.5 text-sm shadow-xl focus:ring-2 focus:ring-yellow-400 outline-none text-gray-900 bg-white placeholder:text-gray-400"
              />
            </div>
            <div className="relative shrink-0" ref={cityDropdownRef}>
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="w-full sm:w-auto inline-flex items-center gap-2 bg-white rounded-xl px-4 py-3.5 text-sm shadow-xl font-semibold text-gray-800 hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <i className="fa-solid fa-location-dot text-brand-blue" />
                <span>{selectedArea ? `${getCityLabel(selectedCity)} (${selectedArea})` : getCityLabel(selectedCity)}</span>
                <i className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showCityDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl z-30 border border-gray-100 overflow-hidden text-left">
                  {/* GPS Location Button */}
                  <button
                    onClick={handleDetectGPS}
                    disabled={detectStatus === 'detecting'}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 text-brand-blue font-semibold border-b border-gray-100 disabled:opacity-60"
                  >
                    {detectStatus === 'detecting' ? (
                      <i className="fa-solid fa-circle-notch animate-spin text-brand-blue" />
                    ) : (
                      <i className="fa-solid fa-crosshairs text-brand-blue" />
                    )}
                    <span>{detectStatus === 'detecting' ? 'Detecting Location...' : 'Use Current Location (GPS)'}</span>
                  </button>
                  {detectStatus === 'error' && (
                    <p className="px-4 py-1.5 text-xs text-red-500 bg-red-50">Location access denied or unavailable</p>
                  )}
                  {detectStatus === 'unsupported' && (
                    <p className="px-4 py-1.5 text-xs text-amber-600 bg-amber-50">Location outside supported regions</p>
                  )}

                  {/* City List */}
                  <div className="py-1">
                    <p className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Select City</p>
                    {Object.entries(cities).map(([id, city]) => (
                      <button
                        key={id}
                        onClick={() => { setLocationCity(id); setDetectStatus('idle'); setShowCityDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${selectedCity === id ? 'bg-brand-blue/10 text-brand-blue font-bold' : 'text-gray-700'}`}
                      >
                        {city.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="mt-10 text-sm text-white/90 max-w-xl mx-auto flex items-center justify-center gap-2 font-medium">
            <i className="fa-solid fa-shield-halved text-yellow-400" />
            Buy, sell, or rent. Find everything you need near you.
          </p>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;
