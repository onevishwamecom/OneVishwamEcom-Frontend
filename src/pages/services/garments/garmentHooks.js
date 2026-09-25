import { useState, useEffect } from 'react';
import { dummyGarments } from '../../../data/dummyGarments';

export function useGarments(params = {}) {
  const [garments, setGarments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let filtered = dummyGarments || [];
    if (params.category && params.category !== 'All') {
      filtered = filtered.filter((g) => g.category === params.category);
    }
    setGarments(filtered);
    setLoading(false);
  }, [params.category]);

  return { garments, loading, error };
}

export function useGarmentById(id) {
  const [garment, setGarment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const item = (dummyGarments || []).find((g) => String(g.id) === String(id));
    setGarment(item);
    setLoading(false);
  }, [id]);

  return { garment, loading, error };
}

export function useSimilarGarments(id) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const item = (dummyGarments || []).find((g) => String(g.id) === String(id));
    if (item) {
      setSimilar((dummyGarments || []).filter((g) => g.category === item.category && g.id !== item.id).slice(0, 4));
    }
    setLoading(false);
  }, [id]);

  return { similar, loading };
}

