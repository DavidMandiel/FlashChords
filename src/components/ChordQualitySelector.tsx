import React from 'react';
import { ChordQuality, ChordProgressionMode } from '../types';
import './ChordQualitySelector.css';

interface ChordQualitySelectorProps {
  enabledQualities: ChordQuality[];
  onToggleQuality: (quality: ChordQuality) => void;
  progressionMode: ChordProgressionMode;
  onSetProgressionMode: (mode: ChordProgressionMode) => void;
}

export function ChordQualitySelector({
  enabledQualities,
  onToggleQuality,
  progressionMode,
  onSetProgressionMode,
}: ChordQualitySelectorProps) {
  const qualities: { value: ChordQuality; label: string; color: string }[] = [
    { value: 'major', label: 'Major', color: '#4CAF50' },
    { value: 'minor', label: 'Minor', color: '#2196F3' },
    { value: '7th', label: '7th', color: '#FF9800' },
    { value: '5th', label: '5th', color: '#9C27B0' },
    { value: 'diminished', label: 'Dim', color: '#F44336' },
  ];

  const progressionModes: { value: ChordProgressionMode; label: string }[] = [
    { value: 'random', label: 'Random' },
    { value: 'circle_of_fifths', label: 'Circle of 5ths' },
    { value: 'circle_of_fourths', label: 'Circle of 4ths' },
  ];

  return (
    <div className="chord-quality-selector">
      {/* Chord Qualities */}
      <div className="section">
        <div className="section-title">Chord Qualities</div>
        <div className="quality-buttons">
          {qualities.map((quality) => (
            <button
              key={quality.value}
              className={`quality-btn ${enabledQualities.includes(quality.value) ? 'active' : ''}`}
              style={{
                '--quality-color': quality.color,
              } as React.CSSProperties}
              onClick={() => onToggleQuality(quality.value)}
            >
              {quality.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progression Mode */}
      <div className="section">
        <div className="section-title">Progression Mode</div>
        <div className="progression-buttons">
          {progressionModes.map((mode) => (
            <button
              key={mode.value}
              className={`progression-btn ${progressionMode === mode.value ? 'active' : ''}`}
              onClick={() => onSetProgressionMode(mode.value)}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
