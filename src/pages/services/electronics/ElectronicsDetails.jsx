import React from 'react';
import MasterDetailPage from '../../../components/common/templates/MasterDetailPage';

export default function ElectronicsDetails({ item = null, similarItems = [] }) {
  return (
    <MasterDetailPage
      item={item}
      categoryName="Consumer Electronics"
      categoryLink="/electronics"
      similarItems={similarItems}
      itemLinkPrefix="/electronics/"
      bentoTitle="Product Key Specifications & Verified Details"
      featuresTitle="Certified Standards & Included Features"
    />
  );
}

