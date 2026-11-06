import { useState, useMemo } from 'react';
import { navigateTo } from '../../../config/navigation';
import useLoanProducts from './useLoanProducts';
import { QuickMatchModalShell } from '../shared';
import { signalHomepageRefresh } from '../../../utils/matchEvents';

const LOAN_TYPES = ['home', 'vehicle'];
const EMPLOYMENT_TYPES = ['Salaried', 'Self-employed', 'Business Owner', 'Freelancer'];

function getNumericMaxAmount(loan) {
  if (!loan) return 0;
  if (loan.maxAmountNumeric != null) return Number(loan.maxAmountNumeric) || 0;
  const amount = loan.maxAmount;
  const num = parseFloat(String(amount || '').replace(/[₹,\s]/g, ''));
  if (isNaN(num)) return 0;
  const lower = String(amount || '').toLowerCase();
  if (lower.includes('cr')) return num * 10000000;
  if (lower.includes('l') || lower.includes('lakh')) return num * 100000;
  return num;
}

export default function LoanQuickMatchModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [budgetNeeded, setBudgetNeeded] = useState('');
  const [loanType, setLoanType] = useState('');
  const [employment, setEmployment] = useState('');
  const { loans = [] } = useLoanProducts();

  const handleFindMatch = () => {
    signalHomepageRefresh();
    setStep(2);
  };

  const handleClose = () => {
    if (step === 3) { onClose(); return; }
    if (step === 2) { setStep(3); return; }
    onClose();
  };

  const buckets = useMemo(() => {
    const preApproved = [];
    const shortlisted = [];

    (loans || []).forEach((loan) => {
      if (!loan) return;
      const maxAmt = getNumericMaxAmount(loan);
      const budgetMatch = !budgetNeeded || maxAmt >= +budgetNeeded * 100000;
      const typeMatch = !loanType || loan.type === loanType;

      if (budgetMatch && typeMatch) {
        preApproved.push(loan);
      } else if (typeMatch || budgetMatch) {
        shortlisted.push(loan);
      }
    });

    return { preApproved, shortlisted };
  }, [budgetNeeded, loanType, loans]);

  const hasAnyResults = buckets.preApproved.length > 0 || buckets.shortlisted.length > 0;

  const title = step === 1 ? 'Find My Loan' : step === 2 ? 'Matching Loans' : "You're All Set!";

  return (
    <QuickMatchModalShell title={title} onClose={handleClose}>
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Loan Amount Needed (₹ in Lakhs)</label>
            <input
              type="number"
              placeholder="e.g. 50"
              value={budgetNeeded}
              onChange={(e) => setBudgetNeeded(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Loan Type</label>
            <div className="flex flex-wrap gap-2">
              {LOAN_TYPES.map((lt) => {
                const loan = (loans || []).find((l) => l.type === lt);
                const label = loan?.title || (lt === 'home' ? 'Home Loan' : 'Vehicle Loan');
                const icon = loan?.icon || (lt === 'home' ? 'fa-house-chimney' : 'fa-car');
                return (
                  <label
                    key={lt}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                      loanType === lt
                        ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="qmLoanType"
                      checked={loanType === lt}
                      onChange={() => setLoanType(lt)}
                      className="sr-only"
                    />
                    <i className={`fa-solid ${icon} text-xs`} />
                    {label}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Employment Type</label>
            <div className="flex flex-wrap gap-2">
              {EMPLOYMENT_TYPES.map((et) => (
                <label
                  key={et}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    employment === et
                      ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="qmEmployment"
                    checked={employment === et}
                    onChange={() => setEmployment(et)}
                    className="sr-only"
                  />
                  {et}
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleFindMatch}
            className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Find Match
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {!hasAnyResults && (
            <div className="text-center py-10 text-gray-400">
              <i className="fa-solid fa-building-columns text-4xl mb-3" />
              <p className="text-lg font-medium">No matching loans found.</p>
              <p className="text-sm mt-1">Try adjusting your criteria.</p>
            </div>
          )}

          {buckets.preApproved.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-3">
                <i className="fa-solid fa-circle-check" />
                Best Match ({buckets.preApproved.length})
              </h3>
              <div className="space-y-2">
                {buckets.preApproved.map((loan) => {
                  const loanId = loan._id || loan.id;
                  return (
                    <div
                      key={loanId}
                      onClick={() => { onClose(); navigateTo(`/finance/${loanId}`); }}
                      className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 cursor-pointer hover:shadow-sm transition-shadow"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-brand-charcoal truncate">
                          <i className={`fa-solid ${loan.icon || 'fa-building-columns'} mr-1.5 text-brand-blue`} />
                          {loan.title}
                        </p>
                        <p className="text-xs text-gray-500">{loan.subtitle}</p>
                        <p className="text-xs font-bold text-brand-blue mt-0.5">From {loan.interestRate} · {loan.maxAmount}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onClose(); navigateTo(`/finance/${loanId}`); }}
                        className="ml-3 shrink-0 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {buckets.shortlisted.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-amber-700 mb-3">
                <i className="fa-solid fa-clock" />
                Also Available ({buckets.shortlisted.length})
              </h3>
              <div className="space-y-2">
                {buckets.shortlisted.map((loan) => {
                  const loanId = loan._id || loan.id;
                  return (
                    <div
                      key={loanId}
                      onClick={() => { onClose(); navigateTo(`/finance/${loanId}`); }}
                      className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/50 p-3 cursor-pointer hover:shadow-sm transition-shadow"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-brand-charcoal truncate">
                          <i className={`fa-solid ${loan.icon || 'fa-building-columns'} mr-1.5 text-brand-blue`} />
                          {loan.title}
                        </p>
                        <p className="text-xs text-gray-500">{loan.subtitle}</p>
                        <p className="text-xs font-bold text-brand-blue mt-0.5">From {loan.interestRate} · {loan.maxAmount}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onClose(); navigateTo(`/finance/${loanId}`); }}
                        className="ml-3 shrink-0 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setStep(3)}
            className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Continue
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-6 space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <i className="fa-solid fa-check text-2xl text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-brand-charcoal">We Found Matches!</p>
            <p className="mt-1 text-sm text-gray-500">
              {buckets.preApproved.length} best match · {buckets.shortlisted.length} available
            </p>
          </div>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => { onClose(); navigateTo('/contact-us/'); }}
              className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Contact Loan Advisor
            </button>
            <button
              type="button"
              onClick={() => { onClose(); navigateTo('/finance/'); }}
              className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Browse All Loan Products
            </button>
          </div>
        </div>
      )}
    </QuickMatchModalShell>
  );
}
