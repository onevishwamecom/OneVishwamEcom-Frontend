import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../assets/Logo_icon.png';

/**
 * REPEAT_INTERVAL_MS:
 * Time in milliseconds to wait before re-triggering the toast after user closes it (5 minutes).
 */
const REPEAT_INTERVAL_MS = 5 * 60 * 1000;
const INITIAL_DELAY_MS = 2500; // 2.5 seconds initial appearance

export default function PromoToast() {
  const [visible, setVisible] = useState(false);
  const retriggerTimerRef = useRef(null);
  const navigate = useNavigate();

  // Initial appearance
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, INITIAL_DELAY_MS);

    return () => clearTimeout(initialTimer);
  }, []);

  // Handle dismiss with recurring re-trigger timer
  const handleDismiss = useCallback(() => {
    setVisible(false);

    if (retriggerTimerRef.current) {
      clearTimeout(retriggerTimerRef.current);
    }

    retriggerTimerRef.current = setTimeout(() => {
      setVisible(true);
    }, REPEAT_INTERVAL_MS);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retriggerTimerRef.current) {
        clearTimeout(retriggerTimerRef.current);
      }
    };
  }, []);

  const handleAction = () => {
    handleDismiss();
    navigate('/enquiry/');
  };

  return (
    <aside
      aria-live="polite"
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[999] w-[calc(100vw-2rem)] sm:w-[380px] max-w-sm transition-all duration-500 ease-out transform ${
        visible
          ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
          : 'translate-y-6 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      {/* Toast Card (Bright Luxury Theme matching PromoModal) */}
      <div className="relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md text-slate-900 border border-amber-300/85 shadow-[0_15px_45px_rgba(0,0,0,0.18),0_0_20px_rgba(245,158,11,0.12)] p-4 sm:p-4.5">
        {/* Subtle Ambient Corner Glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-2.5 right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100/90 text-slate-500 hover:text-slate-900 hover:bg-slate-200/90 transition-all border border-slate-200 shadow-2xs cursor-pointer"
          aria-label="Dismiss offer notification"
        >
          <i className="fa-solid fa-xmark text-xs" />
        </button>

        {/* Card Content Row */}
        <div className="flex items-start gap-3.5 pr-5">
          {/* Logo Icon */}
          <img
            src={logoIcon}
            alt="Onevishwam"
            className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0 mt-0.5 drop-shadow-xs"
          />

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
                Onevishwam Deal
              </span>
            </div>

            <h3 className="text-sm font-black text-slate-900 tracking-tight leading-snug">
              PAY 1 EMI,{' '}
              <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-500 bg-clip-text text-transparent">
                BUY PROPERTY!
              </span>
            </h3>

            <p className="mt-0.5 text-xs text-slate-600 font-medium leading-tight">
              Convert your rent into property ownership.
            </p>

            {/* Actions */}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleAction}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-95 text-slate-950 px-3.5 py-1.5 text-xs font-black shadow-md shadow-amber-500/25 transition-all cursor-pointer"
              >
                <span>Claim Offer</span>
                <i className="fa-solid fa-arrow-right text-[10px]" />
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 px-2 py-1 transition-colors cursor-pointer"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
