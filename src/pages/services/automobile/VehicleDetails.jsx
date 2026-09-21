import React, { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useVehicleById, useSimilarVehicles } from './automobileHooks';
import MasterDetailPage from '../../../components/common/templates/MasterDetailPage';
import { mapVehicleToEntityItem } from '../../../components/common/templates/adapters';

export default function VehicleDetails() {
  const { pathname } = useLocation();
  const params = useParams();
  const pathParts = pathname.split('/').filter(Boolean);
  const vehicleId = params.id || (pathParts.length > 1 ? pathParts[1] : null);

  const { vehicle, loading, error } = useVehicleById(vehicleId);
  const { similar } = useSimilarVehicles(vehicleId);

  const mappedVehicle = useMemo(() => {
    if (!vehicle) return null;
    return mapVehicleToEntityItem(vehicle);
  }, [vehicle]);

  const mappedSimilar = useMemo(() => {
    if (!similar || !Array.isArray(similar)) return [];
    return similar.map(mapVehicleToEntityItem).filter(Boolean);
  }, [similar]);

  return (
    <MasterDetailPage
      item={mappedVehicle}
      categoryName="Automobiles & Vehicles"
      categoryLink="/our-services/automobile"
      similarItems={mappedSimilar}
      itemLinkPrefix="/vehicle/"
      loading={loading}
      error={error}
      bentoTitle="Vehicle Key Specifications & Verified Details"
      featuresTitle="Factory Installed Equipment & Features"
    />
  );
}