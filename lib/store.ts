import { create } from 'zustand'

export type TimerMode = 'intervals' | 'emom'
export type TimerPhase = 'work' | 'rest' | 'emom'
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed'

export interface WorkoutConfig {
  id: string
  name: string
  mode: TimerMode
  workTime: number // in seconds
  restTime: number // in seconds
  totalTime: number // in seconds
  intervalTime?: number // for EMOM mode
}

interface TimerState {
  // Current workout configuration
  currentConfig: WorkoutConfig
  
  // Timer state
  status: TimerStatus
  currentTime: number // countdown timer
  totalTimeRemaining: number
  currentRound: number
  totalRounds: number
  currentPhase: TimerPhase
  
  // Saved workouts
  savedWorkouts: WorkoutConfig[]
  
  // Actions
  setConfig: (config: Partial<WorkoutConfig>) => void
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  completeTimer: () => void
  updateTimer: (time: number, totalRemaining: number) => void
  nextPhase: () => void
  saveWorkout: (name: string) => void
  loadWorkout: (id: string) => void
  deleteWorkout: (id: string) => void
  calculateRounds: () => number
}

const defaultConfig: WorkoutConfig = {
  id: '',
  name: '',
  mode: 'intervals',
  workTime: 30,
  restTime: 10,
  totalTime: 300, // 5 minutes
  intervalTime: 60
}

export const useTimerStore = create<TimerState>((set, get) => ({
  currentConfig: defaultConfig,
  status: 'idle',
  currentTime: 30,
  totalTimeRemaining: 300,
  currentRound: 1,
  totalRounds: 1,
  currentPhase: 'work',
  savedWorkouts: [],

  setConfig: (config) => set((state) => {
    const newConfig = { ...state.currentConfig, ...config }
    const totalRounds = get().calculateRounds()
    
    return {
      currentConfig: newConfig,
      totalRounds,
      currentTime: newConfig.mode === 'intervals' ? newConfig.workTime : (newConfig.intervalTime || 60),
      totalTimeRemaining: newConfig.totalTime,
      currentRound: 1,
      currentPhase: newConfig.mode === 'intervals' ? 'work' : 'emom'
    }
  }),

  startTimer: () => set({ status: 'running' }),
  
  pauseTimer: () => set({ status: 'paused' }),
  
  resetTimer: () => set((state) => ({
    status: 'idle',
    currentTime: state.currentConfig.mode === 'intervals' 
      ? state.currentConfig.workTime 
      : (state.currentConfig.intervalTime || 60),
    totalTimeRemaining: state.currentConfig.totalTime,
    currentRound: 1,
    currentPhase: state.currentConfig.mode === 'intervals' ? 'work' : 'emom'
  })),

  completeTimer: () => set({ status: 'completed' }),

  updateTimer: (time, totalRemaining) => set({
    currentTime: time,
    totalTimeRemaining: totalRemaining
  }),

  nextPhase: () => set((state) => {
    const { currentConfig, currentPhase, currentRound } = state
    
    if (currentConfig.mode === 'emom') {
      return {
        currentRound: currentRound + 1,
        currentTime: currentConfig.intervalTime || 60
      }
    }
    
    // Intervals mode
    if (currentPhase === 'work') {
      return {
        currentPhase: 'rest' as TimerPhase,
        currentTime: currentConfig.restTime
      }
    } else {
      return {
        currentPhase: 'work' as TimerPhase,
        currentRound: currentRound + 1,
        currentTime: currentConfig.workTime
      }
    }
  }),

  calculateRounds: () => {
    const { currentConfig } = get()
    if (currentConfig.mode === 'emom') {
      return Math.floor(currentConfig.totalTime / (currentConfig.intervalTime || 60))
    }
    const cycleTime = currentConfig.workTime + currentConfig.restTime
    return Math.floor(currentConfig.totalTime / cycleTime)
  },

  saveWorkout: (name) => set((state) => {
    const workout: WorkoutConfig = {
      ...state.currentConfig,
      id: Date.now().toString(),
      name
    }
    
    const savedWorkouts = [...state.savedWorkouts, workout]
    localStorage.setItem('timer-workouts', JSON.stringify(savedWorkouts))
    
    return { savedWorkouts }
  }),

  loadWorkout: (id) => set((state) => {
    const workout = state.savedWorkouts.find(w => w.id === id)
    if (!workout) return state
    
    const totalRounds = get().calculateRounds()
    
    return {
      currentConfig: workout,
      totalRounds,
      currentTime: workout.mode === 'intervals' ? workout.workTime : (workout.intervalTime || 60),
      totalTimeRemaining: workout.totalTime,
      currentRound: 1,
      currentPhase: workout.mode === 'intervals' ? 'work' : 'emom',
      status: 'idle'
    }
  }),

  deleteWorkout: (id) => set((state) => {
    const savedWorkouts = state.savedWorkouts.filter(w => w.id !== id)
    localStorage.setItem('timer-workouts', JSON.stringify(savedWorkouts))
    return { savedWorkouts }
  })
}))

// Load saved workouts on initialization
if (typeof window !== 'undefined') {
  const savedWorkouts = localStorage.getItem('timer-workouts')
  if (savedWorkouts) {
    try {
      const workouts = JSON.parse(savedWorkouts)
      useTimerStore.setState({ savedWorkouts: workouts })
    } catch (error) {
      console.error('Failed to load saved workouts:', error)
    }
  }
}