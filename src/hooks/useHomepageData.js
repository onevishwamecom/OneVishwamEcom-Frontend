import { useEffect, useState, useCallback } from 'react';
import { homepageAPI } from '../api';
import cache, { PUBLIC_NAMESPACE } from '../services/cache/cacheService';

const CACHE_KEY = 'homepage_data';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Homepage data hook with central cacheService strategy.
 *
 * Flow:
 * 1. Check cacheService namespace → if valid, render immediately
 * 2. Fetch fresh data or use deduplicated concurrent request
 * 3. Update cacheService + UI
 */
export function useHomepageData() {
  const [data, setData] = useState(() => {
    const record = cache.get(PUBLIC_NAMESPACE, CACHE_KEY);
    return record ? record.data : null;
  });
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (force = true) => {
    try {
      const fetcher = async () => {
        const { data: res } = await homepageAPI.getHomepageData();
        return res.data;
      };

      const result = await cache.fetch(PUBLIC_NAMESPACE, CACHE_KEY, fetcher, {
        force: true,
        ttl: CACHE_TTL,
      });

      setData(result.data);
      setError(null);
    } catch (err) {
      if (!data) {
        setError(err.response?.data?.message || 'Failed to load homepage data');
      }
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    fetch(true);
  }, [fetch]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetch(true);
  }, [fetch]);

  return { data, loading, error, refresh };
}