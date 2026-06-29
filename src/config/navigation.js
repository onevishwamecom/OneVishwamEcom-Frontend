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

export function navigateTo(href) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(NAVIGATION_EVENT, { detail: href }));
}
