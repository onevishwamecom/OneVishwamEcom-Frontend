/**
 * Reusable CategoryPillStrip component for horizontal category/filter pill strips.
 *
 * @param {Object} props
 * @param {Array<{id: string|number, label: string, icon?: string, count?: number|string}>} props.items
 * @param {string|number} props.selected - Currently selected item ID
 * @param {(id: string|number) => void} props.onSelect - Callback when item is selected
 * @param {string} [props.className] - Optional container CSS class
 */
function CategoryPillStrip({ items = [], selected, onSelect, className = 'mt-5' }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`${className} flex gap-2 overflow-x-auto pb-1 scrollbar-hide`}>
      {items.map((item) => {
        const isSelected = selected === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect && onSelect(item.id)}
            className={`flex-shrink-0 flex items-center gap-2.5 rounded-full border px-4 py-2 transition-all ${
              isSelected
                ? 'border-brand-blue bg-brand-blue text-white shadow-sm shadow-brand-blue/25'
                : 'border-gray-200 bg-white text-gray-600 hover:border-brand-blue/40 hover:text-brand-blue'
            }`}
          >
            {item.icon && <i className={`fa-solid ${item.icon} text-xs`} />}
            <span className="text-sm font-semibold whitespace-nowrap">{item.label}</span>
            {item.count !== undefined && item.count !== null && (
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryPillStrip;

