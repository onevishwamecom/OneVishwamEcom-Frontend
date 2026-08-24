/**
 * Indian Pricing Utilities for Vishwam-Frontend.
 * Handles formatting and display of prices in Indian numbering system (Lakhs/Crores).
 */

const LAKH = 100000;
const CRORE = 10000000;

/**
 * Format a numeric value into Indian Rupee notation.
 * @param {number|string} value - Raw price (number or string like "500000", "₹5,00,000", "5L", "2.5Cr")
 * @param {object} options
 * @param {boolean} options.compact - If true, shows "₹4.5 L" / "₹2.5 Cr" instead of full number
 * @returns {string} Formatted price string with ₹ symbol
 */
export function formatINR(value, { compact = true } = {}) {
  if (value === null || value === undefined || value === '') return '';

  let num = typeof value === 'number' ? value : parseIndianPrice(value);
  if (isNaN(num) || num === 0) {
    // If it's a non-numeric string that already has ₹, return as-is
    const s = String(value).trim();
    if (s.startsWith('₹')) return s;
    if (s) return `₹${s}`;
    return '';
  }

  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);

  if (compact) {
    if (abs >= CRORE) {
      const cr = abs / CRORE;
      return `${sign}₹${cr % 1 === 0 ? cr : cr.toFixed(1).replace(/\.0$/, '')} Cr`;
    }
    if (abs >= LAKH) {
      const l = abs / LAKH;
      return `${sign}₹${l % 1 === 0 ? l : l.toFixed(1).replace(/\.0$/, '')} L`;
    }
  }

  // Full Indian comma grouping: XX,XX,XXX
  const isDecimal = !Number.isInteger(abs);
  const [intPart, decPart] = isDecimal ? abs.toFixed(2).split('.') : [String(Math.round(abs)), null];
  const last3 = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  let grouped = rest
    ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3
    : last3;

  let result = `${sign}₹${grouped}`;
  if (decPart) result += `.${decPart}`;
  return result.trim();
}

/**
 * Parse an Indian price string into a numeric value.
 * Handles: "₹4.5 L", "2.5Cr", "50,00,000", "5 Lakh", "500000", "25K", etc.
 */
export function parseIndianPrice(s) {
  if (!s && s !== 0) return 0;
  if (typeof s === 'number') return s;

  const raw = String(s).replace(/[₹,\s]/g, '').trim();
  if (!raw) return 0;

  const match = raw.match(/^([+-]?\d+\.?\d*)\s*(.*)/i);
  if (!match) return parseFloat(raw) || 0;

  const num = parseFloat(match[1]);
  if (isNaN(num)) return 0;

  const suffix = (match[2] || '').toLowerCase().trim();
  if (suffix.startsWith('cr') || suffix.startsWith('crore')) return num * CRORE;
  if (suffix.startsWith('l') || suffix.startsWith('lakh')) return num * LAKH;
  if (suffix.startsWith('k') || suffix.startsWith('thousand')) return num * 1000;

  return num;
}

/**
 * Format a listing object's price for display.
 * Reads: price, numericPrice, priceType, priceSuffix
 * Returns a formatted string like "₹4.5 L / Sq. Ft." or "Price on Request"
 */
export function formatDisplayPrice(listing) {
  if (!listing) return '';

  if (listing.priceType === 'on-request') return 'Price on Request';

  const num = listing.numericPrice || listing.priceValue || parseIndianPrice(listing.price);
  if (!num || num === 0) {
    // Fallback: if price is already a formatted string, use it
    if (listing.price && String(listing.price).trim()) {
      const p = String(listing.price).trim();
      const base = p.startsWith('₹') ? p : `₹${p}`;
      const suffix = listing.priceSuffix ? ` ${listing.priceSuffix}` : '';
      return `${base}${suffix}`;
    }
    return '';
  }

  const formatted = formatINR(num, { compact: true });
  const suffix = listing.priceSuffix ? ` ${listing.priceSuffix}` : '';
  return `${formatted}${suffix}`;
}

/**
 * Ensure a price value is displayed with the ₹ symbol and Indian comma grouping.
 * - null/undefined/empty → empty string
 * - numbers → formatted with ₹ and Indian commas via formatINR
 * - strings starting with ₹ or "Rs" → returned as-is (already formatted)
 * - strings that are purely numeric → run through formatINR (adds commas + ₹)
 * - other strings (e.g. "2.5 Cr", "5 Lakh") → prefixed with ₹ if missing
 */
export function withRupeeSymbol(value) {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'number') return formatINR(value, { compact: false });
  const s = String(value).trim();
  if (!s) return '';
  if (s.startsWith('₹') || s.toLowerCase().startsWith('rs') || s.startsWith('INR')) return s;
  if (/^[\d,]+(\.\d+)?$/.test(s.replace(/\s/g, ''))) {
    return formatINR(s.replace(/,/g, ''), { compact: false });
  }
  return `₹${s}`;
}

/**
 * Get badge text for price type (if applicable).
 * Returns null if no badge should be shown.
 */
export function getPriceTypeBadge(priceType) {
  switch (priceType) {
    case 'negotiable': return 'Negotiable';
    case 'per-month': return 'Monthly';
    case 'per-year': return 'Yearly';
    case 'on-request': return 'On Request';
    default: return null;
  }
}
