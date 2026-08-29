/**
 * ONE CENTRAL CLIENT-SIDE CACHE SERVICE — OneVishwam (public site)
 * ============================================================================
 * Every data request funnels through this single abstraction instead of touching
 * localStorage directly. Data is versioned and namespaced so pages, filters and
 * users never collide.
 *
 *   storage key →  onevishwam_cache_v<version>_<namespace>_<key>
 *
 * A cached record looks like:
 *   { data, params, cachedAt, version }
 *
 * In-flight requests are de-duplicated so identical concurrent fetches share
 * one promise (no duplicate API calls).
 * ============================================================================
 */

const STORAGE_PREFIX = 'onevishwam_cache';
const CACHE_VERSION = 1;

/** Configurable freshness lifetimes (ms) — tune per data type, never hardcode. */
export const CACHE_TTL = {
  user: 30 * 60 * 1000, // 30 min — profile, revalidated after login
  products: 10 * 60 * 1000, // 10 min — listing collections / lists
  detail: 30 * 1000, // 30 sec — single listing detail (short TTL for fresh data)
  similar: 10 * 60 * 1000, // 10 min — "similar items"
};

export const PUBLIC_NAMESPACE = 'public';

/** Namespace scoped to a specific user so accounts never share cached data. */
export function userNamespace(user) {
  const id = user?.id || user?._id || user?.email;
  return id ? `user:${id}` : null;
}

/** Deterministic key for parameterised requests (params must be part of the key). */
export function deterministicKey(value) {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'object') return String(value);
  const ordered = {};
  Object.keys(value)
    .sort()
    .forEach((k) => {
      ordered[k] = value[k];
    });
  return JSON.stringify(ordered);
}

function storageKey(namespace, key) {
  return `${STORAGE_PREFIX}_v${CACHE_VERSION}_${namespace}_${key}`;
}

function safeRead(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be unavailable / full — cache silently degrades */
  }
}

/** In-flight request map (per storage key) so identical calls share one promise. */
const inflight = new Map();

export const cache = {
  get(namespace, key) {
    return safeRead(storageKey(namespace, key));
  },

  set(namespace, key, data, params = {}) {
    const record = { data, params, cachedAt: Date.now(), version: CACHE_VERSION };
    safeWrite(storageKey(namespace, key), record);
    return record;
  },

  remove(namespace, key) {
    try {
      localStorage.removeItem(storageKey(namespace, key));
    } catch {
      /* ignore */
    }
  },

  /** Remove every cache entry whose key starts with `prefix` in a namespace. */
  removeByPrefix(namespace, prefix) {
    const start = `${STORAGE_PREFIX}_v${CACHE_VERSION}_${namespace}_`;
    const doomed = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(start + prefix)) doomed.push(k);
    }
    doomed.forEach((k) => localStorage.removeItem(k));
  },

  clearNamespace(namespace) {
    this.removeByPrefix(namespace, '');
  },

  clear() {
    const start = `${STORAGE_PREFIX}_v${CACHE_VERSION}_`;
    const doomed = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(start)) doomed.push(k);
    }
    doomed.forEach((k) => localStorage.removeItem(k));
  },

  isValid(namespace, key, ttl) {
    const record = this.get(namespace, key);
    if (!record) return false;
    if (ttl == null) return true;
    return Date.now() - (record.cachedAt || 0) < ttl;
  },

  isFresh(record, ttl) {
    return !!record && (ttl == null || Date.now() - (record.cachedAt || 0) < ttl);
  },

  isStale(record, ttl) {
    return !!record && !this.isFresh(record, ttl);
  },

  /**
   * Single entry point for "fetch or reuse".
   *  - valid cache → resolves immediately with cached data (no network)
   *  - no cache → runs `fetcher`, stores the result, returns it
   *  - `force: true` → bypasses valid cache (manual refresh / revalidation)
   * Concurrent identical calls share one in-flight promise.
   */
  async fetch(namespace, key, fetcher, { force = false, ttl, params } = {}) {
    const record = this.get(namespace, key);
    if (!force && record && this.isFresh(record, ttl)) {
      return { fromCache: true, data: record.data };
    }
    const inflightKey = storageKey(namespace, key);
    if (inflight.has(inflightKey)) return inflight.get(inflightKey);
    const promise = Promise.resolve()
      .then(fetcher)
      .then((data) => {
        this.set(namespace, key, data, params);
        return { fromCache: false, data };
      })
      .finally(() => inflight.delete(inflightKey));
    inflight.set(inflightKey, promise);
    return promise;
  },
};

export default cache;