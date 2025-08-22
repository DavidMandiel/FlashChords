import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import { Haptics } from 'expo-haptics';
import { MetronomeState, TimeSignature } from '../types';
import { soundManager } from '../utils/soundUtils';
import { getTimeSignatureBeats } from '../utils/chordUtils';

interface UseMetronomeProps {
  bpm: number;
  timeSignature: TimeSignature;
  nextChordEveryBeats: number;
  countInEnabled: boolean;
  onBeat?: (beatCount: number, isAccent: boolean) => void;
  onChordChange?: () => void;
}

export function useMetronome({
  bpm,
  timeSignature,
  nextChordEveryBeats,
  countInEnabled,
  onBeat,
  onChordChange,
}: UseMetronomeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatCount, setBeatCount] = useState(1);
  const [isInCountIn, setIsInCountIn] = useState(false);
  const [countInBeat, setCountInBeat] = useState(0);

  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const expectedTimeRef = useRef<number>(0);
  const lastTickTimeRef = useRef<number>(0);

  const beatsPerBar = getTimeSignatureBeats(timeSignature);
  const msPerBeat = (60 / bpm) * 1000;

  const playTick = useCallback(async (isAccent: boolean) => {
    try {
      await soundManager.playTick(isAccent);
      if (Platform.OS !== 'web') {
        if (isAccent) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    } catch (error) {
      console.error('Failed to play tick:', error);
    }
  }, []);

  const tick = useCallback(() => {
    const now = Date.now();
    
         if (isInCountIn) {
       // Count-in phase - all beats sound the same
       playTick(false); // All count-in beats sound the same (no accent)
       
       const newCountInBeat = countInBeat + 1;
       setCountInBeat(newCountInBeat);
       
       if (newCountInBeat > 4) {
         // End count-in and start regular metronome
         setIsInCountIn(false);
         setCountInBeat(0);
         setBeatCount(1);
         setIsPlaying(true);
         // Play the first beat of regular metronome immediately (accented)
         playTick(true);
         onBeat?.(1, true);
         return; // Exit early to avoid double-playing
       }
         } else {
               // Regular metronome phase - accent on beat 1
        const isAccent = beatCount === 1;
        playTick(isAccent);
        onBeat?.(beatCount, isAccent);
       
                       // Check if it's time to change chord (if we're on the last beat of the cycle)
        if (beatCount === beatsPerBar && (beatCount % nextChordEveryBeats === 0)) {
          onChordChange?.();
        }
        
        // Advance to next beat
        const newBeatCount = beatCount === beatsPerBar ? 1 : beatCount + 1;
        setBeatCount(newBeatCount);
    }
    
    lastTickTimeRef.current = now;
    expectedTimeRef.current = now + msPerBeat;
  }, [
    isInCountIn,
    countInBeat,
    beatCount,
    beatsPerBar,
    nextChordEveryBeats,
    msPerBeat,
    playTick,
    onBeat,
    onChordChange,
  ]);

     const startMetronome = useCallback(() => {
           if (countInEnabled) {
        setIsInCountIn(true);
        setCountInBeat(1); // Start from 1 so we get beats 1, 2, 3, 4
        setBeatCount(1);
      } else {
        setIsPlaying(true);
        setBeatCount(1);
      }
    
    const now = Date.now();
    expectedTimeRef.current = now + msPerBeat;
    lastTickTimeRef.current = now;
    
         // Play first tick immediately
     if (countInEnabled) {
       playTick(false); // First count-in beat (non-accented)
     } else {
       playTick(true); // First beat of regular metronome should be accented
       onBeat?.(1, true);
     }
  }, [countInEnabled, msPerBeat, playTick, onBeat]);

  const stopMetronome = useCallback(() => {
    setIsPlaying(false);
    setIsInCountIn(false);
    setBeatCount(1);
    setCountInBeat(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetMetronome = useCallback(() => {
    stopMetronome();
    setBeatCount(1);
    setCountInBeat(0);
  }, [stopMetronome]);

  // Handle interval timing with drift correction
  useEffect(() => {
    if (!isPlaying && !isInCountIn) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const scheduleNextTick = () => {
      const now = Date.now();
      const drift = now - expectedTimeRef.current;
      
      // More precise drift correction - only reset if significantly off
      if (Math.abs(drift) > msPerBeat * 0.5) {
        expectedTimeRef.current = now + msPerBeat;
      } else {
        expectedTimeRef.current += msPerBeat;
      }
      
      const nextTickDelay = Math.max(0, expectedTimeRef.current - now);
      
      intervalRef.current = setTimeout(() => {
        const tickStart = Date.now();
        tick();
        const tickDuration = Date.now() - tickStart;
        
        // Adjust for tick execution time
        if (tickDuration > 0) {
          expectedTimeRef.current += tickDuration;
        }
        
        scheduleNextTick();
      }, nextTickDelay);
    };

    scheduleNextTick();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, isInCountIn, tick, msPerBeat]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isPlaying: isPlaying || isInCountIn,
    beatCount,
    isInCountIn,
    countInBeat,
    startMetronome,
    stopMetronome,
    resetMetronome,
  };
}
