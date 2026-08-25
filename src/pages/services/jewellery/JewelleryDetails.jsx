import React from 'react';
import { useJewellery, useJewelleryById, useSimilarJewellery } from './jewelleryHooks';
import { MasterDetailPage } from '../shared';
import JewellerySpecsGrid from './components/JewellerySpecsGrid';
import JewelleryStoreCard from './components/JewelleryStoreCard';
import JewelleryConciergeCard from './components/JewelleryConciergeCard';

/**
 * Jewellery & Gold Detail Page
 * Thin declarative wrapper powered by MasterDetailPage.
 */
export default function JewelleryDetails() {
  return (
    <MasterDetailPage
      sector="jewellery"
      hooks={{
        useItems: useJewellery,
        useItemById: useJewelleryById,
        useSimilarItems: useSimilarJewellery,
      }}
      authTitle="Login to View Jewellery Details"
      authMessage="Please log in or create an account to view carat specifications, certification details, pricing, and certified jeweller info."
      backUrl="/our-services/jewellery-gold"
      backLabel="Back to Jewellery & Gold"
      notFoundMessage="Jewellery not found"
      sidebarSlot={({ item }) => (
        <div className="space-y-6">
          <JewelleryStoreCard store={item.store} />
          <JewelleryConciergeCard />
        </div>
      )}
      specsSlot={({ item }) => (
        <div className="space-y-6">
          <JewellerySpecsGrid item={item} />
        </div>
      )}
    />
  );
}