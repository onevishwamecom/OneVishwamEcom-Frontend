import { useState, useMemo } from 'react';
import { navigateTo } from '../../../config/navigation';
import { useGarments } from './garmentHooks';
import { CollapsibleSection, CheckboxGroup, ActiveChip, getNumericPrice } from '../GalleryComponents';
import ProductCard from '../ProductCard';
import SearchSortBar from '../../../components/SearchSortBar';
import FilterSidebar from '../../../components/FilterSidebar';
import MobileFilterDrawer from '../../../components/MobileFilterDrawer';
import SlideinPanel from '../../../components/SlideinPanel';

const TABS = ['All', 'Men', 'Women', 'Kids', 'Ethnic Wear', 'Western', 'Formals', 'Casuals', 'Sportswear', 'Accessories'];

const BUDGET_CHIPS = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹2K', min: 500, max: 2000 },
  { label: '₹2K – ₹5K', min: 2000, max: 5000 },
  { label: '₹5K+', min: 5000, max: Infinity },
];

const BRAND_TYPE_OPTIONS = ['Local Brand', 'National Brand', 'International', 'Handloom', 'Designer'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];
const FABRIC_OPTIONS = ['Cotton', 'Silk', 'Linen', 'Polyester', 'Wool', 'Denim', 'Khadi', 'Chiffon'];
const OCCASION_OPTIONS = ['Casual', 'Formal', 'Party', 'Wedding', 'Festive', 'Sports', 'Daily Wear'];
const DISCOUNT_OPTIONS = [{ label: 'Any', value: 0 }, { label: '10%+', value: 10 }, { label: '20%+', value: 20 }, { label: '30%+', value: 30 }, { label: '50%+', value: 50 }];
const DELIVERY_OPTIONS = ['Same Day', 'Next Day', '2–5 Days', 'Store Pickup'];

const INITIAL_FILTERS = {
  budgetMin: '',
  budgetMax: '',
  brandTypes: [],
  sizes: [],
  fabrics: [],
  occasions: [],
  discount: '',
  delivery: [],
};

const INITIAL_SECTIONS = {
  budget: true, brandTypes: true, sizes: true, fabrics: false, occasions: false, discount: false, delivery: false,
};

function GarmentGallery() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [filters, setFilters] = useState({ ...INITIAL_FILTERS });
  const [openSections, setOpenSections] = useState({ ...INITIAL_SECTIONS });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const { garments, loading, error } = useGarments();

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const toggleSection = (id) => setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  const resetFilters = () => setFilters({ ...INITIAL_FILTERS });

  const toggleWishlist = (item) => {
    setWishlist((prev) => prev.find((i) => (i.id || i._id) === (item.id || item._id))
      ? prev.filter((i) => (i.id || i._id) !== (item.id || item._id))
      : [...prev, item]);
  };

  const isInWishlist = (id) => wishlist.some((i) => (i.id || i._id) === id);

  const filteredItems = useMemo(() => {
    return (garments || [])
      .filter((p) => {
        let matchTab = true;
        if (activeTab !== 'All') {
          const lower = activeTab.toLowerCase();
          if (['men', 'women', 'kids', 'unisex'].includes(lower)) {
            matchTab = p.gender?.toLowerCase() === lower || p.category?.toLowerCase() === lower;
          } else {
            matchTab = p.category?.toLowerCase() === lower || p.category === activeTab;
          }
        }

        const q = searchTerm.toLowerCase();
        const matchSearch = !q ||
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q));

        const np = getNumericPrice(p.finalPrice || p.price);
        const matchBudget =
          (!filters.budgetMin || np >= +filters.budgetMin) &&
          (!filters.budgetMax || np <= +filters.budgetMax);

        const matchSize = filters.sizes.length === 0 || (Array.isArray(p.sizes) ? filters.sizes.some((s) => p.sizes.includes(s)) : (p.size && filters.sizes.includes(p.size)));
        const matchFabric = filters.fabrics.length === 0 || (p.fabric && filters.fabrics.includes(p.fabric));
        const matchOccasion = filters.occasions.length === 0 || (Array.isArray(p.occasion) ? filters.occasions.some((o) => p.occasion.includes(o)) : (p.occasion && filters.occasions.includes(p.occasion)));

        let matchDiscount = true;
        if (filters.discount) {
          const discVal = parseInt(filters.discount);
          matchDiscount = (p.discount || 0) >= discVal;
        }

        const matchDelivery = filters.delivery.length === 0 || (Array.isArray(p.delivery) && filters.delivery.some((d) => p.delivery.includes(d)));

        return matchTab && matchSearch && matchBudget && matchSize &&
          matchFabric && matchOccasion && matchDiscount && matchDelivery;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return getNumericPrice(a.finalPrice || a.price) - getNumericPrice(b.finalPrice || b.price);
        if (sortBy === 'price-high') return getNumericPrice(b.finalPrice || b.price) - getNumericPrice(a.finalPrice || a.price);
        return (new Date(b.createdAt || 0).getTime() || 0) - (new Date(a.createdAt || 0).getTime() || 0);
      });
  }, [garments, activeTab, searchTerm, sortBy, filters]);

  /* ── Filter sidebar content ── */
  const filterContent = (
    <FilterSidebar filters={filters} onReset={resetFilters}>
      <CollapsibleSection id="budget" label="Budget" open={openSections.budget} onToggle={toggleSection}>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {BUDGET_CHIPS.map((r) => {
            const active = +filters.budgetMin === r.min && +filters.budgetMax === r.max;
            return (
              <button key={r.label} onClick={() => {
                if (active) { updateFilter('budgetMin', ''); updateFilter('budgetMax', ''); }
                else { updateFilter('budgetMin', String(r.min)); updateFilter('budgetMax', String(r.max)); }
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
          <input type="number" placeholder="Min" value={filters.budgetMin}
            onChange={(e) => updateFilter('budgetMin', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-blue" />
          <input type="number" placeholder="Max" value={filters.budgetMax}
            onChange={(e) => updateFilter('budgetMax', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-blue" />
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="brandTypes" label="Brand Type" open={openSections.brandTypes} onToggle={toggleSection}>
        <CheckboxGroup options={BRAND_TYPE_OPTIONS} selected={filters.brandTypes}
          onChange={(v) => updateFilter('brandTypes', v)} />
      </CollapsibleSection>

      <CollapsibleSection id="sizes" label="Size" open={openSections.sizes} onToggle={toggleSection}>
        <div className="flex flex-wrap gap-1.5">
          {SIZE_OPTIONS.map((s) => (
            <button key={s} onClick={() => {
              const next = filters.sizes.includes(s) ? filters.sizes.filter((x) => x !== s) : [...filters.sizes, s];
              updateFilter('sizes', next);
            }}
              className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                filters.sizes.includes(s) ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="fabrics" label="Fabric" open={openSections.fabrics} onToggle={toggleSection}>
        <CheckboxGroup options={FABRIC_OPTIONS} selected={filters.fabrics}
          onChange={(v) => updateFilter('fabrics', v)} />
      </CollapsibleSection>

      <CollapsibleSection id="occasions" label="Occasion" open={openSections.occasions} onToggle={toggleSection}>
        <CheckboxGroup options={OCCASION_OPTIONS} selected={filters.occasions}
          onChange={(v) => updateFilter('occasions', v)} />
      </CollapsibleSection>

      <CollapsibleSection id="discount" label="Discount" open={openSections.discount} onToggle={toggleSection}>
        <div className="space-y-1.5">
          {DISCOUNT_OPTIONS.map((opt) => (
            <label key={opt.label} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="garmentDisc" checked={filters.discount === String(opt.value)}
                onChange={() => updateFilter('discount', filters.discount === String(opt.value) ? '' : String(opt.value))}
                className="border-gray-300 text-brand-blue focus:ring-brand-blue/30" />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="delivery" label="Delivery" open={openSections.delivery} onToggle={toggleSection}>
        <CheckboxGroup options={DELIVERY_OPTIONS} selected={filters.delivery}
          onChange={(v) => updateFilter('delivery', v)} />
      </CollapsibleSection>
    </FilterSidebar>
  );

  const sizeDots = (sizes) => {
    const all = ['S', 'M', 'L', 'XL'];
    return (
      <div className="flex gap-1">
        {all.map((size) => (
          <span key={size}
            className={`w-2.5 h-2.5 rounded-full ${sizes.includes(size) ? 'bg-brand-blue' : 'bg-gray-200'}`}
            title={size} />
        ))}
      </div>
    );
  };

  return (
    <div className="pb-24 pt-16 lg:pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-brand-charcoal sm:text-4xl">Fashion & Lifestyle</h1>

        {/* Category Tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === tab ? 'bg-brand-blue text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Search + Sort */}
        <SearchSortBar
          className="mt-4"
          searchValue={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          searchPlaceholder="Search fashion items..."
          sortValue={sortBy}
          onSortChange={(e) => setSortBy(e.target.value)}
          onMobileFilter={() => setShowMobileFilters(true)}
        />

        <p className="mt-3 text-sm text-gray-500 font-medium">{filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found</p>

        {/* Main Layout */}
        <div className="mt-6 flex gap-8">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="lg:sticky lg:top-24 lg:self-start max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-gray-100 bg-white p-5">
              {filterContent}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {filteredItems.length > 0 ? (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredItems.map((p) => (
                  <ProductCard
                    key={p._id || p.id}
                    link={`/garment/${p._id || p.id}`}
                    image={p.images?.[0] || p.image || ''}
                    alt={p.name}
                    overline={p.brand}
                    title={p.name}
                    location={p.store?.city || p.city || 'Bengaluru'}
                    pincode={p.store?.pincode || p.pincode}
                    priceOverride={
                      <div className="flex items-baseline gap-1.5">
                        {(p.discount || 0) > 0 ? (
                          <>
                            <span className="text-sm font-bold text-brand-blue">{p.finalPrice || p.price}</span>
                            {p.originalPrice && <span className="text-[10px] text-gray-400 line-through">{p.originalPrice}</span>}
                          </>
                        ) : (
                          <span className="text-sm font-bold text-brand-blue">{p.finalPrice || p.price}</span>
                        )}
                      </div>
                    }
                    tags={[p.fabric || p.category].filter(Boolean)}
                    badges={[
                      ...((p.discount || 0) > 0 ? [{ label: `${p.discount}% OFF`, className: 'bg-red-500 text-white' }] : []),
                      ...(p.aiRecommended ? [{ label: 'AI Pick', className: 'bg-blue-100 text-blue-700' }] : []),
                      ...(p.trending ? [{ label: 'Trending', className: 'bg-pink-100 text-pink-700' }] : []),
                    ]}
                  >
                    <div className="mt-1.5">{sizeDots(p.sizes)}</div>
                    <div className="mt-2 flex gap-1.5">
                      {/* Bug fix: correct icon toggle between filled/outline heart */}
                      <button onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                          isInWishlist(p.id) ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-gray-300'
                        }`}>
                        <i className={isInWishlist(p.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />
                      </button>
                      <button onClick={() => navigateTo('/contact-us/')}
                        className="flex-1 rounded-lg bg-brand-blue px-2 py-1.5 text-[10px] font-semibold text-white hover:bg-blue-700 transition-colors">
                        View & Buy
                      </button>
                    </div>
                  </ProductCard>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <i className="fa-solid fa-shirt text-4xl mb-4" />
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

      {/* Wishlist FAB */}
      {wishlist.length > 0 && (
        <button onClick={() => setShowWishlist(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-pink-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-pink-700 transition-all">
          <i className="fa-solid fa-heart" />
          Wishlist ({wishlist.length})
        </button>
      )}

      {/* Wishlist Slide-in */}
      <SlideinPanel
        open={showWishlist}
        onClose={() => setShowWishlist(false)}
        title={`Wishlist (${wishlist.length})`}
        footer={
          <button onClick={() => { setShowWishlist(false); navigateTo('/contact-us/'); }}
            className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            Enquire for All
          </button>
        }
      >
        {wishlist.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-brand-charcoal truncate">{item.name}</p>
              <p className="text-xs text-gray-500">{item.brand} · {item.fabric}</p>
              <p className="text-xs font-bold text-brand-blue mt-0.5">{item.finalPrice}</p>
            </div>
            <button onClick={() => toggleWishlist(item)}
              className="ml-3 text-xs text-red-500 font-semibold hover:underline shrink-0">
              Remove
            </button>
          </div>
        ))}
      </SlideinPanel>
    </div>
  );
}

export default GarmentGallery;
