import React from 'react';

/**
 * Universal Pagination component for service galleries and list views.
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = 'mt-8',
}) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className={`flex flex-wrap items-center justify-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={() => onPageChange && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <i className="fa-solid fa-chevron-left text-[10px]" /> Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
        const show = n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1;
        const prevShown = n === 1 || Math.abs(n - 1 - currentPage) <= 1;

        if (!show) {
          if (prevShown) {
            return <span key={n} className="px-1 text-gray-400 text-xs">…</span>;
          }
          return null;
        }

        return (
          <button
            key={n}
            type="button"
            onClick={() => onPageChange && onPageChange(n)}
            className={`min-w-9 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              n === currentPage
                ? 'bg-brand-blue text-white shadow-xs'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {n}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next <i className="fa-solid fa-chevron-right text-[10px]" />
      </button>
    </div>
  );
}
