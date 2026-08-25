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
      <Link
        to={`/our-services/finance-lending${loanCtaParams}`}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors w-full"
      >
        ⚡ Check Home Loan Options
      </Link>
    </div>
  );
}
