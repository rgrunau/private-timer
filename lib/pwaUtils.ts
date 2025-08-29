import { PWAInstallPrompt, PWAUtilsConfig } from '@/types/pwa'

/**
 * Check if the app is running as a PWA (installed)
 */
export const isPWA = (): boolean => {
  if (typeof window === 'undefined') return false
  
  // Check if running in standalone mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  
  // Check for iOS standalone mode
  const isIOSStandalone = (navigator as { standalone?: boolean }).standalone === true
  
  // Check for Android TWA (Trusted Web Activity)
  const isTWA = document.referrer.includes('android-app://')
  
  return isStandalone || isIOSStandalone || isTWA
}

/**
 * Check if PWA installation is available
 */
export const canInstallPWA = (): boolean => {
  if (typeof window === 'undefined') return false
  
  // Already installed
  if (isPWA()) return false
  
  // Check for install prompt support
  return 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window
}

/**
 * Get PWA installation prompt
 */
export const getPWAInstallPrompt = (): Promise<PWAInstallPrompt | null> => {
  return new Promise((resolve) => {
    if (!canInstallPWA()) {
      resolve(null)
      return
    }

    let installPrompt: PWAInstallPrompt | null = null
    
    const handleInstallPrompt = (event: PWAInstallPrompt) => {
      event.preventDefault()
      installPrompt = event
      resolve(installPrompt)
    }
    
    window.addEventListener('beforeinstallprompt', handleInstallPrompt)
    
    // Timeout after 5 seconds if no prompt
    setTimeout(() => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
      resolve(installPrompt)
    }, 5000)
  })
}

/**
 * Trigger PWA installation
 */
export const installPWA = async (): Promise<boolean> => {
  try {
    const installPrompt = await getPWAInstallPrompt()
    
    if (!installPrompt) {
      console.warn('PWA install prompt not available')
      return false
    }
    
    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    
    return choice.outcome === 'accepted'
  } catch (error) {
    console.error('Failed to install PWA:', error)
    return false
  }
}

/**
 * Check if service worker is supported and registered
 */
export const isServiceWorkerSupported = (): boolean => {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator
}

/**
 * Get service worker registration
 */
export const getServiceWorkerRegistration = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isServiceWorkerSupported()) {
    return null
  }
  
  try {
    return await navigator.serviceWorker.ready
  } catch (error) {
    console.error('Failed to get service worker registration:', error)
    return null
  }
}

/**
 * Check if there's an update available
 */
export const checkForUpdates = async (): Promise<boolean> => {
  const registration = await getServiceWorkerRegistration()
  
  if (!registration) {
    return false
  }
  
  try {
    await registration.update()
    return !!registration.waiting
  } catch (error) {
    console.error('Failed to check for updates:', error)
    return false
  }
}

/**
 * Clear all service worker caches
 */
export const clearServiceWorkerCaches = async (): Promise<void> => {
  if (!('caches' in window)) {
    return
  }
  
  try {
    const cacheNames = await caches.keys()
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    )
    console.log('All service worker caches cleared')
  } catch (error) {
    console.error('Failed to clear service worker caches:', error)
  }
}

/**
 * Force reload the app (useful as fallback)
 */
export const forceReload = (): void => {
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}

/**
 * Get PWA display mode
 */
export const getPWADisplayMode = (): string => {
  if (typeof window === 'undefined') return 'browser'
  
  const displayModes = ['fullscreen', 'standalone', 'minimal-ui', 'browser']
  
  for (const displayMode of displayModes) {
    if (window.matchMedia(`(display-mode: ${displayMode})`).matches) {
      return displayMode
    }
  }
  
  return 'browser'
}

/**
 * Check if app is running offline
 */
export const isOffline = (): boolean => {
  return typeof navigator !== 'undefined' && !navigator.onLine
}

/**
 * Listen for online/offline status changes
 */
export const onNetworkStatusChange = (callback: (isOnline: boolean) => void): (() => void) => {
  if (typeof window === 'undefined') {
    return () => {}
  }
  
  const handleOnline = () => callback(true)
  const handleOffline = () => callback(false)
  
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}

/**
 * Get app version from package.json or build info
 */
export const getAppVersion = (): string => {
  // In a real implementation, you might want to inject this at build time
  return process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
}

/**
 * Log PWA-related information for debugging
 */
export const logPWAInfo = (): void => {
  if (typeof window === 'undefined') return
  
  console.group('PWA Information')
  console.log('Is PWA:', isPWA())
  console.log('Display Mode:', getPWADisplayMode())
  console.log('Can Install:', canInstallPWA())
  console.log('Service Worker Supported:', isServiceWorkerSupported())
  console.log('Is Offline:', isOffline())
  console.log('App Version:', getAppVersion())
  console.groupEnd()
}

/**
 * Initialize PWA utilities with configuration
 */
export const initializePWA = async (config: PWAUtilsConfig = {}): Promise<void> => {
  if (typeof window === 'undefined') return
  
  // Log PWA information in development
  if (process.env.NODE_ENV === 'development') {
    logPWAInfo()
  }
  
  // Set up network status monitoring
  if (config.enableNotifications) {
    onNetworkStatusChange((isOnline) => {
      const event = new CustomEvent('network-status-change', { 
        detail: { isOnline }
      })
      window.dispatchEvent(event)
    })
  }
  
  // Check for initial updates
  const hasUpdate = await checkForUpdates()
  if (hasUpdate && config.enableNotifications) {
    const event = new CustomEvent('pwa-update-available', { 
      detail: { message: 'App update available' }
    })
    window.dispatchEvent(event)
  }
}