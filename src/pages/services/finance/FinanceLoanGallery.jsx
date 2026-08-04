import { useState, useMemo } from 'react';
import { navigateTo } from '../../../config/navigation';
import { LOAN_TYPE_META } from './loanUtils';
import useLoanProducts from './useLoanProducts';
import { FINANCE_STATS, FINANCE_FOCUS_AREAS, FINANCE_INCENTIVES } from '../property/propertyConstants';
import LoanQuickMatchModal from './LoanQuickMatchModal';

function FinanceLoanGallery() {
  const [selectedType, setSelectedType] = useState('All');
  const [quickMatchOpen, setQuickMatchOpen] = useState(false);
  const { loans, loading, error } = useLoanProducts();

  const typeStrip = useMemo(() => {
    const present = new Set(loans.map((l) => l.type));
    return [
      { id: 'All', icon: 'fa-layer-group', label: 'All' },
      ...Object.entries(LOAN_TYPE_META)
        .filter(([type]) => present.has(type))
        .map(([type, meta]) => ({ id: type, icon: meta.icon, label: meta.label })),
    ];
  }, [loans]);

  const filteredLoans = useMemo(() => {
    if (selectedType === 'All') return loans;
    return loans.filter((l) => l.type === selectedType);
  }, [loans, selectedType]);

  return (
    <div className="pb-24 pt-6 sm:pt-10 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ── Page Header ── */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-1">
              OneVishwam · Finance
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl">
              Loans & Financial Products
            </h1>
            <p className="mt-1 text-sm text-gray-500 max-w-2xl">
              Home loans, vehicle loans, and more — pre-approved, competitive rates, no hidden charges.
            </p>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-xl border border-brand-blue/10 bg-brand-blue/5 p-4 text-center">
            <p className="text-2xl font-bold text-brand-blue sm:text-3xl">{loading ? '–' : loans.length}</p>
            <p className="text-[11px] font-semibold text-gray-500 mt-0.5">Products</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600 sm:text-3xl">{FINANCE_STATS.enrolled}</p>
            <p className="text-[11px] font-semibold text-gray-500 mt-0.5">Enrolled</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-center">
            <p className="text-2xl font-bold text-amber-600 sm:text-3xl">{FINANCE_STATS.slots}</p>
            <p className="text-[11px] font-semibold text-gray-500 mt-0.5">Open Slots</p>
          </div>
        </div>

        {/* ── Loan Type Pill Strip ── */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {typeStrip.map((ct) => {
            const sel = selectedType === ct.id;
            const count = ct.id === 'All' ? loans.length : loans.filter((l) => l.type === ct.id).length;
            return (
              <button
                key={ct.id}
                onClick={() => setSelectedType(ct.id)}
                className={`flex-shrink-0 flex items-center gap-2.5 rounded-full border px-4 py-2 transition-all ${
                  sel
                    ? 'border-brand-blue bg-brand-blue text-white shadow-sm shadow-brand-blue/25'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-brand-blue/40 hover:text-brand-blue'
                }`}
              >
                <i className={`fa-solid ${ct.icon} text-xs`} />
                <span className="text-sm font-semibold whitespace-nowrap">{ct.label}</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  sel ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Loan Product Cards ── */}
        <div className="mt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white/50 py-20 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-blue border-t-transparent mb-4" />
              <p className="text-sm font-semibold text-gray-500">Loading loan products...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50/50 py-20 text-center">
              <i className="fa-solid fa-triangle-exclamation text-4xl text-red-300 mb-4" />
              <p className="text-lg font-semibold text-gray-600">Something went wrong</p>
              <p className="text-sm text-gray-400 mt-1 max-w-md">{error}</p>
            </div>
          ) : filteredLoans.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {filteredLoans.map((loan) => (
                <div
                  key={loan.id}
                  onClick={() => navigateTo(`/finance/${loan.id}`)}
                  className="group rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg hover:border-brand-blue/20 transition-all cursor-pointer flex flex-col sm:flex-row"
                >
                  {/* Image side */}
                  <div className="sm:w-48 shrink-0 aspect-[4/3] sm:aspect-auto overflow-hidden bg-gray-100">
                    <img src={loan.image} alt={loan.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>

                  {/* Content side */}
                  <div className="flex-1 p-5 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-brand-charcoal group-hover:text-brand-blue transition-colors">
                          <i className={`fa-solid ${loan.icon} mr-2 text-brand-blue`} />
                          {loan.title}
                        </h3>
                        <p className="mt-0.5 text-sm text-gray-500">{loan.subtitle}</p>
                      </div>
                      <span className="text-2xl font-bold text-brand-blue">{loan.interestRate}</span>
                    </div>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-lg bg-brand-blue/10 px-2.5 py-1 text-[11px] font-medium text-brand-blue">
                        <i className="fa-solid fa-indian-rupee-sign mr-1 text-[10px]" />{loan.maxAmount}
                      </span>
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                        <i className="fa-solid fa-clock mr-1 text-[10px]" />{loan.tenure}
                      </span>
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                        <i className="fa-solid fa-percentage mr-1 text-[10px]" />{loan.processingFee}
                      </span>
                    </div>

                    {/* Features preview */}
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      {loan.features.slice(0, 3).map((f) => (
                        <span key={f}><i className="fa-solid fa-check text-emerald-500 mr-1" />{f}</span>
                      ))}
                      {loan.features.length > 3 && (
                        <span className="text-brand-blue font-semibold">+{loan.features.length - 3} more</span>
                      )}
                    </div>

                    {/* Stats + CTA */}
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                      <div className="flex gap-4 text-[11px] text-gray-500">
                        <span><i className="fa-solid fa-users mr-1" />{loan.stats.enquiries} enquiries</span>
                        <span><i className="fa-solid fa-clock mr-1" />{loan.stats.slots} slots</span>
                      </div>
                      <span className="text-xs font-semibold text-brand-blue group-hover:underline">
                        View Details <i className="fa-solid fa-arrow-right text-[10px]" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <i className="fa-solid fa-building-columns text-4xl mb-4" />
              <p className="text-lg font-medium">No products found.</p>
            </div>
          )}
        </div>

        {/* ── Additional Finance Services ── */}
        <div className="mt-12">
          <h2 className="text-lg font-bold text-brand-charcoal mb-4">Other Financial Services</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-brand-blue/10 bg-brand-blue/5 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-brand-blue flex items-center justify-center text-white">
                  <i className="fa-solid fa-hand-holding-dollar text-sm" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-charcoal">Other Loans</h3>
                  <p className="text-xs text-gray-500">More options available</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {FINANCE_FOCUS_AREAS.map((f) => (
                  <span key={f} className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-brand-blue">{f}</span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <i className="fa-solid fa-tags text-sm" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-charcoal">Incentives</h3>
                  <p className="text-xs text-gray-500">Exclusive offers</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {FINANCE_INCENTIVES.map((inc) => (
                  <span key={inc} className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-emerald-700">{inc}</span>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-brand-navy text-white p-5">
              <h3 className="text-sm font-bold">Need help choosing?</h3>
              <p className="mt-1 text-xs text-gray-400">Our team will help you find the best loan.</p>
              <button onClick={() => setQuickMatchOpen(true)}
                className="mt-3 w-full rounded-xl bg-brand-blue px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors">
                Find My Loan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <button
        onClick={() => setQuickMatchOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 transition-all"
      >
        <i className="fa-solid fa-bolt" /> Find My Loan
      </button>

      {/* Quick Match Modal */}
      {quickMatchOpen && (
        <LoanQuickMatchModal onClose={() => setQuickMatchOpen(false)} />
      )}
    </div>
  );
}

export default FinanceLoanGallery;
