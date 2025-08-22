import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useMetronome } from '../src/hooks/useMetronome';
import { useChordDrill } from '../src/hooks/useChordDrill';
import { ChordDisplay } from '../src/components/ChordDisplay';
import { MetronomeControls } from '../src/components/MetronomeControls';
import { ChordQualitySelector } from '../src/components/ChordQualitySelector';
import { storageUtils } from '../src/utils/storage';
import { TimeSignature, ChordProgressionMode } from '../src/types';

export default function App() {
  // Chord drill state
  const {
    currentChord,
    nextChord,
    chordPool,
    isChordPoolValid,
    generateNextChord,
    toggleChordQuality,
    setProgressionMode,
    resetChord,
  } = useChordDrill();

  // Metronome state
  const [bpm, setBpm] = useState(120);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4');
  const [nextChordEveryBeats, setNextChordEveryBeats] = useState(4);
  const [countInEnabled, setCountInEnabled] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isAccent, setIsAccent] = useState(false);

  // Load saved settings on app start
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await storageUtils.getMetronomeSettings();
        setBpm(savedSettings.bpm);
        setTimeSignature(savedSettings.timeSignature);
        setNextChordEveryBeats(savedSettings.nextChordEveryBeats);
        setCountInEnabled(savedSettings.countInEnabled);
      } catch (error) {
        console.error('Failed to load metronome settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Save settings when they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await storageUtils.setMetronomeSettings({
          bpm,
          timeSignature,
          nextChordEveryBeats,
          countInEnabled,
        });
      } catch (error) {
        console.error('Failed to save metronome settings:', error);
      }
    };
    saveSettings();
  }, [bpm, timeSignature, nextChordEveryBeats, countInEnabled]);

  // Metronome callbacks
  const handleBeat = useCallback((beatCount: number, isAccent: boolean) => {
    setIsPulsing(true);
    setIsAccent(isAccent);
    
    // Reset pulse after animation
    setTimeout(() => {
      setIsPulsing(false);
    }, 200);
  }, []);

  const handleChordChange = useCallback(() => {
    generateNextChord();
  }, [generateNextChord]);

  // Metronome hook
  const {
    isPlaying,
    beatCount,
    isInCountIn,
    countInBeat,
    startMetronome,
    stopMetronome,
    resetMetronome,
  } = useMetronome({
    bpm,
    timeSignature,
    nextChordEveryBeats,
    countInEnabled,
    onBeat: handleBeat,
    onChordChange: handleChordChange,
  });

  // Control handlers
  const handleStartStop = useCallback(() => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  }, [isPlaying, startMetronome, stopMetronome]);





  const handleBpmChange = useCallback((newBpm: number) => {
    setBpm(newBpm);
  }, []);

  const handleTimeSignatureChange = useCallback((newTimeSignature: TimeSignature) => {
    setTimeSignature(newTimeSignature);
    // Reset next chord every beats if it's not valid for new time signature
    const maxBeats = newTimeSignature === '6/8' ? 6 : 
                    newTimeSignature === '3/4' ? 3 : 4;
    if (nextChordEveryBeats > maxBeats) {
      setNextChordEveryBeats(maxBeats);
    }
  }, [nextChordEveryBeats]);

  const handleNextChordEveryChange = useCallback((beats: number) => {
    setNextChordEveryBeats(beats);
  }, []);

     const handleCountInToggle = useCallback(() => {
     setCountInEnabled(prev => !prev);
   }, []);

  const handleToggleQuality = useCallback((quality: string) => {
    toggleChordQuality(quality as any);
  }, [toggleChordQuality]);

  const handleSetProgressionMode = useCallback((mode: ChordProgressionMode) => {
    setProgressionMode(mode);
  }, [setProgressionMode]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.mainContainer}>
        {/* Chord Display */}
        <ChordDisplay
          chord={currentChord}
          nextChord={nextChord}
          isPulsing={isPulsing}
          isAccent={isAccent}
        />

        {/* Count-in Display */}
        {isInCountIn && countInBeat >= 0 && countInBeat <= 4 && (
          <View style={styles.countInOverlay}>
            <View style={styles.countInBox}>
              <Text style={styles.countInText}>
                {5 - countInBeat}
              </Text>
            </View>
          </View>
        )}

        {/* Metronome Controls */}
        <MetronomeControls
          bpm={bpm}
          onBpmChange={handleBpmChange}
          timeSignature={timeSignature}
          onTimeSignatureChange={handleTimeSignatureChange}
          nextChordEveryBeats={nextChordEveryBeats}
          onNextChordEveryChange={handleNextChordEveryChange}
          countInEnabled={countInEnabled}
          onCountInToggle={handleCountInToggle}
          isPlaying={isPlaying}
          onStartStop={handleStartStop}
          isChordPoolValid={isChordPoolValid}
          isInCountIn={isInCountIn}
          countInBeat={countInBeat}
        />

        {/* Chord Quality Selector */}
        <ChordQualitySelector
          enabledQualities={chordPool.enabledQualities}
          onToggleQuality={handleToggleQuality}
          progressionMode={chordPool.progressionMode}
          onSetProgressionMode={handleSetProgressionMode}
        />

        {/* Start/Stop Button */}
        <View style={styles.startStopContainer}>
          <TouchableOpacity
            style={[
              styles.startStopButton,
              isPlaying ? styles.stopButton : styles.startButton,
              !isChordPoolValid && styles.disabledButton,
            ]}
            onPress={handleStartStop}
            disabled={!isChordPoolValid}
          >
            <Text style={styles.startStopButtonText}>
              {isPlaying ? 'Stop' : 'Start'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignItems: 'center',
    maxHeight: '100%',
    minHeight: 0,
    width: '100%',
    overflow: 'hidden',
  },
  countInContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginVertical: 10,
  },
  countInText: {
    fontSize: 150,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 150,
    textShadowColor: 'rgba(76, 175, 80, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  countInOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  countInBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#4CAF50',
    shadowColor: 'rgba(76, 175, 80, 0.5)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  startStopContainer: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 5,
    width: '90%',
    maxWidth: 350,
  },
  startStopButton: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#FF4444',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
  startStopButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
