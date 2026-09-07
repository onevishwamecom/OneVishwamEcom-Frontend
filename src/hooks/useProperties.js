import { propertyAPI } from '../api';
import useCachedData from './useCachedData';
import { CACHE_TTL, deterministicKey } from '../services/cache/cacheService';

import { getTotalPropertyPrice, parsePriceRange } from '../pages/services/property/propertyHelpers';

function extractProperties(res) {
  let list = [];
  if (Array.isArray(res?.data)) list = res.data;
  else if (Array.isArray(res?.data?.data)) list = res.data.data;
  else if (Array.isArray(res?.data?.items)) list = res.data.items;
  else if (Array.isArray(res?.data?.data?.items)) list = res.data.data.items;
  
  return list.map((p) => ({
    ...p,
    calculatedTotalAmount: getTotalPropertyPrice(p),
    priceRange: parsePriceRange(p),
  }));
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
    () =>
      propertyAPI
        .getById(id)
        .then(
          (res) =>
            res.data?.data?.item ||
            res.data?.data?.property ||
            res.data?.item ||
            res.data?.property ||
            (res.data?.data && typeof res.data.data === 'object' && !res.data.data.item ? res.data.data : null) ||
            res.data ||
            null
        ),
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