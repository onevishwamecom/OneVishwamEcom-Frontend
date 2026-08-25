import React from 'react';

export default function VehicleSpecsGrid({ vehicle }) {
  if (!vehicle) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Fuel Type</p>
        <p className="text-sm font-bold text-brand-charcoal mt-0.5">{vehicle.fuelType}</p>
      </div>
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Year</p>
        <p className="text-sm font-bold text-brand-charcoal mt-0.5">{vehicle.year}</p>
      </div>
      {vehicle.condition === 'old' && (vehicle.kmDriven || 0) > 0 && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">KM Driven</p>
          <p className="text-sm font-bold text-brand-charcoal mt-0.5">
            {vehicle.kmDriven.toLocaleString()} km
          </p>
        </div>
      )}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Category</p>
        <p className="text-sm font-bold text-brand-charcoal mt-0.5 capitalize">{vehicle.category}</p>
      </div>
    </div>
  );
}
