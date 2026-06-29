import React from 'react';

export const ActiveChip = React.memo(function ActiveChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-brand-blue/10 text-brand-blue rounded-full px-3 py-1 text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-brand-blue/70">
        <i className="fa-solid fa-xmark text-[10px]" />
      </button>
    </span>
  );
});
