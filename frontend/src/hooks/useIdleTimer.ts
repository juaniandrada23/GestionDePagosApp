import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/services/apiClient';
import { SESSION_TIMEOUT_MS, SESSION_WARNING_SECONDS } from '@/config/constants';

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'keydown',
  'click',
  'scroll',
  'touchstart',
];

export function useIdleTimer() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(SESSION_WARNING_SECONDS);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const countdownRef = useRef<ReturnType<typeof setInterval>>();
  const warningActiveRef = useRef(false);

  const doLogout = useCallback(() => {
    clearTimeout(idleTimerRef.current);
    clearInterval(countdownRef.current);
    warningActiveRef.current = false;
    setShowWarning(false);
    logout();
    navigate('/', { replace: true });
  }, [logout, navigate]);

  const startWarning = useCallback(() => {
    warningActiveRef.current = true;
    setSecondsLeft(SESSION_WARNING_SECONDS);
    setShowWarning(true);

    let remaining = SESSION_WARNING_SECONDS;
    countdownRef.current = setInterval(() => {
      remaining -= 1;
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(countdownRef.current);
        doLogout();
      }
    }, 1000);
  }, [doLogout]);

  const resetIdleTimer = useCallback(() => {
    if (warningActiveRef.current) return;
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(startWarning, SESSION_TIMEOUT_MS);
  }, [startWarning]);

  const extendSession = useCallback(async () => {
    clearInterval(countdownRef.current);
    try {
      const refreshed = await apiClient.refreshToken();
      if (!refreshed) {
        doLogout();
        return;
      }
    } catch {
      doLogout();
      return;
    }
    warningActiveRef.current = false;
    setShowWarning(false);
    resetIdleTimer();
  }, [doLogout, resetIdleTimer]);

  useEffect(() => {
    resetIdleTimer();

    const onActivity = () => resetIdleTimer();
    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, onActivity, { passive: true }));

    return () => {
      clearTimeout(idleTimerRef.current);
      clearInterval(countdownRef.current);
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, onActivity));
    };
  }, [resetIdleTimer]);

  return { showWarning, secondsLeft, extendSession, doLogout };
}
