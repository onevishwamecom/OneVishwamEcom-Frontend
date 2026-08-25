import React from 'react';

/**
 * Standard Floating Action Button (FAB) anchored to bottom-right across service galleries.
 */
export default function Fab({
  icon = 'fa-solid fa-bolt',
  label,
  count,
  onClick,
  className = '',
  ariaLabel,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || label}
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-xl hover:bg-blue-700 hover:shadow-2xl transition-all duration-200 active:scale-95 ${className}`}
    >
      <i className={icon} />
      {label && <span>{label}</span>}
      {count !== undefined && count > 0 && (
        <span className="flex items-center justify-center min-w-[20px] h-5 rounded-full bg-white text-brand-blue text-[11px] font-bold px-1.5 shadow-xs">
          {count}
        </span>
      )}
    </button>
  );
}
