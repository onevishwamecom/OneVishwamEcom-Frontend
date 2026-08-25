import React, { useState } from 'react';
import { navigateTo } from '../../../../config/navigation';
import { useAuth } from '../../../../store/authSlice';
import { formatINR, withRupeeSymbol } from '../priceUtils';
import { normalizeListing } from './normalizeListing';

const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="none"><rect width="400" height="300" fill="#f3f4f6"/><path fill="#9ca3af" d="M160 130h80v-10l-40-40-40 40v10zm-20 50h120v-60l-40-40-80 80v20z"/></svg>`
);

const EMPTY_ARRAY = [];

/**
 * Universal Master Listing Card Component
 * Supports direct props or auto-normalization from raw sector items.
 */
export const ListingCard = React.memo(function ListingCard({
  item,
  sector,
  config,
  link,
  image,
  alt = '',
  overline,
  title,
  price,
  priceSuffix = '',
  priceType,
  priceOverride,
  location,
  pincode,
  tags,
  badges,
  showButton = true,
  buttonText = 'View Details',
  children,
}) {
  const [imgError, setImgError] = useState(false);
  const { isLoggedIn, openAuthModal } = useAuth();

  // Normalize if item is provided
  const normalized = item ? normalizeListing(item, sector || config?.sector || '') : null;

  const cardLink = link || normalized?.link || '#';
  const cardImage = image || normalized?.image;
  const cardAlt = alt || title || normalized?.title || '';
  const cardOverline = overline !== undefined ? overline : normalized?.overline;
  const cardTitle = title || normalized?.title || '';
  const cardPrice = price !== undefined ? price : normalized?.price;
  const cardPriceSuffix = priceSuffix || normalized?.priceSuffix || '';
  const cardPriceType = priceType || normalized?.priceType;
  const cardLocation = location !== undefined ? location : normalized?.location;
  const cardPincode = pincode !== undefined ? pincode : normalized?.pincode;
  const cardTags = tags || normalized?.tags || EMPTY_ARRAY;
  const cardBadges = badges || normalized?.badges || EMPTY_ARRAY;

  const handleCardClick = (e) => {
    if (!cardLink || cardLink === '#') return;
    if (!isLoggedIn) {
      if (e && e.preventDefault) e.preventDefault();
      sessionStorage.setItem('vishwam_auth_redirect', cardLink);
      openAuthModal('login');
      return;
    }
    navigateTo(cardLink);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col cursor-pointer h-full"
    >
      {/* 4:3 Aspect Ratio Image Stage */}
      <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative shrink-0">
        {cardImage && !imgError ? (
          <img
            src={cardImage}
            alt={cardAlt}
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

        {/* Badges Overlay */}
        {cardBadges.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10">
            {cardBadges.map((b, i) => (
              <span
                key={i}
                className={`rounded-lg px-2 py-0.5 text-[10px] font-bold shadow-2xs ${b.className}`}
              >
                {b.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-3 flex flex-col flex-1">
        {/* Overline */}
        {cardOverline && (
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5 truncate">
            {cardOverline}
          </p>
        )}

        {/* Title — Fixed height line clamp */}
        <div className="min-h-[2.5rem] flex items-start">
          {cardTitle && (
            <h3 className="font-semibold text-brand-charcoal text-sm leading-snug line-clamp-2">
              {cardTitle}
            </h3>
          )}
        </div>

        {/* Price Row */}
        <div className="min-h-[1.25rem]">
          {priceOverride ? (
            <div className="mt-0.5">{priceOverride}</div>
          ) : cardPriceType === 'on-request' ? (
            <p className="mt-0.5 text-sm font-bold text-brand-gold">Price on Request</p>
          ) : (
            cardPrice != null && cardPrice !== '' && (
              <p className="mt-0.5 text-sm font-bold text-brand-blue">
                {typeof cardPrice === 'number' || (typeof cardPrice === 'string' && /^\d/.test(cardPrice.replace(/[₹,\s]/g, '')))
                  ? formatINR(cardPrice)
                  : withRupeeSymbol(cardPrice)}
                {cardPriceSuffix && (
                  <span className="text-xs font-medium text-gray-400 ml-1">
                    {cardPriceSuffix}
                  </span>
                )}
                {cardPriceType === 'negotiable' && (
                  <span className="ml-1.5 text-[9px] font-bold text-brand-gold bg-brand-gold/10 px-1.5 py-0.5 rounded-md">
                    Negotiable
                  </span>
                )}
              </p>
            )
          )}
        </div>

        {/* Location Row */}
        {cardLocation && (
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 min-w-0">
            <i className="fa-solid fa-location-dot text-brand-blue text-[10px] shrink-0" />
            <span className="truncate">
              {cardLocation}
              {cardPincode ? ` · ${cardPincode}` : ''}
            </span>
          </div>
        )}

        {/* Tags Row */}
        {cardTags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1 text-xs text-gray-600 overflow-hidden max-h-[3rem]">
            {cardTags.map((t, i) => (
              t && (
                <span key={i} className="bg-gray-100 rounded-lg px-2 py-0.5 whitespace-nowrap">
                  {t}
                </span>
              )
            ))}
          </div>
        )}

        {/* Sector-specific action children slot */}
        {children && <div className="mt-1.5 overflow-hidden">{children}</div>}

        {/* Details button pinned to bottom */}
        {showButton !== false && (
          <div className="mt-auto pt-2">
            <div className="w-full rounded-lg bg-brand-blue/10 text-brand-blue text-center text-[11px] font-semibold py-1.5 hover:bg-brand-blue hover:text-white transition-colors">
              {buttonText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ListingCard;
