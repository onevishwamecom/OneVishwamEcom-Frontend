import React from 'react';
import ListingCard from './shared/cards/ListingCard';

/**
 * Universal ProductCard Component
 * Acts as a backward-compatible wrapper around the Master ListingCard.
 */
export const ProductCard = React.memo(function ProductCard(props) {
  return <ListingCard {...props} />;
});

export default ProductCard;
