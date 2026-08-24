import { useState, useMemo, useEffect } from 'react';
import { navigateTo } from '../../../config/navigation';
import { cities } from '../../../data/locations';
import { ActiveChip } from '../GalleryComponents';
import FinanceCard from './FinanceCard';
import FinanceFilterSidebar from './FinanceFilterSidebar';
import { FINANCE_TABS, INITIAL_FILTERS, INITIAL_SECTIONS } from './financeConstants';
import { useTabStats, useActiveChips, useFilteredServices, useFinanceServices } from './financeHooks';

function FinanceGallery() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [filters, setFilters] = useState({ ...INITIAL_FILTERS });
  const [openSections, setOpenSections] = useState({ ...INITIAL_SECTIONS });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { services, loading, error } = useFinanceServices();

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const toggleSection = (id) => setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  const resetFilters = () => setFilters({ ...INITIAL_FILTERS });

  const tabStats = useTabStats(services, activeTab);
  const activeChips = useActiveChips(filters);
  const filteredServices = useFilteredServices({ services, activeTab, searchTerm, sortBy, filters });

  const removeChip = (chip) => {
    if (chip.key.startsWith('lt-')) {
      updateFilter('loanTypes', filters.loanTypes.filter((x) => x !== chip.label));
    } else if (chip.key === 'amount') {
      if (chip.label.startsWith('Min')) updateFilter('amountMin', '');
      else updateFilter('amountMax', '');
    } else if (chip.key === 'interest') {
      if (chip.label.startsWith('Min')) updateFilter('interestMin', '');
      else updateFilter('interestMax', '');
    } else if (chip.key === 'tenure') {
      updateFilter('tenure', '');
    } else if (chip.key.startsWith('pt-')) {
      updateFilter('providerTypes', filters.providerTypes.filter((x) => x !== chip.label));
    } else if (chip.key.startsWith('sm-')) {
      updateFilter('serviceModes', filters.serviceModes.filter((x) => x !== chip.label));
    } else if (chip.key === 'city') {
      updateFilter('city', '');
    } else if (chip.key.startsWith('loc-')) {
      updateFilter('localities', filters.localities.filter((x) => x !== chip.label));
    } else if (chip.key === 'pincode') {
      updateFilter('pincode', '');
    } else if (chip.key.startsWith('pb-')) {
      updateFilter('postedBy', filters.postedBy.filter((x) => x !== chip.label));
    } else if (chip.key.startsWith('av-')) {
      updateFilter('availability', filters.availability.filter((x) => x !== chip.label));
    }
  };

  const cityAreas = filters.city ? (cities[filters.city]?.areas || []) : [];
  const noCityMessage = !filters.city;

  return (
    <div className="pb-24 pt-16 lg:pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ── Page Header ── */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-1">
              OneVishwam · Finance
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl">
              Finance & Loan Services
            </h1>
            <p className="mt-1 text-sm text-gray-500 max-w-2xl">
              Find trusted financial services, loans, insurance, and investment options near you.
            </p>
          </div>
         
        </div>

        {/* ── Category Tabs ── */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FINANCE_TABS.map((tab) => {
            const sel = activeTab === tab.id;
            const count = tab.id === 'All' ? services.length : (tabStats[tab.id] || 0);
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 rounded-full border px-4 py-2 transition-all ${
                  sel
                    ? 'border-brand-blue bg-brand-blue text-white shadow-sm shadow-brand-blue/25'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-brand-blue/40 hover:text-brand-blue'
                }`}
              >
                <i className={`fa-solid ${tab.icon} text-xs`} />
                <span className="text-sm font-semibold whitespace-nowrap">{tab.label}</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  sel ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* ── Search & Sort Bar ── */}
        <div className="mt-5 flex items-center gap-3">
          <div className="flex-1 relative">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services, providers, categories..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-blue transition-colors" />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="hidden sm:block rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-blue">
            <option value="latest">Latest</option>
            <option value="interest-low">Interest: Low to High</option>
            <option value="interest-high">Interest: High to Low</option>
          </select>
          <button onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 hover:border-brand-blue/40 hover:text-brand-blue transition-colors">
            <i className="fa-solid fa-sliders" /> Filters
            {activeChips.length > 0 && (
              <span className="bg-brand-blue text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeChips.length}
              </span>
            )}
          </button>
        </div>

        {/* ── Active Chips ── */}
        {activeChips.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {activeChips.map((chip) => (
              <ActiveChip key={chip.key} label={chip.label} onRemove={() => removeChip(chip)} />
            ))}
            <button onClick={resetFilters} className="text-xs font-semibold text-gray-500 hover:text-brand-blue ml-1">
              Clear All
            </button>
          </div>
        )}

        {/* ── Results Summary ── */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-brand-charcoal">{filteredServices.length}</span> service{filteredServices.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* ── Main Content: Sidebar + Grid ── */}
        <div className="mt-5 grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FinanceFilterSidebar
              filters={filters} updateFilter={updateFilter}
              openSections={openSections} toggleSection={toggleSection}
              activeChips={activeChips} resetFilters={resetFilters}
              cityAreas={cityAreas} noCityMessage={noCityMessage}
            />
          </div>

          {/* Service Cards Grid */}
          <div>
            {loading ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white/50 py-20 text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-blue border-t-transparent mb-4" />
                <p className="text-sm font-semibold text-gray-500">Loading finance services...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50/50 py-20 text-center">
                <i className="fa-solid fa-triangle-exclamation text-4xl text-red-300 mb-4" />
                <p className="text-lg font-semibold text-gray-600">Something went wrong</p>
                <p className="text-sm text-gray-400 mt-1 max-w-md">{error}</p>
                <button onClick={() => { setServices([]); setLoading(true); setError(null); window.location.reload(); }}
                  className="mt-4 rounded-xl bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                  Try Again
                </button>
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredServices.map((service) => (
                  <FinanceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white/50 py-20 text-center">
                <i className="fa-solid fa-building-columns text-5xl text-gray-300 mb-4" />
                <p className="text-lg font-semibold text-gray-500">No services found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
                <button onClick={resetFilters}
                  className="mt-4 rounded-xl bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile CTA ── */}
        <div className="mt-8 text-center sm:hidden">
          <button onClick={() => navigateTo('/add-finance-service')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors">
            <i className="fa-solid fa-plus" /> Post a Financial Service
          </button>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FinanceFilterSidebar
        mobile open={showMobileFilters} onClose={() => setShowMobileFilters(false)}
        filters={filters} updateFilter={updateFilter}
        openSections={openSections} toggleSection={toggleSection}
        activeChips={activeChips} resetFilters={resetFilters}
        cityAreas={cityAreas} noCityMessage={noCityMessage}
        resultCount={filteredServices.length} resultLabel="Services"
      />
    </div>
  );
}

export default FinanceGallery;
