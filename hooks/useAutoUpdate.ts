import { useState, useEffect, useCallback, useRef } from 'react';
import { PWAUpdateHook, PWAUtilsConfig } from '@/types/pwa';

const DEFAULT_CONFIG: PWAUtilsConfig = {
  updateCheckInterval: 60000, // Check every minute
  enableNotifications: true,
  enableAutoInstall: true,
  fallbackToRefresh: false,
};

export const useAutoUpdate = (config: PWAUtilsConfig = {}): PWAUpdateHook => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateReady, setUpdateReady] = useState(false);
  
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkForUpdate = useCallback(async (): Promise<void> => {
    if (!('serviceWorker' in navigator) || !registrationRef.current) {
      return;
    }

    try {
      await registrationRef.current.update();
    } catch (error) {
      console.warn('Failed to check for updates:', error);
      setUpdateError(error instanceof Error ? error.message : 'Unknown update error');
    }
  }, []);

  const installUpdate = useCallback(async (): Promise<void> => {
    if (!registrationRef.current?.waiting) {
      return;
    }

    try {
      setIsUpdating(true);
      setUpdateError(null);

      // Send skip waiting message to the waiting service worker
      registrationRef.current.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Use workbox if available, otherwise fallback to manual approach
      if (window.workbox) {
        window.workbox.messageSkipWaiting();
      }

    } catch (error) {
      console.error('Failed to install update:', error);
      setUpdateError(error instanceof Error ? error.message : 'Failed to install update');
      
      // Fallback: force refresh if configured
      if (finalConfig.fallbackToRefresh) {
        window.location.reload();
      }
    } finally {
      setIsUpdating(false);
    }
  }, [finalConfig.fallbackToRefresh]);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    const setupServiceWorker = async () => {
      try {
        // Wait for service worker to be ready
        const registration = await navigator.serviceWorker.ready;
        registrationRef.current = registration;

        // Handle service worker updates
        const handleUpdateFound = () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          setUpdateAvailable(true);

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version is available and ready to be activated
              if (finalConfig.enableAutoInstall) {
                installUpdate();
              } else {
                setUpdateReady(true);
              }
            }
          });
        };

        // Handle controller change (when new SW takes control)
        const handleControllerChange = () => {
          setUpdateReady(false);
          setUpdateAvailable(false);
          setIsUpdating(false);
          
          console.log('App updated successfully');
          
          // Optional: Show brief notification that update completed
          if (finalConfig.enableNotifications) {
            // This could trigger a toast notification in the UI
            window.dispatchEvent(new CustomEvent('pwa-updated', { 
              detail: { message: 'App updated successfully' }
            }));
          }
        };

        // Set up event listeners
        registration.addEventListener('updatefound', handleUpdateFound);
        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

        // Check if there's already an update waiting
        if (registration.waiting) {
          setUpdateAvailable(true);
          if (finalConfig.enableAutoInstall) {
            installUpdate();
          } else {
            setUpdateReady(true);
          }
        }

        // Set up periodic update checks
        if (finalConfig.updateCheckInterval && finalConfig.updateCheckInterval > 0) {
          intervalRef.current = setInterval(checkForUpdate, finalConfig.updateCheckInterval);
        }

        // Cleanup function
        return () => {
          registration.removeEventListener('updatefound', handleUpdateFound);
          navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        };

      } catch (error) {
        console.error('Error setting up service worker:', error);
        setUpdateError(error instanceof Error ? error.message : 'Service worker setup failed');
      }
    };

    setupServiceWorker();

    // Setup workbox listeners if available
    if (window.workbox) {
      window.workbox.addEventListener('waiting', (event) => {
        setUpdateAvailable(true);
        if (finalConfig.enableAutoInstall) {
          window.workbox?.messageSkipWaiting();
        } else {
          setUpdateReady(true);
        }
      });

      window.workbox.addEventListener('controlling', () => {
        setUpdateReady(false);
        setUpdateAvailable(false);
        setIsUpdating(false);
        
        if (finalConfig.enableNotifications) {
          window.dispatchEvent(new CustomEvent('pwa-updated', { 
            detail: { message: 'App updated successfully' }
          }));
        }
      });
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkForUpdate, installUpdate, finalConfig]);

  return {
    updateAvailable,
    isUpdating,
    updateError,
    updateReady,
    checkForUpdate,
    installUpdate,
  };
};