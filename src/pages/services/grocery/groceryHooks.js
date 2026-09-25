import { useState, useEffect } from 'react';
import { dummyGrocery } from '../../../data/dummyGrocery';

export function useGroceries(params = {}) {
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let filtered = dummyGrocery || [];
    if (params.category && params.category !== 'All') {
      filtered = filtered.filter((g) => g.category === params.category);
    }
    setGroceries(filtered);
    setLoading(false);
  }, [params.category]);

  return { groceries, loading, error };
}

export function useGroceryById(id) {
  const [grocery, setGrocery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const item = (dummyGrocery || []).find((g) => String(g.id) === String(id));
    setGrocery(item);
    setLoading(false);
  }, [id]);

  return { grocery, loading, error };
}

export function useSimilarGroceries(id) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const item = (dummyGrocery || []).find((g) => String(g.id) === String(id));
    if (item) {
      setSimilar((dummyGrocery || []).filter((g) => g.category === item.category && g.id !== item.id).slice(0, 4));
    }
    setLoading(false);
  }, [id]);

  return { similar, loading };
}

