import React from 'react';
import './BpmSlider.css';

interface BpmSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function BpmSlider({ 
  value, 
  onChange, 
  min = 40, 
  max = 240 
}: BpmSliderProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    onChange(newValue);
  };

  const handleDecrease = () => {
    const newValue = Math.max(min, value - 1);
    onChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + 1);
    onChange(newValue);
  };

  return (
    <div className="bpm-slider-container">
      <div className="bpm-controls">
        <button 
          className="bpm-btn bpm-decrease" 
          onClick={handleDecrease}
          disabled={value <= min}
        >
          -
        </button>
        <div className="bpm-slider-wrapper">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            className="bpm-slider"
            style={{
              '--slider-progress': `${(value - min) / (max - min) * 100}%`
            } as React.CSSProperties}
          />
        </div>
        <button 
          className="bpm-btn bpm-increase" 
          onClick={handleIncrease}
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}
