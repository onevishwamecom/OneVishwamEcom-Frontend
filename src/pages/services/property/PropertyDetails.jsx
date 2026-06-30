import { useEffect, useState } from 'react';
import { navigateTo } from '../../../config/navigation';
import { useProperties } from '../../../hooks/useProperties';

const FINANCE_STATS = { enquiries: 5, enrolled: 6, slots: 25 };

function PropertyDetails({ location }) {
  const { properties, loading: listLoading } = useProperties();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLoanBanner, setShowLoanBanner] = useState(false);
  const pathParts = location?.pathname?.split('/').filter(Boolean) || [];
  const propertySlug = pathParts.length > 1 ? pathParts[1] : null;

  const property = properties.find(
    (p) => p._id === propertySlug || String(p.id) === propertySlug
  ) || null;
  const loading = listLoading;
  const error = !property && !listLoading ? new Error('Property not found') : null;

  useEffect(() => { window.scrollTo(0, 0); }, [propertySlug]);

  useEffect(() => {
    if (!property) return;
    const timer = setTimeout(() => setShowLoanBanner(true), 2000);
    return () => clearTimeout(timer);
  }, [property]);

  const loanCtaParams = property
    ? `?type=property&id=${property.id}&title=${encodeURIComponent(property.title)}&price=${encodeURIComponent(property.price)}`
    : '';

  if (loading) {
    return (
      <div className="py-32 flex items-center justify-center gap-2 text-gray-400">
        <i className="fa-solid fa-spinner fa-spin text-lg" />
        <span className="text-sm">Loading property...</span>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-2xl font-bold text-gray-400">Property not found</h1>
        <a href="/our-services/real-estate-property" className="mt-4 inline-block text-brand-blue font-semibold">&larr; Back to Real Estate</a>
      </div>
    );
  }

  const amenities = ['Swimming Pool', '24/7 Security', 'Gymnasium', 'Power Backup', 'Club House', 'Park'];

  return (
    <div className="pb-24 sm:pb-32">
      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-brand-navy via-brand-navy to-brand-blue text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <button onClick={() => navigateTo('/our-services/real-estate-property')}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors">
            <i className="fa-solid fa-arrow-left" /> Back to Properties
          </button>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Images */}
            <div className="lg:col-span-3 space-y-3">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-white/10 shadow-lg">
                <img src={property.images[currentImageIndex]} alt={property.title}
                  className="h-full w-full object-cover" />
              </div>
              {property.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {property.images.map((img, idx) => (
                    <button key={idx} onClick={() => setCurrentImageIndex(idx)}
                      className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        idx === currentImageIndex ? 'border-yellow-400' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}>
                      <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400">Property Detail</p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{property.title}</h1>
              <p className="text-white/70 text-sm">
                <i className="fa-solid fa-location-dot mr-1.5 text-yellow-400" />
                {property.location}{property.pincode ? ` — ${property.pincode}` : ''}
              </p>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-yellow-400">{property.price}</span>
                {property.priceSuffix && <span className="text-white/60 text-sm">{property.priceSuffix}</span>}
              </div>

              <div className="flex flex-wrap gap-2">
                {property.bhk && property.bhk !== 'N/A' && (
                  <span className="rounded-lg bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-bold">{property.bhk}</span>
                )}
                {property.area && (
                  <span className="rounded-lg bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-bold">{property.area}</span>
                )}
                {property.furnishing && property.furnishing !== 'N/A' && (
                  <span className="rounded-lg bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-bold">{property.furnishing}</span>
                )}
                <span className={`rounded-lg backdrop-blur-sm px-3 py-1 text-xs font-bold ${
                  property.status === 'available' ? 'bg-emerald-500/30 text-emerald-200' :
                  property.status === 'closed' ? 'bg-red-500/30 text-red-200' : 'bg-amber-500/30 text-amber-200'
                }`}>
                  {property.status === 'available' ? '✓ Available' :
                   property.status === 'closed' ? 'Closed' : 'Under Negotiation'}
                </span>
                {property.loanApproved && (
                  <span className="rounded-lg bg-emerald-500/30 backdrop-blur-sm px-3 py-1 text-xs font-bold">
                    Loan Approved
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                  <i className="fa-solid fa-info text-brand-blue text-xs" />
                </div>
                <h2 className="text-base font-bold text-brand-charcoal">Description</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <i className="fa-solid fa-star text-emerald-600 text-xs" />
                </div>
                <h2 className="text-base font-bold text-brand-charcoal">Amenities & Features</h2>
              </div>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                {amenities.map((a) => (
                  <div key={a} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <i className="fa-solid fa-check text-brand-blue shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Property Facts */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-brand-charcoal mb-3">Property Facts</h3>
              <div className="space-y-3 text-sm">
                {property.bhk && property.bhk !== 'N/A' && (
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Type</span>
                    <span className="font-semibold">{property.bhk}</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Area</span>
                    <span className="font-semibold">{property.area}</span>
                  </div>
                )}
                {property.bathrooms && property.bathrooms !== 'N/A' && (
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Bathrooms</span>
                    <span className="font-semibold">{property.bathrooms}</span>
                  </div>
                )}
                {property.furnishing && property.furnishing !== 'N/A' && (
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Furnishing</span>
                    <span className="font-semibold">{property.furnishing}</span>
                  </div>
                )}
                {property.floor && property.floor !== 'N/A' && (
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Floor</span>
                    <span className="font-semibold">{property.floor}</span>
                  </div>
                )}
                {property.parking && property.parking !== 'N/A' && (
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Parking</span>
                    <span className="font-semibold">{property.parking}</span>
                  </div>
                )}
                {property.pincode && (
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Pincode</span>
                    <span className="font-semibold">{property.pincode}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-semibold ${
                    property.status === 'available' ? 'text-green-600' :
                    property.status === 'closed' ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    {property.status === 'available' ? 'Available' :
                     property.status === 'closed' ? 'Closed' : 'Under Negotiation'}
                  </span>
                </div>
              </div>
            </div>

            {/* Agent Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-brand-charcoal mb-3">Listed By</h3>
              <div className="flex items-center gap-3">
                <img src={property.agent.avatar} alt={property.agent.name}
                  className="w-12 h-12 rounded-full" />
                <div>
                  <p className="text-sm font-bold text-brand-charcoal">{property.agent.name}</p>
                  <p className="text-xs text-gray-400">{property.agent.type}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-brand-blue">{property.totalUnits}</p>
                  <p className="text-[10px] text-gray-500 font-semibold">Total Units</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-emerald-600">{property.availableUnits}</p>
                  <p className="text-[10px] text-gray-500 font-semibold">Available</p>
                </div>
              </div>
            </div>

            {/* Home Loan */}
            {property.loanApproved && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <h3 className="text-sm font-bold text-emerald-800">Home Loan Available</h3>
                <p className="mt-1 text-xs text-emerald-600">Pre-approved, starting at 7%+</p>
                <div className="mt-3 flex gap-3">
                  <div className="text-center flex-1">
                    <p className="text-lg font-bold text-brand-blue">{FINANCE_STATS.enquiries}</p>
                    <p className="text-[10px] text-gray-500 font-semibold">Enquiries</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-lg font-bold text-brand-blue">{FINANCE_STATS.enrolled}</p>
                    <p className="text-[10px] text-gray-500 font-semibold">Enrolled</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-lg font-bold text-brand-blue">{FINANCE_STATS.slots}</p>
                    <p className="text-[10px] text-gray-500 font-semibold">Slots</p>
                  </div>
                </div>
                <a href={`/finance/home-loan${loanCtaParams}`}
                  className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors">
                  ⚡ Get Pre-Approved
                </a>
              </div>
            )}

            {/* Other Finance */}
            <div className="rounded-2xl border border-brand-blue/20 bg-brand-paper p-5">
              <h3 className="text-sm font-bold text-brand-charcoal">Finance Options</h3>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3">
                  <div>
                    <p className="text-xs font-bold text-brand-charcoal">Construction Loan</p>
                    <p className="text-[10px] text-gray-500">Disbursed in stages</p>
                  </div>
                  <a href={`/contact-us/${loanCtaParams}`}
                    className="rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors">
                    Enquire
                  </a>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3">
                  <div>
                    <p className="text-xs font-bold text-brand-charcoal">Other Finance</p>
                    <p className="text-[10px] text-gray-500">NRI Loans · LAP</p>
                  </div>
                  <a href="/our-services/finance-lending"
                    className="rounded-lg border border-brand-blue px-3 py-1.5 text-xs font-semibold text-brand-blue hover:bg-brand-blue hover:text-white transition-colors">
                    Explore
                  </a>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="rounded-2xl bg-gradient-to-br from-brand-navy to-brand-blue text-white p-6">
              <h3 className="text-lg font-bold">Interested?</h3>
              <p className="mt-2 text-sm text-white/70">Contact our team for a site visit.</p>
              <a href={`/contact-us/${loanCtaParams}`}
                className="mt-4 inline-flex w-full items-center justify-center bg-yellow-400 px-6 py-3 rounded-xl font-semibold text-sm text-brand-navy hover:bg-yellow-300 transition-colors">
                Contact Agent
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Loan Banner */}
      {showLoanBanner && property.loanApproved && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-emerald-200 bg-white shadow-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-circle-check text-emerald-500 text-lg" />
                <div>
                  <p className="text-sm font-bold text-brand-charcoal">100% Pre-Approved Home Loan at 7%+</p>
                  <p className="text-xs text-gray-500">Just Click to see qualifying properties</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <button onClick={() => setShowLoanBanner(false)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Dismiss
                </button>
                <a href={`/finance/home-loan${loanCtaParams}`}
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors">
                  Just Click →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyDetails;
