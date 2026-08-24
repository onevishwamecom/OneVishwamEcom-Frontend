import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { navigateTo } from '../../../config/navigation';
import { useGarments, useGarmentById, useSimilarGarments } from './garmentHooks';
import { useAuth } from '../../../store/authSlice';
import AuthRequiredView from '../../../components/auth/AuthRequiredView';
import { withRupeeSymbol } from '../../../utils/priceUtils';

function GarmentDetails() {
  const { pathname } = useLocation();
  const { isLoggedIn } = useAuth();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  const pathParts = pathname.split('/').filter(Boolean);
  const garmentId = pathParts.length > 1 ? pathParts[1] : null;

  const { garments, loading: listLoading } = useGarments();
  const { garment: directItem, loading: directLoading, error: directError } = useGarmentById(garmentId);
  const { similar: relatedItems } = useSimilarGarments(garmentId);

  const foundFromList = (garments || []).find(
    (g) => String(g._id) === String(garmentId) || String(g.id) === String(garmentId)
  ) || null;
  const item = (directItem?.item || directItem) || (foundFromList?.item || foundFromList);
  const loading = !item && (listLoading || directLoading);
  const error = !item && !listLoading && !directLoading ? (directError || 'Item not found') : null;

  if (!isLoggedIn) {
    return (
      <AuthRequiredView
        title="Login to View Garment Details"
        message="Please log in or create an account to view available sizes, fabrics, pricing, colors, and order options."
        backUrl="/our-services/garments-fashion-lifestyle"
      />
    );
  }

  if (loading) {
    return (
      <div className="py-32 text-center">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-400">Loading garment details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-2xl font-bold text-gray-400">{error || 'Item not found'}</h1>
        <Link to="/our-services/garments-fashion-lifestyle" className="mt-4 inline-block text-brand-blue font-semibold">&larr; Back to Garments &amp; Fashion</Link>
      </div>
    );
  }

  return (
    <div className="pb-24 sm:pb-32">
      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-pink-700 via-pink-600 to-rose-500 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 lg:pt-14 pb-12 sm:pb-16">
          <button onClick={() => navigateTo('/our-services/garments-fashion-lifestyle')}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors">
            <i className="fa-solid fa-arrow-left" /> Back to Garments &amp; Fashion
          </button>

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-white/10 shadow-lg">
                <img src={item.images?.[0] || item.image || ''} alt={item.name}
                  className="h-full w-full object-cover" />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400">{item.brand || ''} {item.store?.city || item.city ? `· ${item.store?.city || item.city}` : ''}</p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{item.name}</h1>
              <p className="text-white/70 text-sm capitalize">{item.gender || 'Unisex'} · {item.fabric || item.material || 'Cotton'} · {item.category || item.subcategory}</p>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-yellow-400">{withRupeeSymbol(item.finalPrice || item.price)}</span>
                {item.originalPrice && <span className="text-lg text-white/50 line-through">{withRupeeSymbol(item.originalPrice)}</span>}
                {item.discount > 0 && (
                  <span className="text-sm font-bold text-emerald-300">{item.discount}% OFF</span>
                )}
              </div>

              {Array.isArray(item.sizes) && item.sizes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.sizes.map((s) => (
                    <span key={s} className="rounded-lg bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {Array.isArray(item.occasion) && item.occasion.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.occasion.map((o) => (
                    <span key={o} className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs">
                      <i className="fa-solid fa-tag text-yellow-400" /> {o}
                    </span>
                  ))}
                  {item.trending && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-rose-500/30 px-3 py-1.5 text-xs font-bold">
                      <i className="fa-solid fa-fire text-yellow-400" /> Trending
                    </span>
                  )}
                </div>
              )}

              {Array.isArray(item.delivery) && item.delivery.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.delivery.map((d) => (
                    <span key={d} className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs">
                      <i className="fa-solid fa-truck text-yellow-400" /> {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          <div className="lg:col-span-2 space-y-6">
            {/* Store Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-600 to-rose-500 flex items-center justify-center text-white shadow-sm">
                  <i className="fa-solid fa-store text-lg" />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-charcoal">{item.store.name}</p>
                  <p className="text-xs text-gray-400">{item.store.city} · {item.store.pincode}</p>
                </div>
              </div>
            </div>

            {/* Fabric & Care */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <i className="fa-solid fa-shirt text-blue-600 text-xs" />
                </div>
                <h2 className="text-base font-bold text-brand-charcoal">Fabric & Care</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Fabric</p>
                  <p className="text-sm font-bold text-brand-charcoal mt-0.5">{item.fabric}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Category</p>
                  <p className="text-sm font-bold text-brand-charcoal mt-0.5 capitalize">{item.category}</p>
                </div>
              </div>
            </div>

            {/* AI Recommended */}
            {item.aiRecommended && (
              <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-5">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-wand-magic-sparkles text-yellow-300" />
                  <h3 className="text-sm font-bold">AI Recommended</h3>
                </div>
                <p className="text-xs text-white/70">This item is recommended based on your style preferences and browsing history.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-brand-charcoal mb-3">Product Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Brand</span>
                  <span className="font-semibold">{item.brand}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Category</span>
                  <span className="font-semibold capitalize">{item.category}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Fabric</span>
                  <span className="font-semibold">{item.fabric}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Gender</span>
                  <span className="font-semibold capitalize">{item.gender}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Sizes</span>
                  <span className="font-semibold">{item.sizes.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Occasion</span>
                  <span className="font-semibold">{item.occasion.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-brand-charcoal mb-3">Price Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Original Price</span>
                  <span className="line-through text-gray-400">{item.originalPrice}</span>
                </div>
                {item.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount</span>
                    <span className="font-semibold text-emerald-600">-{item.discount}%</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-2 flex justify-between">
                  <span className="font-bold text-brand-charcoal">Final Price</span>
                  <span className="font-bold text-brand-blue">{item.finalPrice}</span>
                </div>
              </div>
              <Link to="/contact-us/"
                className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                <i className="fa-solid fa-headset" /> Send Enquiry
              </Link>
            </div>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-brand-charcoal mb-6">More in {item.category}</h2>
            <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
              {relatedItems.map((r) => (
                <div key={r.id}
                  onClick={() => navigateTo(`/garment/${r.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 mb-3">
                    <img src={r.images[0]} alt={r.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="text-sm font-bold text-brand-charcoal group-hover:text-brand-blue transition-colors">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.brand} · {r.fabric}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-bold text-brand-blue">{r.finalPrice}</span>
                    <span className="text-xs text-gray-400 line-through">{r.originalPrice}</span>
                    {r.discount > 0 && (
                      <span className="text-[10px] font-bold text-emerald-600">-{r.discount}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GarmentDetails;
