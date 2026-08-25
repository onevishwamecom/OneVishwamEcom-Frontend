import React from 'react';
import { navigateTo } from '../../../config/navigation';
import { FINANCE_FOCUS_AREAS, FINANCE_INCENTIVES } from './propertyConstants';
import FinanceFlow from '../../../services/FinanceFlow';

function FinanceCardsGrid() {
  return (
    <div className="mt-3 grid gap-4 sm:grid-cols-3">
      <FinanceFlow />

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
            type="button"
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
            <span key={f} className="rounded-lg bg-brand-blue/10 px-2.5 py-1 text-xs font-medium text-brand-blue">
              {f}
            </span>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {FINANCE_INCENTIVES.map((inc) => (
            <span key={inc} className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {inc}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-4">
          <button
            type="button"
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

/**
 * Finance options panel (Home Loan / Construction Loan / Other Finance).
 * When `panelOnly` is true, renders just the cards grid without an outer toggle button.
 */
export default function PropertyFinancePanel({ show, onToggle, panelOnly }) {
  if (panelOnly) {
    return <FinanceCardsGrid />;
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline"
      >
        <i className={`fa-solid fa-chevron-down text-xs transition-transform ${show ? 'rotate-180' : ''}`} />
        View Finance Options
      </button>

      {show && <FinanceCardsGrid />}
    </div>
  );
}
