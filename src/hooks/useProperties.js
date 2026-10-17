import { useEffect, useState, useCallback, useSyncExternalStore, useMemo } from 'react';
import API from '../services/api';
import {
  getTotalPropertyPrice,
  parsePriceRange,
  formatPropertyDisplayPrice,
  formatPropertyAddress,
  resolvePropertyLocality,
  getBangaloreZone,
} from '../pages/services/property/propertyHelpers';

/**
 * ============================================================================
 * Centralized Property Store & API Manager
 * ============================================================================
 * Fetches the property catalog ONCE and shares the data across:
 *   1. Home Page (dream homes, map distribution, fresh arrivals, search)
 *   2. Property Gallery Page (filters, sorting, zones, counts)
 *   3. Property Details Page (instant direct lookup, similar properties)
 *
 * Guarantees:
 *   - Only ONE API call across the entire user session.
 *   - Zero duplicate network calls on route navigation.
 *   - Concurrent requests are de-duplicated via a shared in-flight promise.
 *   - Instant synchronous lookup for detail view with zero delay.
 *   - Backed by sessionStorage for instant rendering across page refreshes.
 */

const SESSION_CACHE_KEY = 'vishwam_centralized_properties_v1';

function readSessionCache() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    // Ignore JSON / quota errors
  }
  return null;
}

function writeSessionCache(list) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(list));
  } catch (e) {
    // Ignore quota errors
  }
}

/**
 * Normalizes a property listing with resolved location, locality, zone, and price.
 */
function normalizeProperty(p) {
  if (!p || typeof p !== 'object') return null;
  const id = p._id || p.id;
  const display = formatPropertyDisplayPrice(p);
  const resolvedAddress = formatPropertyAddress(p);
  const resolvedLocality = resolvePropertyLocality(p);
  const rawAddr = (p.address || '').trim().toLowerCase();
  const isBareCity =
    !p.address ||
    rawAddr === 'bangalore' ||
    rawAddr === 'bengaluru' ||
    (p.city && rawAddr === p.city.toLowerCase());

  return {
    ...p,
    id,
    _id: id,
    address: isBareCity ? resolvedAddress : (p.address || resolvedAddress),
    locality: p.locality || resolvedLocality,
    location: resolvedAddress,
    formattedAddress: resolvedAddress,
    zone: p.zone || getBangaloreZone(p),
    rawPrice: p.rawPrice || p.price,
    rawPriceSuffix: p.rawPriceSuffix || p.priceSuffix,
    calculatedTotalAmount: getTotalPropertyPrice(p),
    priceRange: parsePriceRange(p),
    price: display.price,
    priceSuffix: display.priceSuffix,
  };
}

// Initialize centralized store from session cache if available
const initialCached = readSessionCache();
const initialById = new Map();
if (initialCached) {
  initialCached.forEach((p) => {
    if (p._id) initialById.set(String(p._id), p);
    if (p.id) initialById.set(String(p.id), p);
  });
}

let storeState = {
  properties: initialCached || [],
  byId: initialById,
  loading: false,
  error: null,
  isFetched: Boolean(initialCached && initialCached.length > 0),
  lastFetchedAt: initialCached ? Date.now() : 0,
};

let inFlightPromise = null;
const listeners = new Set();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribeProperties(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getPropertiesSnapshot() {
  return storeState;
}

function getServerSnapshot() {
  return storeState;
}

/**
 * Centralized fetch function.
 * Called once and shared everywhere. Subsequent calls return the cached data.
 *
 * @param {boolean} force - Force re-fetch from network
 * @returns {Promise<Array>} List of normalized properties
 */
export function fetchProperties(force = false) {
  // 1. If already fetched and not forced, return cached data immediately
  if (!force && storeState.isFetched && storeState.properties.length > 0) {
    return Promise.resolve(storeState.properties);
  }

  // 2. If a request is already in-flight, return the existing promise (de-duplication)
  if (inFlightPromise) {
    return inFlightPromise;
  }

  // 3. Update loading state if we do not already have data
  if (!storeState.properties.length) {
    storeState = { ...storeState, loading: true, error: null };
    emitChange();
  }

  inFlightPromise = API.get('/api/properties', { params: { limit: 100 } })
    .then((res) => {
      let list = [];
      if (Array.isArray(res?.data?.data?.items)) list = res.data.data.items;
      else if (Array.isArray(res?.data?.items)) list = res.data.items;
      else if (Array.isArray(res?.data?.data)) list = res.data.data;
      else if (Array.isArray(res?.data)) list = res.data;

      const normalizedList = list.map(normalizeProperty).filter(Boolean);
      const byId = new Map(storeState.byId);
      normalizedList.forEach((p) => {
        if (p._id) byId.set(String(p._id), p);
        if (p.id) byId.set(String(p.id), p);
      });

      storeState = {
        properties: normalizedList,
        byId,
        loading: false,
        error: null,
        isFetched: true,
        lastFetchedAt: Date.now(),
      };
      writeSessionCache(normalizedList);
      emitChange();
      return normalizedList;
    })
    .catch((err) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load properties';
      storeState = {
        ...storeState,
        loading: false,
        error: msg,
      };
      emitChange();
      if (storeState.properties.length > 0) {
        return storeState.properties;
      }
      throw err;
    })
    .finally(() => {
      inFlightPromise = null;
    });

  return inFlightPromise;
}

/**
 * Synchronous cache lookup by id or _id.
 */
export function getPropertyFromCache(id) {
  if (!id) return null;
  return storeState.byId.get(String(id)) || null;
}

/**
 * Main Hook: useProperties()
 * Subscribes to the centralized properties store.
 * Automatically triggers the single API call on first use.
 *
 * Used in:
 *   - Home page (Dream Home, Bangalore Map, Fresh Arrivals, Search)
 *   - Property Gallery page (Catalog list, filters, zones)
 *   - Property Details page (Similar properties, Recently viewed)
 *   - QuickMatchModal
 */
export function useProperties(params = {}) {
  const state = useSyncExternalStore(
    subscribeProperties,
    getPropertiesSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    // Only fetch if data has never been fetched and is not currently in flight
    if (!storeState.isFetched && !inFlightPromise) {
      fetchProperties(false).catch(() => {});
    }
  }, []);

  const refetch = useCallback(() => {
    return fetchProperties(true);
  }, []);

  return {
    properties: state.properties,
    loading: state.loading && !state.properties.length,
    error: state.error,
    isFetched: state.isFetched,
    refetch,
    retry: refetch,
  };
}

/**
 * Hook: usePropertyById(id)
 * Resolves a property by id/slug from the centralized store first.
 * ZERO API calls are made if the property is already in the centralized catalog!
 *
 * Used in:
 *   - Property Details page
 */
export function usePropertyById(id) {
  const state = useSyncExternalStore(
    subscribeProperties,
    getPropertiesSnapshot,
    getServerSnapshot
  );

  const [directItem, setDirectItem] = useState(null);
  const [directLoading, setDirectLoading] = useState(false);
  const [directError, setDirectError] = useState(null);

  const propertyKey = id ? String(id).trim() : '';

  // 1. Check if the property already exists in the centralized store
  const cachedProperty = propertyKey ? (state.byId.get(propertyKey) || null) : null;

  useEffect(() => {
    if (!propertyKey) return;

    // Found in centralized cache: do nothing!
    if (cachedProperty) {
      return;
    }

    // Centralized list is currently in flight: wait for it
    if (state.loading || inFlightPromise) {
      return;
    }

    // Centralized list has not started fetching: start it
    if (!state.isFetched) {
      fetchProperties(false).catch(() => {});
      return;
    }

    // Fallback: Property was not found in the 100 properties catalog.
    // Fetch directly via GET /api/properties/:id:
    let cancelled = false;
    setDirectLoading(true);
    setDirectError(null);

    API.get(`/api/properties/${propertyKey}`)
      .then((res) => {
        if (cancelled) return;
        const raw =
          res.data?.data?.item ||
          res.data?.data?.property ||
          res.data?.item ||
          res.data?.property ||
          (res.data?.data && typeof res.data.data === 'object' && !res.data.data.item ? res.data.data : null) ||
          res.data ||
          null;

        if (raw) {
          const normalized = normalizeProperty(raw);
          setDirectItem(normalized);
          storeState.byId.set(propertyKey, normalized);
          if (normalized._id) storeState.byId.set(String(normalized._id), normalized);
          if (normalized.id) storeState.byId.set(String(normalized.id), normalized);
          emitChange();
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setDirectError(err?.response?.data?.message || err?.message || 'Property not found');
      })
      .finally(() => {
        if (!cancelled) setDirectLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [propertyKey, cachedProperty, state.loading, state.isFetched]);

  const property = cachedProperty || directItem;
  const loading = !property && (state.loading || directLoading);
  const error = directError || (state.isFetched && !property && !directLoading ? 'Property not found' : state.error);

  const retry = useCallback(() => {
    if (!propertyKey) return;
    setDirectLoading(true);
    API.get(`/api/properties/${propertyKey}`)
      .then((res) => {
        const raw =
          res.data?.data?.item ||
          res.data?.data?.property ||
          res.data?.item ||
          res.data?.property ||
          res.data?.data ||
          res.data;
        if (raw) {
          const normalized = normalizeProperty(raw);
          setDirectItem(normalized);
          storeState.byId.set(propertyKey, normalized);
          emitChange();
        }
      })
      .catch((err) => setDirectError(err.message))
      .finally(() => setDirectLoading(false));
  }, [propertyKey]);

  return { property, loading, error, retry };
}

/**
 * Hook: useSimilarProperties(id)
 * Derives similar properties from the centralized catalog without making an additional API call.
 */
export function useSimilarProperties(id) {
  const { properties } = useProperties();
  const similar = useMemo(() => {
    if (!id || !properties.length) return [];
    const strId = String(id);
    const current = properties.find((p) => String(p._id || p.id) === strId);
    const subcat = (current?.subcategory || current?.propertyType || '').toLowerCase();

    const matched = properties.filter((p) => {
      const pId = String(p._id || p.id);
      if (pId === strId) return false;
      const pSubcat = (p.subcategory || p.propertyType || '').toLowerCase();
      return pSubcat && pSubcat === subcat;
    });

    if (matched.length < 4) {
      const rest = properties.filter((p) => {
        const pId = String(p._id || p.id);
        return pId !== strId && !matched.some((m) => String(m._id || m.id) === pId);
      });
      return [...matched, ...rest].slice(0, 8);
    }
    return matched.slice(0, 8);
  }, [id, properties]);

  return { similar, loading: false, error: null };
}

export default useProperties;