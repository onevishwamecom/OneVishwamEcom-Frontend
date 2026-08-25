import { garmentAPI } from '../../../api';
import useCachedData from '../../../hooks/useCachedData';
import { CACHE_TTL, deterministicKey } from '../../../services/cache/cacheService';

function extractGarments(res) {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data?.items)) return res.data.items;
  if (Array.isArray(res?.data?.data?.items)) return res.data.data.items;
  return [];
}

export function useGarments(params = {}) {
  const key = `garments:${deterministicKey(params)}`;
  const { data, loading, error, retry } = useCachedData(
    key,
    () => garmentAPI.getAll(params).then(extractGarments),
    { ttl: CACHE_TTL.products, fallback: [] }
  );

  return { garments: data || [], loading, error, retry };
}

export function useGarmentById(id) {
  const { data, loading, error, retry } = useCachedData(
    `garment:item:${id}`,
    () =>
      garmentAPI
        .getById(id)
        .then(
          (res) =>
            res.data?.data?.item ||
            res.data?.data?.garment ||
            res.data?.item ||
            res.data?.garment ||
            (res.data?.data && typeof res.data.data === 'object' && !res.data.data.item ? res.data.data : null) ||
            res.data ||
            null
        ),
    { ttl: CACHE_TTL.detail, fallback: null, enabled: !!id }
  );

  return { garment: data, loading, error, retry };
}

export function useSimilarGarments(id) {
  const { data, loading, error } = useCachedData(
    `garment:similar:${id}`,
    () => garmentAPI.getSimilar(id).then(extractGarments),
    { ttl: CACHE_TTL.similar, fallback: [], enabled: !!id }
  );

  return { similar: data || [], loading, error };
}
