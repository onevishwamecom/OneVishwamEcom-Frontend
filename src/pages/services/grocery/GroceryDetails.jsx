import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { navigateTo } from '../../../config/navigation';
import { useGroceryById, useSimilarGroceries } from './groceryHooks';
import ProductCard from '../ProductCard';

function GroceryDetails() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  const pathParts = pathname.split('/').filter(Boolean);
  const groceryId = pathParts.length > 1 ? pathParts[1] : null;
  const { grocery: item, loading, error } = useGroceryById(groceryId);
  const { similar: relatedItems } = useSimilarGroceries(groceryId);

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(false);

  useEffect(() => {
    const handle = () => setShowFloatingBar(window.scrollY > 400);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-400">Loading grocery details...</p>
      </div>
    );
  }

  if (!item || error) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-2xl font-bold text-gray-400">Item not found</h1>
        <a href="/our-services/consumer-marketplace" className="mt-4 inline-block text-brand-blue font-semibold">&larr; Back to Groceries &amp; Daily Needs</a>
      </div>
    );
  }

  const certifications = [];
  if (item.organic) certifications.push({ label: 'Organic Certified', icon: 'fa-leaf', desc: 'Grown without chemicals or pesticides' });
  if (item.fssaiCertified) certifications.push({ label: 'FSSAI Certified', icon: 'fa-certificate', desc: 'Approved by Food Safety Authority' });
  if (item.freshToday) certifications.push({ label: 'Fresh Today', icon: 'fa-sun', desc: 'Harvested and delivered fresh daily' });

  const badges = [];
  if (item.organic) badges.push({ label: 'Organic', className: 'bg-emerald-100 text-emerald-700' });
  if (item.freshToday) badges.push({ label: 'Fresh Today', className: 'bg-blue-100 text-blue-700' });
  if (item.inStock !== false && item.stock !== 0) badges.push({ label: 'In Stock', className: 'bg-green-100 text-green-700' });
  else badges.push({ label: 'Out of Stock', className: 'bg-red-100 text-red-700' });

  const unitPrice = typeof item.pricePerUnit === 'number'
    ? item.pricePerUnit
    : parseFloat(String(item.pricePerUnit || item.price || item.numericPrice || '0').replace(/[₹,\s]/g, '')) || 0;

  const totalPrice = (qty * unitPrice).toLocaleString();

  return (
    <div className="pb-24 sm:pb-32">
      {/* ── Gradient Hero ── */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 lg:pt-14 pb-12 sm:pb-16">
          <button onClick={() => navigateTo('/our-services/consumer-marketplace')}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors">
            <i className="fa-solid fa-arrow-left" /> Back to Groceries &amp; Daily Needs
          </button>

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-white/10 shadow-lg">
                <img src={item.images?.[0] || item.image || ''} alt={item.name}
                  className="h-full w-full object-cover" />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400">{item.vendorName || item.brand || 'OneVishwam'} {item.vendorType ? `· ${item.vendorType}` : ''}</p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{item.name}</h1>
              <p className="text-white/70 text-sm">{item.category} {item.location?.area || item.area ? `· ${item.location?.area || item.area}, ${item.location?.city || item.city || 'Bengaluru'}` : ''}</p>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-yellow-400">{item.pricePerUnit || item.price || `₹ ${unitPrice}`}</span>
                <span className="text-white/60">/{item.unit || 'kg'}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {badges.map((b) => (
                  <span key={b.label} className="rounded-lg bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-bold">
                    {b.label}
                  </span>
                ))}
              </div>

              {Array.isArray(item.deliveryType) && item.deliveryType.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.deliveryType.map((d) => (
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

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quantity + Add */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-brand-charcoal mb-3">Order Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 rounded-xl border border-gray-200 px-2 py-1.5">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">−</button>
                  <span className="w-10 text-center text-base font-bold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">+</button>
                </div>
                <span className="text-sm text-gray-500">= <span className="font-bold text-brand-charcoal">₹{totalPrice}</span></span>
                <button onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 2000); }}
                  className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ml-auto ${
                    added ? 'bg-emerald-600 text-white' : 'bg-brand-blue text-white hover:bg-blue-700'
                  }`}>
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <i className="fa-solid fa-shield-halved text-emerald-600 text-xs" />
                  </div>
                  <h2 className="text-base font-bold text-brand-charcoal">Certifications & Quality</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {certifications.map((c) => (
                    <div key={c.label} className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-center">
                      <i className={`fa-solid ${c.icon} text-emerald-600 text-lg mb-1`} />
                      <p className="text-sm font-bold text-brand-charcoal">{c.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Info */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <i className="fa-solid fa-truck-fast text-blue-600 text-xs" />
                </div>
                <h2 className="text-base font-bold text-brand-charcoal">Delivery Options</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {item.deliveryType.map((d) => (
                  <div key={d} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
                    <i className="fa-solid fa-clock text-brand-blue text-lg mb-1" />
                    <p className="text-sm font-bold text-brand-charcoal">{d}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Available for this item</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vendor */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-sm">
                  <i className="fa-solid fa-store text-lg" />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-charcoal">{item.vendorName}</p>
                  <p className="text-xs text-gray-400">{item.vendorType}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><i className="fa-solid fa-location-dot text-brand-blue w-4" /> {item.location.area}, {item.location.city}</p>
                <p><i className="fa-solid fa-map-pin text-brand-blue w-4" /> {item.location.pincode}</p>
                {item.fssaiCertified && (
                  <p><i className="fa-solid fa-certificate text-emerald-600 w-4" /> FSSAI Certified</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-brand-charcoal mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Item</span>
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Quantity</span>
                  <span className="font-medium">{qty} {item.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price</span>
                  <span className="font-medium">{item.pricePerUnit}/{item.unit}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between">
                  <span className="font-bold text-brand-charcoal">Total</span>
                  <span className="font-bold text-brand-blue">₹{totalPrice}</span>
                </div>
              </div>
              <a href="/contact-us/"
                className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                <i className="fa-solid fa-headset" /> Contact Vendor
              </a>
            </div>

            {/* Recommended by AI */}
            {item.aiRecommended && (
              <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-5">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-wand-magic-sparkles text-yellow-300" />
                  <h3 className="text-sm font-bold">AI Recommended</h3>
                </div>
                <p className="text-xs text-white/70">This item is recommended based on your preferences and purchase history.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-brand-charcoal mb-6">More in {item.category}</h2>
            <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
              {relatedItems.map((r) => (
                <ProductCard
                  key={r.id}
                  link={`/grocery/${r.id}`}
                  image={r.images[0]}
                  alt={r.name}
                  overline={r.vendorName}
                  title={r.name}
                  price={r.pricePerUnit}
                  priceSuffix={`/${r.unit}`}
                  location={r.location.area}
                  pincode={r.location.pincode}
                  tags={[r.deliveryType[0]]}
                  badges={[
                    ...(r.organic ? [{ label: 'Organic', className: 'bg-emerald-100 text-emerald-700' }] : []),
                    ...(r.freshToday ? [{ label: 'Fresh Today', className: 'bg-blue-100 text-blue-700' }] : []),
                  ]}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
        showFloatingBar ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-t-2xl border border-gray-200 bg-white shadow-xl p-4 flex items-center gap-4">
            <img src={item.images[0]} alt={item.name}
              className="w-12 h-12 rounded-lg object-cover shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-brand-charcoal truncate">{item.name}</p>
              <p className="text-xs text-gray-500">{qty} × {item.pricePerUnit}/{item.unit}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-xl border border-gray-200 px-2 py-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-6 h-6 rounded-lg hover:bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">−</button>
                <span className="w-6 text-center text-xs font-bold">{qty}</span>
                <button onClick={() => setQty(qty + 1)}
                  className="w-6 h-6 rounded-lg hover:bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">+</button>
              </div>
              <button onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 2000); }}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  added ? 'bg-emerald-600 text-white' : 'bg-brand-blue text-white hover:bg-blue-700'
                }`}>
                {added ? '✓ Added' : `Add · ₹${totalPrice}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroceryDetails;
