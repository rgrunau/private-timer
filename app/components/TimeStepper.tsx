'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Minus, Plus } from 'lucide-react'
import { formatTime } from '@/lib/utils'

interface TimeStepperProps {
  value: number // in seconds
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label: string
  labelColor?: string
  type?: 'time' | 'minutes'
  suffix?: string
}

const TimeStepper = ({ 
  value, 
  onChange, 
  min = 5, 
  max = 3600, 
  step = 5, 
  label,
  labelColor = 'text-gray-300',
  type = 'time',
  suffix = ''
}: TimeStepperProps) => {
  const [isPressed, setIsPressed] = useState<'minus' | 'plus' | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const hapticFeedback = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50)
    }
  }, [])

  const increment = useCallback(() => {
    const newValue = Math.min(value + step, max)
    if (newValue !== value) {
      onChange(newValue)
      hapticFeedback()
    }
  }, [value, step, max, onChange, hapticFeedback])

  const decrement = useCallback(() => {
    const newValue = Math.max(value - step, min)
    if (newValue !== value) {
      onChange(newValue)
      hapticFeedback()
    }
  }, [value, step, min, onChange, hapticFeedback])

  const startLongPress = useCallback((action: 'increment' | 'decrement') => {
    const fn = action === 'increment' ? increment : decrement
    
    // Initial delay before rapid changes
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(fn, 100) // Rapid changes every 100ms
    }, 500) // Start rapid changes after 500ms
    
    // Execute once immediately
    fn()
  }, [increment, decrement])

  const stopLongPress = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsPressed(null)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLongPress()
    }
  }, [stopLongPress])

  const formatValue = () => {
    if (type === 'minutes') {
      return `${value}${suffix}`
    }
    return formatTime(value)
  }

  const buttonClass = (direction: 'minus' | 'plus') => `
    flex-shrink-0 w-14 h-14 rounded-xl font-semibold text-lg
    transition-all duration-200 ease-out
    active:scale-95 hover:scale-105 transform
    ${isPressed === direction 
      ? 'bg-gray-600 shadow-inner' 
      : 'bg-gray-700 hover:bg-gray-600 shadow-lg hover:shadow-xl'
    }
    ${direction === 'minus' ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}
    flex items-center justify-center
    select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    min-h-[44px] min-w-[44px]
  `

  return (
    <div className="space-y-3">
      <label className={`text-sm font-medium ${labelColor}`}>
        {label}
      </label>
      
      <div className="flex items-center justify-center space-x-4">
        <button
          type="button"
          className={buttonClass('minus')}
          disabled={value <= min}
          onMouseDown={() => {
            setIsPressed('minus')
            startLongPress('decrement')
          }}
          onMouseUp={stopLongPress}
          onMouseLeave={stopLongPress}
          onTouchStart={(e) => {
            e.preventDefault()
            setIsPressed('minus')
            startLongPress('decrement')
          }}
          onTouchEnd={stopLongPress}
          onTouchCancel={stopLongPress}
          aria-label={`Decrease ${label.toLowerCase()}`}
        >
          <Minus className="h-5 w-5" />
        </button>

        <div className="flex-1 min-w-0 max-w-28">
          <div className="bg-gray-800 border-2 border-gray-600 rounded-xl px-4 py-4 text-center shadow-md hover:shadow-lg transition-shadow duration-200 min-h-[56px] flex items-center justify-center">
            <div className="text-xl font-mono font-bold text-white leading-none">
              {formatValue()}
            </div>
          </div>
        </div>

        <button
          type="button"
          className={buttonClass('plus')}
          disabled={value >= max}
          onMouseDown={() => {
            setIsPressed('plus')
            startLongPress('increment')
          }}
          onMouseUp={stopLongPress}
          onMouseLeave={stopLongPress}
          onTouchStart={(e) => {
            e.preventDefault()
            setIsPressed('plus')
            startLongPress('increment')
          }}
          onTouchEnd={stopLongPress}
          onTouchCancel={stopLongPress}
          aria-label={`Increase ${label.toLowerCase()}`}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default TimeStepper