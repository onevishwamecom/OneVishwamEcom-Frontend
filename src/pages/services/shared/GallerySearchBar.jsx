import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Universal Search Bar + Post Requirement CTA component used across product galleries.
 */
export function GallerySearchBar({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  postRequirementLink = '/post-requirement',
  postRequirementLabel = 'Post Requirement',
  showPostRequirement = true,
  className = 'my-4',
}) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-3 ${className}`}>
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-10 py-3 text-sm font-semibold text-brand-charcoal outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all shadow-2xs hover:shadow-xs"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-brand-charcoal hover:bg-gray-100 transition-colors"
            aria-label="Clear search"
          >
            <i className="fa-solid fa-xmark text-xs" />
          </button>
        )}
      </div>

      {/* Post Requirement CTA Button */}
      {showPostRequirement && postRequirementLink && (
        <Link
          to={postRequirementLink}
          className="rounded-2xl bg-brand-blue hover:bg-brand-navy text-white font-bold px-5 py-3 text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 whitespace-nowrap shadow-xs hover:shadow transition-colors duration-200"
        >
          <i className="fa-solid fa-circle-plus text-xs" />
          <span>{postRequirementLabel}</span>
        </Link>
      )}
    </div>
  );
}

export default GallerySearchBar;

