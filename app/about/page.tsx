import { Shield, Smartphone, Timer, Volume2, Save, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">About Private Timer</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A completely private interval timer designed for fitness enthusiasts who value their privacy.
          </p>
        </div>

        {/* Privacy First */}
        <div className="bg-gray-800 rounded-xl p-8 space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-green-400" />
            <h2 className="text-2xl font-semibold">Privacy First</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-400">What We DON&apos;T Do</h3>
              <ul className="space-y-2 text-gray-300">
                <li>❌ No user accounts or registration</li>
                <li>❌ No data collection or analytics</li>
                <li>❌ No tracking pixels or cookies</li>
                <li>❌ No external API calls</li>
                <li>❌ No ads or third-party integrations</li>
                <li>❌ No workout data sent anywhere</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-400">What We DO</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✅ Store everything locally on your device</li>
                <li>✅ Work completely offline</li>
                <li>✅ Respect your privacy 100%</li>
                <li>✅ Keep your workouts private</li>
                <li>✅ Fast, responsive performance</li>
                <li>✅ No internet required after first load</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Timer className="h-6 w-6 text-green-400" />
                <h3 className="font-semibold">Interval Training</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Set custom work and rest periods with automatic round counting.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-blue-400" />
                <h3 className="font-semibold">EMOM Timer</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Every Minute on the Minute training with customizable intervals.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-6 w-6 text-orange-400" />
                <h3 className="font-semibold">Audio Cues</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Different beeps for start, transitions, and completion using Web Audio.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Save className="h-6 w-6 text-purple-400" />
                <h3 className="font-semibold">Save Workouts</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Save your favorite configurations locally for quick access.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-6 w-6 text-pink-400" />
                <h3 className="font-semibold">PWA Ready</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Install as an app on your phone or desktop for native experience.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-cyan-400" />
                <h3 className="font-semibold">Offline First</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Works completely offline after first load. No internet required.
              </p>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">How to Use</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-400">Interval Training</h3>
              <ol className="space-y-2 text-gray-300">
                <li>1. Select &ldquo;Intervals&rdquo; mode</li>
                <li>2. Set your work time (e.g., 30 seconds)</li>
                <li>3. Set your rest time (e.g., 10 seconds)</li>
                <li>4. Choose total workout duration</li>
                <li>5. Save configuration (optional)</li>
                <li>6. Press &ldquo;Start Workout&rdquo;</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-400">EMOM Training</h3>
              <ol className="space-y-2 text-gray-300">
                <li>1. Select &ldquo;EMOM&rdquo; mode</li>
                <li>2. Set interval duration (e.g., 1 minute)</li>
                <li>3. Choose total workout time</li>
                <li>4. Save configuration (optional)</li>
                <li>5. Press &ldquo;Start Workout&rdquo;</li>
                <li>6. Complete exercises within each interval</li>
              </ol>
            </div>
          </div>
        </div>

        {/* PWA Installation */}
        <div className="bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center space-x-2">
            <Smartphone className="h-6 w-6" />
            <span>Install as App</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-400">Mobile (iOS/Android)</h3>
              <ol className="space-y-2 text-gray-300">
                <li>1. Open in Safari (iOS) or Chrome (Android)</li>
                <li>2. Tap the share button (iOS) or menu (Android)</li>
                <li>3. Select &ldquo;Add to Home Screen&rdquo;</li>
                <li>4. Confirm installation</li>
                <li>5. Launch from home screen like any app</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-400">Desktop</h3>
              <ol className="space-y-2 text-gray-300">
                <li>1. Open in Chrome, Edge, or Firefox</li>
                <li>2. Look for install icon in address bar</li>
                <li>3. Click &ldquo;Install Private Timer&rdquo;</li>
                <li>4. App will appear in applications folder</li>
                <li>5. Launch like any desktop application</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Why This Exists */}
        <div className="bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-4">
              Most fitness apps today collect extensive data about your workouts, location, device information, 
              and personal habits. They use this data for advertising, analytics, and sometimes sell it to third parties.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong>Private Timer</strong> was built on a simple principle: your workout data should stay with you. 
              You shouldn&apos;t have to surrender your privacy just to use a simple interval timer.
            </p>
            <p className="text-gray-300 leading-relaxed">
              This app proves that you can have a great user experience while respecting privacy. 
              No compromises, no trade-offs - just a clean, fast, private timer for your workouts.
            </p>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Technical Details</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-green-400">Built With</h3>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Next.js 15 (React framework)</li>
                <li>• TypeScript (type safety)</li>
                <li>• Tailwind CSS (styling)</li>
                <li>• Zustand (state management)</li>
                <li>• Web Audio API (sound)</li>
                <li>• PWA (Progressive Web App)</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-blue-400">Data Storage</h3>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• localStorage for saved workouts</li>
                <li>• No cookies or tracking</li>
                <li>• No external databases</li>
                <li>• All data stays on your device</li>
                <li>• Can be cleared anytime</li>
                <li>• No backup or sync</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm py-8">
          <p>Private Timer - Your workout data stays with you.</p>
          <p className="mt-2">Built with ❤️ for privacy-conscious fitness enthusiasts.</p>
        </div>
      </div>
    </div>
  )
}