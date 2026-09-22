import React, { useState } from 'react';
import { navigateTo } from '../../../config/navigation';

const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="none"><rect width="400" height="300" fill="#f3f4f6"/><path fill="#9ca3af" d="M160 130h80v-10l-40-40-40 40v10zm-20 50h120v-60l-40-40-80 80v20z"/></svg>`
);

/**
 * CategoryListingCard:
 * Exact 1:1 replication of ProductCard topology from Real Estate Gallery:
 * 1. Image container: aspect [16/10] with subtle black gradient overlay
 * 2. Top-left badges (blue, green, amber, slate)
 * 3. Top-right favorite wishlist button
 * 4. Overline / Category tag
 * 5. Title (bold, hover:text-brand-blue)
 * 6. Location with location pin icon
 * 7. Middle row: 3 attribute pills (cardPills)
 * 8. Green trust banner (100% Pre-Approved Loan or Inspection Guaranteed)
 * 9. Footer: Price on left with priceSuffix + "View Details →" on right (or children)
 */
export default React.memo(function CategoryListingCard({
  item,
  link,
  image,
  alt = '',
  overline,
  title,
  price,
  priceSuffix = '',
  location,
  pincode,
  statusBadges = [],
  keyAttributes = [],
  cardPills = [],
  highlightBanner,
  onSelect,
  children,
}) {
  const [imgError, setImgError] = useState(false);
  const [faved, setFaved] = useState(false);

  // Normalize data
  const cardTitle = item?.title || title || '';
  const cardLink = link || item?.link || (item?.id ? `/property/${item.id}` : '#');
  const cardImg = image || item?.images?.[0] || item?.image || '';
  const cardPrice = item?.price || price || 'Price on Request';
  const cardPriceSuffix = item?.priceSuffix || priceSuffix || '';
  const cardLocation = item?.location || location || '';
  const cardPincode = item?.pincode || pincode || '';
  const cardOverline = overline || item?.category || item?.brand || item?.propertyType || '';

  // Badges
  const rawBadges = item?.statusBadges || statusBadges || item?.badges || [];
  const badges = rawBadges.map((b) => {
    if (typeof b === 'string') return { label: b, className: 'bg-brand-blue text-white' };
    let cls = b.className;
    if (!cls) {
      if (b.variant === 'green') cls = 'bg-emerald-600 text-white';
      else if (b.variant === 'amber') cls = 'bg-amber-500 text-white';
      else if (b.variant === 'blue') cls = 'bg-brand-blue text-white';
      else if (b.variant === 'slate') cls = 'bg-slate-700 text-white';
      else cls = 'bg-brand-blue text-white';
    }
    return { label: b.label, className: cls };
  });

  // 3 Attribute Pills (cardPills)
  const pills = (item?.cardPills || cardPills || item?.keyAttributes || keyAttributes || []).slice(0, 3);

  // Trust highlight banner
  const bannerText =
    highlightBanner ||
    item?.highlightBanner ||
    item?.trustBannerText ||
    (item?.loanApproved ? '100% Pre-Approved Loan Available' : null);

  const handleClick = () => {
    if (onSelect) {
      onSelect(item);
      return;
    }
    if (cardLink && cardLink !== '#') {
      navigateTo(cardLink);
    }
  };

  return (
    <div
      onClick={handleClick}
      role="article"
      className="group bg-white rounded-2xl border border-gray-200/80 hover:border-brand-blue/50 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer h-full shadow-xs"
    >
      {/* ── Image Container ── */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 shrink-0">
        {cardImg && !imgError ? (
          <img
            src={cardImg}
            alt={alt || cardTitle}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <img
            src={FALLBACK_IMG}
            alt={cardTitle}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Top-Left Badges */}
        {badges.length > 0 && (
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
        )}

        {/* Top-Right Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setFaved(!faved);
          }}
          className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md backdrop-blur-sm flex items-center justify-center transition-all z-10 cursor-pointer"
          aria-label="Save to favorites"
        >
          <i className={`${faved ? 'fa-solid text-rose-500' : 'fa-regular text-gray-500'} fa-heart text-xs`} />
        </button>
      </div>

      {/* ── Card Body (matches ProductCard.jsx 1:1) ── */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Overline / Category */}
        {cardOverline && (
          <p className="text-[10px] text-brand-blue font-bold uppercase tracking-wider">
            {cardOverline}
          </p>
        )}

        {/* Title */}
        <div className="min-h-[2.5rem] flex items-start">
          {cardTitle && (
            <h3 className="font-bold text-brand-charcoal text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">
              {cardTitle}
            </h3>
          )}
        </div>

        {/* Location */}
        {cardLocation && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
            <i className="fa-solid fa-location-dot text-brand-blue text-[11px] shrink-0" />
            <span className="truncate">
              {cardLocation}
              {cardPincode ? ` · ${cardPincode}` : ''}
            </span>
          </div>
        )}

        {/* 3 Attribute Pills (cardPills) */}
        {pills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {pills.map((pill, idx) => {
              const label = typeof pill === 'string' ? pill : `${pill.label ? `${pill.label}: ` : ''}${pill.value}`;
              return (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-700 font-semibold text-[11px] rounded-lg px-2.5 py-1 whitespace-nowrap truncate max-w-full"
                >
                  {label}
                </span>
              );
            })}
          </div>
        )}

        {/* Highlight Trust Banner (Green) */}
        {bannerText && (
          <div className="mt-1 flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200/60 px-2.5 py-1">
            <i className="fa-solid fa-circle-check text-[10px] text-emerald-600 shrink-0" />
            <span className="text-[10px] font-bold text-emerald-700 truncate">
              {bannerText}
            </span>
          </div>
        )}

        {/* ── Card Footer: Price + View Details CTA ── */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="min-w-0">
            <span
              className={`leading-tight block truncate ${
                String(cardPrice).trim().toLowerCase() === 'this is negotiable'
                  ? 'text-sm font-normal text-gray-500'
                  : 'text-base sm:text-lg font-extrabold text-brand-charcoal'
              }`}
            >
              {cardPrice}
            </span>
            {cardPriceSuffix && (
              <span className="text-[11px] font-semibold text-gray-400 block truncate">
                {cardPriceSuffix}
              </span>
            )}
          </div>

          {/* Right Action / "View Details →" */}
          {children ? (
            <div>{children}</div>
          ) : (
            <div className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue group-hover:text-brand-navy transition-colors shrink-0">
              <span>View Details</span>
              <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

