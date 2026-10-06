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

  const isPropertyOrVehicle =
    (targetLink && (targetLink.includes('/property') || targetLink.includes('/vehicle') || targetLink.includes('/automobile'))) ||
    (item?.category && (
      String(item.category).toLowerCase().includes('property') ||
      String(item.category).toLowerCase().includes('real-estate') ||
      String(item.category).toLowerCase().includes('automobile') ||
      String(item.category).toLowerCase().includes('vehicle')
    ));

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
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold tracking-wide shadow-xs backdrop-blur-xs ${className}`}
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
          className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md backdrop-blur-sm flex items-center justify-center transition-all z-10 cursor-pointer"
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
          <span className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-xs font-semibold backdrop-blur-xs">
            1/{item.images.length}
          </span>
        )}
      </div>

      {/* ── Content Body ── */}
      <div className="p-4 sm:p-4.5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          {/* Price Header / Contact Us */}
          {!isPropertyOrVehicle && (
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  {price}
                </span>
                {priceSubtext && (
                  <span className="text-xs font-normal text-slate-500">
                    {priceSubtext}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Title */}
          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-brand-blue transition-colors duration-200 line-clamp-2 leading-snug">
            {title}
          </h3>

          {/* Location */}
          {location && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
              <MapPin className="w-4 h-4 text-brand-blue shrink-0" />
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
                className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-700 truncate max-w-full"
              >
                <span className="font-bold text-slate-800 mr-1">{attr.label}:</span>
                <span>{attr.value}</span>
              </span>
            ))}
          </div>
        )}

        {/* Optional Custom Slots / CTA / Contact Us */}
        {children ? (
          <div className="pt-2 border-t border-slate-100 mt-auto">{children}</div>
        ) : isPropertyOrVehicle ? (
          <div className="pt-2 border-t border-slate-100 mt-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                window.dispatchEvent(
                  new CustomEvent('onevishwam:open_enquiry_modal', {
                    detail: { title: title || 'Property / Vehicle Enquiry' },
                  })
                );
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs sm:text-sm font-extrabold transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <i className="fa-solid fa-envelope text-xs" />
              <span>Contact Us</span>
            </button>
          </div>
        ) : showButton ? (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-brand-blue group-hover:text-blue-700 mt-auto">
            <span>{buttonText}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        ) : null}
      </div>
    </div>
  );
});
