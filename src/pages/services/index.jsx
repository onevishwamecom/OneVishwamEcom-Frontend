import { Link, useLocation } from 'react-router-dom';
import ServiceDetails from './ServiceDetails';
import { serviceItems, serviceIconMap } from '../../data/servicesContent';
import PageHero from '../../components/PageHero';

function ServicesPage() {
  const { pathname } = useLocation();
  const pathParts = pathname.split('/').filter(Boolean);
  const serviceId = pathParts.length > 1 ? pathParts[1] : null;

  if (serviceId) {
    const service = serviceItems.find((item) => item.id === serviceId);
    return <ServiceDetails service={service} />;
  }

  return (
    <div>
      <PageHero
        eyebrow="Our Services"
        title="A Comprehensive Multi-Business Ecosystem"
        subtitle="Explore our diverse divisions in one unified portal. From finance and real estate to consumer marketplaces and HR solutions — everything you need under a single ecosystem."
      />

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {serviceItems.map((item) => (
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServicesPage;
