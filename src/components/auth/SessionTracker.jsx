import { useEffect, useRef } from 'react';
import { useAuth } from '../../store/authSlice';
import API from '../../services/api';

/**
 * SessionTracker
 * Tracks user active duration on the website and sends periodic heartbeats to the backend.
 * Only records time when the browser tab is actively visible and focused.
 */
export default function SessionTracker() {
  const { isLoggedIn, user } = useAuth();
  const lastSyncRef = useRef(Date.now());
  const pendingSecondsRef = useRef(0);

  useEffect(() => {
    if (!isLoggedIn || !user) return;

    lastSyncRef.current = Date.now();
    pendingSecondsRef.current = 0;

    // Send initial ping to mark active status upon login / reload
    API.post('/auth/heartbeat', { seconds: 5 }).catch(() => null);

    const sendHeartbeat = async (seconds) => {
      if (seconds <= 0) return;
      try {
        await API.post('/auth/heartbeat', { seconds });
        pendingSecondsRef.current = 0;
      } catch {
        // keep pending seconds to retry on next interval
      }
    };

    // Periodic heartbeat every 30 seconds
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        const elapsedSecs = Math.round((now - lastSyncRef.current) / 1000);
        lastSyncRef.current = now;

        // Cap elapsed to avoid large jumps if device woke from sleep
        const validElapsed = Math.min(60, Math.max(1, elapsedSecs));
        pendingSecondsRef.current += validElapsed;

        if (pendingSecondsRef.current >= 25) {
          sendHeartbeat(pendingSecondsRef.current);
        }
      } else {
        lastSyncRef.current = Date.now();
      }
    }, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const now = Date.now();
        const elapsedSecs = Math.round((now - lastSyncRef.current) / 1000);
        const validElapsed = Math.min(60, Math.max(0, elapsedSecs));
        const toSend = pendingSecondsRef.current + validElapsed;
        if (toSend >= 5) {
          sendHeartbeat(toSend);
        }
      } else {
        lastSyncRef.current = Date.now();
      }
    };

    const handleBeforeUnload = () => {
      const now = Date.now();
      const elapsedSecs = Math.round((now - lastSyncRef.current) / 1000);
      const toSend = pendingSecondsRef.current + Math.min(60, Math.max(0, elapsedSecs));
      if (toSend >= 3) {
        sendHeartbeat(toSend);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isLoggedIn, user]);

  return null;
}
