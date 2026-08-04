import { useState } from "react";
import { useLocation } from "../../../store/locationSlice";
import { cities } from "../../../data/locations";
import { ActiveChip } from "../GalleryComponents";
import { useProperties } from "../../../hooks/useProperties";
import QuickMatchModal from "./QuickMatchModal";

import {
  PROPERTY_CARD_TYPES,
  CITY_OPTIONS,
  INITIAL_FILTERS,
  INITIAL_SECTIONS,
} from "./propertyConstants";
import {
  useCardTypeStats,
  useActiveChips,
  useFilteredProperties,
} from "./propertyHooks";
import PropertyTypeStrip from "./PropertyTypeStrip";
import PropertyFinancePanel from "./PropertyFinancePanel";
import PropertyFilterSidebar from "./PropertyFilterSidebar";
import ProductCard from "../ProductCard";
import {
  getPropertyTypeLabel,
  getDetailTags,
  getStatusBadge,
} from "./propertyHelpers";

function PropertyGallery() {
  const { selectedCity, selectCity } = useLocation();
  const { properties, loading, error } = useProperties();

  /* ── Top-level state ── */
  const [selectedCardType, setSelectedCardType] = useState("All");
  const [locationInput, setLocationInput] = useState("");
  const [pincodeInput, setPincodeInput] = useState("");
  const [requirementText, setRequirementText] = useState("");
  const [showFinance, setShowFinance] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filters, setFilters] = useState({ ...INITIAL_FILTERS });
  const [openSections, setOpenSections] = useState({ ...INITIAL_SECTIONS });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [quickMatchOpen, setQuickMatchOpen] = useState(false);
  const [familyLocationsOnly, setFamilyLocationsOnly] = useState(false);
  const [preApprovedMode, setPreApprovedMode] = useState(false);

  /* ── Derived values ── */
  const cityAreas = selectedCity ? cities[selectedCity]?.areas || [] : [];
  const noCityMessage = !selectedCity;

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  const resetFilters = () => setFilters({ ...INITIAL_FILTERS });

  /* ── Custom hooks ── */
  const cardTypeStats = useCardTypeStats(properties, PROPERTY_CARD_TYPES);
  const activeChips = useActiveChips(filters);
  const filteredProperties = useFilteredProperties({
    properties,
    selectedCardType,
    searchTerm,
    requirementText,
    sortBy,
    filters,
    selectedCity,
    locationInput,
    pincodeInput,
    familyLocationsOnly,
    preApprovedMode,
  });

  /* ── Chip removal ── */
  const removeChip = (chip) => {
    if (chip.key === "budget") {
      updateFilter("budgetMin", "");
      updateFilter("budgetMax", "");
    } else if (chip.key === "listed") {
      updateFilter("listedWithin", "");
    } else if (chip.key === "gated") {
      updateFilter("gatedCommunity", false);
    } else if (chip.key === "loan") {
      updateFilter("loanApprovedOnly", false);
    } else {
      const prefix = chip.key.split("-")[0];
      const map = {
        bt: "buildingType",
        pt: "propertyType",
        bed: "bedrooms",
        loc: "localities",
        furn: "furnishing",
        pb: "postedBy",
        poss: "possessionStatus",
        amen: "amenities",
        face: "facing",
        age: "propertyAge",
        avail: "availability",
      };
      const key = map[prefix];
      if (key)
        updateFilter(
          key,
          filters[key].filter((s) => s !== chip.label),
        );
    }
  };

  /* ── Shared filter sidebar props ── */
  const sidebarProps = {
    filters,
    updateFilter,
    openSections,
    toggleSection,
    activeChips,
    resetFilters,
    cityAreas,
    noCityMessage,
  };

  /* ── Render ── */
  return (
    <div className="pb-24 pt-6 sm:pt-10 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ── Page Header ── */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-1">
              OneVishwam · Real Estate
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl">
              Find Your Property
            </h1>
          </div>
          <span className="hidden sm:block text-xs text-gray-400 pb-1">
            {filteredProperties.length} listing
            {filteredProperties.length !== 1 ? "s" : ""} available
          </span>
        </div>

        {/* ── Property Type Pill Strip ── */}
        <PropertyTypeStrip
          types={PROPERTY_CARD_TYPES}
          selected={selectedCardType}
          stats={cardTypeStats}
          onSelect={setSelectedCardType}
        />

        {/* ── Unified Search Card ── */}
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Row 1: Location selectors + Search button */}
          <div className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {/* City */}
            <div className="flex-1 flex flex-col px-4 py-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                <i className="fa-solid fa-city mr-1 text-brand-blue/60" />
                City
              </label>
              <select
                value={selectedCity || ""}
                onChange={(e) => {
                  selectCity(e.target.value);
                  setLocationInput("");
                }}
                className="flex-1 text-sm font-medium text-brand-charcoal outline-none bg-transparent cursor-pointer"
              >
                <option value="">Select City</option>
                {CITY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location / Area */}
            <div className="flex-1 flex flex-col px-4 py-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                <i className="fa-solid fa-location-dot mr-1 text-brand-blue/60" />
                Area
              </label>
              <select
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                disabled={!selectedCity}
                className="flex-1 text-sm font-medium text-brand-charcoal outline-none bg-transparent cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                <option value="">
                  {selectedCity ? "Select Area" : "Select city first"}
                </option>
                {cityAreas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Pincode */}
            <div className="flex-1 flex flex-col px-4 py-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                <i className="fa-solid fa-map-pin mr-1 text-brand-blue/60" />
                Pincode
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) =>
                  setPincodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="6-digit code"
                className="flex-1 text-sm font-medium text-brand-charcoal outline-none bg-transparent placeholder:text-gray-300"
              />
            </div>

            {/* Requirement text */}
            <div className="flex-[2] flex flex-col px-4 py-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                <i className="fa-solid fa-pen mr-1 text-brand-blue/60" />
                Requirement
              </label>
              <input
                type="text"
                value={requirementText}
                onChange={(e) => setRequirementText(e.target.value)}
                placeholder="e.g. 3 BHK ready to move, budget 50L"
                className="flex-1 text-sm font-medium text-brand-charcoal outline-none bg-transparent placeholder:text-gray-300"
              />
            </div>

            {/* Search button */}
            <div className="flex items-center px-3 py-2 sm:py-0">
              <button
                onClick={() => setQuickMatchOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                <i className="fa-solid fa-magnifying-glass" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Row 2: Toggles + Finance link */}
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-gray-100 bg-gray-50/60 px-4 py-2.5">
            {/* Family Locations toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <button
                onClick={() => setFamilyLocationsOnly(!familyLocationsOnly)}
                className={`relative w-8 h-4 rounded-full transition-colors ${familyLocationsOnly ? "bg-brand-blue" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${familyLocationsOnly ? "translate-x-4" : ""}`}
                />
              </button>
              <span className="text-xs font-semibold text-gray-600">
                Family Locations Only
              </span>
            </label>

            {/* Finance Options link */}
            <button
              onClick={() => setShowFinance(!showFinance)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline"
            >
              <i
                className={`fa-solid fa-chevron-down text-[10px] transition-transform ${showFinance ? "rotate-180" : ""}`}
              />
              View Finance Options
            </button>
          </div>
        </div>

        {/* Finance Panel (expands below the card) */}
        {showFinance && (
          <PropertyFinancePanel
            show={showFinance}
            onToggle={() => setShowFinance(!showFinance)}
            onPreApproved={() => {
              setPreApprovedMode(true);
              setShowFinance(false);
            }}
            panelOnly
          />
        )}

        {/* ── Post Requirement Banner ── */}
        <a href="/property/requirement"
          className="mt-5 rounded-2xl border border-dashed border-brand-blue/30 bg-brand-blue/5 p-5 flex items-center justify-between gap-4 hover:bg-brand-blue/10 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0 group-hover:bg-brand-blue/20 transition-colors">
              <i className="fa-solid fa-circle-plus text-brand-blue" />
            </div>
            <p className="text-sm font-bold text-brand-charcoal">Post Your Requirement</p>
          </div>
          <i className="fa-solid fa-arrow-right text-brand-blue text-sm" />
        </a>

        {/* ── Loading / Error states ── */}
        {loading && (
          <div className="mt-5 flex items-center justify-center gap-2 py-10 text-gray-400">
            <i className="fa-solid fa-spinner fa-spin text-lg" />
            <span className="text-sm">Loading properties...</span>
          </div>
        )}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-center">
            <i className="fa-solid fa-circle-exclamation text-red-400 text-lg mb-1" />
            <p className="text-sm text-red-600">Failed to load properties. Please try again later.</p>
          </div>
        )}

        {/* ── Results Bar: Count + Active chips + Search + Sort ── */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Left: count + chips */}
          <div className="flex-1 flex flex-wrap items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
              {filteredProperties.length} propert
              {filteredProperties.length !== 1 ? "ies" : "y"}
            </span>
            {activeChips.map((chip) => (
              <ActiveChip
                key={chip.key}
                label={chip.label}
                onRemove={() => removeChip(chip)}
              />
            ))}
            {activeChips.length > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-red-500 font-semibold hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Right: search + mobile filter toggle + sort */}
          <div className="flex gap-2 shrink-0">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search properties..."
                className="w-44 rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-xs outline-none focus:border-brand-blue focus:w-56 transition-all"
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <i className="fa-solid fa-sliders text-brand-blue" /> Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-brand-blue bg-white"
            >
              <option value="latest">Latest</option>
              <option value="price-low">Price ↑</option>
              <option value="price-high">Price ↓</option>
            </select>
          </div>
        </div>

        {/* Pre-Approved Mode Banner */}
        {preApprovedMode && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-circle-check text-emerald-600 text-lg" />
              <div>
                <p className="text-sm font-bold text-emerald-800">
                  100% Pre-Approved Home Loan at 7%+
                </p>
                <p className="text-xs text-emerald-600">
                  Showing {filteredProperties.length} qualifying propert
                  {filteredProperties.length === 1 ? "y" : "ies"} — all with
                  loan approval
                </p>
              </div>
            </div>
            <button
              onClick={() => setPreApprovedMode(false)}
              className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              Browse All
            </button>
          </div>
        )}

        {/* ── Main Layout: Sidebar + Grid ── */}
        <div className="mt-5 flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="lg:sticky lg:top-24 lg:self-start max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-gray-100 bg-white p-4">
              <PropertyFilterSidebar {...sidebarProps} />
            </div>
          </aside>

          {/* Property Grid */}
          <div className="flex-1 min-w-0">
            {filteredProperties.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProperties.map((p) => {
                  const typeLabel = getPropertyTypeLabel(p);
                  const tags = getDetailTags(p);
                  const badge = getStatusBadge(p);
                  return (
                    <ProductCard
                      key={p.id}
                      link={`/property/${p.id}`}
                      image={p.images[0]}
                      alt={p.title}
                      title={p.title}
                      price={p.price}
                      priceSuffix={p.priceSuffix}
                      location={p.location}
                      pincode={p.pincode}
                      tags={[typeLabel, ...tags.slice(0, 2)]}
                      badges={[
                        ...(p.recentlyAdded
                          ? [
                              {
                                label: "New",
                                className: "bg-emerald-500 text-white",
                              },
                            ]
                          : []),
                        ...(badge
                          ? [{ label: badge.label, className: badge.cls }]
                          : []),
                      ]}
                    >
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500">
                        {p.agent && (
                          <span>
                            <i className="fa-solid fa-user mr-1 text-gray-400" />
                            {p.agent.name}
                          </span>
                        )}
                        {p.extraRoom && (
                          <span>
                            <i className="fa-solid fa-star mr-1 text-gray-400" />
                            {p.extraRoom}
                          </span>
                        )}
                      </div>
                      {p.loanApproved && (
                        <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1">
                          <i className="fa-solid fa-circle-check text-[10px] text-emerald-600" />
                          <span className="text-[10px] font-semibold text-emerald-700">100% Pre‑Approved Loan</span>
                        </div>
                      )}
                    </ProductCard>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <i className="fa-solid fa-building text-4xl mb-4" />
                <p className="text-lg font-medium">No properties found.</p>
                <p className="text-sm mt-1 mb-6">
                  Try another category or location.
                </p>
                <a href="/property/requirement"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white hover:bg-brand-navy transition-colors"
                >
                  <i className="fa-solid fa-circle-plus" />
                  Tell Us What You're Looking For
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
              <span className="font-bold text-brand-charcoal">Filters</span>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <i className="fa-solid fa-xmark text-gray-500" />
              </button>
            </div>
            <div className="px-5 py-4">
              <PropertyFilterSidebar {...sidebarProps} />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-brand-blue text-white rounded-xl py-3 text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Show {filteredProperties.length} Properties
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Match Floating Button */}
      <button
        onClick={() => setQuickMatchOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 transition-all"
      >
        <i className="fa-solid fa-bolt" /> Find My Property
      </button>

      {/* Quick Match Modal */}
      {quickMatchOpen && (
        <QuickMatchModal onClose={() => setQuickMatchOpen(false)} />
      )}
    </div>
  );
}

export default PropertyGallery;
