# Private Timer

A completely private interval timer for workouts - no tracking, no data collection, no compromises on privacy.

## Features

### Timer Modes
- **Intervals**: Custom work/rest periods with automatic round counting
- **EMOM**: Every Minute on the Minute training with customizable intervals

### Core Features
- 🔒 **100% Private** - All data stays on your device
- 🔊 **Audio Cues** - Different beeps for start, transitions, and completion
- 🎨 **Color-Coded Phases** - Visual indicators for work (green), rest (orange), EMOM (blue)
- 💾 **Save Workouts** - Store favorite configurations locally
- 📱 **PWA Ready** - Install as an app on mobile or desktop
- 🌐 **Offline First** - Works completely offline after first load

### Privacy First
- ❌ No user accounts or registration
- ❌ No data collection or analytics  
- ❌ No tracking pixels or cookies
- ❌ No external API calls
- ❌ No ads or third-party integrations
- ✅ Everything stored locally on your device

## Getting Started

### Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

```bash
npm run build
npm start
```

## How to Use

### Interval Training
1. Select "Intervals" mode
2. Set work time (e.g., 30 seconds)  
3. Set rest time (e.g., 10 seconds)
4. Choose total workout duration
5. Save configuration (optional)
6. Press "Start Workout"

### EMOM Training
1. Select "EMOM" mode
2. Set interval duration (e.g., 1 minute)
3. Choose total workout time
4. Save configuration (optional) 
5. Press "Start Workout"
6. Complete exercises within each interval

## Install as PWA

### Mobile (iOS/Android)
1. Open in Safari (iOS) or Chrome (Android)
2. Tap share button (iOS) or menu (Android)
3. Select "Add to Home Screen"
4. Launch from home screen like any app

### Desktop
1. Open in Chrome, Edge, or Firefox
2. Look for install icon in address bar
3. Click "Install Private Timer"
4. Launch like any desktop application

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Web Audio API** - Sound generation
- **next-pwa** - Progressive Web App functionality
- **Lucide React** - Icons

## Why This Exists

Most fitness apps collect extensive data about your workouts, location, and personal habits for advertising and analytics. Private Timer proves you can have a great user experience while respecting privacy completely.

Your workout data should stay with you - no compromises, no trade-offs.
