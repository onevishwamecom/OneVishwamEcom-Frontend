import { useCallback, useEffect, useRef, useState } from 'react';
import logo from '../assets/logo.png';
import { navLinks } from '../data/siteContent';
import { cities, getCityLabel } from '../data/locations';
import { useLocation } from '../store/locationSlice';
import { useAuth } from '../store/authSlice';
import { detectCurrentLocation } from '../utils/detectLocation';
import { navigateTo } from '../config/navigation';
import { useLocation as useRouterLocation } from 'react-router-dom';
import AuthModals from './auth/AuthModals';
import UserDropdown from './auth/UserDropdown';

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
  const { isLoggedIn, openAuthModal, user, logout } = useAuth();

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
        handleDetect(() => {});
      }
    };
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !locationRef.current?.contains(e.target)) {
        setMenuOpen(false);
        setActiveDropdown(null);
        setLocationOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onClick);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onClick);
    };
  }, [handleDetect]);

  const isActive = (link) => {
    const path = currentLocation.pathname;
    if (link.id === 'home') return path === '/' || path === '/home';
    if (link.id === 'our-services') return path.startsWith('/our-services');
    if (link.id === 'careers') return path.startsWith('/careers');
    if (link.id === 'finance') return path.startsWith('/our-services/finance-lending') || path.startsWith('/finance-service') || path.startsWith('/add-finance-service');
    if (link.id === 'contacts') return path.startsWith('/contact-us');
    if (link.id === 'about-us') return path.startsWith('/about-us');
    return false;
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
      {detectStatus === 'idle' && <span className="text-[10px] text-gray-400 font-medium">⌘L</span>}
    </button>
  );

  return (
    <div ref={menuRef}>
      <header className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:py-3">
          <a href="/home" onClick={(e) => { e.preventDefault(); navigateTo('/home'); }}
            className="flex items-center gap-2 shrink-0"
          >
            <img src={logo} alt="Vishwam" className="h-14 w-auto sm:h-16 object-contain drop-shadow-sm" />

          </a>

          {/* City Dropdown (Desktop) */}
          <div className="relative hidden lg:block" ref={locationRef}>
            <button onClick={() => { setLocationOpen(!locationOpen); setActiveDropdown(null); }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i className="fa-solid fa-location-dot text-brand-blue" />
              <span>{getCityLabel(selectedCity)}</span>
              <i className={`fa-solid fa-chevron-down text-[10px] text-gray-400 transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
            </button>

            {locationOpen && (
              <div className="absolute left-0 top-full pt-2 w-56 z-50">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 space-y-0.5">
                  {detectButton(() => setLocationOpen(false))}
                  <hr className="my-1.5 border-gray-100" />
                  {Object.entries(cities).map(([cityId, city]) => (
                    <button key={cityId} onClick={() => handleSelectCity(cityId, () => setLocationOpen(false))}
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
            )}
          </div>

          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <div key={link.id} className="relative"
                onMouseEnter={() => { clearTimeout(closeTimerRef.current); if (link.submenu) setActiveDropdown(link.id); }}
                onMouseLeave={() => { closeTimerRef.current = setTimeout(() => setActiveDropdown(null), 150); }}
              >
                <a href={link.href} onClick={(e) => { e.preventDefault(); navigateTo(link.href); setActiveDropdown(null); }}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(link) ? 'text-brand-blue bg-brand-blue/5' : 'text-gray-700 hover:text-brand-blue hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  {link.submenu && <i className="fa-solid fa-chevron-down ml-1.5 text-[10px] text-gray-400" />}
                </a>
                {link.submenu && activeDropdown === link.id && (
                  <div className="absolute left-0 top-full pt-2 w-64 z-50"
                    onMouseEnter={() => clearTimeout(closeTimerRef.current)}
                    onMouseLeave={() => { closeTimerRef.current = setTimeout(() => setActiveDropdown(null), 150); }}
                  >
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2">
                      {link.submenu.columns.flat().map((item) => (
                        <a key={item.label} href={item.href} onClick={(e) => { e.preventDefault(); navigateTo(item.href); setActiveDropdown(null); }}
                          className="block px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-brand-blue/5 hover:text-brand-blue transition-colors"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Mobile location trigger */}
            <div className="lg:hidden">
              <button onClick={() => setMenuOpen(true)}
                className="flex items-center gap-1.5 px-2 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <i className="fa-solid fa-location-dot text-brand-blue text-xs" />
                <span className="text-xs truncate max-w-[80px]">{getCityLabel(selectedCity)}</span>
              </button>
            </div>

            <a href="/add-listing/" onClick={(e) => { e.preventDefault(); navigateTo('/add-listing/'); }}
              className="hidden lg:inline-flex items-center gap-2 bg-yellow-400 text-brand-navy px-4 py-2 text-xs font-bold rounded-lg hover:bg-yellow-300 hover:shadow-sm transition-all"
            >
              <i className="fa-solid fa-plus" />
              Post Your Listing
            </a>

            {isLoggedIn ? (
              <UserDropdown />
            ) : (
              <button onClick={() => openAuthModal('login')}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <i className="fa-solid fa-user text-brand-blue" />
                Login
              </button>
            )}
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
            <a href="/add-listing/" onClick={(e) => { e.preventDefault(); navigateTo('/add-listing/'); setMenuOpen(false); }}
              className="flex items-center justify-center gap-2 bg-yellow-400 text-brand-navy px-5 py-3 text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors"
            >
              <i className="fa-solid fa-plus" /> Post Your Listing
            </a>
          </div>

          {/* Mobile User Profile Section */}
          {isLoggedIn ? (
            <div className="p-4 border-b">
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-1">
                  <div className="h-10 w-10 rounded-full bg-brand-blue flex items-center justify-center text-white text-base font-bold shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-brand-charcoal truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a href="/profile/settings" onClick={(e) => { e.preventDefault(); navigateTo('/profile/settings'); setMenuOpen(false); }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 hover:text-brand-blue transition-colors"
                  >
                    <i className="fa-solid fa-user-gear text-gray-400" /> Settings
                  </a>
                  <button onClick={() => { logout(); setMenuOpen(false); }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <i className="fa-solid fa-right-from-bracket" /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /*
            <div className="p-4 border-b">
              <button onClick={() => { openAuthModal('login'); setMenuOpen(false); }}
                className="flex w-full items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 px-4 text-sm font-semibold rounded-lg transition-colors"
              >
                <i className="fa-solid fa-right-to-bracket text-brand-blue" />
                Login / Register
              </button>
            </div>
            */
            null
          )}

          {/* Mobile city selector */}
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
                <a href={link.href} onClick={(e) => { e.preventDefault(); navigateTo(link.href); setMenuOpen(false); }}
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
      <AuthModals />
    </div>
  );
}

export default Navbar;
