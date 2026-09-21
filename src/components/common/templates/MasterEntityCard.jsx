import React from 'react';
import CategoryListingCard from './CategoryListingCard';

/**
 * MasterEntityCard:
 * Unified card component implementing the single source of truth Real Estate card topology.
 * Maps entity props to CategoryListingCard.
 */
export default React.memo(function MasterEntityCard({
  entity,
  link,
  onSelect,
  children,
  ...props
}) {
  if (!entity) return null;
  const targetLink =
    link ||
    (entity.categorySlug
      ? `/${entity.categorySlug}/${entity.id}`
      : entity.category === 'SUV' || entity.fuelType
      ? `/vehicle/${entity.id}`
      : `/property/${entity.id}`);

  return (
    <CategoryListingCard
      item={entity}
      link={targetLink}
      onSelect={onSelect}
      {...props}
    >
      {children}
    </CategoryListingCard>
  );
});

