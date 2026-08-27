import React, { useState } from 'react';
import { navigateTo } from '../../../config/navigation';
import { useAuth } from '../../../store/authSlice';
import { formatINR, withRupeeSymbol } from '../../../utils/priceUtils';
import {
  getPropertyTypeLabel,
  getDetailTags,
  getStatusBadge,
  getPropertyCoverImage,
} from './propertyHelpers';

const FALLBACK_IMG =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="none"><rect width="400" height="300" fill="#f3f4f6"/><path fill="#9ca3af" d="M160 130h80v-10l-40-40-40 40v10zm-20 50h120v-60l-40-40-80 80v20z"/></svg>`,
  );

const EMPTY_ARRAY = [];

function PropertyCardImpl({ property }) {
  const [imgError, setImgError] = useState(false);
  const { isLoggedIn, openAuthModal } = useAuth();

  if (!property) return null;

  const id = property._id || property.id;
  const link = id ? `/property/${id}` : '#';
  const image = getPropertyCoverImage(property);
  const title = property.title || property.name || 'Property';
  const typeLabel = getPropertyTypeLabel(property);
  const tags = (getDetailTags(property) || []).slice(0, 2);
  const badge = getStatusBadge(property);

  const badges = [
    ...(property.recentlyAdded
      ? [{ label: 'New', className: 'bg-emerald-500 text-white' }]
      : []),
    ...(badge ? [{ label: badge.label, className: badge.cls }] : []),
  ];

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

  const cardTags = [typeLabel, ...tags].filter(Boolean);

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-gray-200/80 overflow-hidden hover:border-brand-blue/40 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col cursor-pointer h-full"
    >
      {/* 4:3 Image Stage */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 shrink-0">
        {image && !imgError ? (
          <img
            src={image}
            alt={title}
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

        {badges.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10">
            {badges.map((b, i) => (
              <span
                key={i}
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-2xs backdrop-blur-xs ${b.className}`}
              >
                {b.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <div className="min-h-[2.5rem] flex items-start">
          <h3 className="font-bold text-brand-charcoal text-sm leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">
            {title}
          </h3>
        </div>

        {/* Price */}
        <div className="min-h-[1.5rem] my-1">
          {property.priceType === 'on-request' ? (
            <p className="text-base font-extrabold text-brand-gold">Price on Request</p>
          ) : (
            property.price != null && property.price !== '' && (
              <p className="text-base font-extrabold text-brand-blue">
                {typeof property.price === 'number' ||
                (typeof property.price === 'string' &&
                  /^\d/.test(property.price.replace(/[₹,\s]/g, '')))
                  ? formatINR(property.price)
                  : withRupeeSymbol(property.price)}
                {property.priceSuffix && (
                  <span className="text-xs font-normal text-gray-400 ml-1">
                    {property.priceSuffix}
                  </span>
                )}
                {property.priceType === 'negotiable' && (
                  <span className="ml-1.5 text-[9px] font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full">
                    Negotiable
                  </span>
                )}
              </p>
            )
          )}
        </div>

        {/* Location */}
        {(property.location || property.city) && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
            <i className="fa-solid fa-location-dot text-brand-blue text-[11px] shrink-0" />
            <span className="truncate font-medium">
              {property.location || property.city}
              {property.pincode ? ` · ${property.pincode}` : ''}
            </span>
          </div>
        )}

        {/* Tags */}
        {cardTags.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1 text-[11px] text-gray-600 overflow-hidden max-h-[3rem]">
            {cardTags.map((t, i) => (
              <span
                key={i}
                className="bg-gray-100/80 rounded-md px-2 py-0.5 font-medium whitespace-nowrap"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Agent / extras */}
        {(property.agent || property.extraRoom) && (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500">
            {property.agent && (
              <span>
                <i className="fa-solid fa-user mr-1 text-gray-400" />
                {property.agent.name}
              </span>
            )}
            {property.extraRoom && (
              <span>
                <i className="fa-solid fa-star mr-1 text-gray-400" />
                {property.extraRoom}
              </span>
            )}
          </div>
        )}

        {/* Loan badge */}
        {property.loanApproved && (
          <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 w-fit">
            <i className="fa-solid fa-circle-check text-[10px] text-emerald-600" />
            <span className="text-[10px] font-semibold text-emerald-700">
              100% Pre‑Approved Loan
            </span>
          </div>
        )}

        {/* View Details */}
        <div className="mt-auto pt-3">
          <div className="w-full rounded-xl bg-gray-50 border border-gray-100 group-hover:bg-brand-blue group-hover:text-white group-hover:border-brand-blue text-brand-charcoal text-center text-xs font-bold py-2.5 transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs">
            <span>View Details</span>
            <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}

const PropertyCard = React.memo(PropertyCardImpl);
export default PropertyCard;
