import { Platform } from 'react-native';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private isLoaded = false;

  async loadSounds(): Promise<void> {
    if (this.isLoaded) return;

    try {
      if (Platform.OS === 'web') {
        // Web Audio API - handle potential errors
        if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
          this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
      }
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load sounds:', error);
      this.isLoaded = true;
    }
  }

  private createBeep(frequency: number, duration: number, volume: number): void {
    if (Platform.OS === 'web' && this.audioContext && this.audioContext.state === 'running') {
      try {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
      } catch (error) {
        console.error('Failed to play beep:', error);
      }
    }
  }

  async playTick(isAccent = false): Promise<void> {
    try {
      if (!this.isLoaded) {
        await this.loadSounds();
      }

      if (Platform.OS === 'web' && this.audioContext) {
        if (isAccent) {
          this.createBeep(1000, 0.15, 0.5);
        } else {
          this.createBeep(800, 0.1, 0.3);
        }
      }
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  }

  async unloadSounds(): Promise<void> {
    try {
      if (this.audioContext) {
        await this.audioContext.close();
        this.audioContext = null;
      }
      this.isLoaded = false;
    } catch (error) {
      console.error('Failed to unload sounds:', error);
    }
  }
}

export const soundManager = new SoundManager();
