'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Settings, Clock, CheckCircle2 } from 'lucide-react'
import { useTimerStore, TimerMode } from '@/lib/store'
import { formatTime, formatDuration } from '@/lib/utils'
import { initializeAudio } from '@/lib/audio'
import TimeStepper from './components/TimeStepper'

export default function Home() {
  const router = useRouter()
  const { currentConfig, setConfig, calculateRounds } = useTimerStore()
  
  const [workTime, setWorkTime] = useState(currentConfig.workTime)
  const [restTime, setRestTime] = useState(currentConfig.restTime)
  const [totalTime, setTotalTime] = useState(currentConfig.totalTime)
  const [intervalTime, setIntervalTime] = useState(currentConfig.intervalTime || 60)

  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [workoutName, setWorkoutName] = useState('')
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleModeChange = (mode: TimerMode) => {
    setConfig({ mode })
  }

  const handleTimeUpdate = useCallback(() => {
    setConfig({
      workTime,
      restTime,
      totalTime,
      intervalTime
    })
  }, [workTime, restTime, totalTime, intervalTime, setConfig])

  useEffect(() => {
    handleTimeUpdate()
  }, [handleTimeUpdate])

  const totalRounds = calculateRounds()

  const handleStart = async () => {
    await initializeAudio()
    router.push('/timer')
  }

  const handleSave = async () => {
    if (workoutName.trim()) {
      setIsLoading(true)
      
      // Haptic feedback
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(100)
      }
      
      const { saveWorkout } = useTimerStore.getState()
      saveWorkout(workoutName.trim())
      
      setWorkoutName('')
      setShowSaveDialog(false)
      setIsLoading(false)
      setShowSuccessAnimation(true)
      
      // Hide success animation after 2 seconds
      setTimeout(() => setShowSuccessAnimation(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pb-safe">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 pt-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Setup Timer</h1>
          <p className="text-gray-400 text-lg">Configure your workout and start training</p>
        </div>

        {/* Mode Selection */}
        <div className="bg-gray-800 rounded-xl p-6 space-y-6 shadow-lg border border-gray-700/50">
          <h2 className="text-xl font-semibold flex items-center">
            <Settings className="mr-2 h-5 w-5 text-gray-400" />
            Timer Mode
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                handleModeChange('intervals')
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(50)
                }
              }}
              className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 transform active:scale-95 min-h-[80px] ${
                currentConfig.mode === 'intervals'
                  ? 'border-green-500 bg-green-500/20 text-green-400 shadow-lg shadow-green-500/20'
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-650 shadow-md hover:shadow-lg'
              }`}
            >
              <div className="text-lg font-semibold">Intervals</div>
              <div className="text-sm text-gray-400 mt-1">Work/Rest cycles</div>
            </button>
            <button
              onClick={() => {
                handleModeChange('emom')
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(50)
                }
              }}
              className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 transform active:scale-95 min-h-[80px] ${
                currentConfig.mode === 'emom'
                  ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20'
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-650 shadow-md hover:shadow-lg'
              }`}
            >
              <div className="text-lg font-semibold">EMOM</div>
              <div className="text-sm text-gray-400 mt-1">Every Minute on the Minute</div>
            </button>
          </div>
        </div>

        {/* Timer Configuration */}
        <div className="bg-gray-800 rounded-xl p-6 space-y-8 shadow-lg border border-gray-700/50">
          <h2 className="text-xl font-semibold flex items-center">
            <Clock className="mr-2 h-5 w-5 text-gray-400" />
            Timer Settings
          </h2>

          {currentConfig.mode === 'intervals' ? (
            <>
              <TimeStepper
                value={workTime}
                onChange={setWorkTime}
                min={5}
                max={600}
                step={5}
                label="Work Time"
                labelColor="text-green-400"
              />
              
              <TimeStepper
                value={restTime}
                onChange={setRestTime}
                min={5}
                max={300}
                step={5}
                label="Rest Time"
                labelColor="text-orange-400"
              />
            </>
          ) : (
            <TimeStepper
              value={intervalTime}
              onChange={setIntervalTime}
              min={30}
              max={300}
              step={15}
              label="Interval Time"
              labelColor="text-blue-400"
            />
          )}

          <TimeStepper
            value={totalTime / 60}
            onChange={(value) => setTotalTime(value * 60)}
            min={1}
            max={120}
            step={1}
            label="Total Workout Time"
            labelColor="text-gray-300"
            type="minutes"
            suffix=" min"
          />
        </div>

        {/* Workout Preview */}
        <div className="bg-gray-800 rounded-xl p-6 space-y-6 shadow-lg border border-gray-700/50">
          <h3 className="text-xl font-semibold text-center flex items-center justify-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Workout Preview
          </h3>
          <div className="grid grid-cols-2 gap-6 text-center">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-600/30">
              <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-none">{totalRounds}</div>
              <div className="text-sm text-gray-400 font-medium uppercase tracking-wide">
                {currentConfig.mode === 'intervals' ? 'Rounds' : 'Intervals'}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-600/30">
              <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent leading-none">{formatDuration(currentConfig.totalTime)}</div>
              <div className="text-sm text-gray-400 font-medium uppercase tracking-wide">Total Time</div>
            </div>
          </div>
          
          {currentConfig.mode === 'intervals' && (
            <div className="text-center bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-lg p-4 border border-gray-600/30">
              <div className="text-sm text-gray-300">
                Each round: <span className="text-green-400 font-semibold">{formatTime(currentConfig.workTime)} work</span> + <span className="text-orange-400 font-semibold">{formatTime(currentConfig.restTime)} rest</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pb-8">
          <button
            onClick={() => {
              handleStart()
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([100, 50, 100])
              }
            }}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:from-green-700 active:to-green-800 text-white font-bold py-6 px-6 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 transform shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 min-h-[64px] flex items-center justify-center space-x-3"
          >
            <Play className="h-7 w-7" />
            <span className="text-xl font-semibold">Start Workout</span>
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setShowSaveDialog(true)
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(50)
                }
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white font-semibold py-5 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 transform shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 min-h-[56px]"
            >
              Save Configuration
            </button>
            <button
              onClick={() => {
                router.push('/saved')
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(50)
                }
              }}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 active:from-gray-800 active:to-gray-900 text-white font-semibold py-5 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 transform shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 min-h-[56px]"
            >
              Load Saved
            </button>
          </div>
        </div>
        
        {/* Success Animation */}
        {showSuccessAnimation && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none animate-in fade-in-0 duration-300">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full p-6 animate-bounce shadow-2xl shadow-green-500/50">
              <CheckCircle2 className="h-16 w-16 text-white" />
            </div>
          </div>
        )}

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in-0 duration-200">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-700/50 animate-in zoom-in-95 duration-200">
              <h3 className="text-xl font-semibold mb-6 text-center">Save Workout</h3>
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="Enter workout name..."
                className="w-full bg-gray-700 border-2 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-4 mb-6 text-lg transition-all duration-200 outline-none"
                autoFocus
              />
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  disabled={!workoutName.trim() || isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 transform shadow-lg hover:shadow-xl disabled:hover:scale-100 disabled:opacity-50 flex items-center justify-center min-h-[48px]"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Save'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowSaveDialog(false)
                    setWorkoutName('')
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      navigator.vibrate(50)
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 active:from-gray-800 active:to-gray-900 disabled:opacity-50 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 transform shadow-lg hover:shadow-xl disabled:hover:scale-100 min-h-[48px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
