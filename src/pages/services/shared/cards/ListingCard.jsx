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
      className="group bg-white rounded-2xl border border-gray-200/80 overflow-hidden hover:border-brand-blue/40 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col cursor-pointer h-full"
    >
      {/* 4:3 Aspect Ratio Image Stage */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 shrink-0">
        {cardImage && !imgError ? (
          <img
            src={cardImage}
            alt={cardAlt}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <img
            src={FALLBACK_IMG}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}

        {/* Badges Overlay */}
        {cardBadges.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10">
            {cardBadges.map((b, i) => (
              <span
                key={i}
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur-xs ${b.className}`}
              >
                {b.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Overline */}
        {cardOverline && (
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 truncate">
            {cardOverline}
          </p>
        )}

        {/* Title — Fixed height line clamp */}
        <div className="min-h-[2.5rem] flex items-start">
          {cardTitle && (
            <h3 className="font-bold text-brand-charcoal text-sm leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">
              {cardTitle}
            </h3>
          )}
        </div>

        {/* Price Row */}
        <div className="min-h-[1.5rem] my-1">
          {priceOverride ? (
            <div className="mt-0.5">{priceOverride}</div>
          ) : cardPriceType === 'on-request' ? (
            <p className="text-sm font-bold text-brand-gold">Price on Request</p>
          ) : (
            cardPrice != null && cardPrice !== '' && (
              <p className="text-base font-extrabold text-brand-blue">
                {typeof cardPrice === 'number' || (typeof cardPrice === 'string' && /^\d/.test(cardPrice.replace(/[₹,\s]/g, '')))
                  ? formatINR(cardPrice)
                  : withRupeeSymbol(cardPrice)}
                {cardPriceSuffix && (
                  <span className="text-xs font-normal text-gray-400 ml-1">
                    {cardPriceSuffix}
                  </span>
                )}
                {cardPriceType === 'negotiable' && (
                  <span className="ml-1.5 text-[9px] font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full">
                    Negotiable
                  </span>
                )}
              </p>
            )
          )}
        </div>

        {/* Location Row */}
        {cardLocation && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
            <i className="fa-solid fa-location-dot text-brand-blue text-[11px] shrink-0" />
            <span className="truncate font-medium">
              {cardLocation}
              {cardPincode ? ` · ${cardPincode}` : ''}
            </span>
          </div>
        )}

        {/* Tags Row */}
        {cardTags.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1 text-[11px] text-gray-600 overflow-hidden max-h-[3rem]">
            {cardTags.map((t, i) => (
              t && (
                <span key={i} className="bg-gray-100/80 rounded-md px-2 py-0.5 font-medium whitespace-nowrap">
                  {t}
                </span>
              )
            ))}
          </div>
        )}

        {/* Sector-specific action children slot */}
        {children && <div className="mt-2 overflow-hidden">{children}</div>}

        {/* Details button pinned to bottom */}
        {showButton !== false && (
          <div className="mt-auto pt-3">
            <div className="w-full rounded-xl bg-gray-50 border border-gray-100 group-hover:bg-brand-blue group-hover:text-white group-hover:border-brand-blue text-brand-charcoal text-center text-xs font-bold py-2.5 transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs">
              <span>{buttonText}</span>
              <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ListingCard;
