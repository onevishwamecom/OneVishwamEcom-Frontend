// Module-level reference to React Router's navigate function.
// Populated by RouterSyncEffect in App.jsx immediately on mount.
let _navigate = null;

/**
 * Store a reference to React Router's navigate function.
 * Called once by RouterSyncEffect in App.jsx.
 */
export function setNavigate(navigateFn) {
  _navigate = navigateFn;
}

/**
 * Navigate to an internal route using React Router (client-side, no page reload).
 * Falls back to window.location only if called before the router has mounted.
 */
export function navigateTo(href) {
  if (_navigate) {
    _navigate(href);
  } else if (typeof window !== 'undefined') {
    // Fallback: should only occur during SSR or very early boot
    window.location.href = href;
  }
}

// Kept for any legacy code that still listens to this event.
export const NAVIGATION_EVENT = 'vishwam:navigation';

export function getLocationSnapshot() {
  if (typeof window === 'undefined') {
    return { pathname: '/', hash: '' };
  }
  return {
    pathname: window.location.pathname,
    hash: window.location.hash,
  };
}
