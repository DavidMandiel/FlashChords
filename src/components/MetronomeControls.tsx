import React from 'react';
import { TimeSignature } from '../types';
import { BpmSlider } from './BpmSlider';
import './MetronomeControls.css';

interface MetronomeControlsProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  timeSignature: TimeSignature;
  onTimeSignatureChange: (timeSignature: TimeSignature) => void;
  nextChordEveryBeats: number;
  onNextChordEveryChange: (beats: number) => void;
  countInEnabled: boolean;
  onCountInToggle: () => void;
  isPlaying: boolean;
  onStartStop: () => void;
  isChordPoolValid: boolean;
  isInCountIn: boolean;
  countInBeat: number;
}

export function MetronomeControls({
  bpm,
  onBpmChange,
  timeSignature,
  onTimeSignatureChange,
  nextChordEveryBeats,
  onNextChordEveryChange,
  countInEnabled,
  onCountInToggle,
  isPlaying,
  onStartStop,
  isChordPoolValid,
  isInCountIn,
  countInBeat,
}: MetronomeControlsProps) {
  const timeSignatures: TimeSignature[] = ['4/4', '3/4', '6/8'];
  
  const getAvailableBeats = (ts: TimeSignature) => {
    switch (ts) {
      case '3/4': return [1, 2, 3];
      case '6/8': return [1, 2, 3, 4, 6];
      default: return [1, 2, 3, 4, 6, 8];
    }
  };

  const handleBeatsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newBeats = parseInt(event.target.value, 10);
    onNextChordEveryChange(newBeats);
  };

  return (
    <div className="metronome-controls">
      {/* BPM Control */}
      <div className="control-section">
        <div className="control-label">BPM: {bpm}</div>
        <BpmSlider value={bpm} onChange={onBpmChange} />
      </div>

      {/* Time Signature */}
      <div className="control-section">
        <div className="control-label">Time Signature</div>
        <div className="time-signature-buttons">
          {timeSignatures.map((ts) => (
            <button
              key={ts}
              className={`time-signature-btn ${timeSignature === ts ? 'active' : ''}`}
              onClick={() => onTimeSignatureChange(ts)}
            >
              {ts}
            </button>
          ))}
        </div>
      </div>

      {/* Next Chord Every */}
      <div className="control-section">
        <div className="control-label">Next Chord Every</div>
        <select
          className="beats-dropdown"
          value={nextChordEveryBeats}
          onChange={handleBeatsChange}
        >
          {getAvailableBeats(timeSignature).map((beats) => (
            <option key={beats} value={beats}>
              {beats} {beats === 1 ? 'beat' : 'beats'}
            </option>
          ))}
        </select>
      </div>

      {/* Count-in Toggle */}
      <div className="control-section">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={countInEnabled}
            onChange={onCountInToggle}
            className="checkbox-input"
          />
          <span className="checkbox-text">Count-in (4 beats)</span>
        </label>
      </div>

      {/* Count-in Display */}
      {isInCountIn && countInBeat >= 0 && countInBeat <= 4 && (
        <div className="count-in-display">
          <div className="count-in-number">{5 - countInBeat}</div>
        </div>
      )}
    </div>
  );
}
