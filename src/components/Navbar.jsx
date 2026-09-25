import { useCallback, useEffect, useRef, useState } from 'react';
import logo from '../assets/logo.png';
import { navLinks } from '../data/siteContent';
import { marketplaceCategories } from '../data/categoriesData';
import { cities, getCityLabel } from '../data/locations';
import { useLocation } from '../store/locationSlice';
import { detectCurrentLocation } from '../utils/detectLocation';
import { PROPERTIES_ONLY } from '../config/appConfig';
import { Link, useLocation as useRouterLocation } from 'react-router-dom';
import VerticalRibbonBar from './VerticalRibbonBar';
import HitCounterBanner from './HitCounterBanner';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const currentLocation = useRouterLocation();
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'categories', 'more', 'location', or null
  const menuRef = useRef(null);
  const categoryRef = useRef(null);
  const closeTimerRef = useRef(null);
  const locationRef = useRef(null);
  const { selectedCity, selectArea, selectCity, detectStatus, setDetectStatus } = useLocation();

  const visibleNavLinks = navLinks;

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
      const clickedOutsideCategory = !categoryRef.current || !categoryRef.current.contains(e.target);
      const clickedOutsideMore = !menuRef.current || !menuRef.current.contains(e.target);
      const clickedOutsideLocation = !locationRef.current || !locationRef.current.contains(e.target);
      if (clickedOutsideCategory && clickedOutsideMore && clickedOutsideLocation) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
    setMenuOpen(false);
    setMobileCategoryOpen(false);
  }, [currentLocation.pathname]);

  const isCategoryActive =
    currentLocation.pathname.startsWith('/our-services') ||
    currentLocation.pathname.startsWith('/property') ||
    currentLocation.pathname.startsWith('/automobile') ||
    currentLocation.pathname.startsWith('/vehicle') ||
    currentLocation.pathname.startsWith('/bedding') ||
    currentLocation.pathname.startsWith('/electronics') ||
    currentLocation.pathname.startsWith('/grocery') ||
    currentLocation.pathname.startsWith('/garment') ||
    currentLocation.pathname.startsWith('/jewellery') ||
    currentLocation.pathname.startsWith('/finance');

  const isActive = (link) => {
    const path = currentLocation.pathname;
    if (link.id === 'home') return path === '/' || path === '/home';
    if (link.id === 'category' || link.id === 'categories') return isCategoryActive;
    if (link.id === 'about') return path.startsWith('/about-us');
    if (link.id === 'enquiry' || link.id === 'contact') return path.startsWith('/enquiry') || path.startsWith('/contact-us');
    if (link.id === 'careers') return path.startsWith('/careers');
    return false;
  };

  const aboutLink = visibleNavLinks.find((l) => l.id === 'about');
  const enquiryLink = visibleNavLinks.find((l) => l.id === 'enquiry');

  const renderNavLink = (link) => {
    if (!link) return null;
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
            id={`${link.id}-dropdown-trigger`}
            aria-controls={`${link.id}-dropdown-menu`}
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
              id={`${link.id}-dropdown-menu`}
              role="menu"
              aria-labelledby={`${link.id}-dropdown-trigger`}
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
      <Link
        key={link.id}
        to={link.href}
        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${active ? 'text-brand-blue bg-brand-blue/5' : 'text-gray-700 hover:text-brand-blue hover:bg-gray-50'}`}
      >
        {link.label}
      </Link>
    );
  };

  const renderMobileNavLink = (link) => {
    if (!link) return null;
    return (
      <div key={link.id}>
        <Link
          to={link.href}
          onClick={() => setMenuOpen(false)}
          className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive(link) ? 'text-brand-blue bg-brand-blue/5' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          {link.label}
        </Link>
        {link.submenu && (
          <div className="ml-4 mt-1 space-y-0.5">
            {link.submenu.columns.flat().map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 hover:text-brand-blue transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white shadow-xs'}`}>
        <HitCounterBanner />
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-14">
            <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Vishwam Home">
              <img src={logo} alt="Vishwam Logo" className="h-8 w-auto" />
            </Link>

            <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {/* Home Link */}
              <Link
                to="/home"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentLocation.pathname === '/' || currentLocation.pathname === '/home'
                    ? 'text-brand-blue bg-brand-blue/5 font-semibold'
                    : 'text-gray-700 hover:text-brand-blue hover:bg-gray-50'
                }`}
              >
                Home
              </Link>

              {/* Category Dropdown Menu */}
              {/* About Us Link */}
              {renderNavLink(aboutLink)}

              {/* Enquiry Link */}
              {renderNavLink(enquiryLink)}

              {/* Categories Dropdown Menu */}
              <div
                ref={categoryRef}
                className="relative"
                onMouseEnter={() => showDropdown('categories')}
                onMouseLeave={hideDropdown}
              >
                <button
                  type="button"
                  id="category-dropdown-trigger"
                  aria-controls="category-dropdown-menu"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'categories'}
                  onClick={() => toggleDropdown('categories')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isCategoryActive
                      ? 'text-brand-blue bg-brand-blue/5 font-semibold'
                      : 'text-gray-700 hover:text-brand-blue hover:bg-gray-50'
                  }`}
                >
                  <span>Categories</span>
                  <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${openDropdown === 'categories' ? 'rotate-180 text-brand-blue' : 'text-gray-400'}`} />
                </button>

                {openDropdown === 'categories' && (
                  <div
                    id="category-dropdown-menu"
                    role="menu"
                    aria-labelledby="category-dropdown-trigger"
                    className="absolute left-0 top-full pt-1.5 w-[580px] max-w-[calc(100vw-2rem)] z-50 animate-fade-in"
                  >
                    <div className="rounded-2xl border border-gray-100 bg-white shadow-xl shadow-slate-200/70 overflow-hidden ring-1 ring-black/5">
                      {/* Dropdown Header */}
                      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-2 w-2 rounded-full bg-brand-blue" />
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                            Marketplace Categories
                          </span>
                        </div>
                        <Link
                          to="/our-services"
                          onClick={() => setOpenDropdown(null)}
                          className="text-xs font-semibold text-brand-blue hover:text-brand-navy inline-flex items-center gap-1 group"
                        >
                          <span>All Services</span>
                          <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>

                      {/* Categories Grid */}
                      <div className="p-3 grid grid-cols-2 gap-1.5 max-h-[440px] overflow-y-auto">
                        {marketplaceCategories.map((cat) => {
                          const isItemActive = currentLocation.pathname === cat.href;

                          if (cat.disabled) {
                            return (
                              <div
                                key={cat.id}
                                role="menuitem"
                                aria-disabled="true"
                                className="flex items-start gap-3 p-2.5 rounded-xl opacity-40 cursor-not-allowed select-none bg-gray-50/50"
                              >
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm bg-gray-100 text-gray-400">
                                  <i className={cat.icon} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-500 truncate">
                                      {cat.label}
                                    </h4>
                                    <span className="text-[10px] font-semibold text-gray-400 bg-gray-200/70 px-1.5 py-0.5 rounded">
                                      Coming Soon
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-400 truncate mt-0.5">
                                    {cat.shortDesc}
                                  </p>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <Link
                              key={cat.id}
                              to={cat.href}
                              role="menuitem"
                              onClick={() => setOpenDropdown(null)}
                              className={`group flex items-start gap-3 p-2.5 rounded-xl transition-all duration-150 ${
                                isItemActive
                                  ? 'bg-brand-blue/5 ring-1 ring-brand-blue/20'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm transition-all duration-150 ${
                                  isItemActive
                                    ? 'bg-brand-blue text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 group-hover:bg-brand-blue group-hover:text-white'
                                }`}
                              >
                                <i className={cat.icon} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className={`text-sm font-semibold truncate ${
                                    isItemActive ? 'text-brand-blue' : 'text-gray-800 group-hover:text-brand-blue'
                                  }`}>
                                    {cat.label}
                                  </h4>
                                  <i className="fa-solid fa-chevron-right text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                </div>
                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                  {cat.shortDesc}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Dropdown Footer */}
                      <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-gray-500">Looking for custom partnership or listing?</span>
                        <Link
                          to="/enquiry"
                          onClick={() => setOpenDropdown(null)}
                          className="font-semibold text-brand-blue hover:text-brand-navy inline-flex items-center gap-1"
                        >
                          Contact Team <i className="fa-solid fa-chevron-right text-[10px]" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>


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
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-base`} />
            </button>
          </div>
        </div>
        <VerticalRibbonBar />
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
          {/* Home Link */}
          <Link
            to="/home"
            onClick={() => setMenuOpen(false)}
            className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              currentLocation.pathname === '/' || currentLocation.pathname === '/home'
                ? 'text-brand-blue bg-brand-blue/5 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Home
          </Link>

          {/* Category Accordion */}
          {/* About Us Link */}
          {renderMobileNavLink(aboutLink)}

          {/* Enquiry Link */}
          {renderMobileNavLink(enquiryLink)}

          {/* Categories Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setMobileCategoryOpen((prev) => !prev)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isCategoryActive ? 'text-brand-blue bg-brand-blue/5 font-semibold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>Category</span>
              <span>Categories</span>
              <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${mobileCategoryOpen ? 'rotate-180 text-brand-blue' : 'text-gray-400'}`} />
            </button>

            {mobileCategoryOpen && (
              <div className="ml-4 pl-3 my-1.5 border-l-2 border-brand-blue/20 space-y-0.5">
                {marketplaceCategories.map((cat) => {
                  if (cat.disabled) {
                    return (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg text-gray-400 opacity-40 cursor-not-allowed select-none"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <i className={`${cat.icon} w-4 text-center text-gray-300`} />
                          <span className="truncate">{cat.label}</span>
                        </div>
                        <span className="text-[9px] font-semibold text-gray-400 bg-gray-200/70 px-1.5 py-0.5 rounded shrink-0">
                          Coming Soon
                        </span>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={cat.id}
                      to={cat.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        currentLocation.pathname === cat.href
                          ? 'text-brand-blue bg-brand-blue/5 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-brand-blue'
                      }`}
                    >
                      <i className={`${cat.icon} w-4 text-center text-gray-400`} />
                      <span className="truncate">{cat.label}</span>
                    </Link>
                  );
                })}
                <Link
                  to="/our-services"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-brand-blue rounded-lg hover:bg-brand-blue/5 transition-colors"
                >
                  <i className="fa-solid fa-arrow-right w-4 text-center" />
                  <span>View All Categories</span>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;