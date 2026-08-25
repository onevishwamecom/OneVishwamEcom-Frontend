import React from 'react';
import { Link } from 'react-router-dom';
import { withRupeeSymbol } from '../../../../utils/priceUtils';

export default function GarmentPriceSummaryCard({ item }) {
  if (!item) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
      <h3 className="text-sm font-bold text-brand-charcoal mb-3">Price Summary</h3>
      <div className="space-y-2 text-sm">
        {item.originalPrice && (
          <div className="flex justify-between">
            <span className="text-gray-500">Original Price</span>
            <span className="line-through text-gray-400">{withRupeeSymbol(item.originalPrice)}</span>
          </div>
        )}
        {item.discount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500">Discount</span>
            <span className="font-semibold text-emerald-600">-{item.discount}%</span>
          </div>
        )}
        <div className="border-t border-gray-100 pt-2 flex justify-between">
          <span className="font-bold text-brand-charcoal">Final Price</span>
          <span className="font-bold text-brand-blue">{withRupeeSymbol(item.finalPrice || item.price)}</span>
        </div>
      </div>
      <Link
        to="/contact-us/"
        className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        <i className="fa-solid fa-headset" /> Send Enquiry
      </Link>
    </div>
  );
}
