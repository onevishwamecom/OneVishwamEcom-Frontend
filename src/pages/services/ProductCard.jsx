import React, { useState } from 'react';
import { navigateTo } from "../../config/navigation";
import { useAuth } from "../../store/authSlice";

const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="none"><rect width="400" height="300" fill="#f3f4f6"/><path fill="#9ca3af" d="M160 130h80v-10l-40-40-40 40v10zm-20 50h120v-60l-40-40-80 80v20z"/></svg>`
);

/**
 * Generic product card component.
 * Props:
 * - link: URL to navigate to when card is clicked
 * - image: Image URL
 * - alt: Alt text for image
 * - title: Main title text
 * - price: Price text (e.g., "₹2.5 Cr")
 * - priceSuffix: Optional suffix displayed after price (e.g., "/ month")
 * - location: Primary location string (city, area, etc.)
 * - pincode: Optional pincode string
 * - tags: Array of short tag strings to show (e.g., type, brand)
 * - badges: Array of { label: string, className: string } objects displayed in the top‑left overlay
 * - children: Optional JSX rendered at the bottom of the card (e.g., action buttons)
 */
const EMPTY_ARRAY = [];

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
  tags = EMPTY_ARRAY,
  badges = EMPTY_ARRAY,
  showButton = true,
  children,
}) {
  const [imgError, setImgError] = useState(false);
  const { isLoggedIn, openAuthModal } = useAuth();

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
      className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
        {image && !imgError ? (
          <img
            src={image}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <img
            src={FALLBACK_IMG}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {badges.map((b, i) => (
            <span
              key={i}
              className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${b.className}`}
            >
              {b.label}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col flex-1">
        {/* Overline */}
        {overline && (
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
            {overline}
          </p>
        )}

        {/* Title */}
        {title && (
          <h3 className="font-semibold text-brand-charcoal text-sm leading-snug line-clamp-2">
            {title}
          </h3>
        )}

        {/* Price */}
        {priceOverride ? (
          <div className="mt-0.5">{priceOverride}</div>
        ) : (
          price && (
            <p className="mt-0.5 text-sm font-bold text-brand-blue">
              {price}
              {priceSuffix && (
                <span className="text-xs font-medium text-gray-400 ml-1">
                  {priceSuffix}
                </span>
              )}
            </p>
          )
        )}

        {/* Location */}
        {location && (
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <i className="fa-solid fa-location-dot text-brand-blue text-[10px]" />
            <span>
              {location}
              {pincode ? ` - ${pincode}` : ""}
            </span>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1 text-xs text-gray-600">
            {tags.map((t, i) => (
              <span key={i} className="bg-gray-100 rounded-lg px-2 py-0.5">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* View Details button */}
        {showButton !== false && (
          <div className="mt-auto pt-1.5">
            <div className="w-full rounded-lg bg-brand-blue/10 text-brand-blue text-center text-[11px] font-semibold py-1.5 hover:bg-brand-blue hover:text-white transition-colors">
              View Details
            </div>
          </div>
        )}

        {/* Footer / extra actions */}
        {children && <div className="mt-1.5">{children}</div>}
      </div>
    </div>
  );
});
