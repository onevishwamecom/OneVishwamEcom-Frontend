import React from 'react';
import { Link } from 'react-router-dom';

export default function PropertyLoanCard({ property }) {
  if (!property) return null;

  const loanCtaParams = `?type=property&id=${property.id || property._id}&title=${encodeURIComponent(
    property.title || ''
  )}&price=${encodeURIComponent(property.price || '')}`;

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <i className="fa-solid fa-calculator text-emerald-600" />
        <h3 className="text-sm font-bold text-emerald-900">Pre-Approved Home Loan</h3>
      </div>
      <p className="text-xs text-emerald-700 mb-3">
        Check your loan eligibility and compute EMI with our banking partners.
      </p>
      <button
        type="button"
        disabled
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gray-200 px-4 py-2.5 text-xs font-bold text-gray-400 cursor-not-allowed w-full select-none"
      >
        ⚡ Check Home Loan Options
      </button>
    </div>
  );
}
