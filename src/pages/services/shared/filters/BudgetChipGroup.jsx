import React from 'react';

/**
 * BudgetChipGroup
 * Preset budget chips + min/max number inputs with currency prefixes.
 */
export default function BudgetChipGroup({
  chips = [],
  budgetMin = '',
  budgetMax = '',
  onBudgetChange,
  showCustomInputs = true,
  minPlaceholder = 'Min (₹)',
  maxPlaceholder = 'Max (₹)',
}) {
  const isChipSelected = (chip) => {
    return (
      (chip.min === undefined || String(budgetMin) === String(chip.min)) &&
      (chip.max === undefined || (chip.max === Infinity ? budgetMax === '' : String(budgetMax) === String(chip.max)))
    );
  };

  const handleChipClick = (chip) => {
    if (isChipSelected(chip)) {
      onBudgetChange && onBudgetChange('', '');
    } else {
      onBudgetChange && onBudgetChange(chip.min !== undefined ? chip.min : '', chip.max !== Infinity && chip.max !== undefined ? chip.max : '');
    }
  };

  return (
    <div className="space-y-3 pt-1">
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {chips.map((chip, idx) => {
            const sel = isChipSelected(chip);
            return (
              <button
                key={chip.label || idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  sel
                    ? 'bg-brand-blue text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      )}

      {showCustomInputs && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={budgetMin}
            onChange={(e) => onBudgetChange && onBudgetChange(e.target.value, budgetMax)}
            placeholder={minPlaceholder}
            className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-brand-blue"
          />
          <span className="text-gray-400 text-xs">–</span>
          <input
            type="number"
            value={budgetMax}
            onChange={(e) => onBudgetChange && onBudgetChange(budgetMin, e.target.value)}
            placeholder={maxPlaceholder}
            className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-brand-blue"
          />
        </div>
      )}
    </div>
  );
}
