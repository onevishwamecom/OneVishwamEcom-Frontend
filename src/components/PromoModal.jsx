import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const PROMO_IMAGE_URL =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = useCallback(() => {
    const hasSeen = sessionStorage.getItem('onevishwam_emi_modal_seen');
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    sessionStorage.setItem('onevishwam_emi_modal_seen', 'true');
  }, []);

  // 1. Timed appearance (2.5s after mount)
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('onevishwam_emi_modal_seen');
    if (hasSeen) return;

    const timer = setTimeout(() => {
      handleOpen();
    }, 2500);

    return () => clearTimeout(timer);
  }, [handleOpen]);

  // 2. Desktop Exit Intent (mouse leaving near top of browser window)
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 10) {
        handleOpen();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [handleOpen]);

  // 3. Close on Escape key press & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-modal-title"
    >
      {/* Modal Card Container (Bright Luxury Theme) */}
      <div
        className="relative w-full max-w-lg sm:max-w-xl overflow-hidden rounded-3xl bg-white text-slate-900 shadow-[0_25px_70px_rgba(0,0,0,0.25)] border border-amber-300/80 transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500" />

        {/* Ambient Warm Corner Glow Effects */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header with Bright Architectural Image & Seamless Fade */}
        <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-slate-100">
          <img
            src={PROMO_IMAGE_URL}
            alt="Onevishwam Luxury Real Estate"
            className="w-full h-full object-cover object-center transform scale-105"
            loading="eager"
          />
          {/* Gradients blending into the bright card */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/40" />

          {/* Top-Left Brand Floating Pill with Logo */}
          <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-900 border border-amber-300 shadow-md">
            <img src={logo} alt="Onevishwam" className="h-4 sm:h-5 w-auto object-contain" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Exclusive</span>
          </div>

          {/* Top-Right Sleek Circular Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-slate-500 hover:text-slate-900 hover:bg-white border border-slate-200/80 backdrop-blur-md transition-all shadow-md active:scale-95"
            aria-label="Close promotional modal"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="px-5 pb-6 sm:px-8 sm:pb-8 pt-1 relative z-10">
          {/* Brand Logo & Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <img src={logo} alt="Onevishwam" className="h-8 sm:h-9 w-auto object-contain drop-shadow-xs" />
            </div>
            <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-amber-700 mb-1 flex items-center justify-center gap-1.5">
              <i className="fa-solid fa-gem text-[10px] text-amber-500" />
              Zero-Stress Homeownership
            </p>
            <h2
              id="promo-modal-title"
              className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight"
            >
              PAY 1 EMI,{' '}
              <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-500 bg-clip-text text-transparent">
                BUY PROPERTY!
              </span>
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm font-semibold text-slate-600 max-w-md mx-auto leading-relaxed">
              Convert your monthly rent expense into your own property asset with Onevishwam.
            </p>
          </div>

          {/* 2-Column Value Comparison (Bright & High Contrast) */}
          <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-3 sm:gap-4">
            {/* Left: Renting (Muted / Soft Rose) */}
            <div className="rounded-2xl bg-rose-50/80 border border-rose-200/80 p-3.5 sm:p-4 text-left flex flex-col justify-between relative overflow-hidden shadow-2xs">
              <div>
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-md border border-rose-200">
                  Current Rent
                </span>
                <p className="mt-2 text-sm sm:text-base font-bold text-slate-800">
                  0% Asset Building
                </p>
                <p className="mt-1 text-[11px] sm:text-xs text-slate-600 leading-snug">
                  100% loss to landlord with zero equity or ownership.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-rose-200/60 flex items-center gap-1 text-[11px] font-bold text-rose-600">
                <i className="fa-solid fa-circle-xmark text-[10px]" /> Money Gone Forever
              </div>
            </div>

            {/* Right: Onevishwam EMI (Warm Golden Highlight) */}
            <div className="rounded-2xl bg-gradient-to-b from-amber-50 via-yellow-50/50 to-amber-100/60 border-2 border-amber-400 p-3.5 sm:p-4 text-left flex flex-col justify-between relative overflow-hidden shadow-sm">
              <div>
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded-md border border-amber-300">
                  Onevishwam EMI
                </span>
                <p className="mt-2 text-sm sm:text-base font-black text-amber-900">
                  100% Owned Asset
                </p>
                <p className="mt-1 text-[11px] sm:text-xs text-slate-700 leading-snug font-medium">
                  Direct property title, clear ownership &amp; capital gains.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-300/80 flex items-center gap-1 text-[11px] font-black text-amber-800">
                <i className="fa-solid fa-circle-check text-[10px] text-amber-600" /> Lifetime Wealth Asset
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs font-bold text-slate-700">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 shadow-2xs">
              <i className="fa-solid fa-circle-check text-[11px] text-emerald-600" /> Instant Pre-Approval
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 shadow-2xs">
              <i className="fa-solid fa-shield-halved text-[11px] text-blue-600" /> Clear Legal Titles
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 shadow-2xs">
              <i className="fa-solid fa-location-dot text-[11px] text-amber-600" /> Prime Bengaluru Plots
            </span>
          </div>

          {/* CTAs */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                handleClose();
                navigate('/contact-us/');
              }}
              className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-[0.98] px-5 py-3.5 text-sm font-black text-slate-950 shadow-md shadow-amber-500/30 transition-all cursor-pointer"
            >
              <span>Claim Offer Now</span>
              <i className="fa-solid fa-arrow-right text-xs" />
            </button>
            <button
              type="button"
              onClick={() => {
                handleClose();
                navigate('/our-services/real-estate-property');
              }}
              className="w-full inline-flex justify-center items-center gap-2 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-800 active:scale-[0.98] px-5 py-3.5 text-sm font-extrabold transition-all shadow-xs cursor-pointer"
            >
              <i className="fa-solid fa-building-columns text-xs text-slate-500" />
              <span>Explore Properties</span>
            </button>
          </div>

          {/* Micro Disclaimer */}
          <p className="mt-3.5 text-center text-[10px] sm:text-[11px] text-slate-400">
            *Limited period promotional scheme. Terms and conditions apply.
          </p>
        </div>
      </div>
    </div>
  );
}
