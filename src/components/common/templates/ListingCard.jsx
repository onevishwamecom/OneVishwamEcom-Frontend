import React, { useState } from 'react';
import { MapPin, Heart, ChevronRight } from 'lucide-react';
import { navigateTo } from '../../../config/navigation';

const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="none"><rect width="400" height="300" fill="#f3f4f6"/><path fill="#9ca3af" d="M160 130h80v-10l-40-40-40 40v10zm-20 50h120v-60l-40-40-80 80v20z"/></svg>`
);

/**
 * Reusable ListingCard adhering to the unified EntityItem topology.
 * Displays: image cover/carousel, status badges, favorite button, price,
 * title, location, and the first 3 key attribute pills.
 */
export default React.memo(function ListingCard({
  item,
  link,
  onSelect,
  showButton = true,
  buttonText = 'View Details',
  children,
}) {
  const [imgError, setImgError] = useState(false);
  const [faved, setFaved] = useState(false);

  // Normalize from item object or fallback
  const targetLink = link || (item?.id ? `/property/${item.id}` : '#');
  const image = item?.images?.[0] || '';
  const title = item?.title || '';
  const price = item?.price || '';
  const priceSubtext = item?.priceSubtext || '';
  const location = item?.location || '';
  const pincode = item?.pincode || '';
  const badges = item?.badges || [];
  const keyAttributes = (item?.keyAttributes || []).slice(0, 3);

  const handleClick = () => {
    if (onSelect) {
      onSelect(item);
      return;
    }
    if (targetLink && targetLink !== '#') {
      navigateTo(targetLink);
    }
  };

  return (
    <div
      onClick={handleClick}
      role="article"
      className="group bg-white rounded-2xl border border-slate-200 hover:border-brand-blue/50 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer h-full shadow-xs"
    >
      {/* ── Image & Cover Carousel ── */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 shrink-0">
        {image && !imgError ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <img
            src={FALLBACK_IMG}
            alt={title}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Status Badges */}
        {badges.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10">
            {badges.map((b, i) => {
              const label = typeof b === 'string' ? b : b.label;
              const className = typeof b === 'string' ? 'bg-brand-blue text-white' : (b.className || 'bg-brand-blue text-white');
              return (
                <span
                  key={i}
                  className={`rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wide shadow-xs backdrop-blur-xs ${className}`}
                >
                  {label}
                </span>
              );
            })}
          </div>
        )}

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setFaved(!faved);
          }}
          className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md backdrop-blur-sm flex items-center justify-center transition-all z-10"
          aria-label="Save to favorites"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              faved ? 'fill-rose-500 text-rose-500' : 'text-slate-500 hover:text-rose-500'
            }`}
          />
        </button>

        {/* Multi-image count indicator */}
        {item?.images && item.images.length > 1 && (
          <span className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
            1/{item.images.length}
          </span>
        )}
      </div>

      {/* ── Content Body ── */}
      <div className="p-4 sm:p-4.5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          {/* Price Header */}
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className={price === 'This is negotiable' ? "text-sm font-normal text-slate-500" : "text-base sm:text-lg font-bold text-slate-900 tracking-tight"}>
                {price}
              </span>
              {priceSubtext && (
                <span className="text-xs font-normal text-slate-500">
                  {priceSubtext}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-blue transition-colors duration-200 line-clamp-1">
            {title}
          </h3>

          {/* Location */}
          {location && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {location}
                {pincode ? ` - ${pincode}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* ── First 3 Key Attributes Pills ── */}
        {keyAttributes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {keyAttributes.map((attr, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/70 text-[11px] font-medium text-slate-600 truncate max-w-full"
              >
                <span className="font-semibold text-slate-700 mr-1">{attr.label}:</span>
                <span>{attr.value}</span>
              </span>
            ))}
          </div>
        )}

        {/* Optional Custom Slots / CTA */}
        {children ? (
          <div className="pt-2 border-t border-slate-100 mt-auto">{children}</div>
        ) : showButton ? (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-blue group-hover:text-blue-700 mt-auto">
            <span>{buttonText}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        ) : null}
      </div>
    </div>
  );
});
