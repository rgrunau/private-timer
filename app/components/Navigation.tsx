'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Timer, Save, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const Navigation = () => {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/',
      label: 'Timer',
      icon: Timer,
      active: pathname === '/' || pathname === '/timer'
    },
    {
      href: '/saved',
      label: 'Saved',
      icon: Save,
      active: pathname === '/saved'
    },
    {
      href: '/about',
      label: 'About',
      icon: Info,
      active: pathname === '/about'
    }
  ]

  return (
    <nav className="bg-gray-800 border-b border-gray-700/50 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 px-safe">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-3 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-lg p-2 -m-2"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(50)
                }
              }}
            >
              <div className="p-2 bg-blue-500/20 rounded-lg shadow-md">
                <Timer className="h-8 w-8 text-blue-400" />
              </div>
              <span className="text-xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Private Timer</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 transform min-w-[48px] min-h-[48px] justify-center sm:justify-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800',
                    item.active
                      ? 'bg-gray-700 text-white shadow-lg border border-gray-600/50 focus:ring-gray-500'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/80 hover:shadow-md focus:ring-gray-400'
                  )}
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      navigator.vibrate(50)
                    }
                  }}
                >
                  <Icon className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation