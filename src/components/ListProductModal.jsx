import { useEffect } from 'react';
import logo from '../assets/logo.png';

export default function ListProductModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    window.open('https://listing-onevishwam.netlify.app/', '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="list-product-modal-title"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl border border-brand-blue/20 transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-blue via-blue-600 to-indigo-600 shrink-0" />

        {/* Ambient Glow Effects */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <i className="fa-solid fa-xmark text-sm" />
        </button>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 text-center relative z-10">
          {/* Logo & Icon Badge */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shadow-xs">
            <i className="fa-solid fa-store text-2xl" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <img src={logo} alt="One Vishwam" className="h-5 w-auto object-contain" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-full">
              Listing Portal
            </span>
          </div>

          <h3
            id="list-product-modal-title"
            className="text-xl font-black tracking-tight text-gray-900 mb-2"
          >
            Do you want to list your product?
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            You will be redirected to the <strong className="text-brand-navy">One Vishwam Listing Portal</strong> where you can register and publish your properties, vehicles, and marketplace products.
          </p>

          {/* Action Buttons (Yes / No) */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-5 text-sm shadow-md shadow-brand-blue/25 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Yes, Proceed</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-5 text-sm active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>No, Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
