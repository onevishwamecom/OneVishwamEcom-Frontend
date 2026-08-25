import React from 'react';
import { Link } from 'react-router-dom';

export default function VehicleContactCard() {
  return (
    <div className="rounded-xl bg-brand-navy text-white p-5 shadow-xs">
      <h3 className="text-base font-bold">Interested?</h3>
      <p className="mt-1 text-xs text-gray-400">Contact our team for a test drive or more details.</p>
      <Link
        to="/contact-us/"
        className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        <i className="fa-solid fa-headset" /> Contact Agent
      </Link>
    </div>
  );
}
