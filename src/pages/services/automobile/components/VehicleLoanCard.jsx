import React from 'react';
import { Link } from 'react-router-dom';

export default function VehicleLoanCard({ loanApproved }) {
  if (!loanApproved) return null;

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-center gap-2 mb-2">
        <i className="fa-solid fa-circle-check text-emerald-600" />
        <span className="text-sm font-bold text-emerald-800">Pre-Approved Loan Available</span>
      </div>
      <p className="text-xs text-emerald-600 mb-3">Get instant loan approval for this vehicle.</p>
      <Link
        to="/our-services/finance-lending"
        className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
      >
        ⚡ Apply for Loan
      </Link>
    </div>
  );
}
