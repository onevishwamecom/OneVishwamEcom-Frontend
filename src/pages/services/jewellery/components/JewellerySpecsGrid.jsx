import React from 'react';

export default function JewellerySpecsGrid({ item }) {
  if (!item) return null;

  return (
    <div className="space-y-6">
      {/* Specifications */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
        <h2 className="text-base font-bold text-brand-charcoal mb-4 flex items-center gap-2">
          <i className="fa-solid fa-gem text-amber-500 text-sm" /> Specifications &amp; Purity
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {item.metalType && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Metal &amp; Purity</p>
              <p className="text-sm font-bold text-brand-charcoal mt-0.5">{item.metalType} · {item.purity}</p>
            </div>
          )}
          {item.weightGrams && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Gross Weight</p>
              <p className="text-sm font-bold text-brand-charcoal mt-0.5">{item.weightGrams}g</p>
            </div>
          )}
          {item.certAgency && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Certification</p>
              <p className="text-sm font-bold text-brand-charcoal mt-0.5">{item.certAgency}</p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <h2 className="text-base font-bold text-brand-charcoal mb-3">About this piece</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
        </div>
      )}
    </div>
  );
}
