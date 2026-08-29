import React from 'react';

/**
 * Reusable Corner Diagonal Red Ribbon for Sold Out items
 */
export function SoldOutRibbon({ text = 'Sold Out', className = '' }) {
  return (
    <div className={`absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none z-30 ${className}`}>
      <div className="absolute top-6 -right-9 w-40 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white font-extrabold text-[10px] uppercase tracking-widest text-center py-1.5 shadow-lg transform rotate-45 border-y border-red-800/60 drop-shadow-md">
        {text}
      </div>
    </div>
  );
}

export default SoldOutRibbon;
