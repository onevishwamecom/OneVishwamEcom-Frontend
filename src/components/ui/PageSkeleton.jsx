import React from 'react';

function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 sm:pt-20 pb-10">
      <div className="h-3 w-40 max-w-full rounded bg-brand-blue/10 animate-pulse" />
      <div className="mt-2.5 h-8 w-72 max-w-full rounded bg-gray-200 animate-pulse" />
      <div className="mt-4 h-3 w-full max-w-xl rounded bg-gray-100 animate-pulse" />
      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-gray-100 bg-white">
            <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
            <div className="space-y-2 p-3">
              <div className="h-3 w-3/4 rounded bg-gray-100 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-gray-100 animate-pulse" />
              <div className="h-3 w-2/3 rounded bg-gray-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PageSkeleton;