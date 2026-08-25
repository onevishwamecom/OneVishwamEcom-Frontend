import React from 'react';

export const PROPERTY_HIGHLIGHTS_META = [
  { key: 'bhk', label: 'Bedrooms', icon: 'fa-bed' },
  { key: 'bathrooms', label: 'Bathrooms', icon: 'fa-bath' },
  { key: 'area', label: 'Area', icon: 'fa-vector-square' },
  { key: 'parking', label: 'Parking', icon: 'fa-square-parking' },
  { key: 'floor', label: 'Floor', icon: 'fa-layer-group' },
  { key: 'furnishing', label: 'Furnishing', icon: 'fa-couch' },
  { key: 'extraRoom', label: 'Extra Room', icon: 'fa-door-open' },
  { key: 'status', label: 'Possession', icon: 'fa-key' },
];

export default function PropertySpecsGrid({ property }) {
  if (!property) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {PROPERTY_HIGHLIGHTS_META.map((meta) => {
        const value = property[meta.key];
        if (!value || value === 'N/A' || value === '') return null;
        const displayValue = meta.key === 'status'
          ? (value === 'available' ? 'Ready to Move' : value === 'closed' ? 'Closed' : value)
          : value;

        return (
          <div
            key={meta.key}
            className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <i className={`fa-solid ${meta.icon} text-amber-600 text-sm`} />
            </div>
            <span className="text-xs text-gray-500 font-medium">{meta.label}</span>
            <span className="text-sm font-bold text-brand-charcoal">{displayValue}</span>
          </div>
        );
      })}
    </div>
  );
}
