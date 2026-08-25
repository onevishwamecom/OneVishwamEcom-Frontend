import React from 'react';
import { useVehicles, useVehicleById, useSimilarVehicles } from './automobileHooks';
import { MasterDetailPage } from '../shared';
import VehicleSpecsGrid from './components/VehicleSpecsGrid';
import VehicleShowroomCard from './components/VehicleShowroomCard';
import VehicleLoanCard from './components/VehicleLoanCard';
import VehicleContactCard from './components/VehicleContactCard';

/**
 * Automobile / Vehicle Detail Page
 * Thin declarative wrapper powered by MasterDetailPage.
 */
export default function VehicleDetails() {
  return (
    <MasterDetailPage
      sector="automobile"
      hooks={{
        useItems: useVehicles,
        useItemById: useVehicleById,
        useSimilarItems: useSimilarVehicles,
      }}
      authTitle="Login to View Vehicle Details"
      authMessage="Please log in or create an account to view full vehicle specifications, pricing, seller contacts, and test drive booking options."
      backUrl="/our-services/automobile"
      backLabel="Back to Vehicles"
      notFoundMessage="Vehicle not found"
      sidebarSlot={({ item }) => (
        <div className="space-y-4">
          <VehicleShowroomCard showroom={item.showroom} />
          <VehicleLoanCard loanApproved={item.loanApproved} />
          <VehicleContactCard />
        </div>
      )}
      specsSlot={({ item }) => (
        <div className="space-y-6">
          <VehicleSpecsGrid vehicle={item} />
        </div>
      )}
    />
  );
}