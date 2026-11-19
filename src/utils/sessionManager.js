/**
 * OneVishwam 24-Hour Trusted Session Manager
 *
 * Implements strict 24-hour persistence:
 * - When a user logs in, a 24-hour validity timestamp is anchored.
 * - If the user closes the tab/browser and returns anytime within 24 hours,
 *   they remain fully authenticated and enter the portal without re-prompting.
 * - Once 24 hours elapse, the session expires cleanly and requests login.
 * - Manual logout clears the session immediately and brings up the login screen.
 */

export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 Hours in milliseconds

export const STORAGE_KEYS = {
  USER: 'user',
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  SESSION_EXPIRES_AT: 'vishwam_session_expires_at',
  LOGIN_TIMESTAMP: 'vishwam_login_timestamp',
  STORY_SEEN: 'vishwam_story_seen',
};

/**
 * Initializes and anchors a 24-hour session
 * @param {object} userData
 * @param {string} [token]
 */
export function startSession(userData, token = null) {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const expiresAt = now + SESSION_DURATION_MS;

  try {
    if (userData) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    }
    if (token) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    }
    localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRES_AT, String(expiresAt));
    localStorage.setItem(STORAGE_KEYS.LOGIN_TIMESTAMP, String(now));
  } catch (err) {
    console.warn('[SessionManager] Failed to persist session:', err);
  }
}

/**
 * Checks if current local session is strictly within the 24-hour window
 * @returns {boolean}
 */
export function isSessionActive() {
  if (typeof window === 'undefined') return false;

  try {
    const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (!rawUser || rawUser === 'undefined' || rawUser === 'null') {
      return false;
    }

    const rawExpiresAt = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRES_AT);
    if (!rawExpiresAt) {
      // Legacy session back-compat: grant 24hr window from now
      const now = Date.now();
      localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRES_AT, String(now + SESSION_DURATION_MS));
      localStorage.setItem(STORAGE_KEYS.LOGIN_TIMESTAMP, String(now));
      return true;
    }

    const expiresAt = Number(rawExpiresAt);
    if (isNaN(expiresAt)) {
      clearSession();
      return false;
    }

    const now = Date.now();
    if (now < expiresAt) {
      return true;
    }

    // Expired past 24 hours
    clearSession();
    return false;
  } catch (err) {
    console.warn('[SessionManager] Error checking session:', err);
    return false;
  }
}

/**
 * Retrieves the stored user profile if session is active
 * @returns {object|null}
 */
export function getActiveSessionUser() {
  if (!isSessionActive()) {
    return null;
  }
  try {
    const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
}

/**
 * Clears all authenticated session tokens and timestamps
 */
export function clearSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRES_AT);
    localStorage.removeItem(STORAGE_KEYS.LOGIN_TIMESTAMP);
  } catch (err) {
    console.warn('[SessionManager] Error clearing session:', err);
  }
}

/**
 * Get remaining session lifetime in milliseconds
 * @returns {number} 0 if expired or not logged in
 */
export function getRemainingSessionTime() {
  if (typeof window === 'undefined') return 0;
  const rawExpiresAt = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRES_AT);
  if (!rawExpiresAt) return 0;
  const remaining = Number(rawExpiresAt) - Date.now();
  return remaining > 0 ? remaining : 0;
}
