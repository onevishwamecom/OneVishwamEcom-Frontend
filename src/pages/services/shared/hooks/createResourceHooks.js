import useCachedData from '../../../../hooks/useCachedData';
import { CACHE_TTL, deterministicKey } from '../../../../services/cache/cacheService';

function extractList(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data?.items)) return res.data.items;
  if (Array.isArray(res?.data?.data?.items)) return res.data.data.items;
  return [];
}

function extractDetail(res) {
  if (!res) return null;
  return (
    res.data?.data?.item ||
    res.data?.data?.electronic ||
    res.data?.data?.bedding ||
    res.data?.data?.property ||
    res.data?.data?.vehicle ||
    res.data?.data?.garment ||
    res.data?.data?.grocery ||
    res.data?.data?.jewellery ||
    res.data?.item ||
    res.data?.electronic ||
    res.data?.bedding ||
    res.data?.vehicle ||
    res.data?.property ||
    res.data?.garment ||
    res.data?.grocery ||
    res.data?.jewellery ||
    (res.data?.data && typeof res.data.data === 'object' && !Array.isArray(res.data.data) ? res.data.data : null) ||
    res.data ||
    res
  );
}

/**
 * Creates standardized API resource hooks for list, detail, and similar items.
 */
async function fetchAllList(api, params = {}) {
  const queryParams = { limit: 1000, ...params };
  const firstRes = await api.getAll(queryParams);
  const items = [...extractList(firstRes)];

  // If caller explicitly requested a specific page, return just that page
  if (params && params.page !== undefined && params.page !== null) {
    return items;
  }

  // Check pagination envelope to see if more pages exist
  const pagination =
    firstRes?.data?.pagination ||
    firstRes?.data?.data?.pagination ||
    firstRes?.pagination;

  if (pagination && pagination.totalPages > 1 && (pagination.page === 1 || !pagination.page)) {
    const pageLimit = pagination.limit || 100;
    const pagePromises = [];
    for (let p = 2; p <= pagination.totalPages; p++) {
      pagePromises.push(
        api
          .getAll({ ...queryParams, page: p, limit: pageLimit })
          .then(extractList)
          .catch((err) => {
            console.error('Failed to fetch page ' + p + ':', err);
            return [];
          })
      );
    }
    const subsequentPages = await Promise.all(pagePromises);
    for (const pageItems of subsequentPages) {
      if (Array.isArray(pageItems)) {
        items.push(...pageItems);
      }
    }
  }

  // Deduplicate items across pages by unique identifier (_id / id)
  const seenIds = new Set();
  const uniqueItems = [];
  for (const it of items) {
    if (!it) continue;
    const id = String(it._id || it.id || '');
    if (id) {
      if (seenIds.has(id)) continue;
      seenIds.add(id);
    }
    uniqueItems.push(it);
  }

  return uniqueItems;
}

export function createResourceHooks({
  singular,
  plural,
  api,
  listFallback = [],
  detailFallback = null,
}) {
  const useList = (params = {}) => {
    const key = `${plural}:${deterministicKey(params)}`;
    const { data, loading, error, retry } = useCachedData(
      key,
      () => fetchAllList(api, params),
      { ttl: CACHE_TTL.products, fallback: listFallback }
    );
    const list = data || listFallback;
    return {
      [plural]: list,
      items: list,
      data: list,
      loading,
      error,
      retry,
    };
  };

  const useById = (id) => {
    const { data, loading, error, retry } = useCachedData(
      `${singular}:item:${id}`,
      () => api.getById(id).then(extractDetail),
      { ttl: CACHE_TTL.detail, fallback: detailFallback, enabled: !!id }
    );
    const itemData = data || detailFallback;
    return {
      [singular]: itemData,
      item: itemData,
      data: itemData,
      loading,
      error,
      retry,
    };
  };

  const useSimilar = (id) => {
    const { data, loading, error } = useCachedData(
      `${singular}:similar:${id}`,
      () => (api.getSimilar ? api.getSimilar(id).then(extractList) : Promise.resolve([])),
      { ttl: CACHE_TTL.similar, fallback: [], enabled: !!id }
    );
    return { similar: data || [], loading, error };
  };

  return { useList, useById, useSimilar };
}

export default createResourceHooks;
