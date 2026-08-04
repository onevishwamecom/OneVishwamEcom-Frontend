import { useState, useEffect } from 'react';
import { jewelleryAPI } from '../../../api';

function extractData(res) {
  if (Array.isArray(res.data)) return { data: res.data };
  if (Array.isArray(res.data?.data)) return { data: res.data.data };
  if (Array.isArray(res.data?.items)) return { data: res.data.items };
  if (res.data?.data && Array.isArray(res.data.data.items)) return { data: res.data.data.items };
  return { data: [] };
}

export function useJewellery(params = {}) {
  const [jewellery, setJewellery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    jewelleryAPI.getAll(params)
      .then((res) => {
        if (cancelled) return;
        const { data } = extractData(res);
        setJewellery(data);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[useJewellery] Fetch error:', err?.response?.data || err?.message || err);
          const msg = err?.response?.data?.message || err?.message || 'Failed to load jewellery';
          setError(msg.includes('Network Error') ? 'Cannot reach server. Make sure the backend is running on port 5001.' : msg);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [params]);

  return { jewellery, loading, error };
}

export function useJewelleryById(id) {
  const [jewellery, setJewellery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    jewelleryAPI.getById(id)
      .then((res) => {
        if (cancelled) return;
        const item = res.data?.data?.item || res.data?.item || res.data?.data;
        setJewellery(item);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[useJewelleryById] Fetch error:', err?.response?.data || err?.message || err);
          const msg = err?.response?.data?.message || err?.message || 'Failed to load jewellery';
          setError(msg.includes('Network Error') ? 'Cannot reach server. Make sure the backend is running on port 5001.' : msg);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  return { jewellery, loading, error };
}

export function useSimilarJewellery(id) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    jewelleryAPI.getSimilar(id)
      .then((res) => {
        if (cancelled) return;
        const items = res.data?.data?.items || res.data?.items || [];
        setSimilar(items);
      })
      .catch((err) => {
        console.error('[useSimilarJewellery] Fetch error:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  return { similar, loading };
}