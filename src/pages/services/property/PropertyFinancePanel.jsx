import { navigateTo } from '../../../config/navigation';
import { FINANCE_STATS, FINANCE_FOCUS_AREAS, FINANCE_INCENTIVES } from './propertyConstants';

/**
 * Finance options panel (Home Loan / Construction Loan / Other Finance).
 * When `panelOnly` is true, renders just the cards grid without a toggle button.
 */
export default function PropertyFinancePanel({ show, onToggle, onPreApproved, panelOnly }) {
  if (panelOnly) {
    return (
        <div className="mt-3 grid gap-4 sm:grid-cols-3">

          {/* Home Loan */}
          <div className="rounded-xl border border-brand-blue/20 bg-brand-paper p-5 flex flex-col">
            <h3 className="text-base font-bold text-brand-charcoal">Home Loan</h3>
            <p className="mt-1 text-xs text-gray-500">Pre-approved, starting at 7%+</p>
            <div className="mt-3 flex flex-wrap gap-4">
              {[
                { label: 'Enquiries', val: FINANCE_STATS.enquiries },
                { label: 'Enrolled',  val: FINANCE_STATS.enrolled  },
                { label: 'Slots',     val: FINANCE_STATS.slots     },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p className="text-[11px] text-gray-500">{label}</p>
                  <p className="text-lg font-bold text-brand-blue">{val}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 text-xs text-gray-600">
              <p><i className="fa-solid fa-check text-emerald-500 mr-1.5" />100% home loan available</p>
              <p><i className="fa-solid fa-check text-emerald-500 mr-1.5" />Starting @ 7% interest</p>
            </div>
            <div className="mt-auto pt-4">
              <button
                onClick={onPreApproved}
                className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                ⚡ Just Click — Get Pre-Approved
              </button>
            </div>
          </div>

          {/* Construction Loan */}
          <div className="rounded-xl border border-brand-blue/20 bg-brand-paper p-5 flex flex-col">
            <h3 className="text-base font-bold text-brand-charcoal">Construction Loan</h3>
            <p className="mt-1 text-xs text-gray-500">Disbursed in stages</p>
            <div className="mt-3 space-y-2 text-xs text-gray-600">
              {[
                'Site assessment & approval',
                'Foundation stage disbursement',
                'Floor-by-floor release',
                'Final finishing & handover',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue/10 text-[10px] font-bold text-brand-blue">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-2 ml-1">
                <i className="fa-solid fa-arrow-right" />
                <span>Flexible stages (3, 4, 5, 6…)</span>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <button
                onClick={() => navigateTo('/contact-us/')}
                className="w-full rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Enquire Now
              </button>
            </div>
          </div>

          {/* Other Finance */}
          <div className="rounded-xl border border-brand-blue/20 bg-brand-paper p-5 flex flex-col">
            <h3 className="text-base font-bold text-brand-charcoal">Other Finance</h3>
            <p className="mt-1 text-xs text-gray-500">Investments & financial support</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {FINANCE_FOCUS_AREAS.map((f) => (
                <span key={f} className="rounded-lg bg-brand-blue/10 px-2.5 py-1 text-xs font-medium text-brand-blue">{f}</span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {FINANCE_INCENTIVES.map((inc) => (
                <span key={inc} className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">{inc}</span>
              ))}
            </div>
            <div className="mt-auto pt-4">
              <button
                onClick={() => navigateTo('/our-services/finance-lending')}
                className="w-full rounded-xl border border-brand-blue px-4 py-2.5 text-sm font-semibold text-brand-blue hover:bg-brand-blue hover:text-white transition-colors"
              >
                Know More
              </button>
            </div>
          </div>

        </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        onClick={onToggle}
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline"
      >
        <i className={`fa-solid fa-chevron-down text-xs transition-transform ${show ? 'rotate-180' : ''}`} />
        View Finance Options
      </button>

      {show && (
        <div className="mt-3 grid gap-4 sm:grid-cols-3">

          {/* Home Loan */}
          <div className="rounded-xl border border-brand-blue/20 bg-brand-paper p-5 flex flex-col">
            <h3 className="text-base font-bold text-brand-charcoal">Home Loan</h3>
            <p className="mt-1 text-xs text-gray-500">Pre-approved, starting at 7%+</p>
            <div className="mt-3 flex flex-wrap gap-4">
              {[
                { label: 'Enquiries', val: FINANCE_STATS.enquiries },
                { label: 'Enrolled',  val: FINANCE_STATS.enrolled  },
                { label: 'Slots',     val: FINANCE_STATS.slots     },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p className="text-[11px] text-gray-500">{label}</p>
                  <p className="text-lg font-bold text-brand-blue">{val}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 text-xs text-gray-600">
              <p><i className="fa-solid fa-check text-emerald-500 mr-1.5" />100% home loan available</p>
              <p><i className="fa-solid fa-check text-emerald-500 mr-1.5" />Starting @ 7% interest</p>
            </div>
            <div className="mt-auto pt-4">
              <button
                onClick={onPreApproved}
                className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                ⚡ Just Click — Get Pre-Approved
              </button>
            </div>
          </div>

          {/* Construction Loan */}
          <div className="rounded-xl border border-brand-blue/20 bg-brand-paper p-5 flex flex-col">
            <h3 className="text-base font-bold text-brand-charcoal">Construction Loan</h3>
            <p className="mt-1 text-xs text-gray-500">Disbursed in stages</p>
            <div className="mt-3 space-y-2 text-xs text-gray-600">
              {[
                'Site assessment & approval',
                'Foundation stage disbursement',
                'Floor-by-floor release',
                'Final finishing & handover',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue/10 text-[10px] font-bold text-brand-blue">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-2 ml-1">
                <i className="fa-solid fa-arrow-right" />
                <span>Flexible stages (3, 4, 5, 6…)</span>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <button
                onClick={() => navigateTo('/contact-us/')}
                className="w-full rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Enquire Now
              </button>
            </div>
          </div>

          {/* Other Finance */}
          <div className="rounded-xl border border-brand-blue/20 bg-brand-paper p-5 flex flex-col">
            <h3 className="text-base font-bold text-brand-charcoal">Other Finance</h3>
            <p className="mt-1 text-xs text-gray-500">Investments & financial support</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {FINANCE_FOCUS_AREAS.map((f) => (
                <span key={f} className="rounded-lg bg-brand-blue/10 px-2.5 py-1 text-xs font-medium text-brand-blue">{f}</span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {FINANCE_INCENTIVES.map((inc) => (
                <span key={inc} className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">{inc}</span>
              ))}
            </div>
            <div className="mt-auto pt-4">
              <button
                onClick={() => navigateTo('/our-services/finance-lending')}
                className="w-full rounded-xl border border-brand-blue px-4 py-2.5 text-sm font-semibold text-brand-blue hover:bg-brand-blue hover:text-white transition-colors"
              >
                Know More
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
