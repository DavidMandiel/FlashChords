import React, { useState, useEffect, useCallback } from 'react';
import { useMetronome } from './hooks/useMetronome';
import { useChordDrill } from './hooks/useChordDrill';
import { ChordDisplay } from './components/ChordDisplay';
import { MetronomeControls } from './components/MetronomeControls';
import { ChordQualitySelector } from './components/ChordQualitySelector';
import { storageUtils } from './utils/storage';
import { soundManager } from './utils/soundUtils';
import { TimeSignature, ChordProgressionMode } from './types';
import './App.css';

function App() {
  // Chord drill state
  const {
    currentChord,
    nextChord,
    chordPool,
    isChordPoolValid,
    generateNextChord,
    toggleChordQuality,
    setProgressionMode,
  } = useChordDrill();

  // Metronome state
  const [bpm, setBpm] = useState(120);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4');
  const [nextChordEveryBeats, setNextChordEveryBeats] = useState(4);
  const [countInEnabled, setCountInEnabled] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isAccent, setIsAccent] = useState(false);
  const [isChordChanging, setIsChordChanging] = useState(false);

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
    // Trigger chord change visual feedback
    setIsChordChanging(true);
    
    // Play chord change sound
    soundManager.playChordChange();
    
    // Generate the next chord immediately with visual feedback
    requestAnimationFrame(() => {
      generateNextChord();
    });
    
    // Reset chord change feedback after animation
    setTimeout(() => {
      setIsChordChanging(false);
    }, 300);
  }, [generateNextChord]);

  // Metronome hook
  const {
    isPlaying,
    isInCountIn,
    countInBeat,
    startMetronome,
    stopMetronome,
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

  const handleNextChord = useCallback(() => {
    // Only allow manual chord changes when metronome is not playing
    if (!isPlaying) {
      handleChordChange();
    }
  }, [isPlaying, handleChordChange]);

  return (
    <div className="app">
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <h1 className="app-title">FlashChord</h1>
          <p className="app-subtitle">Guitar Chord Practice with Metronome</p>
        </header>

        {/* Main Content */}
        <main className="main-content">
          {/* Chord Display */}
          <div className="chord-display-section">
            <ChordDisplay
              chord={currentChord}
              nextChord={nextChord}
              isPulsing={isPulsing}
              isAccent={isAccent}
              isChordChanging={isChordChanging}
              onNextChord={handleNextChord}
              showNextButton={!isPlaying && isChordPoolValid}
            />
          </div>

          {/* Metronome Controls */}
          <div className="controls-section">
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
          </div>

          {/* Chord Quality Selector */}
          <div className="controls-section">
            <ChordQualitySelector
              enabledQualities={chordPool.enabledQualities}
              onToggleQuality={handleToggleQuality}
              progressionMode={chordPool.progressionMode}
              onSetProgressionMode={handleSetProgressionMode}
            />
          </div>

          {/* Start/Stop Button */}
          <div className="start-stop-container">
            <button
              className={`start-stop-button ${isPlaying ? 'stop' : 'start'} ${!isChordPoolValid ? 'disabled' : ''}`}
              onClick={handleStartStop}
              disabled={!isChordPoolValid}
            >
              {isPlaying ? 'Stop' : 'Start'}
            </button>
          </div>


          {/* Warning */}
          {!isChordPoolValid && (
            <div className="warning">
              Please select at least one chord quality to start practicing
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;