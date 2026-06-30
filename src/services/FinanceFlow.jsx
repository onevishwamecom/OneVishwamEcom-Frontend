import { useState, useRef } from 'react';

const loanTable = [
  { homeLoan: 3, tenure: 4 },
  { homeLoan: 5, tenure: 6 },
  { homeLoan: '', tenure: 35 },
];

export default function FinanceFlow() {
  const [financeStep, setFinanceStep] = useState('entry');
  const [requirement, setRequirement] = useState('');
  const [showMatch, setShowMatch] = useState(false);
  const matchRef = useRef(null);

  const scrollToMatch = () => {
    matchRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitRequirement = (e) => {
    e.preventDefault();
    if (!requirement.trim()) return;
    setShowMatch(true);
  };

  return (
    <div className="rounded-xl border border-brand-blue/20 bg-brand-paper p-5 flex flex-col">
      {/* ── 1. FINANCE ENTRY ── */}
      {financeStep === 'entry' && (
        <>
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2">
            <i className="fa-solid fa-building-columns text-brand-blue" />
            Finance
          </h3>
          <ul className="mt-4 space-y-2">
            <li>
              <button
                onClick={() => setFinanceStep('type')}
                className="w-full flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:border-brand-blue/30 hover:text-brand-blue transition-colors text-left"
              >
                <i className="fa-solid fa-hand-holding-dollar text-brand-blue w-5" />
                Loans
              </button>
            </li>
            <li>
              <button
                onClick={() => setFinanceStep('type')}
                className="w-full flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:border-brand-blue/30 hover:text-brand-blue transition-colors text-left"
              >
                <i className="fa-solid fa-chart-line text-brand-blue w-5" />
                Investment
              </button>
            </li>
          </ul>
        </>
      )}

      {/* ── 2. TYPE OF FINANCE / 3. LOAN TABLE ── */}
      {financeStep === 'type' && (
        <div className="space-y-4">
          <button
            onClick={() => setFinanceStep('entry')}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-blue transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-[10px]" />
            Back
          </button>

          <h3 className="text-base font-bold text-brand-charcoal">Type of finance</h3>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Home loan</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Tenure</th>
                </tr>
              </thead>
              <tbody>
                {loanTable.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.homeLoan || ''}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.tenure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── 4. PRE-APPROVAL CTA ── */}
          <div className="rounded-xl bg-brand-blue px-4 py-4 text-white flex flex-col items-center gap-3">
            <p className="text-sm font-bold">100% home loan @ 7%</p>
            <button
              onClick={() => setFinanceStep('requirement')}
              className="rounded-xl bg-white px-5 py-2 text-xs font-bold text-brand-blue hover:bg-blue-50 transition-colors"
            >
              Just click
            </button>
          </div>
        </div>
      )}

      {/* ── 5. YOUR REQUIREMENT + 6. MATCH RESULT BOX ── */}
      {financeStep === 'requirement' && (
        <div className="space-y-4">
          <button
            onClick={() => setFinanceStep('type')}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-blue transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-[10px]" />
            Back
          </button>

          <h3 className="text-base font-bold text-brand-charcoal">Your requirement</h3>
          <form onSubmit={handleSubmitRequirement}>
            <div className="relative">
              <input
                type="text"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                placeholder="Describe your requirement..."
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-20 text-sm outline-none focus:border-brand-blue transition-colors"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-brand-blue px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>

          {showMatch && (
            <div ref={matchRef} className="rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-4 text-center">
              <i className="fa-solid fa-circle-check text-2xl text-emerald-500 mb-2" />
              <p className="text-sm font-semibold text-brand-charcoal">
                Any approved flat/site looking with location, click here
              </p>
              <button
                onClick={scrollToMatch}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                <i className="fa-solid fa-arrow-left" /> Go back to loan options
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
