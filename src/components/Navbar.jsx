import { useCallback, useEffect, useRef, useState } from 'react';
import logo from '../assets/logo.png';
import { navLinks } from '../data/siteContent';
import { cities, getCityLabel } from '../data/locations';
import { useLocation } from '../store/locationSlice';
import { detectCurrentLocation } from '../utils/detectLocation';
import { Link, useLocation as useRouterLocation } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentLocation = useRouterLocation();
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'more', 'location', or null
  const menuRef = useRef(null);
  const closeTimerRef = useRef(null);
  const locationRef = useRef(null);
  const { selectedCity, selectArea, selectCity, detectStatus, setDetectStatus } = useLocation();

  const showDropdown = useCallback((name) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDropdown(name);
  }, []);

  const hideDropdown = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  }, []);

  const toggleDropdown = useCallback((name) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDropdown((prev) => (prev === name ? null : name));
  }, []);

  useEffect(() => {
    if (openDropdown === 'location') setDetectStatus('idle');
  }, [openDropdown, setDetectStatus]);

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
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setOpenDropdown(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        toggleDropdown('location');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggleDropdown]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const clickedOutsideMore = !menuRef.current || !menuRef.current.contains(e.target);
      const clickedOutsideLocation = !locationRef.current || !locationRef.current.contains(e.target);
      if (clickedOutsideMore && clickedOutsideLocation) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
    setMenuOpen(false);
  }, [currentLocation.pathname]);

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
            <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Vishwam Home">
              <img src={logo} alt="Vishwam Logo" className="h-8 w-auto" />
            </Link>

            <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {navLinks.map((link) => {
                const active = isActive(link);
                if (link.submenu) {
                  return (
                    <div
                      key={link.id}
                      ref={menuRef}
                      className="relative"
                      onMouseEnter={() => showDropdown(link.id)}
                      onMouseLeave={hideDropdown}
                    >
                      <button
                        type="button"
                        id="more-dropdown-trigger"
                        aria-controls="more-dropdown-menu"
                        aria-haspopup="true"
                        aria-expanded={openDropdown === link.id}
                        onClick={() => toggleDropdown(link.id)}
                        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${active ? 'text-brand-blue bg-brand-blue/5' : 'text-gray-700 hover:text-brand-blue hover:bg-gray-50'}`}
                      >
                        {link.label}
                        <i className={`fa-solid fa-chevron-down text-xs transition-transform ${openDropdown === link.id ? 'rotate-180' : ''}`} />
                      </button>
                      {openDropdown === link.id && (
                        <div
                          id="more-dropdown-menu"
                          role="menu"
                          aria-labelledby="more-dropdown-trigger"
                          className="absolute left-0 top-full pt-1.5 min-w-[200px] z-50 animate-fade-in"
                        >
                          <div className="rounded-xl border border-gray-100 bg-white shadow-lg py-2">
                            {link.submenu.columns.map((col, ci) => (
                              <div key={ci} className="border-r border-gray-100 last:border-r-0">
                                {col.map((item) => (
                                  <Link
                                    key={item.label}
                                    to={item.href}
                                    role="menuitem"
                                    onClick={() => setOpenDropdown(null)}
                                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-blue transition-colors"
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link key={link.id} to={link.href}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${active ? 'text-brand-blue bg-brand-blue/5' : 'text-gray-700 hover:text-brand-blue hover:bg-gray-50'}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <div
                className="relative"
                ref={locationRef}
                onMouseEnter={() => showDropdown('location')}
                onMouseLeave={hideDropdown}
              >
                <button
                  type="button"
                  id="location-dropdown-trigger"
                  aria-controls="location-dropdown-menu"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'location'}
                  onClick={() => toggleDropdown('location')}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <i className="fa-solid fa-location-dot text-brand-blue" />
                  <span className="hidden sm:inline truncate max-w-[120px]">{getCityLabel(selectedCity)}</span>
                  <i className={`fa-solid fa-chevron-down text-xs transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'location' && (
                  <div
                    id="location-dropdown-menu"
                    role="menu"
                    aria-labelledby="location-dropdown-trigger"
                    className="absolute right-0 top-full pt-1.5 w-56 z-50 animate-fade-in"
                  >
                    <div className="rounded-xl border border-gray-100 bg-white shadow-lg py-2">
                      <div className="px-3 py-2">
                        {detectButton(() => setOpenDropdown(null))}
                      </div>
                      <hr className="my-1.5 border-gray-100 mx-2" />
                      <div className="max-h-48 overflow-y-auto px-2">
                        {Object.entries(cities).map(([cityId, city]) => (
                          <button
                            key={cityId}
                            onClick={() => handleSelectCity(cityId, () => setOpenDropdown(null))}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCity === cityId ? 'bg-brand-blue/5 text-brand-blue font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            {city.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/contact-us/"
                className="hidden sm:inline-flex items-center gap-2 bg-brand-blue text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-brand-navy transition-colors"
              >
                <i className="fa-solid fa-phone" /> Enquire Now
              </Link>
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
              <Link to={link.href} onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link) ? 'text-brand-blue bg-brand-blue/5' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
              {link.submenu && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {link.submenu.columns.flat().map((item) => (
                    <Link key={item.label} to={item.href} onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 hover:text-brand-blue transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <hr className="my-3" />
          <Link to="/contact-us/" onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 bg-brand-blue text-white px-5 py-3 text-sm font-semibold rounded-lg"
          >
            <i className="fa-solid fa-phone" /> Enquire Now
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;