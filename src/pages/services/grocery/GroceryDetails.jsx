import React from 'react';
import { useGroceries, useGroceryById, useSimilarGroceries } from './groceryHooks';
import { MasterDetailPage } from '../shared';
import GroceryOrderSection from './components/GroceryOrderSection';
import GroceryCertifications from './components/GroceryCertifications';
import GroceryVendorCard from './components/GroceryVendorCard';

/**
 * Grocery & Daily Needs Detail Page
 * Thin declarative wrapper powered by MasterDetailPage.
 */
export default function GroceryDetails() {
  return (
    <MasterDetailPage
      sector="grocery"
      hooks={{
        useItems: useGroceries,
        useItemById: useGroceryById,
        useSimilarItems: useSimilarGroceries,
      }}
      authTitle="Login to View Grocery Details"
      authMessage="Please log in or create an account to view fresh batch availability, nutritional info, pricing, and order options."
      backUrl="/our-services/consumer-marketplace"
      backLabel="Back to Groceries & Daily Needs"
      notFoundMessage="Grocery item not found"
      sidebarSlot={({ item }) => <GroceryVendorCard item={item} />}
      specsSlot={({ item }) => (
        <div className="space-y-6">
          <GroceryOrderSection item={item} />
          <GroceryCertifications item={item} />
        </div>
      )}
    />
  );
}
