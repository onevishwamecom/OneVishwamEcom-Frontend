import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { dummyElectronics } from '../../../data/dummyElectronics';
import MasterDetailPage from '../../../components/common/templates/MasterDetailPage';

export default function ElectronicsDetails() {
  const { pathname } = useLocation();
  const pathParts = pathname.split('/').filter(Boolean);
  const itemId = pathParts.length > 1 ? pathParts[1] : null;

  const item = useMemo(() => {
    if (!itemId) return null;
    return dummyElectronics.find((e) => String(e.id) === String(itemId)) || null;
  }, [itemId]);

  const similarElectronics = useMemo(() => {
    if (!item) return [];
    return dummyElectronics
      .filter((e) => String(e.id) !== String(item.id))
      .slice(0, 6);
  }, [item]);

  return (
    <MasterDetailPage
      item={item}
      categoryName="Consumer Electronics"
      categoryLink="/our-services/consumer-electronics"
      similarItems={similarElectronics}
      itemLinkPrefix="/electronics/"
      bentoTitle="Product Key Specifications & Verified Details"
      featuresTitle="Certified Standards & Included Features"
    />
  );
}

