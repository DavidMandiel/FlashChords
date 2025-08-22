import { useState, useEffect, useCallback } from 'react';
import { Chord, ChordQuality, ChordPoolSettings } from '../types';
import { generateRandomChord } from '../utils/chordUtils';
import { storageUtils } from '../utils/storage';

export function useChordDrill() {
  const [currentChord, setCurrentChord] = useState<Chord | null>(null);
  const [chordPool, setChordPool] = useState<ChordPoolSettings>({
    enabledQualities: ['major', 'minor'],
    useFlats: false,
  });
  const [lastChord, setLastChord] = useState<Chord | null>(null);

  // Load initial settings from storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await storageUtils.getChordPoolSettings();
        setChordPool(savedSettings);
      } catch (error) {
        console.error('Failed to load chord pool settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Save settings to storage when they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await storageUtils.setChordPoolSettings(chordPool);
      } catch (error) {
        console.error('Failed to save chord pool settings:', error);
      }
    };
    saveSettings();
  }, [chordPool]);

  const generateNextChord = useCallback(() => {
    if (chordPool.enabledQualities.length === 0) {
      return null;
    }

    try {
      const newChord = generateRandomChord(
        chordPool.enabledQualities,
        chordPool.useFlats,
        lastChord
      );
      
      setLastChord(currentChord);
      setCurrentChord(newChord);
      return newChord;
    } catch (error) {
      console.error('Failed to generate chord:', error);
      return null;
    }
  }, [chordPool.enabledQualities, chordPool.useFlats, currentChord, lastChord]);

  const toggleChordQuality = useCallback((quality: ChordQuality) => {
    setChordPool(prev => ({
      ...prev,
      enabledQualities: prev.enabledQualities.includes(quality)
        ? prev.enabledQualities.filter(q => q !== quality)
        : [...prev.enabledQualities, quality],
    }));
  }, []);

  const setUseFlats = useCallback((useFlats: boolean) => {
    setChordPool(prev => ({
      ...prev,
      useFlats,
    }));
  }, []);

  const resetChord = useCallback(() => {
    setCurrentChord(null);
    setLastChord(null);
  }, []);

  const isChordPoolValid = chordPool.enabledQualities.length > 0;

  return {
    currentChord,
    chordPool,
    isChordPoolValid,
    generateNextChord,
    toggleChordQuality,
    setUseFlats,
    resetChord,
  };
}
