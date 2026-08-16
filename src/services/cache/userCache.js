/**
 * User profile cache.
 * ============================================================================
 * The authenticated user's profile is cached (per user, under `user:<id>`) so
 * `/auth/me` can be skipped while the profile is fresh. Tokens are NEVER cached
 * — this cache only ever stores the profile object returned by the API.
 * ============================================================================
 */
import cache, { CACHE_TTL, userNamespace } from './cacheService';

const ME_KEY = 'me';

export function cacheUser(user) {
  const ns = userNamespace(user);
  if (ns) cache.set(ns, ME_KEY, user);
}

export function getCachedUser(user) {
  const ns = userNamespace(user);
  if (!ns) return null;
  const record = cache.get(ns, ME_KEY);
  return record ? record.data : null;
}

export function cachedUserIsFresh(user, ttl = CACHE_TTL.user) {
  const ns = userNamespace(user);
  return ns ? cache.isValid(ns, ME_KEY, ttl) : false;
}

export function clearUserCache(user) {
  const ns = userNamespace(user);
  if (ns) cache.remove(ns, ME_KEY);
}

/** Drop every cached user profile (used on logout / account deletion). */
export function clearAllUserCaches() {
  cache.clearNamespace('user');
}

export default {
  cacheUser,
  getCachedUser,
  cachedUserIsFresh,
  clearUserCache,
  clearAllUserCaches,
};