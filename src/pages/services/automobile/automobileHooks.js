import { vehicleAPI } from '../../../api';
import useCachedData from '../../../hooks/useCachedData';
import { CACHE_TTL, deterministicKey } from '../../../services/cache/cacheService';

function extractVehicles(res) {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data?.items)) return res.data.items;
  if (Array.isArray(res?.data?.data?.items)) return res.data.data.items;
  return [];
}

export function useVehicles(params = {}) {
  const key = `vehicles:${deterministicKey(params)}`;
  const { data, loading, error, retry } = useCachedData(
    key,
    () => vehicleAPI.getAll(params).then(extractVehicles),
    { ttl: CACHE_TTL.products, fallback: [] }
  );

  return { vehicles: data || [], loading, error, retry };
}

export function useVehicleById(id) {
  const { data, loading, error, retry } = useCachedData(
    `vehicle:item:${id}`,
    () => vehicleAPI.getById(id).then((res) => res.data?.data?.vehicle || res.data?.vehicle || res.data?.data || res.data || null),
    { ttl: CACHE_TTL.detail, fallback: null, enabled: !!id }
  );

  return { vehicle: data, loading, error, retry };
}

export function useSimilarVehicles(id) {
  const { data, loading, error } = useCachedData(
    `vehicle:similar:${id}`,
    () => vehicleAPI.getSimilar(id).then(extractVehicles),
    { ttl: CACHE_TTL.similar, fallback: [], enabled: !!id }
  );

  return { similar: data || [], loading, error };
}
