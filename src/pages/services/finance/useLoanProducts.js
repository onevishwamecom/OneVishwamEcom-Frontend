import { useEffect, useState } from 'react';
import { publicAPI } from '../../../api';
import { enrichLoan } from './loanUtils';

export default function useLoanProducts() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    publicAPI.getLoans()
      .then((res) => {
        if (!cancelled) {
          const raw = res.data?.data?.loans || res.data?.loans || [];
          setLoans(raw.map(enrichLoan));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Loans fetch error:', err);
          const msg = err.response?.data?.message || err.message || 'Failed to load loan products';
          setError(msg.includes('Network Error') ? 'Cannot reach server. Make sure the backend is running on port 5001.' : msg);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { loans, loading, error };
}
