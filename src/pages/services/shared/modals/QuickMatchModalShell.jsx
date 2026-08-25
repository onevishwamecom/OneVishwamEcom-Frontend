import React from 'react';

/**
 * Universal Modal Frame Shell for QuickMatch & Enquiry dialogs.
 */
export default function QuickMatchModalShell({
  title,
  onClose,
  maxWidth = 'max-w-lg',
  children,
  footer,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative w-full ${maxWidth} rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
          <h2 className="text-lg font-bold text-brand-charcoal">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <i className="fa-solid fa-xmark text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {footer && (
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
