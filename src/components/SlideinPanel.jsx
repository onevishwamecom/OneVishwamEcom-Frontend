/**
 * SlideinPanel
 * A full-screen overlay + right-side slide-in panel with a sticky header,
 * scrollable body, and optional sticky footer area.
 *
 * Used for: Cart (Grocery), Enquiry Cart (Jewellery), Wishlist (Garment).
 *
 * Props:
 *   open      – boolean, controls visibility
 *   onClose   – called when overlay or close button is clicked
 *   title     – heading in the panel header
 *   footer    – JSX rendered in the sticky bottom area (checkout button, totals, etc.)
 *   children  – scrollable body content (list of items)
 */
export default function SlideinPanel({ open, onClose, title, footer, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl border-l border-brand-blue/20 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 shrink-0">
          <span className="font-bold text-brand-charcoal">{title}</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <i className="fa-solid fa-xmark text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
