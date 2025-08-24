import { useState, useEffect, useCallback } from 'react';
import { Chord, ChordQuality, ChordPoolSettings, ChordProgressionMode } from '../types';
import { generateRandomChord } from '../utils/chordUtils';
import { storageUtils } from '../utils/storage';

export function useChordDrill() {
  const [currentChord, setCurrentChord] = useState<Chord | null>(null);
  const [nextChord, setNextChord] = useState<Chord | null>(null);
  const [chordPool, setChordPool] = useState<ChordPoolSettings>({
    enabledQualities: ['major', 'minor'],
    progressionMode: 'random',
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

  // Generate initial next chord when chord pool changes
  useEffect(() => {
    if (chordPool.enabledQualities.length > 0 && !nextChord) {
      try {
        const previewChord = generateRandomChord(
          chordPool.enabledQualities,
          chordPool.progressionMode,
          undefined
        );
        setNextChord(previewChord);
      } catch (error) {
        console.error('Failed to generate initial next chord:', error);
      }
    }
  }, [chordPool, nextChord]);

  const generateNextChord = useCallback(() => {
    if (chordPool.enabledQualities.length === 0) {
      return null;
    }

    try {
      // If we have a next chord preview, use it as the current chord
      if (nextChord) {
        setLastChord(currentChord);
        setCurrentChord(nextChord);
        
        // Generate a new preview chord
        const newPreviewChord = generateRandomChord(
          chordPool.enabledQualities,
          chordPool.progressionMode,
          nextChord
        );
        setNextChord(newPreviewChord);
        
        return nextChord;
      } else {
        // First chord generation
        const newChord = generateRandomChord(
          chordPool.enabledQualities,
          chordPool.progressionMode,
          lastChord || undefined
        );
        
        setLastChord(currentChord);
        setCurrentChord(newChord);
        
        // Generate the next chord to show in the preview
        const previewChord = generateRandomChord(
          chordPool.enabledQualities,
          chordPool.progressionMode,
          newChord
        );
        setNextChord(previewChord);
        
        return newChord;
      }
    } catch (error) {
      console.error('Failed to generate chord:', error);
      return null;
    }
  }, [chordPool.enabledQualities, chordPool.progressionMode, currentChord, lastChord, nextChord]);

  const toggleChordQuality = useCallback((quality: ChordQuality) => {
    setChordPool(prev => {
      const isCurrentlyEnabled = prev.enabledQualities.includes(quality);
      
      if (isCurrentlyEnabled) {
        // Remove the quality if it's currently enabled
        return {
          ...prev,
          enabledQualities: prev.enabledQualities.filter(q => q !== quality),
        };
      } else {
        // Add the quality if it's not currently enabled
        return {
          ...prev,
          enabledQualities: [...prev.enabledQualities, quality],
        };
      }
    });
  }, []);

  const setProgressionMode = useCallback((mode: ChordProgressionMode) => {
    setChordPool(prev => ({
      ...prev,
      progressionMode: mode,
    }));
  }, []);

  const resetChord = useCallback(() => {
    setCurrentChord(null);
    setLastChord(null);
    setNextChord(null);
  }, []);

  const isChordPoolValid = chordPool.enabledQualities.length > 0;

  return {
    currentChord,
    nextChord,
    chordPool,
    isChordPoolValid,
    generateNextChord,
    toggleChordQuality,
    setProgressionMode,
    resetChord,
  };
}
