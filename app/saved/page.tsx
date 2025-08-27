'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Trash2, Plus, Clock, Zap } from 'lucide-react'
import { useTimerStore, WorkoutConfig } from '@/lib/store'
import { formatTime, formatDuration } from '@/lib/utils'

export default function SavedPage() {
  const router = useRouter()
  const { savedWorkouts, loadWorkout, deleteWorkout } = useTimerStore()
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null)

  // Load saved workouts from localStorage on component mount
  useEffect(() => {
    const loadSavedWorkouts = () => {
      const saved = localStorage.getItem('timer-workouts')
      if (saved) {
        try {
          const workouts = JSON.parse(saved)
          useTimerStore.setState({ savedWorkouts: workouts })
        } catch (error) {
          console.error('Failed to load saved workouts:', error)
        }
      }
    }
    
    loadSavedWorkouts()
  }, [])

  const handleLoad = (id: string) => {
    loadWorkout(id)
    router.push('/')
  }

  const handleDelete = (id: string) => {
    deleteWorkout(id)
    setShowDeleteDialog(null)
  }

  const confirmDelete = (id: string) => {
    setShowDeleteDialog(id)
  }

  const calculateRoundsForWorkout = (workout: WorkoutConfig): number => {
    if (workout.mode === 'emom') {
      return Math.floor(workout.totalTime / (workout.intervalTime || 60))
    }
    const cycleTime = workout.workTime + workout.restTime
    return Math.floor(workout.totalTime / cycleTime)
  }

  const getWorkoutTypeIcon = (mode: string) => {
    return mode === 'intervals' ? <Clock className="h-5 w-5" /> : <Zap className="h-5 w-5" />
  }

  const getWorkoutTypeColor = (mode: string) => {
    return mode === 'intervals' ? 'text-green-400' : 'text-blue-400'
  }

  const workoutToDelete = savedWorkouts.find(w => w.id === showDeleteDialog)

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pb-safe">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Saved Workouts</h1>
          <p className="text-gray-400 text-lg">Load your favorite workout configurations</p>
        </div>

        {/* Empty State */}
        {savedWorkouts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md mx-auto shadow-xl border border-gray-700">
              <div className="text-gray-500 mb-6">
                <Plus className="h-20 w-20 mx-auto opacity-50" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-200">No Saved Workouts</h2>
              <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                Create and save your workout configurations to access them quickly.
              </p>
              <button
                onClick={() => {
                  router.push('/')
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(50)
                  }
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 transform shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 min-h-[56px]"
              >
                Create Workout
              </button>
            </div>
          </div>
        ) : (
          /* Workout List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedWorkouts.map((workout) => {
              const rounds = calculateRoundsForWorkout(workout)
              
              return (
                <div key={workout.id} className="bg-gray-800 rounded-2xl p-6 space-y-5 shadow-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-200 hover:scale-105 hover:shadow-xl transform">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getWorkoutTypeColor(workout.mode)} bg-opacity-20`}>
                        {getWorkoutTypeIcon(workout.mode)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg line-clamp-1 text-white">{workout.name}</h3>
                        <p className="text-sm text-gray-400 capitalize font-medium">{workout.mode}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        confirmDelete(workout.id)
                        if (typeof navigator !== 'undefined' && navigator.vibrate) {
                          navigator.vibrate(50)
                        }
                      }}
                      className="text-gray-400 hover:text-red-400 active:text-red-500 transition-all duration-200 p-3 rounded-lg hover:bg-red-500/20 active:bg-red-500/30 hover:scale-110 active:scale-95 transform min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    {workout.mode === 'intervals' ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Work:</span>
                          <span className="text-green-400">{formatTime(workout.workTime)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Rest:</span>
                          <span className="text-orange-400">{formatTime(workout.restTime)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Interval:</span>
                        <span className="text-blue-400">{formatTime(workout.intervalTime || 60)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Rounds:</span>
                      <span className="text-white">{rounds}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total:</span>
                      <span className="text-white">{formatDuration(workout.totalTime)}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.vibrate) {
                        navigator.vibrate([100, 50, 100])
                      }
                      handleLoad(workout.id)
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:from-green-700 active:to-green-800 text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 transform shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center space-x-2 min-h-[56px]"
                  >
                    <Play className="h-6 w-6" />
                    <span className="text-lg font-semibold">Load & Start</span>
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Add New Workout Button */}
        <div className="mt-12 text-center pb-8">
          <button
            onClick={() => {
              router.push('/')
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(50)
              }
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white font-bold py-5 px-8 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 transform shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center space-x-3 mx-auto min-h-[60px]"
          >
            <Plus className="h-6 w-6" />
            <span className="text-lg font-semibold">Create New Workout</span>
          </button>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && workoutToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in-0 duration-200">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-700/50 animate-in zoom-in-95 duration-200">
              <h3 className="text-xl font-bold mb-3 text-center">Delete Workout</h3>
              <p className="text-gray-300 mb-6 text-center leading-relaxed">
                Are you sure you want to delete &ldquo;<span className="font-semibold text-white">{workoutToDelete.name}</span>&rdquo;? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      navigator.vibrate(100)
                    }
                    handleDelete(showDeleteDialog)
                  }}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800 text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 transform shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 min-h-[48px]"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteDialog(null)
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      navigator.vibrate(50)
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 active:from-gray-800 active:to-gray-900 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 transform shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 min-h-[48px]"
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