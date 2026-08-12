import { useState, useEffect } from 'react';
import { dummyJewellery } from '../../../data/dummyJewellery';

export function useJewellery(params = {}) {
  const [jewellery, setJewellery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let filtered = dummyJewellery;
    if (params.category) {
      filtered = filtered.filter(j => j.category === params.category);
    }
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(j => j.name.toLowerCase().includes(search));
    }
    setJewellery(filtered);
    setLoading(false);
  }, [params]);

  return { jewellery, loading, error };
}

export function useJewelleryById(id) {
  const [jewellery, setJewellery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const item = dummyJewellery.find(j => String(j.id) === String(id));
    setJewellery(item);
    setLoading(false);
  }, [id]);

  return { jewellery, loading, error };
}

export function useSimilarJewellery(id) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const item = dummyJewellery.find(j => String(j.id) === String(id));
    if (item) {
      setSimilar(dummyJewellery.filter(j => j.category === item.category && j.id !== item.id).slice(0, 4));
    }
    setLoading(false);
  }, [id]);

  return { similar, loading };
}