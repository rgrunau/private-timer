'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Download, AlertCircle } from 'lucide-react'
import { useAutoUpdate } from '@/hooks/useAutoUpdate'
import { UpdateManagerProps } from '@/types/pwa'

const UpdateManager: React.FC<UpdateManagerProps> = ({
  onUpdateAvailable,
  onUpdateInstalled,
  onUpdateError,
  notificationOptions = { show: true, duration: 3000, position: 'bottom' }
}) => {
  const { 
    updateAvailable, 
    isUpdating, 
    updateError, 
    updateReady, 
    installUpdate 
  } = useAutoUpdate({
    enableAutoInstall: true, // Auto-install by default for seamless experience
    enableNotifications: true,
    updateCheckInterval: 60000, // Check every minute
  })

  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('info')

  // Handle update events and trigger callbacks
  useEffect(() => {
    if (updateAvailable && onUpdateAvailable) {
      onUpdateAvailable()
    }
  }, [updateAvailable, onUpdateAvailable])

  useEffect(() => {
    if (updateError && onUpdateError) {
      onUpdateError(updateError)
    }
  }, [updateError, onUpdateError])

  // Handle PWA update events
  useEffect(() => {
    const handlePWAUpdate = (event: CustomEvent) => {
      if (onUpdateInstalled) {
        onUpdateInstalled()
      }
      
      if (notificationOptions.show) {
        setNotificationMessage(event.detail?.message || 'App updated successfully')
        setNotificationType('success')
        setShowNotification(true)
      }
    }

    window.addEventListener('pwa-updated', handlePWAUpdate as EventListener)
    
    return () => {
      window.removeEventListener('pwa-updated', handlePWAUpdate as EventListener)
    }
  }, [onUpdateInstalled, notificationOptions.show])

  // Auto-hide notifications
  useEffect(() => {
    if (showNotification && notificationOptions.duration) {
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, notificationOptions.duration)
      
      return () => clearTimeout(timer)
    }
  }, [showNotification, notificationOptions.duration])

  // Handle update errors
  useEffect(() => {
    if (updateError && notificationOptions.show) {
      setNotificationMessage(`Update failed: ${updateError}`)
      setNotificationType('error')
      setShowNotification(true)
    }
  }, [updateError, notificationOptions.show])

  // Handle manual update installation (fallback for non-auto mode)
  const handleInstallUpdate = async () => {
    try {
      await installUpdate()
      if (notificationOptions.show) {
        setNotificationMessage('Installing update...')
        setNotificationType('info')
        setShowNotification(true)
      }
    } catch {
      if (notificationOptions.show) {
        setNotificationMessage('Failed to install update')
        setNotificationType('error')
        setShowNotification(true)
      }
    }
  }

  // Get notification icon
  const getNotificationIcon = () => {
    switch (notificationType) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      case 'info':
      default:
        return <Download className="h-4 w-4 text-blue-400" />
    }
  }

  // Get notification colors
  const getNotificationColors = () => {
    switch (notificationType) {
      case 'success':
        return 'bg-green-900/90 border-green-500/50 text-green-100'
      case 'error':
        return 'bg-red-900/90 border-red-500/50 text-red-100'
      case 'info':
      default:
        return 'bg-blue-900/90 border-blue-500/50 text-blue-100'
    }
  }

  if (!notificationOptions.show) {
    return null
  }

  return (
    <>
      {/* Update notification toast */}
      {showNotification && (
        <div 
          className={`fixed z-50 left-4 right-4 mx-auto max-w-sm transition-all duration-300 ease-in-out transform ${
            notificationOptions.position === 'top' ? 'top-4' : 'bottom-4'
          } ${
            showNotification ? 'translate-y-0 opacity-100' : 
            notificationOptions.position === 'top' ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0'
          }`}
        >
          <div className={`rounded-xl border backdrop-blur-sm px-4 py-3 shadow-lg flex items-center space-x-3 ${getNotificationColors()}`}>
            {getNotificationIcon()}
            <div className="flex-1 text-sm font-medium">
              {notificationMessage}
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Dismiss notification"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Manual update button (fallback, rarely shown) */}
      {updateReady && !isUpdating && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={handleInstallUpdate}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 text-sm"
          >
            <Download className="h-4 w-4" />
            <span>Update Available</span>
          </button>
        </div>
      )}

      {/* Update in progress indicator */}
      {isUpdating && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-gray-800 border border-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg flex items-center space-x-2 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
            <span>Updating...</span>
          </div>
        </div>
      )}
    </>
  )
}

export default UpdateManager