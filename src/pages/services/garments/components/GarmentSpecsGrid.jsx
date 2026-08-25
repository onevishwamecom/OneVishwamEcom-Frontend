import React from 'react';

export default function GarmentSpecsGrid({ item }) {
  if (!item) return null;

  return (
    <div className="space-y-6">
      {/* Fabric & Care */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <i className="fa-solid fa-shirt text-blue-600 text-xs" />
          </div>
          <h2 className="text-base font-bold text-brand-charcoal">Fabric &amp; Care</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Fabric</p>
            <p className="text-sm font-bold text-brand-charcoal mt-0.5">{item.fabric || 'Cotton'}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Category</p>
            <p className="text-sm font-bold text-brand-charcoal mt-0.5 capitalize">{item.category}</p>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      {item.aiRecommended && (
        <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-5">
          <div className="flex items-center gap-2 mb-2">
            <i className="fa-solid fa-wand-magic-sparkles text-yellow-300" />
            <h3 className="text-sm font-bold">AI Recommended</h3>
          </div>
          <p className="text-xs text-white/70">
            This item is recommended based on your style preferences and browsing history.
          </p>
        </div>
      )}
    </div>
  );
}
