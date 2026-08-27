import { useState, useEffect, useMemo, useRef, useTransition, useDeferredValue } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useLocation } from "../../../store/locationSlice";
import { cities, getCityLabel } from "../../../data/locations";

import {
  CategoryPillStrip,
  SectorPageTemplate,
  SectorPageHeader,
  GallerySearchBar,
  ResultsBar,
  Pagination,
  EmptyState,
  Fab,
  LoadingSpinner,
  ErrorState,
} from "../shared";

import QuickMatchModal from "./QuickMatchModal";
import PropertyFinancePanel from "./PropertyFinancePanel";
import PropertyFilterSidebar from "./PropertyFilterSidebar";
import PropertyCard from "./PropertyCard";

import { useProperties } from "../../../hooks/useProperties";
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

import {
  loadSessionState,
  saveSessionState,
  clearSessionState,
} from "../shared";

const RESTORE_KEY = "vishwam.propertyGalleryState";
const PER_PAGE = 9;

function PropertyGallery() {
  const { selectedCity, selectCity } = useLocation();
  const { properties, loading, error, retry } = useProperties();

  /* ── State ── */
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
  const [, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(searchTerm);

  /* ── URL search (?q=) ── */
  useEffect(() => {
    const q = (searchParams.get("q") || "").trim();
    if (q) {
      setSearchTerm(q);
      setPage(1);
    }
  }, [searchParams]);

  /* ── Restore previous state on back navigation ── */
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const s = loadSessionState(RESTORE_KEY, {});
    if (s.searchTerm) setSearchTerm(s.searchTerm);
    if (s.requirementText) setRequirementText(s.requirementText);
    if (s.selectedCardType) setSelectedCardType(s.selectedCardType);
    if (s.locationInput) setLocationInput(s.locationInput);
    if (s.pincodeInput) setPincodeInput(s.pincodeInput);
    if (s.sortBy) setSortBy(s.sortBy);
    if (s.page) setPage(s.page);
    if (s.filters) setFilters({ ...INITIAL_FILTERS, ...s.filters });
  }, []);

  /* ── Persist state ── */
  useEffect(() => {
    if (!restoredRef.current) return;
    saveSessionState(RESTORE_KEY, {
      searchTerm,
      requirementText,
      selectedCardType,
      locationInput,
      pincodeInput,
      sortBy,
      page,
      filters,
    });
  }, [searchTerm, requirementText, selectedCardType, locationInput, pincodeInput, sortBy, page, filters]);

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  /* ── Derived values ── */
  const cityAreas = selectedCity ? cities[selectedCity]?.areas || [] : [];
  const noCityMessage = !selectedCity;

  const updateFilter = (key, value) => {
    startTransition(() => {
      setPage(1);
      setFilters((prev) => ({ ...prev, [key]: value }));
    });
  };

  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const resetFilters = () => {
    setPage(1);
    setFilters({ ...INITIAL_FILTERS });
  };

  const handleResetAll = () => {
    setPage(1);
    setSearchTerm("");
    setRequirementText("");
    setLocationInput("");
    setPincodeInput("");
    setSelectedCardType("All");
    setFamilyLocationsOnly(false);
    setPreApprovedMode(false);
    resetFilters();
    clearSessionState(RESTORE_KEY);
  };

  /* ── Derived data hooks ── */
  const cardTypeStats = useCardTypeStats(properties, PROPERTY_CARD_TYPES);
  const activeChips = useActiveChips(filters);
  const filteredProperties = useFilteredProperties({
    properties,
    selectedCardType,
    searchTerm: deferredSearch,
    requirementText,
    sortBy,
    filters,
    selectedCity,
    locationInput,
    pincodeInput,
    familyLocationsOnly,
    preApprovedMode,
  });

  /* ── Image-priority sort + pagination ── */
  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      const aImg = Array.isArray(a.images) && a.images.some((src) => src && !src.startsWith("data:")) ? 1 : 0;
      const bImg = Array.isArray(b.images) && b.images.some((src) => src && !src.startsWith("data:")) ? 1 : 0;
      if (aImg !== bImg) return bImg - aImg;
      return (b._id || b.id || 0) > (a._id || a.id || 0) ? 1 : -1;
    });
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

  /* ── Sidebar props ── */
  const sidebarProps = {
    filters,
    updateFilter,
    openSections,
    toggleSection,
    activeChips,
    resetFilters,
    cityAreas,
    noCityMessage,
    properties,
  };

  /* ── Render ── */
  return (
    <SectorPageTemplate>
      {/* ── Page Header — no Back button ── */}
      <SectorPageHeader
        eyebrow="OneVishwam · Real Estate"
        title="Find Your Property"
        count={sortedProperties.length}
        countLabel="listing"
      />

        {/* ── Property Type Pill Strip ── */}
        <CategoryPillStrip
          types={PROPERTY_CARD_TYPES}
          selected={selectedCardType}
          stats={cardTypeStats}
          onSelect={(t) => {
            setPage(1);
            setSelectedCardType(t);
          }}
          className="mt-5"
        />

        {/* ── Top Bar: Search + Post Requirement ── */}
        <GallerySearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search properties (e.g. 2 BHK, Villa, Whitefield)..."
          postRequirementLink="/post-requirement"
          postRequirementLabel="Post Requirement"
        />
        

        {/* Finance Panel */}
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

        {/* ── Loading / Error ── */}
        {loading && (
          <div className="mt-6">
            <LoadingSpinner text="Loading properties..." className="py-12" />
          </div>
        )}
        {error && !loading && (
          <div className="mt-6">
            <ErrorState error={error} onRetry={retry} title="Failed to load properties" />
          </div>
        )}

        {/* ── Pre-Approved Banner ── */}
        {preApprovedMode && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-circle-check text-emerald-600 text-lg" />
              <div>
                <p className="text-sm font-bold text-emerald-800">
                  100% Pre-Approved Home Loan at 7%+
                </p>
                <p className="text-xs text-emerald-600">
                  Showing {filteredProperties.length} qualifying propert
                  {filteredProperties.length === 1 ? "y" : "ies"} — all with loan approval
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

        {/* ── Results Bar (chips + mobile filters) ── */}
        {!loading && (
          <div className="mt-5">
            <ResultsBar
              activeChips={activeChips}
              onResetChips={handleResetAll}
              onRemoveChip={removeChip}
              showSearch={false}
              onMobileFilter={() => setShowMobileFilters(true)}
              className="space-y-3"
            />
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-bold text-brand-charcoal">
                {filteredProperties.length} propert{filteredProperties.length === 1 ? "y" : "ies"}
              </span>{" "}
              found
            </p>
          </div>
        )}

        {/* ── 2-Column Split Layout ── */}
        {!loading && (
          <div className="mt-5 grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
                <PropertyFilterSidebar {...sidebarProps} variant="desktop" />
              </div>
            </aside>

            {/* Property Grid */}
            <div className="min-w-0">
              {pageProperties.length > 0 ? (
                <>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {pageProperties.map((p) => (
                      <PropertyCard key={p._id || p.id} property={p} />
                    ))}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                  />
                </>
              ) : (
                <EmptyState
                  icon="fa-solid fa-building"
                  title="No properties found."
                  subtitle="Try adjusting your search criteria or reset all filters."
                  onReset={handleResetAll}
                  resetLabel="Reset All Filters"
                  action={
                    <Link
                      to="/property/requirement"
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
                    >
                      <i className="fa-solid fa-circle-plus" /> Post Requirement
                    </Link>
                  }
                />
              )}
            </div>
          </div>
        )}

      {/* ── Mobile Filter Drawer ── */}
      <div className="fixed inset-0 z-50 lg:hidden">
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            showMobileFilters ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setShowMobileFilters(false)}
        />
        <div
          className={`absolute left-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto transition-transform duration-300 ${
            showMobileFilters ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
            <span className="font-bold text-brand-charcoal">Filters</span>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close filters"
            >
              <i className="fa-solid fa-xmark text-gray-500" />
            </button>
          </div>
          <div className="px-5 py-4">
            <PropertyFilterSidebar {...sidebarProps} variant="mobile" />
          </div>
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 flex gap-2">
            <button
              onClick={resetFilters}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="flex-[2] bg-brand-blue text-white rounded-xl py-3 text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Show {filteredProperties.length} Properties
            </button>
          </div>
        </div>
      </div>

      {/* Quick Match FAB */}
      {!quickMatchOpen && (
        <Fab
          icon="fa-solid fa-bolt"
          label="Find My Property"
          onClick={() => setQuickMatchOpen(true)}
          ariaLabel="Quick match"
        />
      )}

      {/* Quick Match Modal */}
      {quickMatchOpen && (
        <QuickMatchModal onClose={() => setQuickMatchOpen(false)} />
      )}
    </SectorPageTemplate>
  );
}

export default PropertyGallery;
