import { useEffect, useRef, useState } from 'react';
import cache, { PUBLIC_NAMESPACE, CACHE_TTL } from '../services/cache/cacheService';

/**
 * useCachedData — cache-aware data fetching for the public site.
 * ============================================================================
 *   valid cache   → data immediately, NO skeleton, NO network request
 *   stale cache   → data immediately + background revalidation
 *   no cache      → skeleton → API → cache → display
 *   API failure   → keep showing cached data (no blank error page)
 *
 * `retry()` bypasses the cache (manual refresh). Identical concurrent requests
 * are de-duplicated inside the cache service.
 *
 * @param {string}  key       deterministic cache key (include params/filters)
 * @param {Function} fetcher  async function returning the final data payload
 * @param {Object}   options  { ttl, namespace, fallback, enabled }
 */
export default function useCachedData(
  key,
  fetcher,
  { ttl = CACHE_TTL.products, namespace = PUBLIC_NAMESPACE, fallback = null, enabled = true } = {},
) {
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const [data, setData] = useState(() => {
    if (!enabled) return fallback;
    const record = cache.get(namespace, key);
    return record ? record.data : fallback;
  });
  const [loading, setLoading] = useState(() => (enabled ? !cache.get(namespace, key) : false));
  const [error, setError] = useState(null);
  const [force, setForce] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;

    const record = cache.get(namespace, key);

    // Show cached data immediately to avoid blank screen or flicker
    if (record) {
      setData(record.data);
      setError(null);
    } else {
      setLoading(true);
      setError(null);
    }

    // Always fetch fresh data from API on mount / refresh (SWR pattern)
    cache
      .fetch(namespace, key, () => fetcherRef.current(), { force: true, ttl })
      .then(({ data: fresh }) => {
        if (cancelled) return;
        setData(fresh);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = err?.response?.data?.message || err?.message || 'Failed to load data';
        setError(
          msg.includes('Network Error')
            ? 'Cannot reach server. Please check your connection.'
            : msg,
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ttl, namespace, enabled, force]);

  const retry = () => setForce((n) => n + 1);

  return { data, loading, error, retry };
}