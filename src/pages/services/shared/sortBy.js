import { parseIndianPrice as getNumericPrice } from '../../../utils/priceUtils';

export const SORT_LATEST = 'latest';
export const SORT_PRICE_LOW = 'price-low';
export const SORT_PRICE_HIGH = 'price-high';

export const DEFAULT_SORT_OPTIONS = [
  { value: SORT_LATEST, label: 'Latest' },
  { value: SORT_PRICE_LOW, label: 'Price: Low to High' },
  { value: SORT_PRICE_HIGH, label: 'Price: High to Low' },
];

/**
 * Compare two items by numeric price.
 */
export function compareByPrice(a, b, ascending = true, getPrice = getNumericPrice) {
  const pA = typeof getPrice === 'function' ? getPrice(a?.price ?? a?.pricePerUnit ?? a?.finalPrice ?? a) : 0;
  const pB = typeof getPrice === 'function' ? getPrice(b?.price ?? b?.pricePerUnit ?? b?.finalPrice ?? b) : 0;
  return ascending ? pA - pB : pB - pA;
}

/**
 * Compare two items by creation timestamp or fallback ID.
 */
export function compareByDate(a, b, desc = true) {
  const tA = new Date(a?.createdAt || 0).getTime() || (typeof a?.id === 'number' ? a.id : 0);
  const tB = new Date(b?.createdAt || 0).getTime() || (typeof b?.id === 'number' ? b.id : 0);
  return desc ? tB - tA : tA - tB;
}

/**
 * Sorts an array using standard sort criteria.
 */
export function applySort(items = [], sortBy = SORT_LATEST, getPrice = getNumericPrice) {
  if (!Array.isArray(items)) return [];
  const copy = [...items];
  if (sortBy === SORT_PRICE_LOW) {
    return copy.sort((a, b) => compareByPrice(a, b, true, getPrice));
  }
  if (sortBy === SORT_PRICE_HIGH) {
    return copy.sort((a, b) => compareByPrice(a, b, false, getPrice));
  }
  return copy.sort((a, b) => compareByDate(a, b, true));
}
