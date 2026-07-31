import { useState, useEffect } from 'react';
import { propertyAPI } from '../api';

function extractData(res) {
  if (Array.isArray(res.data)) return { data: res.data };
  if (Array.isArray(res.data?.data)) return { data: res.data.data };
  if (Array.isArray(res.data?.properties)) return { data: res.data.properties };
  if (Array.isArray(res.data?.results)) return { data: res.data.results };
  if (Array.isArray(res.data?.items)) return { data: res.data.items };
  if (res.data?.data && Array.isArray(res.data.data.items)) return { data: res.data.data.items };
  if (res.data?.data && Array.isArray(res.data.data.properties)) return { data: res.data.data.properties };
  if (res.data?.data && Array.isArray(res.data.data.data)) return { data: res.data.data.data };
  if (res.data?.data?.data && Array.isArray(res.data.data.data.data)) return { data: res.data.data.data.data };
  if (res.data?.data?.data?.data && Array.isArray(res.data.data.data.data.data)) return { data: res.data.data.data.data.data };
  return { data: [] };
}

export function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    propertyAPI.getAll()
      .then((res) => {
        if (cancelled) return;
        const { data } = extractData(res);
        setProperties(data);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[useProperties] Fetch error:', err?.response?.data || err?.message || err);
          const msg = err?.response?.data?.message || err?.message || 'Failed to load properties';
          setError(msg.includes('Network Error') ? 'Cannot reach server. Make sure the backend is running on port 5001.' : msg);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { properties, loading, error };
}
