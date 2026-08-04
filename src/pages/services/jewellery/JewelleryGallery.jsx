import { useState, useMemo, useEffect } from "react";
import { navigateTo } from "../../../config/navigation";
import { useJewellery } from "./jewelleryHooks";
import {
  CollapsibleSection,
  CheckboxGroup,
  getNumericPrice,
} from "../GalleryComponents";
import ProductCard from "../ProductCard";
import SearchSortBar from "../../../components/SearchSortBar";
import FilterSidebar from "../../../components/FilterSidebar";
import MobileFilterDrawer from "../../../components/MobileFilterDrawer";
import SlideinPanel from "../../../components/SlideinPanel";

const CATEGORIES = [
  { id: "All", icon: "fa-gem", label: "All" },
  { id: "Gold", icon: "fa-coins", label: "Gold" },
  { id: "Silver", icon: "fa-ring", label: "Silver" },
  { id: "Diamond", icon: "fa-crown", label: "Diamond" },
  { id: "Platinum", icon: "fa-star", label: "Platinum" },
  { id: "Gemstone", icon: "fa-gem", label: "Gemstone" },
  { id: "Bridal", icon: "fa-heart", label: "Bridal" },
  { id: "Antique", icon: "fa-landmark", label: "Antique" },
];

const OCCASIONS = [
  "Wedding",
  "Engagement",
  "Festival",
  "Daily Wear",
  "Office Wear",
  "Gift",
  "Anniversary",
];

const BUDGET_CHIPS = [
  { label: "Under ₹25K", min: 0, max: 25000 },
  { label: "₹25K – ₹1L", min: 25000, max: 100000 },
  { label: "₹1L – ₹5L", min: 100000, max: 500000 },
  { label: "₹5L+", min: 500000, max: Infinity },
];

const METAL_OPTIONS = [
  "Gold 24K",
  "Gold 22K",
  "Gold 18K",
  "Silver",
  "Platinum",
  "White Gold",
  "Rose Gold",
];
const GENDER_OPTIONS = ["Women", "Men", "Kids", "Unisex"];
const AVAILABILITY_OPTIONS = ["Store Pickup", "Home Delivery", "Try At Home"];

const INITIAL_FILTERS = {
  budgetMin: "",
  budgetMax: "",
  metals: [],
  weightMin: "",
  weightMax: "",
  genders: [],
  availability: [],
  occasions: [],
};

const INITIAL_SECTIONS = {
  budget: true,
  metals: true,
  weight: false,
  occasions: false,
  genders: false,
  availability: false,
};

function JewelleryGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filters, setFilters] = useState({ ...INITIAL_FILTERS });
  const [openSections, setOpenSections] = useState({ ...INITIAL_SECTIONS });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [enquiryCart, setEnquiryCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const apiParams = useMemo(() => ({
    category: activeCategory === "All" ? undefined : activeCategory,
    search: searchTerm || undefined,
    sortBy: sortBy === "latest" ? undefined : sortBy,
    budgetMin: filters.budgetMin || undefined,
    budgetMax: filters.budgetMax || undefined,
    metals: filters.metals.length ? filters.metals.join(",") : undefined,
    weightMin: filters.weightMin || undefined,
    weightMax: filters.weightMax || undefined,
    genders: filters.genders.length ? filters.genders.join(",") : undefined,
    occasions: filters.occasions.length ? filters.occasions.join(",") : undefined,
    availability: filters.availability.includes("Try At Home") ? "tryAtHome" : undefined,
    limit: 100,
  }), [activeCategory, searchTerm, sortBy, filters]);

  const { jewellery, loading, error } = useJewellery(apiParams);

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  const resetFilters = () => setFilters({ ...INITIAL_FILTERS });

  const toggleCartItem = (item) => {
    setEnquiryCart((prev) =>
      prev.find((i) => (i._id || i.id) === (item._id || item.id))
        ? prev.filter((i) => (i._id || i.id) !== (item._id || item.id))
        : [...prev, item],
    );
  };

  const isInCart = (id) => enquiryCart.some((i) => (i._id || i.id) === id);

  const filteredItems = jewellery;

  const totalCartValue = useMemo(
    () => enquiryCart.reduce((sum, i) => sum + getNumericPrice(i.price), 0),
    [enquiryCart],
  );

  const certifiedCount = jewellery.filter((p) => p.certified).length;
  const tryAtHomeCount = jewellery.filter((p) => p.tryAtHome).length;
  const aiPickCount = jewellery.filter((p) => p.aiRecommended).length;

  const filterContent = (
    <FilterSidebar filters={filters} onReset={resetFilters}>
      <CollapsibleSection
        id="budget"
        label="Budget"
        open={openSections.budget}
        onToggle={toggleSection}
      >
        <div className="flex flex-wrap gap-1.5 mb-2">
          {BUDGET_CHIPS.map((r) => {
            const active =
              +filters.budgetMin === r.min && +filters.budgetMax === r.max;
            return (
              <button
                key={r.label}
                onClick={() => {
                  if (active) {
                    updateFilter("budgetMin", "");
                    updateFilter("budgetMax", "");
                  } else {
                    updateFilter("budgetMin", String(r.min));
                    updateFilter("budgetMax", String(r.max));
                  }
                }}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                  active
                    ? "border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.budgetMin}
            onChange={(e) => updateFilter("budgetMin", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-blue"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.budgetMax}
            onChange={(e) => updateFilter("budgetMax", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-blue"
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="metals"
        label="Metal Type"
        open={openSections.metals}
        onToggle={toggleSection}
      >
        <CheckboxGroup
          options={METAL_OPTIONS}
          selected={filters.metals}
          onChange={(v) => updateFilter("metals", v)}
        />
      </CollapsibleSection>

      <CollapsibleSection
        id="weight"
        label="Weight Range (grams)"
        open={openSections.weight}
        onToggle={toggleSection}
      >
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min g"
            value={filters.weightMin}
            onChange={(e) => updateFilter("weightMin", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-blue"
          />
          <input
            type="number"
            placeholder="Max g"
            value={filters.weightMax}
            onChange={(e) => updateFilter("weightMax", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-blue"
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="occasions"
        label="Occasion"
        open={openSections.occasions}
        onToggle={toggleSection}
      >
        <CheckboxGroup
          options={OCCASIONS}
          selected={filters.occasions}
          onChange={(v) => updateFilter("occasions", v)}
        />
      </CollapsibleSection>

      <CollapsibleSection
        id="genders"
        label="Gender"
        open={openSections.genders}
        onToggle={toggleSection}
      >
        <div className="flex flex-wrap gap-1.5">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g}
              onClick={() => {
                const next = filters.genders.includes(g)
                  ? filters.genders.filter((x) => x !== g)
                  : [...filters.genders, g];
                updateFilter("genders", next);
              }}
              className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                filters.genders.includes(g)
                  ? "border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="availability"
        label="Available In"
        open={openSections.availability}
        onToggle={toggleSection}
      >
        <CheckboxGroup
          options={AVAILABILITY_OPTIONS}
          selected={filters.availability}
          onChange={(v) => updateFilter("availability", v)}
        />
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
              OneVishwam · Jewellery & Gold
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl">
              Jewellery & Gold
            </h1>
            <p className="mt-1 text-sm text-gray-500 max-w-2xl">
              Gold, silver, diamond, platinum, and gemstone jewellery —
              certified, hallmarked, and crafted to perfection.
            </p>
          </div>
        </div>

        {/* ── Category Pill Strip ── */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((ct) => {
            const sel = activeCategory === ct.id;
            const count =
              ct.id === "All"
                ? jewellery.length
                : jewellery.filter((p) => p.category === ct.id).length;
            return (
              <button
                key={ct.id}
                onClick={() => setActiveCategory(ct.id)}
                className={`flex-shrink-0 flex items-center gap-2.5 rounded-full border px-4 py-2 transition-all ${
                  sel
                    ? "border-brand-blue bg-brand-blue text-white shadow-sm shadow-brand-blue/25"
                    : "border-gray-200 bg-white text-gray-600 hover:border-brand-blue/40 hover:text-brand-blue"
                }`}
              >
                <i className={`fa-solid ${ct.icon} text-xs`} />
                <span className="text-sm font-semibold whitespace-nowrap">
                  {ct.label}
                </span>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    sel ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Search + Sort ── */}
        <SearchSortBar
          className="mt-5"
          searchValue={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          searchPlaceholder="Search jewellery..."
          sortValue={sortBy}
          onSortChange={(e) => setSortBy(e.target.value)}
          onMobileFilter={() => setShowMobileFilters(true)}
        />

        <p className="mt-3 text-sm text-gray-500 font-medium">
          {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}{" "}
          found
        </p>

        {/* ── Main Layout ── */}
        <div className="mt-6 flex gap-8">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="lg:sticky lg:top-24 lg:self-start max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-gray-100 bg-white p-5">
              {filterContent}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white/50 py-20 text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-blue border-t-transparent mb-4" />
                <p className="text-sm font-semibold text-gray-500">Loading jewellery...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50/50 py-20 text-center">
                <i className="fa-solid fa-triangle-exclamation text-4xl text-red-300 mb-4" />
                <p className="text-lg font-semibold text-gray-600">Something went wrong</p>
                <p className="text-sm text-gray-400 mt-1 max-w-md">{error}</p>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((p) => (
                  <ProductCard
                    key={p._id || p.id}
                    link={`/jewellery/${p._id || p.id}`}
                    image={p.images?.[0]}
                    alt={p.name}
                    title={p.name}
                    price={p.price}
                    location={p.store?.city}
                    pincode={p.store?.pincode}
                    tags={[
                      `${p.metalType} ${p.purity}`,
                      `${p.weightGrams}g`,
                      ...(p.occasion || []).slice(0, 2),
                    ]}
                    badges={[
                      ...(p.certified
                        ? [
                            {
                              label: "Certified",
                              className: "bg-emerald-100 text-emerald-700",
                            },
                          ]
                        : []),
                      ...(p.aiRecommended
                        ? [
                            {
                              label: "AI Pick",
                              className: "bg-purple-100 text-purple-700",
                            },
                          ]
                        : []),
                      ...(p.tryAtHome
                        ? [
                            {
                              label: "Try at Home",
                              className: "bg-blue-100 text-blue-700",
                            },
                          ]
                        : []),
                    ]}
                  >
                    <p className="text-xs text-gray-400">
                      Making charges: {p.makingCharges}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCartItem(p);
                        }}
                        className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                          isInCart(p._id || p.id)
                            ? "bg-brand-blue text-white border-brand-blue"
                            : "border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                        }`}
                      >
                        {isInCart(p._id || p.id) ? "Added ✓" : "Add to Enquiry"}
                      </button>
                      {p.tryAtHome && (
                        <button
                          onClick={() => navigateTo("/contact-us/")}
                          className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                        >
                          Try At Home
                        </button>
                      )}
                    </div>
                  </ProductCard>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <i className="fa-solid fa-gem text-4xl mb-4" />
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

      {/* Enquiry Cart FAB */}
      {enquiryCart.length > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 transition-all"
        >
          <i className="fa-solid fa-cart-shopping" />
          Enquiry ({enquiryCart.length})
        </button>
      )}

      {/* Enquiry Cart Slide-in */}
      <SlideinPanel
        open={showCart}
        onClose={() => setShowCart(false)}
        title={`Enquiry Cart (${enquiryCart.length})`}
        footer={
          <>
            <div className="flex items-center justify-between text-sm font-bold text-brand-charcoal">
              <span>Total Estimate</span>
              <span className="text-brand-blue">
                ₹ {totalCartValue.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => {
                setShowCart(false);
                navigateTo("/contact-us/");
              }}
              className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Send Enquiry
            </button>
          </>
        }
      >
        {enquiryCart.map((item) => (
          <div
            key={item._id || item.id}
            className="flex items-center justify-between rounded-xl border border-gray-100 p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-brand-charcoal truncate">
                {item.name}
              </p>
              <p className="text-xs text-gray-500">
                {item.weightGrams}g · {item.metalType}
              </p>
              <p className="text-xs font-bold text-brand-blue mt-0.5">
                {item.price}
              </p>
            </div>
            <button
              onClick={() => toggleCartItem(item)}
              className="ml-3 text-xs text-red-500 font-semibold hover:underline shrink-0"
            >
              Remove
            </button>
          </div>
        ))}
      </SlideinPanel>
    </div>
  );
}

export default JewelleryGallery;