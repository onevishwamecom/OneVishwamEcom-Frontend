import { Link, useSearchParams } from 'react-router-dom';

const SECTORS = {
  automobile: {
    icon: 'fa-solid fa-car',
    title: 'Automobiles & Vehicles',
    description: 'We are building a premium marketplace for brand-new and certified pre-owned cars, bikes, and commercial vehicles with hassle-free loan approvals.',
    color: 'text-rose-500',
    bg: 'bg-rose-50',
  },
  jewellery: {
    icon: 'fa-solid fa-gem',
    title: 'Jewellery & Gold',
    description: 'Our certified hallmarked gold & diamond jewellery marketplace with flexible EMI purchase plans is on the way.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  electronics: {
    icon: 'fa-solid fa-laptop',
    title: 'Electronics & Gadgets',
    description: 'A curated marketplace for top-brand smartphones, laptops, smart TVs and home appliances with easy no-cost EMI payment schemes is coming.',
    color: 'text-cyan-500',
    bg: 'bg-cyan-50',
  },
};

const DEFAULT_SECTOR = {
  icon: 'fa-solid fa-rocket',
  title: 'This Section',
  description: 'We are working hard to bring this section to life. Stay tuned for updates!',
  color: 'text-brand-blue',
  bg: 'bg-blue-50',
};

export default function ComingSoon() {
  const [params] = useSearchParams();
  const sectorKey = params.get('sector') || '';
  const sector = SECTORS[sectorKey] || DEFAULT_SECTOR;

  return (
    <div className="min-h-screen bg-brand-gray pt-16 lg:pt-14 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">

          {/* Icon */}
          <div className={`mx-auto w-20 h-20 rounded-2xl ${sector.bg} flex items-center justify-center mb-6`}>
            <i className={`${sector.icon} text-3xl ${sector.color}`} />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal">
            {sector.title}
          </h1>

          {/* Coming Soon Badge */}
          <div className="mt-3 inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-sm font-bold">
            <i className="fa-solid fa-clock text-xs" />
            Coming Soon
          </div>

          {/* Description */}
          <p className="mt-5 text-sm sm:text-base text-gray-500 leading-relaxed max-w-md mx-auto">
            {sector.description}
          </p>

          {/* Divider */}
          <div className="mt-8 mb-6 border-t border-gray-200 max-w-xs mx-auto" />

          {/* Notify text */}
          <p className="text-xs text-gray-400 mb-6">
            We will notify you as soon as this section is live.
          </p>

          {/* Back to Home */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-brand-navy transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-xs" />
            Back to Home
          </Link>

        </div>
      </div>
  );
}

