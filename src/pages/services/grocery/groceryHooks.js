import { groceryAPI } from '../../../api';
import useCachedData from '../../../hooks/useCachedData';
import { CACHE_TTL, deterministicKey } from '../../../services/cache/cacheService';

function extractGroceries(res) {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data?.items)) return res.data.items;
  if (Array.isArray(res?.data?.data?.items)) return res.data.data.items;
  return [];
}

export function useGroceries(params = {}) {
  const key = `groceries:${deterministicKey(params)}`;
  const { data, loading, error, retry } = useCachedData(
    key,
    () => groceryAPI.getAll(params).then(extractGroceries),
    { ttl: CACHE_TTL.products, fallback: [] }
  );

  return { groceries: data || [], loading, error, retry };
}

export function useGroceryById(id) {
  const { data, loading, error, retry } = useCachedData(
    `grocery:item:${id}`,
    () =>
      groceryAPI
        .getById(id)
        .then(
          (res) =>
            res.data?.data?.item ||
            res.data?.data?.grocery ||
            res.data?.item ||
            res.data?.grocery ||
            (res.data?.data && typeof res.data.data === 'object' && !res.data.data.item ? res.data.data : null) ||
            res.data ||
            null
        ),
    { ttl: CACHE_TTL.detail, fallback: null, enabled: !!id }
  );

  return { grocery: data, loading, error, retry };
}

export function useSimilarGroceries(id) {
  const { data, loading, error } = useCachedData(
    `grocery:similar:${id}`,
    () => groceryAPI.getSimilar(id).then(extractGroceries),
    { ttl: CACHE_TTL.similar, fallback: [], enabled: !!id }
  );

  return { similar: data || [], loading, error };
}
