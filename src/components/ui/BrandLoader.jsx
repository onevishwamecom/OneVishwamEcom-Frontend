import React from 'react';

function BrandLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-10">
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-brand-blue/20" />
        {/* Inner primary spinner */}
        <div className="absolute inset-0 rounded-full border-4 border-brand-blue border-t-transparent border-b-transparent animate-spin" />
        {/* Inner accent spinner (slower rotation) */}
        <div className="absolute inset-0 rounded-full border-4 border-yellow-400/40 border-l-transparent border-r-transparent animate-[spin_4s_linear_infinite]" />
      </div>
      <p className="mt-4 text-sm font-semibold text-brand-blue uppercase tracking-wider">
        Loading OneVishwam...
      </p>
    </div>
  );
}

export default BrandLoader;
