import React from 'react';

export default function VehicleShowroomCard({ showroom }) {
  if (!showroom) return null;

  return (
    <div className="rounded-xl border border-gray-100 p-4 shadow-xs bg-white">
      <p className="text-xs font-semibold text-gray-500 mb-1">Showroom</p>
      <p className="text-sm font-bold text-brand-charcoal">{showroom.name}</p>
      <p className="mt-1 text-xs text-gray-500">{showroom.address}</p>
      <div className="mt-3 flex gap-2">
        {showroom.mapsLink && (
          <a
            href={showroom.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <i className="fa-solid fa-map-location-dot text-brand-blue" /> View on Map
          </a>
        )}
        {showroom.phone && (
          <a
            href={`tel:${showroom.phone}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-blue px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <i className="fa-solid fa-phone" /> Call
          </a>
        )}
      </div>
    </div>
  );
}
