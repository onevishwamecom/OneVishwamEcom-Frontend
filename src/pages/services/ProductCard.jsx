import React, { useState } from 'react';
import { navigateTo } from "../../config/navigation";
import { cleanProductName } from "../../utils/searchUtils";
import { useAuth } from "../../store/authSlice";

import { ONEVISHWAM_VERIFIED_IMAGE, isPlaceholderImage } from "../../constants/fallbackImage";

const FALLBACK_IMG = ONEVISHWAM_VERIFIED_IMAGE;

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
  hidePrice = false,
}) {
  const [imgError, setImgError] = useState(false);
  const [faved, setFaved] = useState(false);
  const { isLoggedIn, openAuthModal } = useAuth();

  const isPropertyOrVehicle =
    hidePrice ||
    (link && (link.includes('/property') || link.includes('/vehicle') || link.includes('/automobile'))) ||
    (overline && (
      overline.toLowerCase().includes('property') ||
      overline.toLowerCase().includes('house') ||
      overline.toLowerCase().includes('vehicle') ||
      overline.toLowerCase().includes('car') ||
      overline.toLowerCase().includes('automobile')
    ));

  const handleCardClick = (e) => {
    if (!link || link === '#') return;
    if (!isLoggedIn) {
      if (e && e.preventDefault) e.preventDefault();
      sessionStorage.setItem('vishwam_auth_redirect', link);
      openAuthModal('login');
      return;
    }
    navigateTo(link);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-gray-200/80 hover:border-brand-blue/50 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer h-full shadow-xs"
    >
      {/* ── Image Container ── */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 shrink-0">
        {image && !isPlaceholderImage(image) && !imgError ? (
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
              className={`rounded-lg px-2.5 py-1 text-xs font-bold tracking-wide shadow-xs backdrop-blur-xs ${b.className}`}
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
      <div className="p-4 flex flex-col flex-1 gap-2.5">
        {/* Overline / Property Type */}
        {overline && (
          <p className="text-xs text-brand-blue font-bold uppercase tracking-wider">
            {overline}
          </p>
        )}

        {/* Title */}
        <div className="min-h-[2.75rem] flex items-start">
          {title && (
            <h3 className="font-extrabold text-brand-charcoal text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">
              {cleanProductName(title)}
            </h3>
          )}
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600 min-w-0">
            <i className="fa-solid fa-location-dot text-brand-blue text-xs shrink-0" />
            <span className="truncate">
              {location}
              {pincode && !/\b\d{6}\b/.test(location) && !String(location).includes(pincode) ? ` · ${pincode}` : ""}
            </span>
          </div>
        )}

        {/* Specs / Detail Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {tags.map((t, i) => {
              if (!t || String(t).trim().toLowerCase() === 'plots' || String(t).trim().toLowerCase() === 'plot') return null;
              const isFacing = String(t).startsWith('Door Facing') || String(t).startsWith('Facing');
              const isCorner = String(t).startsWith('Corner');
              return (
                <span
                  key={i}
                  className={`font-semibold text-xs rounded-lg px-2.5 py-1 whitespace-nowrap flex items-center gap-1.5 ${
                    isCorner
                      ? 'bg-purple-50 text-purple-800 border border-purple-200/80 shadow-2xs'
                      : isFacing
                      ? 'bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {isCorner && <i className="fa-solid fa-vector-square text-purple-600 text-xs" />}
                  {isFacing && <i className="fa-solid fa-compass text-amber-600 text-xs" />}
                  {t}
                </span>
              );
            })}
          </div>
        )}

        {/* Extra children (Agent info, Loan banners, etc.) */}
        {children && <div className="pt-1">{children}</div>}

        {/* ── Card Footer: Contact Us / Price ── */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          {isPropertyOrVehicle ? (
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
          ) : (
            <div className="min-w-0">
              {priceOverride ? (
                priceOverride
              ) : (
                price && (
                  <div>
                    <span
                      className={`leading-tight block truncate ${
                        String(price).trim().toLowerCase() === 'this is negotiable'
                          ? 'text-sm font-normal text-gray-500'
                          : 'text-base sm:text-lg font-extrabold text-brand-charcoal'
                      }`}
                    >
                      {price}
                    </span>
                    {priceSuffix && (
                      <span className="text-xs font-semibold text-gray-400 block truncate">
                        {priceSuffix}
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
