import React from 'react';

export default function GarmentStoreCard({ store }) {
  if (!store) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-600 to-rose-500 flex items-center justify-center text-white shadow-xs">
          <i className="fa-solid fa-store text-lg" />
        </div>
        <div>
          <p className="text-sm font-bold text-brand-charcoal">{store.name}</p>
          <p className="text-xs text-gray-400">{store.city} · {store.pincode}</p>
        </div>
      </div>
    </div>
  );
}
