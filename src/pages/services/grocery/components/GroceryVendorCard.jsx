import React from 'react';

export default function GroceryVendorCard({ item }) {
  if (!item) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-4">
      <h3 className="text-sm font-bold text-brand-charcoal">Vendor / Supplier</h3>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-base">
          {(item.vendorName || item.brand || 'V')[0]}
        </div>
        <div>
          <p className="font-semibold text-sm text-brand-charcoal">
            {item.vendorName || item.brand || 'OneVishwam Partner'}
          </p>
          <p className="text-xs text-gray-400 capitalize">
            {item.vendorType || 'Direct Producer'} · {item.location?.city || item.city || 'Bengaluru'}
          </p>
        </div>
      </div>
      {item.description && (
        <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
          {item.description}
        </p>
      )}
    </div>
  );
}
