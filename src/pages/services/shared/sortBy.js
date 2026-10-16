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
 * Returns true if an item is an in-house project or posted by ceo@onevishwam.com
 */
export function isInHouseOrCeoListing(item) {
  if (!item) return false;
  if (item.priority && Number(item.priority) > 0) return true;
  if (item.isPriority === true) return true;
  if (item.origin === 'in_house_project' || item.details?.origin === 'in_house_project') return true;

  const email = String(
    item.contributor?.email ||
    item.contributorEmail ||
    item.contactEmail ||
    item.email ||
    ''
  ).trim().toLowerCase();
  if (email === 'ceo@onevishwam.com') return true;

  const partner = String(
    item.channelPartnerName ||
    item.vendorName ||
    item.vendor ||
    item.subtitle ||
    ''
  ).trim().toLowerCase().replace(/\s+/g, '');
  if (partner === 'onevishwam') return true;

  return false;
}

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
 * Sorts an array using standard sort criteria with priority in-house listings at the top.
 */
export function applySort(items = [], sortBy = SORT_LATEST, getPrice = getNumericPrice) {
  if (!Array.isArray(items)) return [];
  const copy = [...items];

  return copy.sort((a, b) => {
    const aPri = isInHouseOrCeoListing(a) ? 1 : 0;
    const bPri = isInHouseOrCeoListing(b) ? 1 : 0;
    if (aPri !== bPri) return bPri - aPri; // In-house / ceo@onevishwam.com always at top

    if (sortBy === SORT_PRICE_LOW) {
      return compareByPrice(a, b, true, getPrice);
    }
    if (sortBy === SORT_PRICE_HIGH) {
      return compareByPrice(a, b, false, getPrice);
    }
    return compareByDate(a, b, true);
  });
}
