export interface UpdateStatus {
  available: boolean;
  installing: boolean;
  ready: boolean;
  error?: string;
}

export interface PWAUpdateHook {
  updateAvailable: boolean;
  isUpdating: boolean;
  updateError: string | null;
  updateReady: boolean;
  checkForUpdate: () => Promise<void>;
  installUpdate: () => Promise<void>;
}

export interface ServiceWorkerUpdateEvent extends Event {
  isUpdate?: boolean;
}

export interface UpdateNotificationOptions {
  show: boolean;
  duration?: number;
  position?: 'top' | 'bottom';
  message?: string;
}

export interface PWAInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface UpdateManagerProps {
  onUpdateAvailable?: () => void;
  onUpdateInstalled?: () => void;
  onUpdateError?: (error: string) => void;
  notificationOptions?: UpdateNotificationOptions;
}

export interface PWAUtilsConfig {
  updateCheckInterval?: number; // in milliseconds
  enableNotifications?: boolean;
  enableAutoInstall?: boolean;
  fallbackToRefresh?: boolean;
}

declare global {
  interface Window {
    workbox?: {
      addEventListener: (event: string, handler: (event: any) => void) => void;
      messageSkipWaiting: () => void;
      register: () => void;
    };
  }

  interface Navigator {
    standalone?: boolean;
  }

  interface WindowEventMap {
    beforeinstallprompt: PWAInstallPrompt;
  }
}