import React, { useState } from 'react';

export default function GroceryOrderSection({ item }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const unitPrice = typeof item?.pricePerUnit === 'number'
    ? item.pricePerUnit
    : parseFloat(String(item?.pricePerUnit || item?.price || item?.numericPrice || '0').replace(/[₹,\s]/g, '')) || 0;

  const totalPrice = (qty * unitPrice).toLocaleString();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
      <p className="text-sm font-bold text-brand-charcoal mb-3">Order Quantity</p>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 rounded-xl border border-gray-200 px-2 py-1.5">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600"
          >
            −
          </button>
          <span className="w-10 text-center text-base font-bold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty(qty + 1)}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600"
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-500">
          = <span className="font-bold text-brand-charcoal">₹{totalPrice}</span>
        </span>
        <button
          type="button"
          onClick={() => {
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ml-auto ${
            added ? 'bg-emerald-600 text-white' : 'bg-brand-blue text-white hover:bg-blue-700'
          }`}
        >
          {added ? '✓ Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
