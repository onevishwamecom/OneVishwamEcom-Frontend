import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useLocation } from "../../../store/locationSlice";
import { cities, getCityLabel } from "../../../data/locations";
import { ActiveChip } from "../GalleryComponents";
import { useProperties } from "../../../hooks/useProperties";
import QuickMatchModal from "./QuickMatchModal";

import {
  CITY_OPTIONS,
  INITIAL_FILTERS,
  INITIAL_SECTIONS,
} from "./propertyConstants";
import {
  useActiveChips,
  useFilteredProperties,
} from "./propertyHooks";
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
    sessionStorage.setItem(
      RESTORE_KEY,
      JSON.stringify({
        searchTerm,
        requirementText,
        selectedCardType,
        locationInput,
        pincodeInput,
        sortBy,
        page,
        filters,
      })
    );
  }, [
    searchTerm,
    requirementText,
    selectedCardType,
    locationInput,
    pincodeInput,
    sortBy,
    page,
    filters,
  ]);

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  /* ── Dynamic available localities derived from loaded properties + city dataset ── */
  const cityAreas = useMemo(() => {
    const areaSet = new Set();

    const baseAreas =
      selectedCity && cities[selectedCity]?.areas
        ? cities[selectedCity].areas
        : cities["bengaluru"]?.areas || [];
    baseAreas.forEach((a) => areaSet.add(a));

    (properties || []).forEach((p) => {
      if (p.zone) areaSet.add(p.zone);
      if (p.location) {
        const parts = p.location.split(",");
        parts.forEach((part) => {
          const trimmed = part.trim();
          if (
            trimmed &&
            trimmed.length > 2 &&
            !trimmed.toLowerCase().includes("bengaluru") &&
            !trimmed.toLowerCase().includes("bangalore")
          ) {
            areaSet.add(trimmed);
          }
        });
      }
    });

    return Array.from(areaSet).sort((a, b) => a.localeCompare(b));
  }, [selectedCity, properties]);

  const noCityMessage = useMemo(() => {
    if (!selectedCity) return null;
    const label = getCityLabel(selectedCity);
    const count = (properties || []).filter((p) => {
      const pCity = String(p.city || "").toLowerCase();
      const sCity = String(selectedCity || "").toLowerCase();
      return (
        pCity === sCity ||
        (sCity === "bengaluru" && pCity === "bangalore") ||
        (sCity === "bangalore" && pCity === "bengaluru")
      );
    }).length;
    if (count === 0) {
      return `We're coming to ${label} soon! Showing all available properties below.`;
    }
    return null;
  }, [selectedCity, properties]);

  /* ── Filter state setters ── */
  const updateFilter = (key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const resetFilters = () => {
    setPage(1);
    setFilters({ ...INITIAL_FILTERS });
    setSearchTerm("");
    setRequirementText("");
    setLocationInput("");
    setPincodeInput("");
    setSelectedCardType("All");
    setFamilyLocationsOnly(false);
    setPreApprovedMode(false);
  };

  /* ── Active chips derived via hook ── */
  const activeChips = useActiveChips(filters);

  /* ── Filtered properties derived via hook ── */
  const filteredProperties = useFilteredProperties(properties, {
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
    currentPage * PER_PAGE
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
          filters[key].filter((s) => s !== chip.label)
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
    <div className="min-h-screen bg-[#f8fafc] pb-24 pt-16 lg:pt-14 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ── Top Navigation & Title Bar ── */}
        <div className="pt-4 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1.5 font-bold text-brand-blue hover:underline"
              >
                <i className="fa-solid fa-arrow-left" /> Back
              </button>
              <span>/</span>
              <Link to="/home" className="hover:text-brand-blue">Home</Link>
              <span>/</span>
              <span className="text-brand-charcoal font-semibold">Real Estate Properties</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/property/requirement"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-gray-200 px-3.5 py-1.5 text-xs font-bold text-brand-blue hover:bg-brand-blue/5 hover:border-brand-blue/30 transition-colors shadow-2xs"
              >
                <i className="fa-solid fa-circle-plus text-brand-blue" />
                <span>Post Requirement</span>
              </Link>
              <button
                onClick={() => setQuickMatchOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue px-3.5 py-1.5 text-xs font-bold text-white hover:bg-brand-navy transition-colors shadow-xs"
              >
                <i className="fa-solid fa-bolt text-yellow-400" />
                <span>Quick Match</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-charcoal">
                Explore Verified Properties
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Discover premium apartments, independent villas, plots, and commercial spaces.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200/80 px-3 py-1.5 rounded-xl shadow-2xs">
                <i className="fa-solid fa-building mr-1.5 text-brand-blue" />
                {sortedProperties.length} Listing{sortedProperties.length !== 1 ? "s" : ""} Available
              </span>
            </div>
          </div>
        </div>

        {/* ── Stretched Modern Unified Search Bar ── */}
        <div className="mt-4">
          <div className="relative flex items-center w-full bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:border-brand-blue/40 focus-within:border-brand-blue focus-within:ring-4 focus-within:ring-brand-blue/10 transition-all duration-200">
            <i className="fa-solid fa-magnifying-glass absolute left-4 text-gray-400 text-sm pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setPage(1);
                setSearchTerm(e.target.value);
              }}
              placeholder="Search properties by title, locality, builder, BHK (e.g. 3 BHK Whitefield, Prestige, Plot)..."
              className="w-full bg-transparent pl-11 pr-28 py-3.5 sm:py-4 text-sm font-medium text-brand-charcoal placeholder:text-gray-400 outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setPage(1);
                  setSearchTerm("");
                }}
                className="absolute right-14 text-gray-400 hover:text-gray-600 p-1 text-xs transition-colors"
                title="Clear search"
              >
                <i className="fa-solid fa-circle-xmark text-sm" />
              </button>
            )}
            <div className="absolute right-3.5 hidden sm:flex items-center">
              <span className="text-[11px] font-bold text-white bg-brand-blue px-3 py-1.5 rounded-xl shadow-xs">
                Search
              </span>
            </div>
          </div>
        </div>

        {/* ── Active Filters & Mobile Trigger Bar ── */}
        {(activeChips.length > 0 || true) && (
          <div className="mt-4 flex items-center justify-between gap-3 pb-1">
            {/* Left: Active chips */}
            <div className="flex-1 flex flex-wrap items-center gap-1.5 min-w-0">
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
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-700 ml-1.5 px-1 py-0.5"
                >
                  <i className="fa-solid fa-rotate-left" /> Reset All Filters
                </button>
              )}
            </div>

            {/* Right: Mobile filter toggle */}
            <div className="lg:hidden flex items-center shrink-0">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-brand-charcoal hover:bg-gray-50 transition-colors shadow-2xs"
              >
                <i className="fa-solid fa-sliders text-brand-blue" />
                <span>Filters</span>
                {activeChips.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-brand-blue text-white text-[10px] flex items-center justify-center font-bold">
                    {activeChips.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Loading / Error states ── */}
        {loading && (
          <div className="my-12 flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
            <i className="fa-solid fa-spinner fa-spin text-2xl text-brand-blue" />
            <span className="text-sm font-semibold">Loading verified properties...</span>
          </div>
        )}
        {error && (
          <div className="my-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-center shadow-xs">
            <i className="fa-solid fa-circle-exclamation text-red-500 text-xl mb-1" />
            <p className="text-sm font-bold text-red-700">Failed to load property inventory.</p>
            <p className="text-xs text-red-500 mt-0.5">Please check your connection or refresh the page.</p>
          </div>
        )}

        {/* ── Main Layout: Sidebar + Grid ── */}
        <div className="mt-4 flex gap-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="lg:sticky lg:top-20 lg:self-start max-h-[calc(100vh-6rem)] overflow-y-auto rounded-3xl border border-gray-200/80 bg-white p-5 shadow-xs scrollbar-hide">
              <PropertyFilterSidebar {...sidebarProps} />
            </div>
          </aside>

          {/* Property Grid Container */}
          <div className="flex-1 min-w-0">
            {pageProperties.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
                {pageProperties.map((p) => {
                  const typeLabel = getPropertyTypeLabel(p);
                  const tags = getDetailTags(p);
                  const badge = getStatusBadge(p);
                  return (
                    <ProductCard
                      key={p._id || p.id}
                      link={`/property/${p._id || p.id}`}
                      image={getPropertyCoverImage(p)}
                      alt={p.title || p.name || "Property"}
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
                                className: "bg-blue-600 text-white",
                              },
                            ]
                          : []),
                        ...(badge
                          ? [{ label: badge.label, className: badge.cls }]
                          : []),
                      ]}
                    >
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500">
                        {p.agent && (
                          <span className="flex items-center gap-1">
                            <i className="fa-solid fa-user-tie text-gray-400 text-[10px]" />
                            {p.agent.name}
                          </span>
                        )}
                        {p.extraRoom && (
                          <span className="flex items-center gap-1">
                            <i className="fa-solid fa-door-open text-gray-400 text-[10px]" />
                            {p.extraRoom}
                          </span>
                        )}
                      </div>
                      {p.loanApproved && (
                        <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200/60 px-2.5 py-1">
                          <i className="fa-solid fa-circle-check text-[10px] text-emerald-600" />
                          <span className="text-[10px] font-bold text-emerald-700">
                            100% Pre‑Approved Loan Available
                          </span>
                        </div>
                      )}
                    </ProductCard>
                  );
                })}
              </div>
            ) : (
              !loading && (
                <div className="rounded-3xl bg-white border border-gray-200/80 p-8 sm:p-12 text-center shadow-xs">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i className="fa-solid fa-building-circle-exclamation" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-charcoal">No Matching Properties Found</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-6 max-w-md mx-auto">
                    We couldn't find any properties matching your current search or filter criteria. Try adjusting your budget, locality, or resetting filters.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-brand-charcoal hover:bg-gray-50 transition-colors shadow-2xs"
                    >
                      <i className="fa-solid fa-rotate-left" />
                      Reset All Filters
                    </button>
                    <Link
                      to="/property/requirement"
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-navy transition-colors shadow-xs"
                    >
                      <i className="fa-solid fa-circle-plus" />
                      Post Custom Requirement
                    </Link>
                  </div>
                </div>
              )
            )}

            {/* ── Modern Pagination Controls ── */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-brand-charcoal hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
                >
                  <i className="fa-solid fa-chevron-left text-[10px]" /> Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                  const show =
                    n === 1 ||
                    n === totalPages ||
                    Math.abs(n - currentPage) <= 1;
                  const prevShown =
                    n === 1 || Math.abs(n - 1 - currentPage) <= 1;
                  if (!show) {
                    if (prevShown) {
                      return (
                        <span key={n} className="px-1 text-gray-400 text-xs font-semibold">
                          …
                        </span>
                      );
                    }
                    return null;
                  }
                  return (
                    <button
                      key={n}
                      onClick={() => goToPage(n)}
                      className={`min-w-10 h-9 rounded-xl text-xs font-bold transition-all ${
                        n === currentPage
                          ? "bg-brand-blue text-white shadow-md scale-105"
                          : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-2xs"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-brand-charcoal hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
                >
                  Next <i className="fa-solid fa-chevron-right text-[10px]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="font-bold text-brand-charcoal">Filter Properties</h3>
                <p className="text-[11px] text-gray-500">Refine by price, size, type & amenities</p>
              </div>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto">
              <PropertyFilterSidebar {...sidebarProps} />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-brand-blue text-white rounded-xl py-3 text-xs font-bold hover:bg-brand-navy transition-colors shadow-md"
              >
                Show {filteredProperties.length} Properties
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Quick Match Floating Action Button ── */}
      <button
        onClick={() => setQuickMatchOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-xs font-bold text-white shadow-xl hover:bg-brand-navy hover:scale-105 transition-all"
      >
        <i className="fa-solid fa-bolt text-yellow-400" /> Find My Property
      </button>

      {/* ── Quick Match Modal ── */}
      {quickMatchOpen && (
        <QuickMatchModal onClose={() => setQuickMatchOpen(false)} />
      )}
    </div>
  );
}

export default PropertyGallery;
