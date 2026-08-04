import { useState } from 'react';
import { navigateTo } from '../config/navigation';
import { useLocation } from '../store/locationSlice';
import { loanProducts } from '../data/dummyFinance';

const LOAN_TABS = ['All', 'Home Loan', 'Construction Loan', 'NRI Loan', 'Loan Against Property'];

const PROPERTY_TYPES = ['Flat', 'Site', 'Villa', 'Independent House', 'Land'];
const BUDGET_OPTIONS = ['Under ₹20L', '₹20L–₹50L', '₹50L–₹1Cr', 'Above ₹1Cr'];
const CITY_OPTIONS = [
  { value: 'bengaluru', label: 'Bengaluru' },
];

const CONSTRUCTION_STAGES = [
  { stage: 3, description: 'Foundation complete', payout: '15%' },
  { stage: 4, description: 'Structure complete', payout: '20%' },
  { stage: 5, description: 'Brickwork & plaster', payout: '25%' },
  { stage: 6, description: 'Finishing & handover', payout: '35% (final)' },
];

function FinanceDashboard() {
  const { selectCity } = useLocation();
  const [activeLoanTab, setActiveLoanTab] = useState('All');

  const [reqType, setReqType] = useState('');
  const [reqBudget, setReqBudget] = useState('');
  const [reqCity, setReqCity] = useState('');

  const filteredLoans = loanProducts.filter(
    (l) => activeLoanTab === 'All' || l.type === activeLoanTab
  );

  const showConstructionTable =
    activeLoanTab === 'All' || activeLoanTab === 'Construction Loan';

  const handleFindProperties = () => {
    const city = reqCity || 'bengaluru';
    selectCity(city);
    const params = new URLSearchParams();
    if (reqType) params.set('type', reqType);
    if (reqBudget) params.set('budget', reqBudget);
    navigateTo(`/our-services/real-estate-property?${params.toString()}`);
  };

  const BADGE_COLORS = {
    'Home Loan': 'bg-brand-blue/10 text-brand-blue',
    'Construction Loan': 'bg-amber-100 text-amber-700',
    'NRI Loan': 'bg-purple-100 text-purple-700',
    'Loan Against Property': 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="pb-24 pt-6 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ── SECTION A: Page Header ── */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-1">
              OneVishwam · Finance
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl">
              Finance & Loans
            </h1>
            <p className="mt-1 text-sm text-gray-500 max-w-2xl">
              Pre-approved home loans, construction finance, and investment support — all in one place.
            </p>
          </div>
        </div>

        {/* ── SECTION B: Type of Finance — two-track splitter ── */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <button
            onClick={() => {
              const el = document.getElementById('loan-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group rounded-xl border-l-4 border-brand-blue bg-white p-6 shadow-sm text-left hover:shadow-md transition-transform duration-200 hover:-translate-y-0.5"
          >
            <i className="fa-solid fa-hand-holding-dollar text-2xl text-brand-blue mb-3" />
            <h3 className="text-lg font-bold text-brand-charcoal">Loans</h3>
            <p className="mt-1 text-sm text-gray-500">
              Home loan · Construction loan · NRI loan · Loan against property
            </p>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('investment-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group rounded-xl border-l-4 border-brand-blue bg-white p-6 shadow-sm text-left hover:shadow-md transition-transform duration-200 hover:-translate-y-0.5"
          >
            <i className="fa-solid fa-chart-line text-2xl text-brand-blue mb-3" />
            <h3 className="text-lg font-bold text-brand-charcoal">Investment & Venture</h3>
            <p className="mt-1 text-sm text-gray-500">
              e-Commerce data support · equity · venture capital
            </p>
          </button>
        </div>

        {/* ── SECTION C: Loan products ── */}
        <div id="loan-section" className="mt-12 scroll-mt-24">
          {/* 3A. Finance type tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {LOAN_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveLoanTab(tab)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  activeLoanTab === tab
                    ? 'border-brand-blue bg-brand-blue text-white shadow-sm shadow-brand-blue/25'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-brand-blue/40 hover:text-brand-blue'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 3B. Loan cards grid */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {filteredLoans.length > 0 ? filteredLoans.map((loan) => (
              <div
                key={loan.id}
                className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <span
                  className={`inline-block rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    BADGE_COLORS[loan.type] || 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {loan.badge}
                </span>
                <h3 className="mt-3 text-base font-bold text-brand-charcoal">{loan.title}</h3>
                <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs">
                  <div>
                    <p className="font-bold text-brand-charcoal">{loan.interestRate}</p>
                    <p className="text-gray-500 mt-0.5">Rate</p>
                  </div>
                  <div>
                    <p className="font-bold text-brand-charcoal">{loan.maxFinancing}</p>
                    <p className="text-gray-500 mt-0.5">Financing</p>
                  </div>
                  <div>
                    <p className="font-bold text-brand-charcoal">{loan.processingFee}</p>
                    <p className="text-gray-500 mt-0.5">Fee</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">Approval:</span> {loan.approvalTime}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">Eligibility:</span> {loan.eligibility}
                </p>
                <a
                  href="/contact-us/"
                  className="mt-4 flex items-center justify-center rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </a>
              </div>
            )) : (
              <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white/50 py-16 text-center">
                <i className="fa-solid fa-file-invoice text-4xl text-gray-300 mb-3" />
                <p className="text-sm font-semibold text-gray-500">No loan products found</p>
                <p className="text-xs text-gray-400 mt-1">Try selecting a different loan category above.</p>
              </div>
            )}
          </div>

          {/* 3C. Construction Loan Stage Grid */}
          {showConstructionTable && (
            <div className="mt-8">
              <h3 className="text-base font-bold text-brand-charcoal mb-4">
                Construction loan — stage-wise payout
              </h3>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-blue text-white">
                      <th className="px-4 py-3 text-left font-semibold">Stage</th>
                      <th className="px-4 py-3 text-left font-semibold">Description</th>
                      <th className="px-4 py-3 text-right font-semibold">% Payout released</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CONSTRUCTION_STAGES.map((s, i) => (
                      <tr key={s.stage} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-medium text-gray-900">{s.stage}</td>
                        <td className="px-4 py-3 text-gray-700">{s.description}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">{s.payout}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="px-4 py-3 text-gray-900">Total</td>
                      <td className="px-4 py-3" />
                      <td className="px-4 py-3 text-right text-gray-900">
                        95% (5% on possession)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Stage 1 (booking) and Stage 2 (approval) are processed before construction begins and are not listed here.
              </p>
            </div>
          )}

          {/* 3D. Pre-approval CTA banner */}
          <div className="mt-8 rounded-xl bg-brand-blue px-6 py-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xl font-bold">100% pre-approved home loan @ 7%+</p>
              <p className="mt-1 text-sm text-blue-100">
                Just click — any flat or site looking for a loan, click here to get matched instantly.
              </p>
            </div>
            <div className="flex flex-col items-center shrink-0">
              <a
                href="/contact-us/"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-blue hover:bg-blue-50 transition-colors"
              >
                Apply Now <i className="fa-solid fa-arrow-right" />
              </a>
              <p className="mt-1.5 text-xs text-blue-200 opacity-75">
                Once clicked, we match you with pre-approved flats and sites. Loop back to search anytime.
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION D: Your Requirement ── */}
        <div id="requirement-section" className="mt-12 scroll-mt-24 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-brand-charcoal">Enter your requirement</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Property type</label>
              <select
                value={reqType}
                onChange={(e) => setReqType(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue bg-white"
              >
                <option value="">Select</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Budget</label>
              <select
                value={reqBudget}
                onChange={(e) => setReqBudget(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue bg-white"
              >
                <option value="">Select</option>
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">City</label>
              <select
                value={reqCity}
                onChange={(e) => setReqCity(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue bg-white"
              >
                <option value="">Select</option>
                {CITY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleFindProperties}
            className="mt-5 w-full sm:w-auto rounded-xl bg-brand-blue px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Find matching properties <i className="fa-solid fa-arrow-right ml-1.5" />
          </button>
        </div>

        {/* ── SECTION E: Investment section ── */}
        <div id="investment-section" className="mt-12 scroll-mt-24">
          <h2 className="text-lg font-bold text-brand-charcoal">Investment & Venture Capital</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <i className="fa-solid fa-database text-2xl text-brand-blue mb-3" />
              <h3 className="text-sm font-bold text-brand-charcoal mb-2">e-Commerce Data Support</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                All verticals — real estate, jewellery, automobile, grocery, garments — are backed by structured e-commerce data for investor reporting.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <i className="fa-solid fa-seedling text-2xl text-emerald-600 mb-3" />
              <h3 className="text-sm font-bold text-brand-charcoal mb-2">Equity & Venture</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Connect with our venture capital desk for equity participation in the OneVishwam ecosystem.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <i className="fa-solid fa-globe text-2xl text-purple-600 mb-3" />
              <h3 className="text-sm font-bold text-brand-charcoal mb-2">NRI Investment</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Dedicated NRI investment channel with FEMA-compliant documentation support.
              </p>
            </div>
          </div>
          <a
            href="/contact-us/"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline"
          >
            Know More <i className="fa-solid fa-arrow-right text-xs" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default FinanceDashboard;
