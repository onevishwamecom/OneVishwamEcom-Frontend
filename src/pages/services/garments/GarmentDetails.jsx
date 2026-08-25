import React from 'react';
import { useGarments, useGarmentById, useSimilarGarments } from './garmentHooks';
import { MasterDetailPage } from '../shared';
import GarmentSpecsGrid from './components/GarmentSpecsGrid';
import GarmentStoreCard from './components/GarmentStoreCard';
import GarmentPriceSummaryCard from './components/GarmentPriceSummaryCard';

/**
 * Garments & Fashion Detail Page
 * Thin declarative wrapper powered by MasterDetailPage.
 */
export default function GarmentDetails() {
  return (
    <MasterDetailPage
      sector="garments"
      hooks={{
        useItems: useGarments,
        useItemById: useGarmentById,
        useSimilarItems: useSimilarGarments,
      }}
      authTitle="Login to View Garment Details"
      authMessage="Please log in or create an account to view available sizes, fabrics, pricing, colors, and order options."
      backUrl="/our-services/garments-fashion-lifestyle"
      backLabel="Back to Garments & Fashion"
      notFoundMessage="Garment not found"
      sidebarSlot={({ item }) => (
        <div className="space-y-6">
          <GarmentStoreCard store={item.store} />
          <GarmentPriceSummaryCard item={item} />
        </div>
      )}
      specsSlot={({ item }) => (
        <div className="space-y-6">
          <GarmentSpecsGrid item={item} />
        </div>
      )}
    />
  );
}
