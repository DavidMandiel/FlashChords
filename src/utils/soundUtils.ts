// Web Audio API implementation for metronome sounds
class WebSoundManager {
  private audioContext: AudioContext | null = null;
  private accentBuffer: AudioBuffer | null = null;
  private regularBuffer: AudioBuffer | null = null;
  private chordChangeBuffer: AudioBuffer | null = null;

  async initialize() {
    if (this.audioContext) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await this.createSoundBuffers();
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  private async createSoundBuffers() {
    if (!this.audioContext) return;

    // Create simple beep sounds using Web Audio API
    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.1; // 100ms
    const samples = Math.floor(sampleRate * duration);

    // Regular beat (higher pitch)
    this.regularBuffer = this.audioContext.createBuffer(1, samples, sampleRate);
    const regularData = this.regularBuffer.getChannelData(0);
    const regularFreq = 800; // Hz
    for (let i = 0; i < samples; i++) {
      regularData[i] = Math.sin(2 * Math.PI * regularFreq * i / sampleRate) * 0.3;
      // Apply fade out
      if (i > samples * 0.7) {
        regularData[i] *= (samples - i) / (samples * 0.3);
      }
    }

    // Accent beat (lower pitch, louder)
    this.accentBuffer = this.audioContext.createBuffer(1, samples, sampleRate);
    const accentData = this.accentBuffer.getChannelData(0);
    const accentFreq = 600; // Hz
    for (let i = 0; i < samples; i++) {
      accentData[i] = Math.sin(2 * Math.PI * accentFreq * i / sampleRate) * 0.5;
      // Apply fade out
      if (i > samples * 0.7) {
        accentData[i] *= (samples - i) / (samples * 0.3);
      }
    }

    // Chord change sound (different pitch and duration)
    const chordChangeDuration = 0.15; // 150ms
    const chordChangeSamples = Math.floor(sampleRate * chordChangeDuration);
    this.chordChangeBuffer = this.audioContext.createBuffer(1, chordChangeSamples, sampleRate);
    const chordChangeData = this.chordChangeBuffer.getChannelData(0);
    const chordChangeFreq = 1000; // Hz - higher pitch for chord changes
    for (let i = 0; i < chordChangeSamples; i++) {
      chordChangeData[i] = Math.sin(2 * Math.PI * chordChangeFreq * i / sampleRate) * 0.4;
      // Apply fade out
      if (i > chordChangeSamples * 0.6) {
        chordChangeData[i] *= (chordChangeSamples - i) / (chordChangeSamples * 0.4);
      }
    }
  }

  async playTick(isAccent: boolean) {
    if (!this.audioContext || !this.accentBuffer || !this.regularBuffer) {
      await this.initialize();
      if (!this.audioContext || !this.accentBuffer || !this.regularBuffer) {
        console.error('Audio context not available');
        return;
      }
    }

    // Resume audio context if suspended (required by browsers)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const buffer = isAccent ? this.accentBuffer : this.regularBuffer;
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start();
  }

  async playChordChange() {
    if (!this.audioContext || !this.chordChangeBuffer) {
      await this.initialize();
      if (!this.audioContext || !this.chordChangeBuffer) {
        console.error('Audio context not available');
        return;
      }
    }

    // Resume audio context if suspended (required by browsers)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = this.chordChangeBuffer;
    source.connect(this.audioContext.destination);
    source.start();
  }

  dispose() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export const soundManager = new WebSoundManager();
