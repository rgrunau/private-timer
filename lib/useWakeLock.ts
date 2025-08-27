import { useEffect, useRef, useCallback } from 'react';

export const useWakeLock = () => {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator && wakeLockRef.current === null) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        console.log('Screen wake lock activated');
      }
    } catch (error) {
      console.error('Failed to request wake lock:', error);
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    try {
      if (wakeLockRef.current !== null) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('Screen wake lock released');
      }
    } catch (error) {
      console.error('Failed to release wake lock:', error);
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && wakeLockRef.current === null) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, [requestWakeLock, releaseWakeLock]);

  return { requestWakeLock, releaseWakeLock, isActive: wakeLockRef.current !== null };
};