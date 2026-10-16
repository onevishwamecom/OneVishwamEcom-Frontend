/**
 * Utility functions for robust, case-resilient, hyphen-agnostic, and token-based searching
 * across all product, property, vehicle, and marketplace catalogs.
 */

/**
 * Normalizes text for comparison:
 * - Trims and converts to lower case
 * - Replaces hyphens, en-dashes, em-dashes with spaces
 * - Normalizes multiple spaces into a single space
 *
 * @param {*} val
 * @returns {string}
 */
export function normalizeSearchString(val) {
  if (!val) return '';
  return String(val)
    .toLowerCase()
    .replace(/[-–—_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Removes hyphens from product titles and names to ensure consistent presentation.
 * E.g. "DS-MAX Samyak" -> "DS MAX Samyak", "Blanket – Solid" -> "Blanket Solid"
 *
 * @param {*} name
 * @returns {string}
 */
export function cleanProductName(name) {
  if (!name) return '';
  return String(name)
    .replace(/\s*[-–—]\s*/g, ' ')
    .replace(/(\b[A-Za-z0-9]+)-([A-Za-z0-9]+\b)/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Multi-token search matcher:
 * Returns true if every token in `query` is found in at least one of the `targets`.
 * Handles case-insensitivity, ignores hyphens/punctuation, and supports unordered words.
 *
 * @param {string} query The user-entered search string.
 * @param {...(string|number|Array|Object)} targets One or more strings, arrays, or fields to search within.
 * @returns {boolean}
 */
export function matchesSearch(query, ...targets) {
  if (!query || !String(query).trim()) return true;

  const normalizedQuery = normalizeSearchString(query);
  if (!normalizedQuery) return true;

  // Flatten and normalize target texts
  const flatTargets = targets
    .flat(Infinity)
    .filter(Boolean)
    .map((t) => {
      if (typeof t === 'object') {
        return normalizeSearchString(
          Object.values(t)
            .filter((v) => typeof v === 'string' || typeof v === 'number')
            .join(' ')
        );
      }
      return normalizeSearchString(t);
    })
    .join(' ');

  // Split query into discrete words/tokens (e.g. "bda", "6th", "block")
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  // Every token in the query must match within the combined text
  return tokens.every((token) => flatTargets.includes(token));
}
