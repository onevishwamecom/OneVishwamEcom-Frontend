import { jewelleryAPI } from '../../../api';
import useCachedData from '../../../hooks/useCachedData';
import { CACHE_TTL, deterministicKey } from '../../../services/cache/cacheService';

function extractData(res) {
  if (Array.isArray(res.data)) return { data: res.data };
  if (Array.isArray(res.data?.data)) return { data: res.data.data };
  if (Array.isArray(res.data?.items)) return { data: res.data.items };
  if (res.data?.data && Array.isArray(res.data.data.items)) return { data: res.data.data.items };
  return { data: [] };
}

export function useJewellery(params = {}) {
  const key = `jewellery:${deterministicKey(params)}`;
  const { data, loading, error } = useCachedData(
    key,
    () => jewelleryAPI.getAll(params).then((res) => extractData(res).data),
    { ttl: CACHE_TTL.products, fallback: [] },
  );
  return { jewellery: data, loading, error };
}

export function useJewelleryById(id) {
  const { data, loading, error } = useCachedData(
    `jewellery:item:${id}`,
    () =>
      jewelleryAPI
        .getById(id)
        .then((res) => res.data?.data?.item || res.data?.item || res.data?.data || null),
    { ttl: CACHE_TTL.detail, fallback: null, enabled: !!id },
  );
  return { jewellery: data, loading, error };
}

export function useSimilarJewellery(id) {
  const { data, loading } = useCachedData(
    `jewellery:similar:${id}`,
    () => jewelleryAPI.getSimilar(id).then((res) => res.data?.data?.items || res.data?.items || []),
    { ttl: CACHE_TTL.similar, fallback: [], enabled: !!id },
  );
  return { similar: data, loading };
}