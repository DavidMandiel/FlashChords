import { MetronomeState, ChordPoolSettings } from '../types';

// Web localStorage implementation
class WebStorageUtils {
  private readonly METRONOME_SETTINGS_KEY = 'flashchord_metronome_settings';
  private readonly CHORD_POOL_SETTINGS_KEY = 'flashchord_chord_pool_settings';

  async getMetronomeSettings(): Promise<Omit<MetronomeState, 'isPlaying' | 'beatCount'>> {
    try {
      const stored = localStorage.getItem(this.METRONOME_SETTINGS_KEY);
      if (stored) {
        const settings = JSON.parse(stored);
        return {
          bpm: settings.bpm || 120,
          timeSignature: settings.timeSignature || '4/4',
          nextChordEveryBeats: settings.nextChordEveryBeats || 4,
          countInEnabled: settings.countInEnabled || false,
        };
      }
    } catch (error) {
      console.error('Failed to load metronome settings:', error);
    }

    // Default settings
    return {
      bpm: 120,
      timeSignature: '4/4',
      nextChordEveryBeats: 4,
      countInEnabled: false,
    };
  }

  async setMetronomeSettings(settings: Omit<MetronomeState, 'isPlaying' | 'beatCount'>): Promise<void> {
    try {
      localStorage.setItem(this.METRONOME_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save metronome settings:', error);
    }
  }

  async getChordPoolSettings(): Promise<ChordPoolSettings> {
    try {
      const stored = localStorage.getItem(this.CHORD_POOL_SETTINGS_KEY);
      if (stored) {
        const settings = JSON.parse(stored);
        return {
          enabledQualities: settings.enabledQualities || ['major', 'minor'],
          progressionMode: settings.progressionMode || 'random',
        };
      }
    } catch (error) {
      console.error('Failed to load chord pool settings:', error);
    }

    // Default settings
    return {
      enabledQualities: ['major', 'minor'],
      progressionMode: 'random',
    };
  }

  async setChordPoolSettings(settings: ChordPoolSettings): Promise<void> {
    try {
      localStorage.setItem(this.CHORD_POOL_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save chord pool settings:', error);
    }
  }

  clearAllSettings(): void {
    try {
      localStorage.removeItem(this.METRONOME_SETTINGS_KEY);
      localStorage.removeItem(this.CHORD_POOL_SETTINGS_KEY);
    } catch (error) {
      console.error('Failed to clear settings:', error);
    }
  }
}

export const storageUtils = new WebStorageUtils();
