import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { AppSettings, ChordPoolSettings, MetronomeState, TimeSignature, ChordProgressionMode } from '../types';

const STORAGE_KEYS = {
  CHORD_POOL: 'chord_pool',
  METRONOME: 'metronome',
  PROGRESSION_MODE: 'progression_mode',
  BPM: 'bpm',
  TIME_SIGNATURE: 'time_signature',
  NEXT_CHORD_EVERY: 'next_chord_every',
  COUNT_IN_ENABLED: 'count_in_enabled',
} as const;

// Helper functions for SecureStore
const getItem = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch {
    return null;
  }
};

const setItem = async (key: string, value: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch {
    // Silent fallback
  }
};

export const storageUtils = {
  // Chord pool settings
  async getChordPoolSettings(): Promise<ChordPoolSettings> {
    const enabledQualities = await getItem(STORAGE_KEYS.CHORD_POOL);
    const progressionMode = await getItem(STORAGE_KEYS.PROGRESSION_MODE);
    
    return {
      enabledQualities: enabledQualities ? JSON.parse(enabledQualities) : ['major', 'minor'],
      progressionMode: (progressionMode as ChordProgressionMode) ?? 'random',
    };
  },

  async setChordPoolSettings(settings: ChordPoolSettings): Promise<void> {
    await setItem(STORAGE_KEYS.CHORD_POOL, JSON.stringify(settings.enabledQualities));
    await setItem(STORAGE_KEYS.PROGRESSION_MODE, settings.progressionMode);
  },

  // Metronome settings
  async getMetronomeSettings(): Promise<Omit<MetronomeState, 'isPlaying' | 'beatCount'>> {
    const bpm = await getItem(STORAGE_KEYS.BPM);
    const timeSignature = await getItem(STORAGE_KEYS.TIME_SIGNATURE);
    const nextChordEvery = await getItem(STORAGE_KEYS.NEXT_CHORD_EVERY);
    const countInEnabled = await getItem(STORAGE_KEYS.COUNT_IN_ENABLED);
    
    return {
      bpm: bpm ? parseInt(bpm, 10) : 120,
      timeSignature: (timeSignature as TimeSignature) ?? '4/4',
      nextChordEveryBeats: nextChordEvery ? parseInt(nextChordEvery, 10) : 4,
      countInEnabled: countInEnabled === 'true',
    };
  },

  async setMetronomeSettings(settings: Omit<MetronomeState, 'isPlaying' | 'beatCount'>): Promise<void> {
    await setItem(STORAGE_KEYS.BPM, settings.bpm.toString());
    await setItem(STORAGE_KEYS.TIME_SIGNATURE, settings.timeSignature);
    await setItem(STORAGE_KEYS.NEXT_CHORD_EVERY, settings.nextChordEveryBeats.toString());
    await setItem(STORAGE_KEYS.COUNT_IN_ENABLED, settings.countInEnabled.toString());
  },

  // Full app settings
  async getAppSettings(): Promise<AppSettings> {
    const [chordPool, metronome] = await Promise.all([
      this.getChordPoolSettings(),
      this.getMetronomeSettings(),
    ]);
    
    return {
      chordPool,
      metronome,
    };
  },

  async setAppSettings(settings: AppSettings): Promise<void> {
    await Promise.all([
      this.setChordPoolSettings(settings.chordPool),
      this.setMetronomeSettings(settings.metronome),
    ]);
  },

  // Individual settings
  async getBpm(): Promise<number> {
    const bpm = await getItem(STORAGE_KEYS.BPM);
    return bpm ? parseInt(bpm, 10) : 120;
  },

  async setBpm(bpm: number): Promise<void> {
    await setItem(STORAGE_KEYS.BPM, bpm.toString());
  },

  async getTimeSignature(): Promise<TimeSignature> {
    const timeSignature = await getItem(STORAGE_KEYS.TIME_SIGNATURE);
    return (timeSignature as TimeSignature) ?? '4/4';
  },

  async setTimeSignature(timeSignature: TimeSignature): Promise<void> {
    await setItem(STORAGE_KEYS.TIME_SIGNATURE, timeSignature);
  },



  async getNextChordEveryBeats(): Promise<number> {
    const beats = await getItem(STORAGE_KEYS.NEXT_CHORD_EVERY);
    return beats ? parseInt(beats, 10) : 4;
  },

  async setNextChordEveryBeats(beats: number): Promise<void> {
    await setItem(STORAGE_KEYS.NEXT_CHORD_EVERY, beats.toString());
  },

  async getCountInEnabled(): Promise<boolean> {
    const enabled = await getItem(STORAGE_KEYS.COUNT_IN_ENABLED);
    return enabled === 'true';
  },

  async setCountInEnabled(enabled: boolean): Promise<void> {
    await setItem(STORAGE_KEYS.COUNT_IN_ENABLED, enabled.toString());
  },
};
