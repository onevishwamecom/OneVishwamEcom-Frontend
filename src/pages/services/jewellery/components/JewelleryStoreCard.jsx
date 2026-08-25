import React from 'react';

export default function JewelleryStoreCard({ store }) {
  if (!store) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-yellow-500 flex items-center justify-center text-white shadow-xs">
          <i className="fa-solid fa-shop text-lg" />
        </div>
        <div>
          <p className="text-sm font-bold text-brand-charcoal">{store.name}</p>
          <p className="text-xs text-gray-400">{store.city} · {store.pincode}</p>
        </div>
      </div>
      {store.address && <p className="text-xs text-gray-500 mb-3">{store.address}</p>}
      {store.phone && (
        <a
          href={`tel:${store.phone}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-blue hover:underline"
        >
          <i className="fa-solid fa-phone" /> {store.phone}
        </a>
      )}
    </div>
  );
}
