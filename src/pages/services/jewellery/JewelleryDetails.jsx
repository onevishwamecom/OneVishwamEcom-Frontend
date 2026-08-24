import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { navigateTo } from '../../../config/navigation';
import { useJewelleryById, useSimilarJewellery } from './jewelleryHooks';
import { useAuth } from '../../../store/authSlice';
import AuthRequiredView from '../../../components/auth/AuthRequiredView';

function JewelleryDetails() {
  const { pathname } = useLocation();
  const { isLoggedIn } = useAuth();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  const pathParts = pathname.split('/').filter(Boolean);
  const jewelleryId = pathParts.length > 1 ? pathParts[1] : null;

  const { jewellery: item, loading, error } = useJewelleryById(jewelleryId);
  const { similar: relatedItems, loading: similarLoading } = useSimilarJewellery(jewelleryId);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isLoggedIn) {
    return (
      <AuthRequiredView
        title="Login to View Jewellery Details"
        message="Please log in or create an account to view carat specifications, certification details, pricing, and certified jeweller info."
        backUrl="/our-services/jewellery-gold"
      />
    );
  }

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-blue border-t-transparent mx-auto mb-4" />
        <p className="text-sm font-semibold text-gray-500">Loading jewellery...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-2xl font-bold text-gray-400">Item not found</h1>
        <a href="/our-services/jewellery-gold" className="mt-4 inline-block text-brand-blue font-semibold">&larr; Back to Jewellery & Gold</a>
      </div>
    );
  }

  const itemId = item._id || item.id;

  return (
    <div className="pb-24 sm:pb-32">
      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-yellow-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 lg:pt-14 pb-12 sm:pb-16">
          <button onClick={() => navigateTo('/our-services/jewellery-gold')}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors">
            <i className="fa-solid fa-arrow-left" /> Back to Jewellery & Gold
          </button>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Images */}
            <div className="lg:col-span-3 space-y-3">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-white/10 shadow-lg">
                <img src={item.images?.[currentImageIndex] || item.images?.[0]} alt={item.name}
                  className="h-full w-full object-cover" />
              </div>
              {(item.images || []).length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {(item.images || []).map((img, idx) => (
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
              <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400">{item.store?.name} · {item.store?.city}</p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{item.name}</h1>
              <p className="text-white/70 text-sm">{item.category} · {item.gender}</p>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-yellow-400">{item.price}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-bold">
                  {item.metalType} {item.purity}
                </span>
                <span className="rounded-lg bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-bold">
                  {item.weightGrams}g
                </span>
                <span className="rounded-lg bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-bold">
                  Making: {item.makingCharges}
                </span>
                {item.certified && (
                  <span className="rounded-lg bg-emerald-500/30 backdrop-blur-sm px-3 py-1 text-xs font-bold">
                    ✓ {item.certificationBody} Certified
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {(item.occasion || []).map((o) => (
                  <span key={o} className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs">
                    <i className="fa-solid fa-tag text-yellow-400" /> {o}
                  </span>
                ))}
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
            {/* Store Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-yellow-500 flex items-center justify-center text-white shadow-sm">
                  <i className="fa-solid fa-store text-lg" />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-charcoal">{item.store?.name}</p>
                  <p className="text-xs text-gray-400">{item.store?.city}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                <i className="fa-solid fa-location-dot text-brand-blue w-4" /> {item.store?.address}
              </p>
            </div>

            {/* Certification */}
            {item.certified && (
              <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <i className="fa-solid fa-shield-halved text-emerald-600 text-xs" />
                  </div>
                  <h2 className="text-base font-bold text-brand-charcoal">Certification</h2>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <i className="fa-solid fa-circle-check text-emerald-600 text-xl" />
                  <div>
                    <p className="text-sm font-bold text-brand-charcoal">{item.certificationBody} Certified</p>
                    <p className="text-xs text-gray-500">This piece is certified for authenticity and quality.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Try at Home */}
            {item.tryAtHome && (
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-5">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-house-chimney text-blue-200" />
                  <h3 className="text-sm font-bold">Try at Home</h3>
                </div>
                <p className="text-xs text-white/70">Try this jewellery piece in the comfort of your home. Free trial, no obligation.</p>
                <a href="/contact-us/"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors">
                  Schedule a Try at Home
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Details */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-brand-charcoal mb-3">Product Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Metal</span>
                  <span className="font-semibold">{item.metalType} {item.purity}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Weight</span>
                  <span className="font-semibold">{item.weightGrams}g</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Making Charges</span>
                  <span className="font-semibold">{item.makingCharges}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Category</span>
                  <span className="font-semibold capitalize">{item.category}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Gender</span>
                  <span className="font-semibold">{item.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Occasion</span>
                  <span className="font-semibold">{(item.occasion || []).join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-brand-charcoal mb-3">Price Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Item Price</span>
                  <span className="font-medium">{item.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Making Charges</span>
                  <span className="font-medium">{item.makingCharges}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between">
                  <span className="font-bold text-brand-charcoal">Total</span>
                  <span className="font-bold text-brand-blue">{item.price}</span>
                </div>
              </div>
              <a href="/contact-us/"
                className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                <i className="fa-solid fa-headset" /> Send Enquiry
              </a>
            </div>

            {/* AI Recommended */}
            {item.aiRecommended && (
              <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-5">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-wand-magic-sparkles text-yellow-300" />
                  <h3 className="text-sm font-bold">AI Recommended</h3>
                </div>
                <p className="text-xs text-white/70">This piece is recommended based on your preferences and browsing history.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Items */}
        {(relatedItems.length > 0 || similarLoading) && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-brand-charcoal mb-6">More {item.category} Jewellery</h2>
            {similarLoading ? (
              <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-200 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-0.5" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
                {relatedItems.map((r) => (
                  <div key={r._id || r.id}
                    onClick={() => navigateTo(`/jewellery/${r._id || r.id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 mb-3">
                      <img src={r.images?.[0]} alt={r.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <p className="text-sm font-bold text-brand-charcoal group-hover:text-brand-blue transition-colors">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.metalType} {r.purity} · {r.weightGrams}g</p>
                    <p className="text-sm font-bold text-brand-blue mt-0.5">{r.price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default JewelleryDetails;