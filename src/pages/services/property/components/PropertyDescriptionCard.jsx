import React, { useState } from 'react';

export default function PropertyDescriptionCard({ description }) {
  const [showFull, setShowFull] = useState(false);

  if (!description) return null;

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center">
          <i className="fa-solid fa-info text-brand-blue text-xs" />
        </div>
        <h2 className="text-base font-bold text-brand-charcoal">Description</h2>
      </div>
      <p className="text-gray-600 leading-relaxed text-sm">
        {showFull || description.length < 300
          ? description
          : `${description.slice(0, 300)}...`}
      </p>
      {description.length > 300 && (
        <button
          type="button"
          onClick={() => setShowFull(!showFull)}
          className="mt-2 text-sm font-semibold text-brand-blue hover:text-brand-navy transition-colors inline-flex items-center gap-1"
        >
          {showFull ? 'Read Less' : 'Read More'}
          <i className={`fa-solid fa-chevron-${showFull ? 'up' : 'down'} text-xs`} />
        </button>
      )}
    </div>
  );
}
