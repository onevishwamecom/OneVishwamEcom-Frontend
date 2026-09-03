import React, { useState } from 'react';
import { navigateTo } from "../../config/navigation";

const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="none"><rect width="400" height="300" fill="#f3f4f6"/><path fill="#9ca3af" d="M160 130h80v-10l-40-40-40 40v10zm-20 50h120v-60l-40-40-80 80v20z"/></svg>`
);

/**
 * Modern Generic Product / Listing Card.
 */
export default React.memo(function ProductCard({
  link = "#",
  image,
  alt = "",
  overline,
  title,
  price,
  priceSuffix = "",
  priceOverride,
  location,
  pincode,
  tags = [],
  badges = [],
  showButton = true,
  theme,
  children,
}) {
  const [imgError, setImgError] = useState(false);
  const [faved, setFaved] = useState(false);

  return (
    <div
      onClick={link ? () => navigateTo(link) : undefined}
      className="group bg-white rounded-2xl border border-gray-200/80 hover:border-brand-blue/50 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer h-full shadow-xs"
    >
      {/* ── Image Container ── */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 shrink-0">
        {image && !imgError ? (
          <img
            src={image}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <img
            src={FALLBACK_IMG}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Top-Left Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10">
          {badges.map((b, i) => (
            <span
              key={i}
              className={`rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wide shadow-xs backdrop-blur-xs ${b.className}`}
            >
              {b.label}
            </span>
          ))}
        </div>

        {/* Top-Right Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setFaved(!faved);
          }}
          className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md backdrop-blur-sm flex items-center justify-center transition-all z-10"
          aria-label="Save to favorites"
        >
          <i className={`${faved ? 'fa-solid text-rose-500' : 'fa-regular text-gray-500'} fa-heart text-xs`} />
        </button>
      </div>

      {/* ── Card Body ── */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Overline / Property Type */}
        {overline && (
          <p className="text-[10px] text-brand-blue font-bold uppercase tracking-wider">
            {overline}
          </p>
        )}

        {/* Title */}
        <div className="min-h-[2.5rem] flex items-start">
          {title && (
            <h3 className="font-bold text-brand-charcoal text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">
              {title}
            </h3>
          )}
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
            <i className="fa-solid fa-location-dot text-brand-blue text-[11px] shrink-0" />
            <span className="truncate">
              {location}
              {pincode ? ` · ${pincode}` : ""}
            </span>
          </div>
        )}

        {/* Specs / Detail Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {tags.map((t, i) => (
              t && String(t).trim().toLowerCase() !== 'plots' && String(t).trim().toLowerCase() !== 'plot' && (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-700 font-semibold text-[11px] rounded-lg px-2.5 py-1 whitespace-nowrap"
                >
                  {t}
                </span>
              )
            ))}
          </div>
        )}

        {/* Extra children (Agent info, Loan banners, etc.) */}
        {children && <div className="pt-1">{children}</div>}

        {/* ── Card Footer: Price ── */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="min-w-0">
            {priceOverride ? (
              priceOverride
            ) : (
              price && (
                <div>
                  <span className="text-base sm:text-lg font-extrabold text-brand-charcoal leading-tight block truncate">
                    {price}
                  </span>
                  {priceSuffix && (
                    <span className="text-[11px] font-semibold text-gray-400 block truncate">
                      {priceSuffix}
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
