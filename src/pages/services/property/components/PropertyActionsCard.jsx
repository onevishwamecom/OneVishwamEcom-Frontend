import React from 'react';
import { Link } from 'react-router-dom';
import { contactInfo } from '../../../../data/footerContent';

export default function PropertyActionsCard({
  property,
  onEnquire,
  onShare,
}) {
  if (!property) return null;

  const whatsappUrl = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(
    `Hi, I would like to enquire about ${property.title}.`
  )}`;

  return (
    <div className="space-y-4">
      {/* Action triggers */}
      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <i className="fa-regular fa-heart" /> Save
        </button>
        {onShare && (
          <button
            type="button"
            onClick={onShare}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <i className="fa-solid fa-share-nodes" /> Share
          </button>
        )}
      </div>

      {/* Primary CTAs */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onEnquire}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-blue text-white px-4 py-3 text-sm font-bold hover:bg-brand-navy transition-colors shadow-xs"
        >
          <i className="fa-solid fa-paper-plane" /> Enquire Now
        </button>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold hover:bg-emerald-700 transition-colors"
          >
            <i className="fa-brands fa-whatsapp text-sm" /> WhatsApp
          </a>
          <Link
            to="/contact-us/"
            className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 text-white px-4 py-2.5 text-xs font-bold hover:bg-amber-600 transition-colors"
          >
            <i className="fa-solid fa-headset" /> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
