import React from 'react';
import { Link } from 'react-router-dom';

export default function JewelleryConciergeCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-4">
      <h3 className="text-base font-bold text-brand-charcoal">Enquire or Buy</h3>
      <p className="text-xs text-gray-500">
        Contact our concierge team to check availability or arrange a showroom visit.
      </p>
      <Link
        to="/contact-us/"
        className="flex items-center justify-center gap-2 w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        <i className="fa-solid fa-headset" /> Contact Concierge
      </Link>
    </div>
  );
}
