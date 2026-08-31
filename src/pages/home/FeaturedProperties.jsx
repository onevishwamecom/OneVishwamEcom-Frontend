import { useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cities } from '../../data/locations';
import { navigateTo } from '../../config/navigation';
import { useLocation } from '../../store/locationSlice';
import { useProperties } from '../../hooks/useProperties';
import { isPlotOrLand } from '../services/property/propertyHelpers';
import { useAuth } from '../../store/authSlice';
import { withRupeeSymbol } from '../../utils/priceUtils';

function FeaturedProperties() {
  const scrollRef = useRef(null);
  const { selectedCity, selectedArea, setArea } = useLocation();
  const { properties } = useProperties();
  const { isLoggedIn, openAuthModal } = useAuth();

  const handlePropertyClick = (propertyId) => {
    const link = `/property/${propertyId}`;
    if (!isLoggedIn) {
      sessionStorage.setItem('vishwam_auth_redirect', link);
      openAuthModal('login');
      return;
    }
    navigateTo(link);
  };

  const cityAreas = cities[selectedCity]?.areas || [];

  const filtered = useMemo(() => {
    return properties.filter((p) => p.city && p.zone === selectedArea);
  }, [properties, selectedArea]);

  const top2 = filtered.slice(0, 2);
  const isEmpty = filtered.length === 0;

  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-blue">Real Estate</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-charcoal sm:text-4xl">
              Properties in {selectedArea}
            </h2>
            <p className="mt-2 text-gray-500">{filtered.length} listing{filtered.length !== 1 ? 's' : ''} available</p>
          </div>
          <Link to="/our-services/real-estate-property"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:gap-2 transition-all"
          >
            View All <i className="fa-solid fa-arrow-right text-xs" />
          </Link>
        </div>

        {/* Area filter pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {cityAreas.map((area) => (
            <button key={area} onClick={() => setArea(area)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                selectedArea === area
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        {isEmpty ? (
          <div className="mt-8 rounded-xl border border-gray-100 bg-gray-50 p-10 text-center">
            <i className="fa-solid fa-house-circle-xmark text-3xl text-gray-300 mb-3" />
            <p className="text-gray-500">No properties listed in <strong>{selectedArea}</strong> yet.</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon or browse another area.</p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {top2.map((p) => (
                <div key={p.id} onClick={() => handlePropertyClick(p.id)}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                    <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    {p.recentlyAdded && (
                      <span className="absolute left-3 top-3 rounded-lg bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white">New Launch</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-brand-charcoal group-hover:text-brand-blue transition-colors">{p.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{p.location}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-lg font-bold text-brand-blue">{withRupeeSymbol(p.price)} <span className="text-xs font-medium text-gray-400">{p.priceSuffix}</span></p>
                      <span className="text-xs text-gray-400">{isPlotOrLand(p) ? (p.area || 'Plot') : (p.bhk || '')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length > 2 && (
              <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-brand-charcoal">More listings in {selectedArea}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => scroll(-1)} className="h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs">
                      <i className="fa-solid fa-chevron-left" />
                    </button>
                    <button onClick={() => scroll(1)} className="h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs">
                      <i className="fa-solid fa-chevron-right" />
                    </button>
                  </div>
                </div>
                <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-3 snap-x" style={{ scrollbarWidth: 'none' }}>
                  {filtered.map((p, i) => (
                    <div key={p.id} onClick={() => handlePropertyClick(p.id)}
                      className="w-64 shrink-0 snap-start cursor-pointer rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-md transition-all"
                    >
                      <div className="relative aspect-[4/3] bg-gray-100">
                        <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
                        <span className="absolute bottom-2 left-3 text-5xl font-black text-white/40 drop-shadow-lg">{i + 1}</span>
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-semibold text-brand-charcoal truncate">{p.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{p.location}</p>
                        <p className="mt-2 text-sm font-bold text-brand-blue">{withRupeeSymbol(p.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default FeaturedProperties;
