import { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import useLoanProducts from './useLoanProducts';
import { resolveLoan } from './loanUtils';
import { useAuth } from '../../../store/authSlice';
import AuthRequiredView from '../../../components/auth/AuthRequiredView';

function LoanDetails() {
  const { pathname } = useLocation();
  const { isLoggedIn } = useAuth();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  const pathParts = pathname.split('/').filter(Boolean);
  const loanId = pathParts.length > 1 ? pathParts[1] : null;
  const { loans, loading, error } = useLoanProducts();

  const { selected: loan, related: relatedLoans } = useMemo(
    () => resolveLoan(loans, loanId),
    [loans, loanId]
  );

  const [emiAmount, setEmiAmount] = useState(5000000);
  const [emiRate, setEmiRate] = useState(8.5);
  const [emiTenure, setEmiTenure] = useState(20);

  if (!isLoggedIn) {
    return (
      <AuthRequiredView
        title="Login to View Loan Details"
        message="Please log in or create an account to view loan terms, bank interest comparisons, EMI options, and apply online."
        backUrl="/our-services/finance-lending"
      />
    );
  }

  const emiResult = useMemo(() => {
    const P = emiAmount;
    const r = emiRate / 12 / 100;
    const n = emiTenure * 12;
    if (r === 0 || n === 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    return { emi: Math.round(emi), totalInterest: Math.round(totalInterest), totalPayment: Math.round(totalPayment) };
  }, [emiAmount, emiRate, emiTenure]);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
        <p className="mt-4 text-sm font-semibold text-gray-500">Loading loan details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-2xl font-bold text-gray-400">Loan not found</h1>
        <p className="mt-2 text-sm text-gray-500">{error}</p>
        <Link to="/our-services/finance-lending" className="mt-4 inline-block text-brand-blue font-semibold">&larr; Back to Finance & Lending</Link>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-2xl font-bold text-gray-400">Loan not found</h1>
        <Link to="/our-services/finance-lending" className="mt-4 inline-block text-brand-blue font-semibold">&larr; Back to Finance & Lending</Link>
      </div>
    );
  }

  const isHome = loan.type === 'home';
  const maxAmount = isHome ? 20000000 : 5000000;
  const maxTenure = isHome ? 30 : 7;

  return (
    <div className="pb-24 sm:pb-32">
      {/* ── Gradient Hero Banner ── */}
      <div className="bg-gradient-to-br from-brand-navy via-brand-navy to-brand-blue text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 lg:pt-14 pb-12 sm:pb-16">
          <Link to="/our-services/finance-lending"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors">
            <i className="fa-solid fa-arrow-left" /> Back to Loan Products
          </Link>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400">
                <i className={`fa-solid ${loan.icon} mr-1.5`} />{loan.title}
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {loan.title}
              </h1>
              <p className="text-white/70 max-w-xl">{loan.subtitle}</p>

              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur-sm">
                  <i className="fa-solid fa-percentage text-yellow-400" /> From {loan.interestRate}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur-sm">
                  <i className="fa-solid fa-indian-rupee-sign text-yellow-400" /> Up to {loan.maxAmount}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur-sm">
                  <i className="fa-solid fa-clock text-yellow-400" /> {loan.tenure}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur-sm">
                  <i className="fa-solid fa-receipt text-yellow-400" /> {loan.processingFee}
                </span>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-1">Quick Stats</p>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{loan.stats.enquiries}</p>
                    <p className="text-[11px] text-white/60 font-semibold">Enquiries</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{loan.stats.enrolled}</p>
                    <p className="text-[11px] text-white/60 font-semibold">Enrolled</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{loan.stats.slots}</p>
                    <p className="text-[11px] text-white/60 font-semibold">Open Slots</p>
                  </div>
                </div>
                <Link to="/contact-us/"
                  className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-brand-navy hover:bg-yellow-300 transition-colors shadow-sm">
                  <i className="fa-solid fa-bolt" /> Apply Now — Instant Approval
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── EMI Calculator + Dashboard ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid gap-6 lg:grid-cols-5 mb-12">
          {/* EMI Calculator */}
          <div className="lg:col-span-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                <i className="fa-solid fa-calculator text-brand-blue text-sm" />
              </div>
              <div>
                <h2 className="text-base font-bold text-brand-charcoal">EMI Calculator</h2>
                <p className="text-xs text-gray-500">Plan your monthly payments</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">Loan Amount</label>
                <input type="range" min="500000" max={maxAmount} step="100000"
                  value={emiAmount} onChange={(e) => setEmiAmount(+e.target.value)}
                  className="w-full accent-brand-blue" />
                <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                  <span>₹5 L</span>
                  <span className="font-semibold text-brand-charcoal">₹{(emiAmount / 100000).toFixed(1)} L</span>
                  <span>₹{maxAmount / 100000} L</span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">Interest Rate (%)</label>
                <input type="range" min="5" max="20" step="0.1"
                  value={emiRate} onChange={(e) => setEmiRate(+e.target.value)}
                  className="w-full accent-brand-blue" />
                <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                  <span>5%</span>
                  <span className="font-semibold text-brand-charcoal">{emiRate}%</span>
                  <span>20%</span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">Tenure (Years)</label>
                <input type="range" min="1" max={maxTenure} step="1"
                  value={emiTenure} onChange={(e) => setEmiTenure(+e.target.value)}
                  className="w-full accent-brand-blue" />
                <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                  <span>1 yr</span>
                  <span className="font-semibold text-brand-charcoal">{emiTenure} yrs</span>
                  <span>{maxTenure} yrs</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl bg-gradient-to-br from-brand-blue/5 to-brand-navy/5 p-4">
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Monthly EMI</p>
                <p className="text-xl font-bold text-brand-blue">₹{emiResult.emi.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Total Interest</p>
                <p className="text-xl font-bold text-amber-600">₹{emiResult.totalInterest.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Total Payment</p>
                <p className="text-xl font-bold text-emerald-600">₹{emiResult.totalPayment.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <i className="fa-solid fa-info-circle" />
              The EMI shown is an estimate based on the inputs above. Actual terms may vary.
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Key Metrics</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-brand-blue/5 border border-brand-blue/10 p-3">
                  <i className="fa-solid fa-percentage text-brand-blue text-sm" />
                  <p className="text-lg font-bold text-brand-charcoal mt-1">{loan.interestRate}</p>
                  <p className="text-[10px] text-gray-500 font-semibold">Interest Rate</p>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                  <i className="fa-solid fa-indian-rupee-sign text-emerald-600 text-sm" />
                  <p className="text-lg font-bold text-brand-charcoal mt-1">{loan.maxAmount}</p>
                  <p className="text-[10px] text-gray-500 font-semibold">Max Amount</p>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                  <i className="fa-solid fa-clock text-amber-600 text-sm" />
                  <p className="text-lg font-bold text-brand-charcoal mt-1">{loan.tenure}</p>
                  <p className="text-[10px] text-gray-500 font-semibold">Tenure</p>
                </div>
                <div className="rounded-xl bg-purple-50 border border-purple-100 p-3">
                  <i className="fa-solid fa-receipt text-purple-600 text-sm" />
                  <p className="text-lg font-bold text-brand-charcoal mt-1">{loan.processingFee}</p>
                  <p className="text-[10px] text-gray-500 font-semibold">Processing Fee</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-brand-navy to-brand-blue p-5 text-white">
              <h3 className="text-base font-bold">Why choose OneVishwam?</h3>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2 text-xs text-white/80">
                  <i className="fa-solid fa-circle-check text-yellow-400 text-[10px]" /> Quick approval & disbursal
                </li>
                <li className="flex items-center gap-2 text-xs text-white/80">
                  <i className="fa-solid fa-circle-check text-yellow-400 text-[10px]" /> Minimal documentation
                </li>
                <li className="flex items-center gap-2 text-xs text-white/80">
                  <i className="fa-solid fa-circle-check text-yellow-400 text-[10px]" /> Competitive interest rates
                </li>
                <li className="flex items-center gap-2 text-xs text-white/80">
                  <i className="fa-solid fa-circle-check text-yellow-400 text-[10px]" /> Dedicated relationship manager
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content Sections ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                  <i className="fa-solid fa-info text-brand-blue text-xs" />
                </div>
                <h2 className="text-xl font-bold text-brand-charcoal">About {loan.title}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{loan.description}</p>
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <i className="fa-solid fa-star text-emerald-600 text-xs" />
                </div>
                <h2 className="text-xl font-bold text-brand-charcoal">Features & Benefits</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {loan.features.map((f) => (
                  <div key={f} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-check text-brand-blue text-[10px]" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Apply */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <i className="fa-solid fa-list-ol text-amber-600 text-xs" />
                </div>
                <h2 className="text-xl font-bold text-brand-charcoal">How to Apply</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {loan.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <i className="fa-solid fa-user-check text-purple-600 text-xs" />
                </div>
                <h2 className="text-xl font-bold text-brand-charcoal">Eligibility</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {loan.eligibility.map((e, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-circle-check text-emerald-500 text-[10px]" />
                    </div>
                    <span className="text-sm text-gray-700">{e}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-brand-charcoal mb-4">Loan Facts</h3>
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-gray-100 pb-3 text-sm">
                  <span className="text-gray-500">Interest Rate</span>
                  <span className="font-semibold text-brand-charcoal">{loan.interestRate}</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-3 text-sm">
                  <span className="text-gray-500">Max Amount</span>
                  <span className="font-semibold text-brand-charcoal">{loan.maxAmount}</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-3 text-sm">
                  <span className="text-gray-500">Tenure</span>
                  <span className="font-semibold text-brand-charcoal">{loan.tenure}</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-3 text-sm">
                  <span className="text-gray-500">Processing Fee</span>
                  <span className="font-semibold text-brand-charcoal">{loan.processingFee}</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className="font-semibold text-green-600">Available</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-brand-blue/20 bg-brand-paper p-5">
              <h3 className="text-base font-bold text-brand-charcoal">Related Finance</h3>
              <p className="mt-1 text-xs text-gray-500">Explore more products from OneVishwam.</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-gray-100 bg-white p-3">
                  <p className="text-sm font-bold text-brand-charcoal">Construction Loan</p>
                  <p className="text-xs text-gray-500">Disbursed in stages</p>
                  <Link to="/contact-us/"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline">
                    Enquire <i className="fa-solid fa-arrow-right text-[10px]" />
                  </Link>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-3">
                  <p className="text-sm font-bold text-brand-charcoal">NRI Loans</p>
                  <p className="text-xs text-gray-500">For non-resident Indians</p>
                  <Link to="/our-services/finance-lending"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline">
                    Explore <i className="fa-solid fa-arrow-right text-[10px]" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-brand-navy to-brand-blue text-white p-6">
              <h3 className="text-lg font-bold">Ready to apply?</h3>
              <p className="mt-2 text-sm text-white/70">Get started with instant approval.</p>
              <Link to="/contact-us/"
                className="mt-4 inline-flex w-full items-center justify-center bg-yellow-400 px-6 py-3 rounded-xl font-semibold text-sm text-brand-navy hover:bg-yellow-300 transition-colors">
                Apply Now
              </Link>
            </div>
          </div>
        </div>

        {/* Related Loans */}
        {relatedLoans.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-brand-charcoal mb-6">Other Loan Products</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedLoans.map((l) => (
                <div key={l.id}
                  onClick={() => navigateTo(`/finance/${l.id}`)}
                  className="group rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-lg hover:border-brand-blue/20 transition-all cursor-pointer"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-brand-navy/5 to-brand-blue/5 flex items-center justify-center">
                    <i className={`fa-solid ${l.icon} text-5xl text-brand-blue/20 group-hover:text-brand-blue/40 transition-colors`} />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold text-brand-charcoal group-hover:text-brand-blue transition-colors">
                      <i className={`fa-solid ${l.icon} mr-1.5 text-brand-blue`} />{l.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">{l.subtitle}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-bold text-brand-blue">{l.interestRate}</span>
                      <span className="text-xs font-semibold text-gray-500">{l.maxAmount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoanDetails;
