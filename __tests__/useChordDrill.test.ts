import { renderHook, act } from '@testing-library/react';
import { useChordDrill } from '../src/hooks/useChordDrill';
import { generateRandomChord } from '../src/utils/chordUtils';
import { ChordQuality } from '../src/types';

// Mock storage
jest.mock('../src/utils/storage', () => ({
  storageUtils: {
    getChordPoolSettings: jest.fn(() => ({
      enabledQualities: ['major', 'minor'],
      useFlats: false,
    })),
    setChordPoolSettings: jest.fn(),
  },
}));

describe('useChordDrill', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default chord pool settings', () => {
    const { result } = renderHook(() => useChordDrill());

    expect(result.current.chordPool.enabledQualities).toEqual(['major', 'minor']);
    expect(result.current.chordPool.useFlats).toBe(false);
    expect(result.current.currentChord).toBeNull();
    expect(result.current.isChordPoolValid).toBe(true);
  });

  it('should toggle chord qualities correctly', () => {
    const { result } = renderHook(() => useChordDrill());

    act(() => {
      result.current.toggleChordQuality('7th');
    });

    expect(result.current.chordPool.enabledQualities).toContain('7th');
    expect(result.current.isChordPoolValid).toBe(true);

    act(() => {
      result.current.toggleChordQuality('major');
    });

    expect(result.current.chordPool.enabledQualities).not.toContain('major');
    expect(result.current.chordPool.enabledQualities).toContain('minor');
    expect(result.current.chordPool.enabledQualities).toContain('7th');
  });

  it('should toggle flats setting correctly', () => {
    const { result } = renderHook(() => useChordDrill());

    act(() => {
      result.current.setUseFlats(true);
    });

    expect(result.current.chordPool.useFlats).toBe(true);
  });

  it('should generate chords when pool is valid', () => {
    const { result } = renderHook(() => useChordDrill());

    act(() => {
      const chord = result.current.generateNextChord();
    });

    expect(result.current.currentChord).not.toBeNull();
    expect(result.current.currentChord?.quality).toBeDefined();
    expect(result.current.currentChord?.root).toBeDefined();
    expect(result.current.currentChord?.display).toBeDefined();
  });

  it('should not generate chords when pool is empty', () => {
    const { result } = renderHook(() => useChordDrill());

    // Remove all qualities
    act(() => {
      result.current.toggleChordQuality('major');
      result.current.toggleChordQuality('minor');
    });

    expect(result.current.isChordPoolValid).toBe(false);
    expect(result.current.generateNextChord()).toBeNull();
  });

  it('should reset chord state correctly', () => {
    const { result } = renderHook(() => useChordDrill());

    // Generate a chord first
    act(() => {
      result.current.generateNextChord();
    });

    expect(result.current.currentChord).not.toBeNull();

    // Reset
    act(() => {
      result.current.resetChord();
    });

    expect(result.current.currentChord).toBeNull();
  });
});

describe('generateRandomChord', () => {
  it('should generate chords with correct qualities', () => {
    const enabledQualities: ChordQuality[] = ['major', '7th'];
    const useFlats = false;

    for (let i = 0; i < 10; i++) {
      const chord = generateRandomChord(enabledQualities, useFlats);
      expect(enabledQualities).toContain(chord.quality);
      expect(chord.display).toMatch(/^[A-G]#?[m7]?$/);
    }
  });

  it('should avoid immediate repeats', () => {
    const enabledQualities: ChordQuality[] = ['major', 'minor'];
    const useFlats = false;

    const chord1 = generateRandomChord(enabledQualities, useFlats);
    const chord2 = generateRandomChord(enabledQualities, useFlats, chord1);

    // Should not be the exact same chord
    expect(chord2.root).not.toBe(chord1.root);
    expect(chord2.quality).not.toBe(chord1.quality);
  });

  it('should handle flats correctly', () => {
    const enabledQualities: ChordQuality[] = ['major'];
    const useFlats = true;

    const chord = generateRandomChord(enabledQualities, useFlats);
    expect(chord.display).toMatch(/^[A-G]b?$/);
  });

  it('should throw error when no qualities enabled', () => {
    expect(() => {
      generateRandomChord([], false);
    }).toThrow('No chord qualities enabled');
  });
});
