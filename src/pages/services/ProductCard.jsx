import React, { useState } from 'react';
import { navigateTo } from "../../config/navigation";

const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="none"><rect width="400" height="300" fill="#f3f4f6"/><path fill="#9ca3af" d="M160 130h80v-10l-40-40-40 40v10zm-20 50h120v-60l-40-40-80 80v20z"/></svg>`
);

const THEME_BORDER_CLASSES = {
  blue: 'border-2 border-brand-blue/40 hover:border-brand-blue ring-1 ring-brand-blue/20',
  property: 'border-2 border-brand-blue/40 hover:border-brand-blue ring-1 ring-brand-blue/20',
  gold: 'border-2 border-amber-400/80 hover:border-amber-500 ring-1 ring-amber-400/20',
  amber: 'border-2 border-amber-400/80 hover:border-amber-500 ring-1 ring-amber-400/20',
  jewellery: 'border-2 border-amber-400/80 hover:border-amber-500 ring-1 ring-amber-400/20',
  red: 'border-2 border-red-400/80 hover:border-red-500 ring-1 ring-red-400/20',
  automobile: 'border-2 border-red-400/80 hover:border-red-500 ring-1 ring-red-400/20',
  vehicle: 'border-2 border-red-400/80 hover:border-red-500 ring-1 ring-red-400/20',
  emerald: 'border-2 border-emerald-400/80 hover:border-emerald-500 ring-1 ring-emerald-400/20',
  grocery: 'border-2 border-emerald-400/80 hover:border-emerald-500 ring-1 ring-emerald-400/20',
  rose: 'border-2 border-rose-400/80 hover:border-rose-500 ring-1 ring-rose-400/20',
  garments: 'border-2 border-rose-400/80 hover:border-rose-500 ring-1 ring-rose-400/20',
  indigo: 'border-2 border-indigo-400/80 hover:border-indigo-500 ring-1 ring-indigo-400/20',
  finance: 'border-2 border-indigo-400/80 hover:border-indigo-500 ring-1 ring-indigo-400/20',
};

function getThemeBorderClass(theme, link, overline) {
  if (theme && THEME_BORDER_CLASSES[theme.toLowerCase()]) {
    return THEME_BORDER_CLASSES[theme.toLowerCase()];
  }
  const str = `${link || ''} ${overline || ''}`.toLowerCase();
  if (str.includes('/jewellery') || str.includes('jewellery') || str.includes('gold')) return THEME_BORDER_CLASSES.jewellery;
  if (str.includes('/vehicle') || str.includes('/automobile') || str.includes('vehicle') || str.includes('automobile')) return THEME_BORDER_CLASSES.automobile;
  if (str.includes('/grocery') || str.includes('grocery') || str.includes('food')) return THEME_BORDER_CLASSES.grocery;
  if (str.includes('/garment') || str.includes('garment') || str.includes('fashion') || str.includes('clothing')) return THEME_BORDER_CLASSES.garments;
  if (str.includes('/finance') || str.includes('loan') || str.includes('finance')) return THEME_BORDER_CLASSES.finance;
  return THEME_BORDER_CLASSES.property;
}

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
 * - theme: Optional theme override ('property', 'jewellery', 'automobile', 'grocery', 'garments', 'finance')
 * - children: Optional JSX rendered at the bottom of the card (e.g., action buttons)
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
  const borderClass = getThemeBorderClass(theme, link, overline);

  return (
    <div
      onClick={link ? () => navigateTo(link) : undefined}
      className={`bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer h-full shadow-sm ${borderClass}`}
    >
      {/* Image — fixed 4:3 aspect ratio, consistent across all cards */}
      <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative shrink-0">
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

      {/* Body — flex column so button is always at the bottom */}
      <div className="p-3 flex flex-col flex-1">
        {/* Overline */}
        {overline && (
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">
            {overline}
          </p>
        )}

        {/* Title — always reserves 2 lines, clamps overflow */}
        <div className="min-h-[2.5rem] flex items-start">
          {title && (
            <h3 className="font-semibold text-brand-charcoal text-sm leading-snug line-clamp-2">
              {title}
            </h3>
          )}
        </div>

        {/* Price — reserves 1.25rem so short/missing price doesn't collapse layout */}
        <div className="min-h-[1.25rem]">
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
        </div>

        {/* Location — single line, clipped */}
        {location && (
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 min-w-0">
            <i className="fa-solid fa-location-dot text-brand-blue text-[10px] shrink-0" />
            <span className="truncate">
              {location}
              {pincode ? ` · ${pincode}` : ""}
            </span>
          </div>
        )}

        {/* Tags — wrappable but max 2 rows */}
        {tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1 text-xs text-gray-600 overflow-hidden max-h-[3rem]">
            {tags.map((t, i) => (
              t && String(t).trim().toLowerCase() !== 'plots' && String(t).trim().toLowerCase() !== 'plot' && (
                <span key={i} className="bg-gray-100 rounded-lg px-2 py-0.5 whitespace-nowrap">
                  {t}
                </span>
              )
            ))}
          </div>
        )}

        {/* Extra children (agent info, loan badges, etc.) */}
        {children && <div className="mt-1.5 overflow-hidden">{children}</div>}

        {/* View Details button — always pinned to the bottom */}
        {showButton !== false && (
          <div className="mt-auto pt-2">
            <div className="w-full rounded-lg bg-brand-blue/10 text-brand-blue text-center text-[11px] font-semibold py-1.5 hover:bg-brand-blue hover:text-white transition-colors">
              View Details
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
