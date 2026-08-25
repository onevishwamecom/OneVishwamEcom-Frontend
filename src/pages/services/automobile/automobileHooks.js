import { vehicleAPI } from '../../../api';
import { createResourceHooks } from '../shared';

const {
  useList: useVehicles,
  useById: useVehicleById,
  useSimilar: useSimilarVehicles,
} = createResourceHooks({
  singular: 'vehicle',
  plural: 'vehicles',
  api: vehicleAPI,
});

export { useVehicles, useVehicleById, useSimilarVehicles };
