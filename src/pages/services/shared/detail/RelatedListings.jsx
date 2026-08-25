import React from 'react';
import ListingCard from '../cards/ListingCard';

/**
 * Universal Related / Similar Listings Section
 */
export default function RelatedListings({
  items = [],
  sector = 'property',
  title = 'Similar Options',
  subtitle = '',
  renderCard,
  className = 'mt-16',
}) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-charcoal">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 4).map((item, idx) => (
          renderCard ? (
            renderCard(item, idx)
          ) : (
            <ListingCard
              key={item._id || item.id || idx}
              item={item}
              sector={sector}
            />
          )
        ))}
      </div>
    </div>
  );
}
