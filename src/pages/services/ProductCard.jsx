import React from 'react';
import ListingCard from './shared/cards/ListingCard';

/**
 * Universal ProductCard Component
 * Acts as a backward-compatible wrapper around the Master ListingCard.
 */
export const ProductCard = React.memo(function ProductCard(props) {
  const filteredTags = props.tags?.filter(
    (t) => t && String(t).trim().toLowerCase() !== 'plots' && String(t).trim().toLowerCase() !== 'plot'
  );

  return <ListingCard {...props} tags={filteredTags} />;
});

export default ProductCard;
