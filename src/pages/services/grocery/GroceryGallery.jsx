import { useState, useMemo } from 'react';
import { navigateTo } from '../../../config/navigation';
import { dummyGrocery } from '../../../data/dummyGrocery';
import { useLocation } from '../../../store/locationSlice';
import { cities } from '../../../data/locations';
import { CollapsibleSection, CheckboxGroup } from '../GalleryComponents';
import ProductCard from '../ProductCard';
import SearchSortBar from '../../../components/SearchSortBar';
import FilterSidebar from '../../../components/FilterSidebar';
import MobileFilterDrawer from '../../../components/MobileFilterDrawer';
import SlideinPanel from '../../../components/SlideinPanel';

const CATEGORIES = [
  { id: 'All',                icon: 'fa-basket-shopping', label: 'All' },
  { id: 'Fruits & Vegetables', icon: 'fa-carrot',          label: 'F&V' },
  { id: 'Grains & Pulses',    icon: 'fa-wheat-awn',        label: 'Grains' },
  { id: 'Dairy',              icon: 'fa-cow',              label: 'Dairy' },
  { id: 'Spices',             icon: 'fa-mortar-pestle',    label: 'Spices' },
  { id: 'Packaged Foods',     icon: 'fa-box',              label: 'Packaged' },
  { id: 'Beverages',          icon: 'fa-mug-saucer',       label: 'Beverages' },
  { id: 'Organic',            icon: 'fa-leaf',             label: 'Organic' },
];

const PRICE_CHIPS = [
  { label: 'Under ₹100', min: 0, max: 100 },
  { label: '₹100 – ₹500', min: 100, max: 500 },
  { label: '₹500+', min: 500, max: Infinity },
];

const VENDOR_OPTIONS = ['Local Farm', 'Supermarket', 'Organic Store', 'Wholesale'];
const DELIVERY_OPTIONS = ['Same Day', 'Next Day', 'Scheduled', 'Store Pickup'];

const INITIAL_FILTERS = {
  priceMin: '', priceMax: '', vendors: [], delivery: [], availability: '', locality: '',
};

const INITIAL_SECTIONS = {
  price: true, vendors: true, delivery: true, availability: false, locality: false,
};

function GroceryGallery() {
  const { selectedCity } = useLocation();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [filters, setFilters] = useState({ ...INITIAL_FILTERS });
  const [openSections, setOpenSections] = useState({ ...INITIAL_SECTIONS });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const toggleSection = (id) => setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  const resetFilters = () => setFilters({ ...INITIAL_FILTERS });

  const cityAreas = selectedCity ? (cities[selectedCity]?.areas || []) : [];

  const getPriceValue = (priceStr) => {
    const num = parseFloat(priceStr.replace(/[₹,\s]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const filteredItems = useMemo(() => {
    return dummyGrocery
      .filter((p) => {
        let matchCat = true;
        if (activeCategory === 'Organic') matchCat = p.organic;
        else if (activeCategory !== 'All') matchCat = p.category === activeCategory;

        const q = searchTerm.toLowerCase();
        const matchSearch = !q ||
          p.name.toLowerCase().includes(q) ||
          p.vendorName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);

        const pv = getPriceValue(p.pricePerUnit);
        const matchPrice = (!filters.priceMin || pv >= +filters.priceMin) && (!filters.priceMax || pv <= +filters.priceMax);
        const matchVendor = filters.vendors.length === 0 || filters.vendors.includes(p.vendorType);
        const matchDelivery = filters.delivery.length === 0 || filters.delivery.some((d) => p.deliveryType.includes(d));

        let matchAvailability = true;
        if (filters.availability === 'In Stock') matchAvailability = p.inStock;
        else if (filters.availability === 'Out of Stock') matchAvailability = !p.inStock;

        const matchLocality = !filters.locality || p.location.area === filters.locality;
        return matchCat && matchSearch && matchPrice && matchVendor && matchDelivery && matchAvailability && matchLocality;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return getPriceValue(a.pricePerUnit) - getPriceValue(b.pricePerUnit);
        if (sortBy === 'price-high') return getPriceValue(b.pricePerUnit) - getPriceValue(a.pricePerUnit);
        return b.id - a.id;
      });
  }, [activeCategory, searchTerm, sortBy, filters]);

  const organicCount = dummyGrocery.filter((p) => p.organic).length;

  const updateQty = (id, delta) => {
    setQuantities((prev) => {
      const cur = prev[id] || 1;
      const next = Math.max(1, cur + delta);
      return { ...prev, [id]: next };
    });
  };

  const addToCart = (item) => {
    const qty = quantities[item.id] || 1;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...item, qty }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const cartTotal = useMemo(() => cart.reduce((sum, i) => sum + getPriceValue(i.pricePerUnit) * i.qty, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart]);

  const filterContent = (
    <FilterSidebar filters={filters} onReset={resetFilters}>
      <CollapsibleSection id="price" label="Price Range" open={openSections.price} onToggle={toggleSection}>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {PRICE_CHIPS.map((r) => {
            const active = +filters.priceMin === r.min && +filters.priceMax === r.max;
            return (
              <button key={r.label} onClick={() => {
                if (active) { updateFilter('priceMin', ''); updateFilter('priceMax', ''); }
                else { updateFilter('priceMin', String(r.min)); updateFilter('priceMax', String(r.max)); }
              }}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                  active ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                {r.label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.priceMin}
            onChange={(e) => updateFilter('priceMin', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-blue" />
          <input type="number" placeholder="Max" value={filters.priceMax}
            onChange={(e) => updateFilter('priceMax', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-blue" />
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="vendors" label="Vendor Type" open={openSections.vendors} onToggle={toggleSection}>
        <CheckboxGroup options={VENDOR_OPTIONS} selected={filters.vendors} onChange={(v) => updateFilter('vendors', v)} />
      </CollapsibleSection>

      <CollapsibleSection id="delivery" label="Delivery" open={openSections.delivery} onToggle={toggleSection}>
        <CheckboxGroup options={DELIVERY_OPTIONS} selected={filters.delivery} onChange={(v) => updateFilter('delivery', v)} />
      </CollapsibleSection>

      <CollapsibleSection id="availability" label="Availability" open={openSections.availability} onToggle={toggleSection}>
        <div className="space-y-1.5">
          {['In Stock', 'Out of Stock'].map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="groceryAvail" checked={filters.availability === opt}
                onChange={() => updateFilter('availability', filters.availability === opt ? '' : opt)}
                className="border-gray-300 text-brand-blue focus:ring-brand-blue/30" />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="locality" label="Locality" open={openSections.locality} onToggle={toggleSection}>
        {!selectedCity ? (
          <p className="text-xs text-gray-400">Please select a city.</p>
        ) : (
          <CheckboxGroup options={cityAreas} selected={filters.locality ? [filters.locality] : []}
            onChange={(v) => updateFilter('locality', v.length ? v[v.length - 1] : '')} search />
        )}
      </CollapsibleSection>
    </FilterSidebar>
  );

  return (
    <div className="pb-24 pt-6 sm:pt-10 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ── Page Header ── */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-1">
              OneVishwam · Consumer Marketplace
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl">
              Groceries & Daily Needs
            </h1>
            <p className="mt-1 text-sm text-gray-500 max-w-2xl">
              Fresh produce, dairy, grains, spices, and packaged goods — delivered to your doorstep.
            </p>
          </div>
        </div>

        {/* ── Category Pill Strip ── */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((ct) => {
            const sel = activeCategory === ct.id;
            const count = ct.id === 'All' ? dummyGrocery.length
              : ct.id === 'Organic' ? organicCount
              : dummyGrocery.filter((p) => p.category === ct.id).length;
            return (
              <button key={ct.id} onClick={() => setActiveCategory(ct.id)}
                className={`flex-shrink-0 flex items-center gap-2.5 rounded-full border px-4 py-2 transition-all ${
                  sel
                    ? 'border-brand-blue bg-brand-blue text-white shadow-sm shadow-brand-blue/25'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-brand-blue/40 hover:text-brand-blue'
                }`}>
                <i className={`fa-solid ${ct.icon} text-xs`} />
                <span className="text-sm font-semibold whitespace-nowrap">{ct.label}</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  sel ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* ── Search + Sort ── */}
        <SearchSortBar
          className="mt-5"
          searchValue={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          searchPlaceholder="Search grocery items..."
          sortValue={sortBy}
          onSortChange={(e) => setSortBy(e.target.value)}
          onMobileFilter={() => setShowMobileFilters(true)}
        />

        <p className="mt-3 text-sm text-gray-500 font-medium">{filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found</p>

        {/* ── Main Layout ── */}
        <div className="mt-6 flex gap-8">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="lg:sticky lg:top-24 lg:self-start max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-gray-100 bg-white p-5">
              {filterContent}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {filteredItems.length > 0 ? (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredItems.map((p) => (
                  <ProductCard
                    key={p.id}
                    link={`/grocery/${p.id}`}
                    image={p.images[0]}
                    alt={p.name}
                    overline={p.vendorName}
                    title={p.name}
                    price={p.pricePerUnit}
                    priceSuffix={`/${p.unit}`}
                    location={p.location.area}
                    pincode={p.location.pincode}
                    tags={[p.deliveryType[0]]}
                    badges={[
                      ...(p.organic ? [{ label: 'Organic', className: 'bg-emerald-100 text-emerald-700' }] : []),
                      ...(p.freshToday ? [{ label: 'Fresh Today', className: 'bg-blue-100 text-blue-700' }] : []),
                      ...(p.aiRecommended ? [{ label: 'AI Pick', className: 'bg-purple-100 text-purple-700' }] : []),
                    ]}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <i className="fa-solid fa-basket-shopping text-4xl mb-4" />
                <p className="text-lg font-medium">No items found.</p>
                <p className="text-sm mt-1">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        open={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        resultCount={filteredItems.length}
        resultLabel="Items"
      >
        {filterContent}
      </MobileFilterDrawer>

      {/* Cart FAB */}
      {cartCount > 0 && (
        <button onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 transition-all">
          <i className="fa-solid fa-cart-shopping" />
          Cart ({cartCount})
        </button>
      )}

      {/* Cart Slide-in Panel */}
      <SlideinPanel
        open={showCart}
        onClose={() => setShowCart(false)}
        title={`Cart (${cartCount})`}
        footer={
          <>
            <div className="flex items-center justify-between text-sm font-bold text-brand-charcoal">
              <span>Subtotal</span>
              <span className="text-brand-blue">₹ {cartTotal.toLocaleString()}</span>
            </div>
            <button onClick={() => { setShowCart(false); navigateTo('/contact-us/'); }}
              className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
              Proceed to Checkout
            </button>
          </>
        }
      >
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-brand-charcoal truncate">{item.name}</p>
              <p className="text-xs text-gray-500">{item.qty} × {item.pricePerUnit}</p>
              <p className="text-xs font-bold text-brand-blue mt-0.5">₹ {(getPriceValue(item.pricePerUnit) * item.qty).toLocaleString()}</p>
            </div>
            <button onClick={() => removeFromCart(item.id)}
              className="ml-3 text-xs text-red-500 font-semibold hover:underline shrink-0">
              Remove
            </button>
          </div>
        ))}
      </SlideinPanel>

    </div>
  );
}

export default GroceryGallery;
