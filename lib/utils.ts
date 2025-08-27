import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  } else {
    return `${remainingSeconds}s`
  }
}

export function parseTimeInput(value: string): number {
  const num = parseInt(value, 10)
  return isNaN(num) || num < 0 ? 0 : num
}

export function secondsToMinutes(seconds: number): number {
  return Math.floor(seconds / 60)
}

export function minutesToSeconds(minutes: number): number {
  return minutes * 60
}

export function calculateTotalWorkoutTime(workTime: number, restTime: number, rounds: number): number {
  return (workTime + restTime) * rounds
}

export function calculateRoundsFromTime(workTime: number, restTime: number, totalTime: number): number {
  if (workTime + restTime === 0) return 0
  return Math.floor(totalTime / (workTime + restTime))
}

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export function getPhaseColor(phase: 'work' | 'rest' | 'emom'): string {
  switch (phase) {
    case 'work':
      return 'bg-green-500'
    case 'rest':
      return 'bg-orange-500'
    case 'emom':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

export function getPhaseTextColor(phase: 'work' | 'rest' | 'emom'): string {
  switch (phase) {
    case 'work':
      return 'text-green-600'
    case 'rest':
      return 'text-orange-600'
    case 'emom':
      return 'text-blue-600'
    default:
      return 'text-gray-600'
  }
}

export function getPhaseLabel(phase: 'work' | 'rest' | 'emom'): string {
  switch (phase) {
    case 'work':
      return 'WORK'
    case 'rest':
      return 'REST'
    case 'emom':
      return 'EMOM'
    default:
      return 'TIMER'
  }
}

export function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}