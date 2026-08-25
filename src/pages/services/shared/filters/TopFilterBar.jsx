import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable Toggle Switch for sector-specific quick filters
 */
export function FilterToggle({ checked, onChange, label, icon }) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange && onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-navy"></div>
      </div>
      <span className="text-xs font-semibold text-brand-charcoal flex items-center gap-1">
        {icon && <i className={`${icon} text-gray-400 text-xs`} />}
        {label}
      </span>
    </label>
  );
}

/**
 * Universal Top Filter Bar Component
 * Matches the capsule location selector + retractable 3-column requirement panel with sector switches.
 */
export function TopFilterBar({
  cityValue = 'bengaluru',
  onCityChange,
  citiesList = ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'],
  areaValue = '',
  onAreaChange,
  areasList = [],
  requirementValue = '',
  onRequirementChange,
  requirementPlaceholder = 'e.g. 3 BHK ready to move, budget 50L',
  onSearch,
  searchButtonText = 'Search Properties',
  postRequirementLink = '/post-requirement',
  postRequirementLabel = 'Post Requirement',
  postRequirementIcon = 'fa-solid fa-circle-plus',
  onPostRequirementClick,
  rightActionSlot,
  customSwitchSlot,
  financeSlot,
  isExpanded: controlledExpanded,
  onToggleExpanded,
  className = '',
}) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const toggleExpanded = onToggleExpanded || (() => setInternalExpanded((prev) => !prev));

  const displayCity = (cityValue || 'Bengaluru');
  const formattedCity = displayCity.charAt(0).toUpperCase() + displayCity.slice(1);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Top Capsule Row */}
      <div className="flex items-center gap-3">
        {/* Blue Border Location Capsule */}
        <button
          type="button"
          onClick={toggleExpanded}
          className="flex-1 flex items-center justify-between rounded-full border-2 border-brand-blue bg-white px-5 py-2.5 text-left transition-all hover:bg-blue-50/20 active:scale-[0.99] shadow-xs"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <i className="fa-solid fa-location-dot text-brand-navy text-sm shrink-0" />
            <span className="font-bold text-brand-navy text-sm sm:text-base truncate">
              {areaValue ? `${areaValue}, ${formattedCity}` : formattedCity}
            </span>
          </div>

          <i
            className={`fa-solid fa-chevron-down text-brand-navy text-xs transition-transform duration-200 shrink-0 ml-2 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Right Companion Action (Post Requirement / Action Button) */}
        {rightActionSlot ? (
          rightActionSlot
        ) : postRequirementLink ? (
          <Link
            to={postRequirementLink}
            onClick={onPostRequirementClick}
            className="rounded-full border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-brand-navy font-bold px-4 sm:px-5 py-2.5 text-xs sm:text-sm flex items-center gap-2 transition-colors shrink-0 shadow-xs active:scale-[0.98]"
          >
            {postRequirementIcon && <i className={postRequirementIcon} />}
            <span>{postRequirementLabel}</span>
          </Link>
        ) : null}
      </div>

      {/* Expanded Filter Panel */}
      {isExpanded && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* 3 Columns + Search Button */}
          <div className="grid gap-3 sm:grid-cols-12 items-center">
            {/* 1. CITY */}
            <div className="sm:col-span-3 border-b sm:border-b-0 sm:border-r border-gray-100 pb-2 sm:pb-0 sm:pr-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5">
                <i className="fa-solid fa-city text-gray-400 text-xs" />
                CITY
              </label>
              <select
                value={cityValue}
                onChange={(e) => onCityChange && onCityChange(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold text-brand-charcoal bg-transparent outline-none cursor-pointer py-1"
              >
                {citiesList.map((c) => {
                  const val = typeof c === 'string' ? c.toLowerCase() : c.id;
                  const label = typeof c === 'string' ? c : c.label;
                  return (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 2. AREA */}
            <div className="sm:col-span-3 border-b sm:border-b-0 sm:border-r border-gray-100 pb-2 sm:pb-0 sm:pr-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5">
                <i className="fa-solid fa-location-dot text-gray-400 text-xs" />
                AREA
              </label>
              {areasList && areasList.length > 0 ? (
                <select
                  value={areaValue}
                  onChange={(e) => onAreaChange && onAreaChange(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold text-brand-charcoal bg-transparent outline-none cursor-pointer py-1"
                >
                  <option value="">Select Area</option>
                  {areasList.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={areaValue}
                  onChange={(e) => onAreaChange && onAreaChange(e.target.value)}
                  placeholder="Select Area / Locality"
                  className="w-full text-xs sm:text-sm font-semibold text-brand-charcoal bg-transparent outline-none py-1 placeholder:text-gray-300 placeholder:font-normal"
                />
              )}
            </div>

            {/* 3. REQUIREMENT */}
            <div className="sm:col-span-4 pb-2 sm:pb-0 sm:pr-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5">
                <i className="fa-solid fa-pen text-gray-400 text-xs" />
                REQUIREMENT
              </label>
              <input
                type="text"
                value={requirementValue}
                onChange={(e) => onRequirementChange && onRequirementChange(e.target.value)}
                placeholder={requirementPlaceholder}
                className="w-full text-xs sm:text-sm font-semibold text-brand-charcoal bg-transparent outline-none py-1 placeholder:text-gray-300 placeholder:font-normal"
              />
            </div>

            {/* 4. SEARCH BUTTON */}
            <div className="sm:col-span-2 flex items-center justify-end">
              <button
                type="button"
                onClick={onSearch}
                className="w-full h-11 rounded-xl bg-brand-navy hover:bg-blue-900 text-white font-bold px-4 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0 whitespace-nowrap active:scale-[0.98]"
              >
                <i className="fa-solid fa-magnifying-glass text-xs" />
                <span>{searchButtonText}</span>
              </button>
            </div>
          </div>

          {/* Bottom Toolbar: Custom Sector Switch + Finance Action */}
          {(customSwitchSlot || financeSlot) && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-3">
                {customSwitchSlot}
              </div>
              <div className="flex items-center gap-2">
                {financeSlot}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TopFilterBar;
