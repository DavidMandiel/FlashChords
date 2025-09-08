import React from 'react';
import './NextButton.css';

interface NextButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function NextButton({ onClick, disabled = false }: NextButtonProps) {
  return (
    <button
      className={`next-button ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title="Next Chord"
    >
      →
    </button>
  );
}
