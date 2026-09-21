import React from 'react';
import MasterDetailPage from '../../../components/common/templates/MasterDetailPage';

export default function BeddingDetails({ item = null, similarItems = [] }) {
  return (
    <MasterDetailPage
      item={item}
      categoryName="Bedding & Comfort"
      categoryLink="/our-services/bedding-comfort"
      similarItems={similarItems}
      itemLinkPrefix="/bedding/"
      bentoTitle="Product Key Specifications & Mattress Dimensions"
      featuresTitle="Certified Standards & Comfort Features"
    />
  );
}

