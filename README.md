# Private Timer

A completely private interval timer for workouts - no tracking, no data collection, no compromises on privacy.

## What Makes It Special

### 🔒 Privacy First Design
- **Zero data collection** - No analytics, tracking, or user accounts
- **Local storage only** - All workout data stays on your device
- **No external calls** - Works completely offline after first load
- **No ads or trackers** - Clean, focused experience

### ⏱️ Powerful Timer Modes

**Interval Training**
- Set custom work and rest periods (5s to 10min each)
- Automatic round counting based on total workout time
- Perfect for HIIT, Tabata, or circuit training
- Example: 30s work, 10s rest for 20 minutes = 30 rounds

**EMOM (Every Minute on the Minute)**
- Set interval duration (30s to 15min)
- Complete exercises within each interval, rest for remainder
- Great for strength training and pacing workouts
- Example: 5 burpees every minute for 10 minutes

### 📱 Mobile-First Features

**Screen Wake Lock**
- Keeps your phone screen on during workouts
- Automatically releases when timer stops or pauses
- No more missing cues because your screen went dark

**Haptic Feedback**
- Vibration cues on button presses and timer events
- Works alongside audio cues for better awareness
- Customizable audio on/off toggle

**PWA Installation**
- Install as a native app on any device
- Works offline once installed
- Full-screen experience without browser UI

### 🎨 Smart Visual Design

**Color-Coded Phases**
- **Green**: Work periods - time to push hard
- **Orange**: Rest periods - recover and prepare
- **Blue**: EMOM intervals - steady pacing
- **Purple**: Completion - workout finished!

**Dynamic Progress Bars**
- Individual phase progress (current work/rest/interval)
- Total workout progress with time remaining
- Visual feedback for motivation and pacing

**Responsive Timer Display**
- Large, easy-to-read countdown timer
- Works in any lighting condition
- Status messages for current phase and round

### 🔊 Audio System

**Smart Beep System**
- **Start beep** (600Hz): Workout begins
- **Transition beep** (800Hz): Phase changes
- **Completion sequence** (400Hz): Workout finished
- Generated using Web Audio API - no sound files needed

**Audio Controls**
- Toggle audio on/off during workouts
- Respects browser audio policies
- Works with device volume controls

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

### Quick Start
1. **Choose your mode**: Intervals for HIIT or EMOM for paced training
2. **Set your times**: Work/rest periods or interval duration
3. **Pick total duration**: How long you want to train
4. **Hit start**: Large green button begins your workout immediately

### Saving & Loading Workouts
- **Save configurations**: Name and store your favorite workout setups
- **Quick access**: Load saved workouts from the "Load Saved" page
- **Local storage**: All saved workouts stay on your device

### During Your Workout
- **Large timer display**: Easy to see from across the gym
- **Color changes**: Visual cues for each phase transition  
- **Audio cues**: Beeps signal starts, transitions, and completion
- **Progress tracking**: See current round and total progress
- **Pause/resume**: Life happens - pause anytime, resume when ready
- **Reset option**: Start over if you need to adjust mid-workout

### Real-World Examples

**HIIT Cardio Session**
- Mode: Intervals
- Work: 45 seconds, Rest: 15 seconds  
- Total: 20 minutes → 20 rounds
- Perfect for: Burpees, mountain climbers, jumping jacks

**Strength Training EMOM**
- Mode: EMOM
- Interval: 90 seconds
- Total: 15 minutes → 10 rounds
- Perfect for: 5 pull-ups every 90s, rest remaining time

**Tabata Protocol**
- Mode: Intervals
- Work: 20 seconds, Rest: 10 seconds
- Total: 4 minutes → 8 rounds
- Perfect for: High-intensity exercises, research-backed timing

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

Most fitness timer apps are bloated with ads, require accounts, track your data, or cost money for basic features. We built Private Timer because:

- **Your workout data should stay private** - No accounts, no cloud sync, no data mining
- **Simple tools should stay simple** - Timer apps don't need social features or premium subscriptions  
- **Offline should be the default** - Your gym doesn't always have WiFi
- **Free should mean free** - No hidden costs, premium tiers, or advertising

Private Timer proves you can have a beautiful, full-featured workout timer while respecting your privacy completely.

## Contributing

Found a bug or want to improve something? Check out the [CLAUDE.md](CLAUDE.md) file for development guidance, or open an issue on GitHub.
