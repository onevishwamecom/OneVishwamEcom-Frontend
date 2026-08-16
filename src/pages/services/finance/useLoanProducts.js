import { publicAPI } from '../../../api';
import { enrichLoan } from './loanUtils';
import useCachedData from '../../../hooks/useCachedData';
import { CACHE_TTL } from '../../../services/cache/cacheService';

export default function useLoanProducts() {
  const { data: loans, loading, error } = useCachedData(
    'loans:all',
    () =>
      publicAPI
        .getLoans()
        .then((res) => (res.data?.data?.loans || res.data?.loans || []).map(enrichLoan)),
    { ttl: CACHE_TTL.products, fallback: [] },
  );

  return { loans, loading, error };
}