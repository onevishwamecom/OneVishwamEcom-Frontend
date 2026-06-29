import React from 'react';

export const CollapsibleSection = React.memo(function CollapsibleSection({ id, label, children, open, onToggle }) {
  return (
    <div className="border-b border-gray-100 pb-4">
      <button
        onClick={() => onToggle(id)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <span className="text-sm font-semibold text-brand-charcoal">{label}</span>
        <i className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pt-1">{children}</div>}
    </div>
  );
});
