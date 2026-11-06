import cache, { PUBLIC_NAMESPACE } from '../services/cache/cacheService';

const HOMEPAGE_CACHE_KEY = 'homepage_data';
const STALE_KEY = 'vishwam_homepage_stale';
export const MATCH_EVENT_NAME = 'vishwam_match_clicked';

/**
 * Signals that a match action was triggered in a service.
 * Invalidates homepage cached snapshots and sets a stale marker in sessionStorage.
 */
export function signalHomepageRefresh() {
  try {
    sessionStorage.setItem(STALE_KEY, 'true');
    cache.invalidate(PUBLIC_NAMESPACE, HOMEPAGE_CACHE_KEY);
    sessionStorage.removeItem('vishwam_centralized_properties_v2');
    window.dispatchEvent(new CustomEvent(MATCH_EVENT_NAME));
  } catch (err) {
    console.warn('Failed to signal homepage refresh:', err);
  }
}

/**
 * Checks whether the homepage data has been marked stale by a match action.
 */
export function isHomepageStale() {
  try {
    return sessionStorage.getItem(STALE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Clears the stale marker from sessionStorage.
 */
export function clearHomepageStale() {
  try {
    sessionStorage.removeItem(STALE_KEY);
  } catch {}
}
