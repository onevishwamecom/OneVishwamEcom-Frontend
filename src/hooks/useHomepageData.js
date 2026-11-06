import { useEffect, useState, useCallback, useRef } from 'react';
import { homepageAPI } from '../api';
import cache, { PUBLIC_NAMESPACE } from '../services/cache/cacheService';
import { isHomepageStale, clearHomepageStale, MATCH_EVENT_NAME } from '../utils/matchEvents';

const CACHE_KEY = 'homepage_data';
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes cache (prevents repetitive homepage refetches)

function stripSoldOut(items) {
  if (!Array.isArray(items)) return [];
  return items.filter((item) => {
    if (!item) return false;
    const st = String(item.availabilityStatus || '').toLowerCase();
    return st !== 'sold_out' && st !== 'sold' && st !== 'out_of_stock' && item.isSoldOut !== true;
  });
}

function sanitizeHomepageData(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  return {
    ...raw,
    latestProperties: stripSoldOut(raw.latestProperties),
    featuredProperties: stripSoldOut(raw.featuredProperties),
    latestVehicles: stripSoldOut(raw.latestVehicles),
    latestGroceries: stripSoldOut(raw.latestGroceries),
    latestGarments: stripSoldOut(raw.latestGarments),
    latestJewellery: stripSoldOut(raw.latestJewellery),
    latestFinance: stripSoldOut(raw.latestFinance),
    financeOfferings: stripSoldOut(raw.financeOfferings),
    featured: stripSoldOut(raw.featured),
  };
}

export function useHomepageData() {
  const [data, setData] = useState(() => {
    const record = cache.get(PUBLIC_NAMESPACE, CACHE_KEY);
    return record ? sanitizeHomepageData(record.data) : null;
  });
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(null);

  const dataRef = useRef(data);
  dataRef.current = data;

  const fetch = useCallback(async (force = false) => {
    try {
      const fetcher = async () => {
        const { data: res } = await homepageAPI.getHomepageData();
        return sanitizeHomepageData(res.data);
      };

      const result = await cache.fetch(PUBLIC_NAMESPACE, CACHE_KEY, fetcher, {
        force: Boolean(force),
        ttl: CACHE_TTL,
      });

      setData(sanitizeHomepageData(result.data));
      setError(null);
    } catch (err) {
      if (!dataRef.current) {
        setError(err.response?.data?.message || 'Failed to load homepage data');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleMatchEvent = () => {
      fetch(true);
    };
    window.addEventListener(MATCH_EVENT_NAME, handleMatchEvent);

    if (isHomepageStale()) {
      fetch(true);
    } else {
      fetch(false);
    }

    return () => {
      window.removeEventListener(MATCH_EVENT_NAME, handleMatchEvent);
    };
  }, [fetch]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetch(true);
  }, [fetch]);

  return { data, loading, error, refresh };
}