import { useCallback, useEffect, useRef, useState } from 'react';
import logo from '../assets/logo.png';
import { navLinks } from '../data/siteContent';
import { cities, getCityLabel } from '../data/locations';
import { useLocation } from '../store/locationSlice';
import { detectCurrentLocation } from '../utils/detectLocation';
import { navigateTo } from '../config/navigation';
import { useLocation as useRouterLocation } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentLocation = useRouterLocation();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const menuRef = useRef(null);
  const closeTimerRef = useRef(null);
  const locationRef = useRef(null);
  const { selectedCity, selectArea, selectCity, detectStatus, setDetectStatus } = useLocation();

  useEffect(() => {
    if (locationOpen) setDetectStatus('idle');
  }, [locationOpen, setDetectStatus]);

  const handleDetect = useCallback(async (close) => {
    setDetectStatus('detecting');
    try {
      const result = await detectCurrentLocation();
      if (result) {
        selectArea(result.cityId, result.area);
        close();
      } else {
        setDetectStatus('unsupported');
      }
    } catch {
      setDetectStatus('error');
    }
  }, [selectArea, setDetectStatus]);

  const handleSelectCity = (cityId, close) => {
    selectCity(cityId);
    setDetectStatus('idle');
    close();
  };

  const detectButton = (close) => (
    <button onClick={() => handleDetect(close)}
      disabled={detectStatus === 'detecting'}
      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
    >
      {detectStatus === 'detecting' ? (
        <i className="fa-solid fa-spinner text-brand-blue animate-spin w-4" />
      ) : detectStatus === 'unsupported' ? (
        <i className="fa-solid fa-triangle-exclamation text-amber-500 w-4" />
      ) : (
        <i className="fa-solid fa-crosshairs text-brand-blue w-4" />
      )}
      <span className="flex-1 text-left">
        {detectStatus === 'detecting' ? 'Detecting...' :
         detectStatus === 'unsupported' ? 'Location not covered yet' :
         'Detect My Location'}
      </span>
    </button>
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') { setMenuOpen(false); setActiveDropdown(null); setLocationOpen(false); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setLocationOpen(!locationOpen);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [locationOpen]);

  const isActive = (link) => {
    const path = currentLocation.pathname;
    if (link.id === 'home') return path === '/' || path === '/home';
    if (link.id === 'properties') return path.startsWith('/our-services/real-estate-property') || path.startsWith('/property/');
    if (link.id === 'automobiles') return path.startsWith('/our-services/automobile') || path.startsWith('/vehicle/');
    if (link.id === 'finance') return path.startsWith('/our-services/finance-lending') || path.startsWith('/finance-service') || path.startsWith('/add-finance-service') || path.startsWith('/finance/') || path.startsWith('/finance-flow');
    if (link.id === 'groceries') return path.startsWith('/our-services/consumer-marketplace') || path.startsWith('/grocery/');
    if (link.id === 'garments') return path.startsWith('/our-services/garments-fashion-lifestyle') || path.startsWith('/garment/');
    return false;
  };

  return (
    <div>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'}`}>
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-14">
            <a href="/" onClick={(e) => { e.preventDefault(); navigateTo('/'); }} className="flex items-center gap-2 shrink-0" aria-label="Vishwam Home">
              <img src={logo} alt="Vishwam Logo" className="h-8 w-auto" />
            </a>

            <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {navLinks.map((link) => {
                const active = isActive(link);
                if (link.submenu) {
                  return (
                    <div key={link.id} className="relative" onMouseEnter={() => setActiveDropdown(link.id)} onMouseLeave={() => setActiveDropdown(null)}>
                      <button type="button"
                        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${active ? 'text-brand-blue bg-brand-blue/5' : 'text-gray-700 hover:text-brand-blue hover:bg-gray-50'}`}
                        aria-haspopup="true"
                        aria-expanded={activeDropdown === link.id}
                      >
                        {link.label}
                        <i className={`fa-solid fa-chevron-down text-xs transition-transform ${activeDropdown === link.id ? 'rotate-180' : ''}`} />
                      </button>
                      {activeDropdown === link.id && (
                        <div className="absolute left-0 top-full mt-1.5 min-w-[200px] rounded-xl border border-gray-100 bg-white shadow-lg py-2 z-50 animate-fade-in"
                             onMouseEnter={() => setActiveDropdown(link.id)}
                             onMouseLeave={() => setActiveDropdown(null)}>
                          {link.submenu.columns.map((col, ci) => (
                            <div key={ci} className="border-r border-gray-100 last:border-r-0">
                              {col.map((item) => (
                                <a key={item.label} href={item.href} onClick={(e) => { e.preventDefault(); navigateTo(item.href); setActiveDropdown(null); }}
                                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-blue transition-colors"
                                >
                                  {item.label}
                                </a>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <a key={link.id} href={link.href} onClick={(e) => { e.preventDefault(); if (link.href !== '#') navigateTo(link.href); }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${active ? 'text-brand-blue bg-brand-blue/5' : 'text-gray-700 hover:text-brand-blue hover:bg-gray-50'}`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <div className="relative" onMouseEnter={() => setLocationOpen(true)} onMouseLeave={() => setLocationOpen(false)}>
                <button type="button"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  aria-haspopup="true"
                  aria-expanded={locationOpen}
                >
                  <i className="fa-solid fa-location-dot text-brand-blue" />
                  <span className="hidden sm:inline truncate max-w-[120px]">{getCityLabel(selectedCity)}</span>
                  <i className={`fa-solid fa-chevron-down text-xs transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
                </button>
                {locationOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border border-gray-100 bg-white shadow-lg py-2 z-50 animate-fade-in"
                       onMouseEnter={() => setLocationOpen(true)}
                       onMouseLeave={() => setLocationOpen(false)}>
                    <div className="px-3 py-2">
                      {detectButton(() => setLocationOpen(false))}
                    </div>
                    <hr className="my-1.5 border-gray-100 mx-2" />
                    <div className="max-h-48 overflow-y-auto px-2">
                      {Object.entries(cities).map(([cityId, city]) => (
                        <button key={cityId} onClick={() => handleSelectCity(cityId, () => setLocationOpen(false))}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCity === cityId ? 'bg-brand-blue/5 text-brand-blue font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          {city.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <a href="/contact-us/" onClick={(e) => { e.preventDefault(); navigateTo('/contact-us/'); }}
                className="hidden sm:inline-flex items-center gap-2 bg-brand-blue text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-brand-navy transition-colors"
              >
                <i className="fa-solid fa-phone" /> Enquire Now
              </a>
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-base`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile sidebar */}
      <div className={`fixed top-0 right-0 z-[60] h-full w-72 bg-white shadow-xl transition-transform overflow-y-auto lg:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <span className="font-bold text-brand-navy">Menu</span>
          <button onClick={() => setMenuOpen(false)} className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="p-4 border-b">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Your Location</p>
          <div className="space-y-1">
            {detectButton(() => setMenuOpen(false))}
            <hr className="my-1.5 border-gray-100" />
            {Object.entries(cities).map(([cityId, city]) => (
              <button key={cityId} onClick={() => handleSelectCity(cityId, () => setMenuOpen(false))}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  selectedCity === cityId
                    ? 'bg-brand-blue/5 text-brand-blue font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navLinks.map((link) => (
            <div key={link.id}>
              <a href={link.href} onClick={(e) => { e.preventDefault(); if (link.href !== '#') navigateTo(link.href); setMenuOpen(false); }}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link) ? 'text-brand-blue bg-brand-blue/5' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </a>
              {link.submenu && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {link.submenu.columns.flat().map((item) => (
                    <a key={item.label} href={item.href} onClick={(e) => { e.preventDefault(); navigateTo(item.href); setMenuOpen(false); }}
                      className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 hover:text-brand-blue transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <hr className="my-3" />
          <a href="/contact-us/" onClick={(e) => { e.preventDefault(); navigateTo('/contact-us/'); setMenuOpen(false); }}
            className="flex items-center justify-center gap-2 bg-brand-blue text-white px-5 py-3 text-sm font-semibold rounded-lg"
          >
            <i className="fa-solid fa-phone" /> Enquire Now
          </a>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;