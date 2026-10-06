import { Link, useLocation } from 'react-router-dom';
import ServiceDetails from './ServiceDetails';
import { serviceItems, serviceIconMap } from '../../data/servicesContent';
import PageHero from '../../components/PageHero';

const ACTIVE_SERVICE_IDS = ['real-estate-property', 'automobile', 'consumer-electronics', 'bedding-comfort'];

function ServicesPage() {
  const { pathname } = useLocation();
  const pathParts = pathname.split('/').filter(Boolean);
  const serviceId = pathParts.length > 1 ? pathParts[1] : null;

  if (serviceId) {
    const service = serviceItems.find((item) => item.id === serviceId);
    return <ServiceDetails service={service} />;
  }

  const sortedServices = [...serviceItems].sort((a, b) => {
    const aIndex = ACTIVE_SERVICE_IDS.indexOf(a.id);
    const bIndex = ACTIVE_SERVICE_IDS.indexOf(b.id);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  return (
    <div>
      <PageHero
        eyebrow="Our Services"
        title="A Comprehensive Multi Business Ecosystem"
        subtitle="Explore our diverse divisions in one unified portal. From finance and real estate to consumer marketplaces and HR solutions — everything you need under a single ecosystem."
      />

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedServices.map((item) => {
              const isActive = ACTIVE_SERVICE_IDS.includes(item.id);

              if (!isActive) {
                return (
                  <Link
                    key={item.id}
                    to={`/coming-soon?sector=${item.id}`}
                    className="group bg-white rounded-xl border border-amber-200/60 p-6 cursor-pointer hover:shadow-lg hover:border-amber-400 transition-all block relative"
                  >
                    <div className="aspect-[16/10] overflow-hidden rounded-lg bg-gray-100 mb-4 relative">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" loading="lazy" />
                      <span className="absolute top-2 right-2 text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full shadow-xs">
                        Coming Soon
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                        <i className={serviceIconMap[item.id] || 'fa-solid fa-circle'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h2 className="font-semibold text-brand-charcoal text-sm leading-snug group-hover:text-brand-blue transition-colors truncate">
                            {item.title}
                          </h2>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{item.description}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:text-brand-blue transition-colors">
                          Coming Soon <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={`/our-services/${item.id}`}
                  className="group bg-white rounded-xl border border-gray-100 p-6 cursor-pointer hover:shadow-lg hover:border-brand-blue/20 transition-all block"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-lg bg-gray-100 mb-4">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-brand-blue/5 flex items-center justify-center text-brand-blue shrink-0 mt-0.5">
                      <i className={serviceIconMap[item.id] || 'fa-solid fa-circle'} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-brand-charcoal text-sm leading-snug group-hover:text-brand-blue transition-colors">
                        {item.title}
                      </h2>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">{item.description}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue">
                        View Details <i className="fa-solid fa-arrow-right text-[10px]" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServicesPage;
