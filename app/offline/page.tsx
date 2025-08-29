'use client'

import { useEffect, useState } from 'react'
import { WifiOff, RefreshCw, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function OfflinePage() {
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload()
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className={`rounded-full p-8 ${isOnline ? 'bg-green-500/20' : 'bg-gray-700'}`}>
            <WifiOff className={`h-16 w-16 ${isOnline ? 'text-green-400' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">
            {isOnline ? 'Back Online!' : 'You\'re Offline'}
          </h1>
          <p className="text-gray-400 text-lg">
            {isOnline 
              ? 'Your connection has been restored. You can now access all features.'
              : 'It looks like you\'re not connected to the internet. Private Timer works offline, but some features may be limited.'
            }
          </p>
        </div>

        {/* Offline features */}
        {!isOnline && (
          <div className="bg-gray-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">Available Offline:</h2>
            <ul className="text-left text-gray-300 space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Timer functionality</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Saved workouts</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Audio cues</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>All core features</span>
              </li>
            </ul>
          </div>
        )}

        {/* Connection status indicator */}
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
          isOnline 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-gray-700 text-gray-400 border border-gray-600'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
          }`}></div>
          <span>{isOnline ? 'Connected' : 'Offline'}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetry}
            disabled={!isOnline}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>{isOnline ? 'Reload Page' : 'Retry Connection'}</span>
          </button>
          
          <button
            onClick={handleGoHome}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </button>
        </div>

        {/* Footer message */}
        <p className="text-sm text-gray-500">
          Private Timer is designed to work offline. Your data stays on your device.
        </p>
      </div>
    </div>
  )
}