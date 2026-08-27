import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import ServiceDetails from './ServiceDetails';
import { serviceItems, serviceIconMap } from '../../data/servicesContent';
import PageHero from '../../components/PageHero';

function ServicesPage() {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pathParts = pathname.split('/').filter(Boolean);
  const serviceId = pathParts.length > 1 ? pathParts[1] : null;

  const queryParam = searchParams.get('q') || searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Keep search input synced if URL search params change
  useEffect(() => {
    const q = searchParams.get('q') || searchParams.get('search') || '';
    setSearchTerm(q);
  }, [searchParams]);

  // Handle search input change & update URL param
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val.trim()) {
        next.set('q', val);
      } else {
        next.delete('q');
        next.delete('search');
      }
      return next;
    }, { replace: true });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('q');
      next.delete('search');
      return next;
    }, { replace: true });
  };

  // Extract categories for pill strip
  const categories = useMemo(() => {
    return ['All', ...serviceItems.map((item) => ({ id: item.id, title: item.title }))];
  }, []);

  // Filter serviceItems by search query and category
  const filteredItems = useMemo(() => {
    return serviceItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.id !== selectedCategory) {
        return false;
      }

      // Keyword search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);
        const overviewMatch = item.details?.overviewText?.toLowerCase().includes(q);
        const sectionMatch = item.details?.sections?.some((s) =>
          s.title?.toLowerCase().includes(q) ||
          s.items?.some((i) => i.toLowerCase().includes(q))
        );
        const featureMatch = item.details?.specialFeatures?.some((f) => f.toLowerCase().includes(q));

        return titleMatch || descMatch || overviewMatch || sectionMatch || featureMatch;
      }

      return true;
    });
  }, [searchTerm, selectedCategory]);

  if (serviceId) {
    const service = serviceItems.find((item) => item.id === serviceId);
    return <ServiceDetails service={service} />;
  }

  return (
    <div className="pt-16 lg:pt-14">
      <PageHero
        eyebrow="Our Services & Products"
        title="A Comprehensive Multi Business Ecosystem"
        subtitle="Explore our diverse divisions in one unified portal. From finance and real estate to consumer marketplaces and HR solutions — everything you need under a single ecosystem."
      />

      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Search & Filter Controls Header */}
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-gray-200/80 space-y-5">
            {/* Search Input Bar */}
            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search products or services (e.g. Real Estate, Vehicles, Gold, Fashion, Loans)..."
                className="w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-10 py-3 text-sm font-semibold text-brand-charcoal outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all shadow-2xs hover:shadow-xs"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-brand-charcoal hover:bg-gray-100 transition-colors"
                  aria-label="Clear search"
                >
                  <i className="fa-solid fa-xmark text-xs" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => {
                const catId = typeof cat === 'string' ? cat : cat.id;
                const catLabel = typeof cat === 'string' ? cat : cat.title;
                const isSelected = selectedCategory === catId;
                return (
                  <button
                    key={catId}
                    onClick={() => setSelectedCategory(catId)}
                    className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/25 scale-[1.02]'
                        : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:text-brand-charcoal'
                    }`}
                  >
                    {catLabel}
                  </button>
                );
              })}
            </div>

            {/* Results Count & Clear Summary */}
            <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 gap-2">
              <span>
                Showing <strong className="text-brand-charcoal font-semibold">{filteredItems.length}</strong> of{' '}
                <strong className="text-brand-charcoal font-semibold">{serviceItems.length}</strong> categories & services
                {searchTerm && (
                  <span>
                    {' '}matching &ldquo;<strong className="text-brand-blue">{searchTerm}</strong>&rdquo;
                  </span>
                )}
              </span>
              {(searchTerm || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    handleClearSearch();
                    setSelectedCategory('All');
                  }}
                  className="font-semibold text-brand-blue hover:underline inline-flex items-center gap-1"
                >
                  <i className="fa-solid fa-rotate-left text-[10px]" /> Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Service & Product Cards Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/our-services/${item.id}`}
                  className="group bg-white rounded-2xl border border-gray-200/80 p-5 cursor-pointer hover:shadow-xl hover:border-brand-blue/40 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 mb-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 mt-0.5 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-200">
                        <i className={serviceIconMap[item.id] || 'fa-solid fa-circle'} />
                      </div>
                      <div>
                        <h2 className="font-bold text-brand-charcoal text-sm leading-snug group-hover:text-brand-blue transition-colors">
                          {item.title}
                        </h2>
                        <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-blue group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      View Category <i className="fa-solid fa-arrow-right text-[10px]" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-xs max-w-md mx-auto my-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                <i className="fa-solid fa-magnifying-glass text-xl" />
              </div>
              <h3 className="text-lg font-bold text-brand-charcoal">No products or services found</h3>
              <p className="mt-2 text-xs text-gray-500">
                We couldn&rsquo;t find anything matching &ldquo;{searchTerm}&rdquo;. Try adjusting your keywords or category filters.
              </p>
              <button
                onClick={() => {
                  handleClearSearch();
                  setSelectedCategory('All');
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-navy transition-colors"
              >
                <i className="fa-solid fa-rotate-left" /> Clear Search
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ServicesPage;
