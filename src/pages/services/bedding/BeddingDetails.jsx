import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { dummyBedding } from '../../../data/dummyBedding';
import MasterDetailPage from '../../../components/common/templates/MasterDetailPage';

export default function BeddingDetails() {
  const { pathname } = useLocation();
  const pathParts = pathname.split('/').filter(Boolean);
  const itemId = pathParts.length > 1 ? pathParts[1] : null;

  const item = useMemo(() => {
    if (!itemId) return null;
    return dummyBedding.find((b) => String(b.id) === String(itemId)) || null;
  }, [itemId]);

  const similarBedding = useMemo(() => {
    if (!item) return [];
    return dummyBedding
      .filter((b) => String(b.id) !== String(item.id))
      .slice(0, 6);
  }, [item]);

  return (
    <MasterDetailPage
      item={item}
      categoryName="Bedding & Comfort"
      categoryLink="/our-services/bedding-comfort"
      similarItems={similarBedding}
      itemLinkPrefix="/bedding/"
      bentoTitle="Product Key Specifications & Mattress Dimensions"
      featuresTitle="Certified Standards & Comfort Features"
    />
  );
}

