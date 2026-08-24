import { propertyAPI } from '../api';
import useCachedData from './useCachedData';
import { CACHE_TTL, deterministicKey } from '../services/cache/cacheService';

function extractProperties(res) {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data?.items)) return res.data.items;
  if (Array.isArray(res?.data?.data?.items)) return res.data.data.items;
  return [];
}

export function useProperties(params = {}) {
  const key = `properties:${deterministicKey(params)}`;
  const { data, loading, error, retry } = useCachedData(
    key,
    () => propertyAPI.getAll(params).then(extractProperties),
    { ttl: CACHE_TTL.products, fallback: [] }
  );

  return { properties: data || [], loading, error, retry };
}

export function usePropertyById(id) {
  const { data, loading, error, retry } = useCachedData(
    `property:item:${id}`,
    () => propertyAPI.getById(id).then((res) => res.data?.data?.property || res.data?.property || res.data?.data || res.data || null),
    { ttl: CACHE_TTL.detail, fallback: null, enabled: !!id }
  );

  return { property: data, loading, error, retry };
}

export function useSimilarProperties(id) {
  const { data, loading, error } = useCachedData(
    `property:similar:${id}`,
    () => propertyAPI.getSimilar(id).then(extractProperties),
    { ttl: CACHE_TTL.similar, fallback: [], enabled: !!id }
  );

  return { similar: data || [], loading, error };
}

export default useProperties;