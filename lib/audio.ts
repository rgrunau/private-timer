export type BeepType = 'start' | 'transition' | 'completion'

class AudioManager {
  private audioContext: AudioContext | null = null
  private isEnabled: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioContext()
    }
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
      this.isEnabled = false
    }
  }

  private async createBeep(frequency: number, duration: number = 200): Promise<void> {
    if (!this.audioContext || !this.isEnabled) return

    // Resume audio context if suspended (required for user interaction)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    oscillator.type = 'sine'

    // Envelope to prevent clicks
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration / 1000)
  }

  async playBeep(type: BeepType): Promise<void> {
    switch (type) {
      case 'start':
        await this.createBeep(600, 300) // 600Hz for start
        break
      case 'transition':
        await this.createBeep(800, 200) // 800Hz for transitions
        break
      case 'completion':
        // Play a sequence for completion
        await this.createBeep(400, 200)
        await new Promise(resolve => setTimeout(resolve, 100))
        await this.createBeep(400, 200)
        await new Promise(resolve => setTimeout(resolve, 100))
        await this.createBeep(400, 400)
        break
    }
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }

  isAudioEnabled(): boolean {
    return this.isEnabled && this.audioContext !== null
  }

  // Initialize audio context on first user interaction
  async initialize(): Promise<void> {
    if (!this.audioContext && typeof window !== 'undefined') {
      this.initAudioContext()
    }
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }
}

// Singleton instance
export const audioManager = new AudioManager()

// Convenience functions
export const playStartBeep = () => audioManager.playBeep('start')
export const playTransitionBeep = () => audioManager.playBeep('transition')
export const playCompletionBeep = () => audioManager.playBeep('completion')
export const initializeAudio = () => audioManager.initialize()
export const setAudioEnabled = (enabled: boolean) => audioManager.setEnabled(enabled)
export const isAudioSupported = () => audioManager.isAudioEnabled()