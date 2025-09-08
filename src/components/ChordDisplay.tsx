import React from 'react';
import { Chord } from '../types';
import { NextButton } from './NextButton';
import './ChordDisplay.css';

interface ChordDisplayProps {
  chord: Chord | null;
  nextChord: Chord | null;
  isPulsing: boolean;
  isAccent: boolean;
  isChordChanging: boolean;
  onNextChord?: () => void;
  showNextButton?: boolean;
}

export function ChordDisplay({ chord, nextChord, isPulsing, isAccent, isChordChanging, onNextChord, showNextButton }: ChordDisplayProps) {
  return (
    <div className="chord-display">
      {/* Current Chord */}
      <div className="current-chord-container">
        <div 
          className={`current-chord ${isPulsing ? 'pulsing' : ''} ${isAccent ? 'accent' : ''} ${isChordChanging ? 'chord-changing' : ''}`}
        >
          {chord ? chord.display : '--'}
        </div>
      </div>

      {/* Next Chord Preview */}
      {nextChord && (
        <div className="next-chord-container">
          <div className="next-chord-label">Next:</div>
          <div className="next-chord-row">
            <div className="next-chord">{nextChord.display}</div>
            {showNextButton && onNextChord && (
              <NextButton onClick={onNextChord} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
