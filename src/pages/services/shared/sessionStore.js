/**
 * Safe session storage helper for persisting and restoring gallery filter & page states.
 */

export function loadSessionState(key, fallback = {}) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? { ...fallback, ...parsed } : fallback;
  } catch (err) {
    return fallback;
  }
}

export function saveSessionState(key, state) {
  try {
    if (!state) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, JSON.stringify(state));
    }
  } catch (err) {
    // Ignore storage quota or disabled storage errors
  }
}

export function clearSessionState(key) {
  try {
    sessionStorage.removeItem(key);
  } catch (err) {
    // Ignore errors
  }
}
