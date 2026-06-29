import React from 'react';

export default function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <i className="fa-solid fa-spinner animate-spin text-4xl text-brand-blue" />
        <p className="text-sm font-semibold tracking-widest text-brand-blue uppercase">
          Loading...
        </p>
      </div>
    </div>
  );
}
