import React from 'react';

/**
 * Universal Category Pill Strip component used across all service galleries.
 * Supports:
 * - Object items: { id: string, label: string, icon?: string, badge?: string|number }
 * - String items: 'All', 'Men', 'Women'
 * - Custom badge rendering callback: renderBadge(item, stats)
 * - Stat maps: stats[item.id]
 */
export default function CategoryPillStrip({
  types = [],
  selected,
  stats,
  onSelect,
  renderBadge,
  className = 'mt-5',
}) {
  if (!types || types.length === 0) return null;

  return (
    <div className={`flex gap-2 overflow-x-auto pb-1 scrollbar-hide ${className}`}>
      {types.map((typeItem) => {
        const isObj = typeof typeItem === 'object' && typeItem !== null;
        const id = isObj ? typeItem.id : typeItem;
        const label = isObj ? typeItem.label : typeItem;
        const icon = isObj ? typeItem.icon : null;
        const isSelected = selected === id;

        // Compute badge
        let badgeContent = null;
        if (typeof renderBadge === 'function') {
          badgeContent = renderBadge(typeItem, stats);
        } else if (isObj && typeItem.badge !== undefined) {
          badgeContent = typeItem.badge;
        } else if (stats && stats[id] !== undefined && id !== 'All') {
          const st = stats[id];
          if (typeof st === 'number') {
            badgeContent = `${st} units`;
          } else if (st && typeof st === 'object') {
            if (st.projects !== undefined && st.sites !== undefined) {
              badgeContent = `${st.projects}P · ${st.sites}S`;
            } else if (st.count !== undefined) {
              badgeContent = st.count;
            }
          }
        }

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect && onSelect(id)}
            className={`flex-shrink-0 flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-150 whitespace-nowrap active:scale-95 ${
              isSelected
                ? 'border-brand-blue bg-brand-blue text-white shadow-xs shadow-brand-blue/25'
                : 'border-gray-200 bg-white text-gray-600 hover:border-brand-blue/40 hover:text-brand-blue'
            }`}
          >
            {icon && <i className={`fa-solid ${icon} text-xs`} />}
            <span>{label}</span>
            {badgeContent !== null && badgeContent !== undefined && (
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {badgeContent}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
