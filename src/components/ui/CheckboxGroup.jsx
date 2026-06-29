import React, { useState } from 'react';

export const CheckboxGroup = React.memo(function CheckboxGroup({ options, selected, onChange, label, search }) {
  const [query, setQuery] = useState('');
  const filtered = search
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <div>
      {search && (
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-blue mb-2"
        />
      )}
      {filtered.length === 0 && search && (
        <p className="text-xs text-gray-400 px-1">No matches found.</p>
      )}
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {filtered.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => {
                const next = selected.includes(opt)
                  ? selected.filter((s) => s !== opt)
                  : [...selected, opt];
                onChange(next);
              }}
              className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue/30"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
});
