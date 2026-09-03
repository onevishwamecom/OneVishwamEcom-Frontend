import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useLocation } from "../../../store/locationSlice";
import { cities, getCityLabel } from "../../../data/locations";
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
import PropertyFilterSidebar from "./PropertyFilterSidebar";
import ProductCard from "../ProductCard";
import {
  getPropertyTypeLabel,
  getDetailTags,
  getStatusBadge,
  hasPropertyImages,
  getPropertyCoverImage,
  sortPropertiesWithPriority,
} from "./propertyHelpers";

const PER_PAGE = 9;
const RESTORE_KEY = "vishwam.propertyGalleryState";

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
  const [page, setPage] = useState(1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const restoredRef = useRef(false);

  /* ── URL search (e.g. homepage/hero search → ?q=...) ── */
  useEffect(() => {
    const q = (searchParams.get("q") || "").trim();
    if (q) {
      setSearchTerm(q);
      setPage(1);
    }
  }, [searchParams]);

  /* ── Restore previous search/filter/pagination state (e.g. after Back) ── */
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    try {
      const raw = sessionStorage.getItem(RESTORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.searchTerm) setSearchTerm(s.searchTerm);
        if (s.requirementText) setRequirementText(s.requirementText);
        if (s.selectedCardType) setSelectedCardType(s.selectedCardType);
        if (s.locationInput) setLocationInput(s.locationInput);
        if (s.pincodeInput) setPincodeInput(s.pincodeInput);
        if (s.sortBy) setSortBy(s.sortBy);
        if (s.page) setPage(s.page);
        if (s.filters) setFilters({ ...INITIAL_FILTERS, ...s.filters });
      }
    } catch (e) {
      /* ignore corrupt storage */
    }
  }, []);

  /* ── Persist state continuously so Back from a detail page restores it ── */
  useEffect(() => {
    if (!restoredRef.current) return;
    sessionStorage.setItem(RESTORE_KEY, JSON.stringify({
      searchTerm,
      requirementText,
      selectedCardType,
      locationInput,
      pincodeInput,
      sortBy,
      page,
      filters,
    }));
  }, [searchTerm, requirementText, selectedCardType, locationInput, pincodeInput, sortBy, page, filters]);

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  /* ── Dynamic available localities derived from loaded properties + city dataset ── */
  const cityAreas = useMemo(() => {
    const areaSet = new Set();

    const baseAreas = (selectedCity && cities[selectedCity]?.areas)
      ? cities[selectedCity].areas
      : (cities['bengaluru']?.areas || []);
    baseAreas.forEach((a) => areaSet.add(a));

    (properties || []).forEach((p) => {
      if (p.zone) areaSet.add(p.zone);
      if (p.location) {
        const parts = p.location.split(',');
        parts.forEach((part) => {
          const clean = part.replace(/\(.*\)/g, '').replace(/-\s*\d+$/g, '').replace(/Bangalore|Bengaluru/gi, '').trim();
          if (clean && clean.length > 2 && clean.length < 30) {
            areaSet.add(clean);
          }
        });
      }
    });

    return Array.from(areaSet).sort((a, b) => a.localeCompare(b));
  }, [properties, selectedCity]);
  const noCityMessage = false;

  const updateFilter = (key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  const resetFilters = () => {
    setPage(1);
    setFilters({ ...INITIAL_FILTERS });
  };

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

  /* ── Priority sort (Onevishwam top priority -> Images first) + pagination ── */
  const sortedProperties = useMemo(() => {
    return sortPropertiesWithPriority(filteredProperties);
  }, [filteredProperties]);

  const totalPages = Math.max(1, Math.ceil(sortedProperties.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageProperties = sortedProperties.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const goToPage = (p) => {
    setPage(Math.min(Math.max(1, p), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    <div className="pb-24 pt-16 lg:pt-14 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ── Page Header ── */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <button onClick={goBack}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-blue transition-colors">
              <i className="fa-solid fa-arrow-left" /> Back
            </button>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-1">
              OneVishwam · Real Estate
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl">
              Find Your Property
            </h1>
          </div>
          <span className="hidden sm:block text-xs text-gray-400 pb-1">
            {sortedProperties.length} listing
            {sortedProperties.length !== 1 ? "s" : ""} available
          </span>
        </div>

        {/* ── Property Type Pill Strip ── */}
        <PropertyTypeStrip
          types={PROPERTY_CARD_TYPES}
          selected={selectedCardType}
          stats={cardTypeStats}
          onSelect={(t) => { setPage(1); setSelectedCardType(t); }}
        />


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
                onChange={(e) => { setPage(1); setSearchTerm(e.target.value); }}
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
              onChange={(e) => { setPage(1); setSortBy(e.target.value); }}
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
            {pageProperties.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
                {pageProperties.map((p) => {
                  const typeLabel = getPropertyTypeLabel(p);
                  const tags = getDetailTags(p);
                  const badge = getStatusBadge(p);
                  return (
                    <ProductCard
                      key={p._id || p.id}
                      link={`/property/${p._id || p.id}`}
                      image={getPropertyCoverImage(p)}
                      alt={p.title || p.name || 'Property'}
                      title={p.title || p.name}
                      price={p.price}
                      priceSuffix={p.priceSuffix}
                      priceType={p.priceType}
                      location={p.location || p.city}
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
                <p className="text-lg font-medium text-brand-charcoal">No properties found.</p>
                <p className="text-sm mt-1 mb-6 text-gray-500">
                  Try adjusting your search criteria or reset all filters.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setRequirementText("");
                      setLocationInput("");
                      setPincodeInput("");
                      setSelectedCardType("All");
                      setFamilyLocationsOnly(false);
                      setPreApprovedMode(false);
                      resetFilters();
                      try { sessionStorage.removeItem(RESTORE_KEY); } catch (e) {}
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
                  >
                    <i className="fa-solid fa-rotate-left" />
                    Reset All Filters
                  </button>
                  <Link
                    to="/property/requirement"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    <i className="fa-solid fa-circle-plus" />
                    Post Requirement
                  </Link>
                </div>
              </div>
            )}

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="fa-solid fa-chevron-left text-[10px]" /> Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                  const show =
                    n === 1 || n === totalPages ||
                    Math.abs(n - currentPage) <= 1;
                  const prevShown = n === 1 || Math.abs(n - 1 - currentPage) <= 1;
                  if (!show) {
                    if (prevShown) {
                      return <span key={n} className="px-1 text-gray-400 text-xs">…</span>;
                    }
                    return null;
                  }
                  return (
                    <button
                      key={n}
                      onClick={() => goToPage(n)}
                      className={`min-w-9 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                        n === currentPage
                          ? "bg-brand-blue text-white shadow-sm"
                          : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next <i className="fa-solid fa-chevron-right text-[10px]" />
                </button>
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
