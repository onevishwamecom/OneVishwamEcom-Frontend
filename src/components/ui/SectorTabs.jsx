import React from 'react';

/**
 * SectorTabs
 * ──────────
 * Unified, token-locked category tab / pill strip component used across
 * every sector page. Provides 100% consistent height, padding, typography,
 * border-radius, and active-state styling.
 *
 * Props
 * ─────
 * tabs        – Array of:
 *                 • string  → used as both id and label
 *                 • { id, label, icon?, badge? }
 * activeTab   – Currently active tab id (string)
 * onTabChange – (id: string) => void
 * stats       – Optional map of { [id]: number | { count } | { projects, sites } }
 *               Auto-renders a badge if no explicit tab.badge supplied
 * renderBadge – Optional (tab, stats) => ReactNode override for badge
 * className   – Extra classes on the scroll container
 *
 * Example
 * ───────
 * <SectorTabs
 *   tabs={[
 *     { id: 'All',       label: 'All' },
 *     { id: 'Apartment', label: 'Apartment', icon: 'fa-building' },
 *   ]}
 *   activeTab={selectedType}
 *   onTabChange={setSelectedType}
 *   stats={cardTypeStats}
 * />
 */
export function SectorTabs({
  tabs = [],
  activeTab,
  onTabChange,
  stats,
  renderBadge,
  className = 'mt-5',
}) {
  if (!tabs || tabs.length === 0) return null;

  return (
    <div className={`flex gap-2 overflow-x-auto pb-1 scrollbar-hide ${className}`}>
      {tabs.map((tabItem) => {
        const isObj = typeof tabItem === 'object' && tabItem !== null;
        const id    = isObj ? tabItem.id    : tabItem;
        const label = isObj ? tabItem.label : tabItem;
        const icon  = isObj ? tabItem.icon  : null;
        const isActive = activeTab === id;

        // ── Badge resolution ──────────────────────────────────────────────
        let badge = null;
        if (typeof renderBadge === 'function') {
          badge = renderBadge(tabItem, stats);
        } else if (isObj && tabItem.badge !== undefined) {
          badge = tabItem.badge;
        } else if (stats && stats[id] !== undefined && id !== 'All') {
          const st = stats[id];
          if (typeof st === 'number') {
            badge = `${st} units`;
          } else if (st && typeof st === 'object') {
            if (st.projects !== undefined && st.sites !== undefined) {
              badge = `${st.projects}P · ${st.sites}S`;
            } else if (st.count !== undefined) {
              badge = st.count;
            }
          }
        }

        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange && onTabChange(id)}
            className={[
              // ── Fixed geometry tokens ─────────────────────────────────
              'flex-shrink-0 flex items-center gap-2.5',
              'rounded-full border',
              'px-4 py-2.5',
              'text-xs sm:text-sm font-bold',
              'whitespace-nowrap',
              'transition-all duration-200 active:scale-95 cursor-pointer',
              // ── Active vs default state ───────────────────────────────
              isActive
                ? 'border-brand-blue bg-brand-blue text-white shadow-md shadow-brand-blue/25 scale-[1.02]'
                : 'border-gray-200 bg-white text-gray-700 hover:border-brand-blue/40 hover:bg-blue-50/20 hover:text-brand-blue shadow-2xs',
            ].join(' ')}
          >
            {icon && <i className={`fa-solid ${icon} text-xs`} />}
            <span>{label}</span>
            {badge !== null && badge !== undefined && (
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-colors ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default SectorTabs;

