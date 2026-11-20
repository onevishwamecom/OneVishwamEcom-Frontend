import { useEffect, useRef } from 'react';
import { useAuth } from '../store/authSlice';

const BROWSE_TIMER_SECONDS = 50;
const PROMPTED_KEY = 'vishwam_prompted_timer';

/**
 * useBrowseTimer
 * 
 * Starts a 50-second countdown once an unauthenticated user enters the storefront.
 * After 50 seconds, triggers the login modal (soft prompt, once per session).
 * 
 * Rules:
 * - Only runs when the user is NOT logged in.
 * - Only prompts once per browser session (via sessionStorage flag).
 * - Cancelled immediately if user logs in during the timer.
 */
export default function useBrowseTimer() {
  const { isLoggedIn, openAuthModal } = useAuth();
  const timerRef = useRef(null);

  useEffect(() => {
    // Don't run in automated test environments
    if (typeof window !== 'undefined' && window.navigator?.webdriver) {
      return;
    }

    // Don't run if already logged in
    if (isLoggedIn) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Don't run if already prompted this session
    try {
      if (sessionStorage.getItem(PROMPTED_KEY) === 'true') return;
    } catch {}

    // Start the 50-second timer
    timerRef.current = setTimeout(() => {
      try {
        // Double-check: only prompt if still not logged in and not already prompted
        if (sessionStorage.getItem(PROMPTED_KEY) !== 'true') {
          sessionStorage.setItem(PROMPTED_KEY, 'true');
          openAuthModal('login');
        }
      } catch {
        openAuthModal('login');
      }
    }, BROWSE_TIMER_SECONDS * 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isLoggedIn, openAuthModal]);
}
