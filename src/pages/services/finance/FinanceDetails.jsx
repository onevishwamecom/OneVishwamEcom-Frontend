import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { financeServices } from '../../../data/dummyFinanceServices';
import FinanceCard from './FinanceCard';
import { formatFinanceAmount } from './financeConstants';

const FALLBACK_LOGO = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="none"><rect width="80" height="80" rx="12" fill="#e5e7eb"/><path fill="#9ca3af" d="M28 48h24v-2l-8-8-16 16v-6zm-4 6h32V30l-8-8-24 24v8z"/></svg>`
);

function FinanceDetails() {
  const [currentImageIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [service, setService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id: serviceId } = useParams();

  useEffect(() => { window.scrollTo(0, 0); }, [serviceId]);

  useEffect(() => {
    if (!serviceId) {
      setService(null);
      setLoading(false);
      setError('Service not found');
      return;
    }

    setLoading(true);
    setError(null);

    const item = financeServices.find(s => String(s.id) === String(serviceId));
    setService(item);
    if (item) {
      setRelatedServices(financeServices.filter(s => s.category === item.category && s.id !== item.id).slice(0, 4));
    }
    setLoading(false);
  }, [serviceId]);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
        <p className="mt-4 text-sm font-semibold text-gray-500">Loading service details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-2xl font-bold text-gray-400">Service not found</h1>
        <p className="mt-2 text-sm text-gray-500">{error}</p>
        <a href="/our-services/finance-lending" className="mt-4 inline-block text-brand-blue font-semibold">&larr; Back to Finance & Loans</a>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-2xl font-bold text-gray-400">Service not found</h1>
        <a href="/our-services/finance-lending" className="mt-4 inline-block text-brand-blue font-semibold">&larr; Back to Finance & Loans</a>
      </div>
    );
  }

  const isInterestApplicable = service.interestRate !== 'N/A' && service.interestRate !== 'Varies';

  return (
    <div className="pb-24 sm:pb-32">
      {/* ── Gradient Hero Banner ── */}
      <div className="bg-gradient-to-br from-brand-navy via-brand-navy to-brand-blue text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 lg:pt-14 pb-12 sm:pb-16">
          <Link to="/our-services/finance-lending"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors">
            <i className="fa-solid fa-arrow-left" /> Back to Finance Services
          </Link>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400">
                <i className="fa-solid fa-building-columns mr-1.5" />{service.category}
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {service.serviceName}
              </h1>
              <p className="text-white/70 max-w-xl">{service.companyName} · {service.location}</p>

              <div className="flex flex-wrap gap-3">
                {isInterestApplicable && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur-sm">
                    <i className="fa-solid fa-percentage text-yellow-400" /> {service.interestRate}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur-sm">
                  <i className="fa-solid fa-indian-rupee-sign text-yellow-400" /> {formatFinanceAmount(service.minAmount)} – {formatFinanceAmount(service.maxAmount)}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur-sm">
                  <i className="fa-solid fa-clock text-yellow-400" /> {service.tenure}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur-sm">
                  <i className="fa-solid fa-hourglass-half text-yellow-400" /> {service.processingTime}
                </span>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-md shrink-0">
                    <img
                      src={service.logo || FALLBACK_LOGO}
                      alt={service.companyName}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{service.companyName}</p>
                    <p className="text-xs text-white/60">{service.providerType}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${service.contactPhone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-white/20 px-4 py-3 text-sm font-semibold text-white hover:bg-white/30 transition-colors">
                    <i className="fa-solid fa-phone" /> Call Now
                  </a>
                  <a href="/contact-us/"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-brand-navy hover:bg-yellow-300 transition-colors shadow-sm">
                    <i className="fa-solid fa-bolt" /> Apply Now
                  </a>
                </div>
                <button onClick={() => setSaved(!saved)}
                  className={`mt-3 w-full flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                    saved
                      ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                      : 'border-white/20 text-white/70 hover:bg-white/10'
                  }`}>
                  <i className={`fa-solid ${saved ? 'fa-bookmark' : 'fa-bookmark'}`} />
                  {saved ? 'Saved' : 'Save Service'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                  <i className="fa-solid fa-info text-brand-blue text-xs" />
                </div>
                <h2 className="text-xl font-bold text-brand-charcoal">About this Service</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>

            {/* Features */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <i className="fa-solid fa-star text-emerald-600 text-xs" />
                </div>
                <h2 className="text-xl font-bold text-brand-charcoal">Features & Benefits</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {service.features.map((f) => (
                  <div key={f} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-check text-brand-blue text-[10px]" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <i className="fa-solid fa-user-check text-purple-600 text-xs" />
                </div>
                <h2 className="text-xl font-bold text-brand-charcoal">Eligibility</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {service.eligibility.map((e, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-circle-check text-emerald-500 text-[10px]" />
                    </div>
                    <span className="text-sm text-gray-700">{e}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Documents */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <i className="fa-solid fa-file-lines text-amber-600 text-xs" />
                </div>
                <h2 className="text-xl font-bold text-brand-charcoal">Required Documents</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {service.documentsRequired.map((doc) => (
                  <div key={doc} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-file text-amber-600 text-[10px]" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-brand-charcoal mb-4">Service Details</h3>
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-gray-100 pb-3 text-sm">
                  <span className="text-gray-500">Provider</span>
                  <span className="font-semibold text-brand-charcoal">{service.companyName}</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-3 text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="font-semibold text-brand-charcoal">{service.category}</span>
                </li>
                {isInterestApplicable && (
                  <li className="flex justify-between border-b border-gray-100 pb-3 text-sm">
                    <span className="text-gray-500">Interest Rate</span>
                    <span className="font-semibold text-brand-charcoal">{service.interestRate}</span>
                  </li>
                )}
                <li className="flex justify-between border-b border-gray-100 pb-3 text-sm">
                  <span className="text-gray-500">Loan Range</span>
                  <span className="font-semibold text-brand-charcoal">{formatFinanceAmount(service.minAmount)} – {formatFinanceAmount(service.maxAmount)}</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-3 text-sm">
                  <span className="text-gray-500">Tenure</span>
                  <span className="font-semibold text-brand-charcoal">{service.tenure}</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-3 text-sm">
                  <span className="text-gray-500">Processing Time</span>
                  <span className="font-semibold text-brand-charcoal">{service.processingTime}</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-3 text-sm">
                  <span className="text-gray-500">Provider Type</span>
                  <span className="font-semibold text-brand-charcoal">{service.providerType}</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-3 text-sm">
                  <span className="text-gray-500">Service Mode</span>
                  <span className="font-semibold text-brand-charcoal">{service.serviceMode}</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-500">Availability</span>
                  <span className={`font-semibold ${service.availability === 'Available Now' ? 'text-green-600' : 'text-amber-600'}`}>
                    {service.availability}
                  </span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="rounded-2xl border border-brand-blue/20 bg-brand-paper p-5">
              <h3 className="text-base font-bold text-brand-charcoal">Contact Information</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-phone text-brand-blue text-xs" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <a href={`tel:${service.contactPhone}`} className="text-sm font-semibold text-brand-charcoal hover:text-brand-blue">
                      {service.contactPhone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-envelope text-brand-blue text-xs" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a href={`mailto:${service.contactEmail}`} className="text-sm font-semibold text-brand-charcoal hover:text-brand-blue">
                      {service.contactEmail}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-location-dot text-brand-blue text-xs" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-semibold text-brand-charcoal">{service.location}</p>
                  </div>
                </div>
              </div>
              <a href={`tel:${service.contactPhone}`}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-blue px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                <i className="fa-solid fa-phone" /> Contact Provider
              </a>
            </div>

            {/* CTA */}
            <div className="rounded-2xl bg-gradient-to-br from-brand-navy to-brand-blue text-white p-6">
              <h3 className="text-lg font-bold">Ready to apply?</h3>
              <p className="mt-2 text-sm text-white/70">Get started with quick approval.</p>
              <a href="/contact-us/"
                className="mt-4 inline-flex w-full items-center justify-center bg-yellow-400 px-6 py-3 rounded-xl font-semibold text-sm text-brand-navy hover:bg-yellow-300 transition-colors">
                Apply Now
              </a>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-brand-charcoal mb-6">Related {service.category}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedServices.map((s) => (
                <FinanceCard key={s._id || s.id} service={s} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FinanceDetails;
