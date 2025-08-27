'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Pause, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react'
import { useTimerStore } from '@/lib/store'
import { formatTime, getPhaseColor, getPhaseTextColor, getPhaseLabel } from '@/lib/utils'
import { playStartBeep, playTransitionBeep, playCompletionBeep, setAudioEnabled } from '@/lib/audio'
import { useWakeLock } from '@/lib/useWakeLock'

export default function TimerPage() {
  const router = useRouter()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [audioEnabled, setAudioEnabledState] = useState(true)
  const { requestWakeLock, releaseWakeLock } = useWakeLock()
  
  const {
    currentConfig,
    status,
    currentTime,
    totalTimeRemaining,
    currentRound,
    totalRounds,
    currentPhase,
    startTimer,
    pauseTimer,
    resetTimer,
    completeTimer,
    updateTimer,
    nextPhase
  } = useTimerStore()

  const progress = currentConfig.mode === 'intervals'
    ? currentPhase === 'work'
      ? ((currentConfig.workTime - currentTime) / currentConfig.workTime) * 100
      : ((currentConfig.restTime - currentTime) / currentConfig.restTime) * 100
    : ((currentConfig.intervalTime! - currentTime) / currentConfig.intervalTime!) * 100

  const totalProgress = ((currentConfig.totalTime - totalTimeRemaining) / currentConfig.totalTime) * 100

  useEffect(() => {
    setAudioEnabled(audioEnabled)
  }, [audioEnabled])

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        updateTimer(
          Math.max(0, currentTime - 1),
          Math.max(0, totalTimeRemaining - 1)
        )

        if (currentTime <= 1) {
          if (totalTimeRemaining <= 1) {
            completeTimer()
            playCompletionBeep()
            releaseWakeLock()
            clearInterval(intervalRef.current!)
          } else {
            nextPhase()
            playTransitionBeep()
          }
        }
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [status, currentTime, totalTimeRemaining, updateTimer, completeTimer, nextPhase, releaseWakeLock])

  const handleStart = async () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(100)
    }
    await requestWakeLock()
    startTimer()
    await playStartBeep()
  }

  const handlePause = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50)
    }
    pauseTimer()
  }

  const handleReset = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(100)
    }
    releaseWakeLock()
    resetTimer()
  }

  const handleHome = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    releaseWakeLock()
    router.push('/')
  }

  const toggleAudio = () => {
    setAudioEnabledState(!audioEnabled)
  }

  const getTimeDisplay = () => {
    if (status === 'completed') {
      return '00:00'
    }
    return formatTime(currentTime)
  }

  const getStatusMessage = () => {
    if (status === 'completed') {
      return 'Workout Complete!'
    }
    if (status === 'idle') {
      return 'Ready to Start'
    }
    if (status === 'paused') {
      return 'Paused'
    }
    
    if (currentConfig.mode === 'emom') {
      return `Round ${currentRound} of ${totalRounds}`
    }
    
    return `${getPhaseLabel(currentPhase)} - Round ${currentRound} of ${totalRounds}`
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col pb-safe">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex justify-between items-center pt-safe shadow-lg">
        <button
          onClick={handleHome}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 transform p-2 rounded-lg hover:bg-gray-700"
        >
          <Home className="h-5 w-5" />
          <span className="hidden sm:inline">Home</span>
        </button>
        
        <button
          onClick={toggleAudio}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 transform p-2 rounded-lg hover:bg-gray-700"
        >
          {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          <span className="hidden sm:inline">{audioEnabled ? 'Audio On' : 'Audio Off'}</span>
        </button>
      </div>

      {/* Main Timer Display */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Phase Indicator */}
        <div 
          className={`inline-flex items-center px-8 py-4 rounded-2xl text-xl font-bold mb-8 shadow-lg transform transition-all duration-300 ${
            status === 'completed' 
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-purple-100 animate-pulse' 
              : `${getPhaseColor(currentPhase)} text-white hover:scale-105`
          }`}
        >
          {status === 'completed' ? '🎉 COMPLETE' : getPhaseLabel(currentPhase)}
        </div>

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div 
            className={`text-8xl sm:text-9xl font-mono font-bold mb-4 ${
              status === 'completed' 
                ? 'text-purple-400' 
                : getPhaseTextColor(currentPhase)
            }`}
          >
            {getTimeDisplay()}
          </div>
          
          {/* Progress Bar */}
          <div className="w-80 max-w-full bg-gray-700 rounded-full h-4 mb-8 shadow-inner overflow-hidden">
            <div 
              className={`h-4 rounded-full transition-all duration-1000 ease-linear shadow-sm ${
                status === 'completed' 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
                  : `bg-gradient-to-r ${getPhaseColor(currentPhase)} to-${getPhaseColor(currentPhase)}/80`
              }`}
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>

          {/* Status Message */}
          <div className="text-2xl font-semibold text-gray-200 mb-3">
            {getStatusMessage()}
          </div>
          
          {/* Total Progress */}
          <div className="text-base text-gray-400 bg-gray-800/50 rounded-lg px-4 py-2">
            {formatTime(totalTimeRemaining)} remaining • {Math.round(totalProgress)}% complete
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-6 px-4">
          {status === 'completed' ? (
            <>
              <button
                onClick={handleReset}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 transform shadow-lg flex items-center space-x-3 text-lg"
              >
                <RotateCcw className="h-6 w-6" />
                <span>Restart</span>
              </button>
              <button
                onClick={handleHome}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 transform shadow-lg flex items-center space-x-3 text-lg"
              >
                <Home className="h-6 w-6" />
                <span>New Workout</span>
              </button>
            </>
          ) : (
            <>
              {status === 'running' ? (
                <button
                  onClick={handlePause}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-10 rounded-xl transition-all duration-200 hover:scale-105 transform shadow-xl flex items-center space-x-3 text-xl"
                >
                  <Pause className="h-7 w-7" />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-5 px-10 rounded-xl transition-all duration-200 hover:scale-105 transform shadow-xl flex items-center space-x-3 text-xl"
                >
                  <Play className="h-7 w-7" />
                  <span>{status === 'paused' ? 'Resume' : 'Start'}</span>
                </button>
              )}
              
              <button
                onClick={handleReset}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 transform shadow-lg flex items-center space-x-2"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>

        {/* Workout Info */}
        <div className="mt-16 text-center text-gray-400 text-base max-w-md bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
          {currentConfig.mode === 'intervals' ? (
            <>
              <div className="mb-2">
                <span className="text-green-400 font-semibold">Work:</span> {formatTime(currentConfig.workTime)} • <span className="text-orange-400 font-semibold">Rest:</span> {formatTime(currentConfig.restTime)}
              </div>
              <div className="text-gray-300">
                <span className="font-semibold">{totalRounds}</span> rounds • <span className="font-semibold">{formatTime(currentConfig.totalTime)}</span> total
              </div>
            </>
          ) : (
            <>
              <div className="mb-2">
                <span className="text-blue-400 font-semibold">EMOM:</span> {formatTime(currentConfig.intervalTime || 60)} intervals
              </div>
              <div className="text-gray-300">
                <span className="font-semibold">{totalRounds}</span> intervals • <span className="font-semibold">{formatTime(currentConfig.totalTime)}</span> total
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}