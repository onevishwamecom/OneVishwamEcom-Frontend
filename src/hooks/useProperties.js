import { useState, useEffect } from 'react';
import { dummyProperties } from '../data/dummyProperties';

export function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setProperties(dummyProperties);
    setLoading(false);
  }, []);

  return { properties, loading, error };
}