# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `npm run dev` - Start development server with Turbopack (auto-reload at http://localhost:3000)
- `npm run build` - Build production version with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality

### Testing Build
Always run `npm run build` after making changes to verify there are no TypeScript errors or build issues.

## Architecture Overview

### Core Technology Stack
- **Next.js 15** with App Router and Turbopack for fast builds
- **TypeScript** for type safety
- **Tailwind CSS** for styling with custom configuration
- **Zustand** for lightweight state management
- **PWA** capabilities via next-pwa with offline support

### State Management (lib/store.ts)
The app uses Zustand with a single store (`useTimerStore`) that manages:
- **Workout Configuration**: Timer modes (intervals/EMOM), durations, and settings
- **Timer State**: Current time, phase, round tracking, and status
- **Saved Workouts**: Local storage persistence for user configurations

Key timer modes:
- **Intervals**: Work/rest cycles (e.g., 30s work, 10s rest)
- **EMOM**: Every Minute on the Minute training

### Audio System (lib/audio.ts)
Uses Web Audio API for generated beeps:
- **Start beep**: 600Hz for workout initiation
- **Transition beep**: 800Hz for phase changes
- **Completion beep**: 400Hz sequence for workout end
- Handles browser audio policy requirements and context suspension

### Screen Wake Lock (lib/useWakeLock.ts)
Prevents mobile screen dimming during active timers:
- Activates when timer starts
- Releases when timer pauses/stops/completes
- Handles visibility changes and browser compatibility

### Privacy Architecture
This app is completely private:
- No external API calls or analytics
- All data stored in localStorage
- No user accounts or cloud sync
- Offline-first PWA design

### App Structure
- **app/page.tsx** - Timer configuration and mode selection
- **app/timer/page.tsx** - Active timer with controls and progress
- **app/saved/page.tsx** - Saved workout configurations
- **app/components/** - Reusable UI components

### Key Features to Maintain
1. **Offline Functionality** - App must work without internet
2. **Privacy** - Never add external services or tracking
3. **PWA Compliance** - Maintain manifest.json and service worker compatibility
4. **Mobile Optimization** - Touch-friendly controls and responsive design
5. **Audio Cues** - Maintain Web Audio API beeps for accessibility

### Development Notes
- The app uses localStorage for persistence - test in browsers with developer tools
- Audio requires user interaction to initialize - handled in timer start flow
- Wake lock is browser-dependent - gracefully degrades on unsupported devices
- Build warnings about Webpack/Turbopack configuration are expected and can be ignored