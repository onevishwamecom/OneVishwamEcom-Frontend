import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { dummyAutomobiles } from '../../../data/dummyAutomobiles';
import MasterDetailPage from '../../../components/common/templates/MasterDetailPage';

export default function VehicleDetails() {
  const { pathname } = useLocation();
  const pathParts = pathname.split('/').filter(Boolean);
  const vehicleId = pathParts.length > 1 ? pathParts[1] : null;

  const vehicle = useMemo(() => {
    if (!vehicleId) return null;
    return dummyAutomobiles.find((v) => String(v.id) === String(vehicleId)) || null;
  }, [vehicleId]);

  const similarVehicles = useMemo(() => {
    if (!vehicle) return [];
    return dummyAutomobiles
      .filter((v) => String(v.id) !== String(vehicle.id))
      .slice(0, 6);
  }, [vehicle]);

  return (
    <MasterDetailPage
      item={vehicle}
      categoryName="Automobiles & Vehicles"
      categoryLink="/our-services/automobile"
      similarItems={similarVehicles}
      itemLinkPrefix="/vehicle/"
      bentoTitle="Vehicle Key Specifications & Verified Details"
      featuresTitle="Factory Installed Equipment & Features"
    />
  );
}