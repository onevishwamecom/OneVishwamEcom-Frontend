import { useEffect } from 'react';
import logo from '../../assets/logo.png';

const LISTING_SITE_URL = import.meta.env.VITE_LISTING_SITE_URL || 'https://onevishwam-listings.web.app';

export default function ListingRedirectModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    window.open(LISTING_SITE_URL, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="listing-modal-title"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl border border-sky-200/90 shadow-[0_25px_80px_rgba(15,35,58,0.35)] overflow-hidden p-6 sm:p-7 text-center transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#134e8f] via-[#90dafc] to-[#134e8f]" />

        {/* Ambient Corner Glow Effects */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 h-8 w-8 rounded-full bg-slate-100/90 text-slate-500 hover:text-slate-900 hover:bg-slate-200/90 transition-all border border-slate-200/80 shadow-2xs flex items-center justify-center cursor-pointer active:scale-95"
        >
          <i className="fa-solid fa-xmark text-xs" />
        </button>

        {/* Brand Pill & Icon Hub */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-brand-blue border border-sky-200/80 mb-3 shadow-xs">
            <img src={logo} alt="OneVishwam" className="h-3.5 w-auto object-contain" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
            <span>Partner Portal</span>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d9ebfa] to-[#cfe4f6] text-brand-blue border border-sky-200/90 flex items-center justify-center text-2xl shadow-md shadow-brand-blue/15 mb-3.5">
            <i className="fa-solid fa-boxes-stacked" />
          </div>
        </div>

        {/* Heading */}
        <h3
          id="listing-modal-title"
          className="relative z-10 text-xl font-black text-slate-950 tracking-tight"
        >
          Do you want to list an item?
        </h3>

        {/* Description */}
        <p className="relative z-10 mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          You are being redirected to the <strong className="text-slate-900 font-bold">OneVishwam Partner &amp; Listing Portal</strong> where you can add properties, automobiles, electronics, and comfort products.
        </p>

        {/* Category Preview Badges */}
        <div className="relative z-10 mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-bold text-slate-700">
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-brand-blue border border-sky-200 px-2.5 py-0.5 shadow-2xs">
            <i className="fa-solid fa-house-chimney text-[9px]" /> Properties
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-brand-blue border border-sky-200 px-2.5 py-0.5 shadow-2xs">
            <i className="fa-solid fa-car text-[9px]" /> Automobiles
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-brand-blue border border-sky-200 px-2.5 py-0.5 shadow-2xs">
            <i className="fa-solid fa-tv text-[9px]" /> Electronics
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-brand-blue border border-sky-200 px-2.5 py-0.5 shadow-2xs">
            <i className="fa-solid fa-couch text-[9px]" /> Comfort
          </span>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 mt-5 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-black transition-all shadow-xs cursor-pointer active:scale-95"
          >
            No, Go Back
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#90dafc] hover:bg-[#78d0f8] text-slate-950 text-xs sm:text-sm font-black tracking-wide border border-[#70caf5]/70 shadow-md shadow-[#90dafc]/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all hover:-translate-y-0.5"
          >
            <span>Yes, Continue</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}

