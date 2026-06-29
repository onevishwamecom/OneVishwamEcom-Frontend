export default function VehicleTypeStrip({ types, selected, stats, onSelect }) {
  return (
    <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {types.map((ct) => {
        const sel = selected === ct.id;
        const st  = stats[ct.id];
        return (
          <button
            key={ct.id}
            onClick={() => onSelect(ct.id)}
            className={`flex-shrink-0 flex items-center gap-2.5 rounded-full border px-4 py-2 transition-all ${
              sel
                ? 'border-brand-blue bg-brand-blue text-white shadow-sm shadow-brand-blue/25'
                : 'border-gray-200 bg-white text-gray-600 hover:border-brand-blue/40 hover:text-brand-blue'
            }`}
          >
            <i className={`fa-solid ${ct.icon} text-xs`} />
            <span className="text-sm font-semibold whitespace-nowrap">{ct.label}</span>
            {ct.id !== 'All' && st !== undefined && (
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                sel ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {st} units
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
