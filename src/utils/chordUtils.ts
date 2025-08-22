import { Chord, ChordQuality, ChordRoot, FlatRoot, ChordProgressionMode } from '../types';

const SHARP_ROOTS: ChordRoot[] = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];
const FLAT_ROOTS: FlatRoot[] = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];

// Circle of Fifths progression (ascending fifths)
const CIRCLE_OF_FIFTHS: ChordRoot[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];

// Circle of Fourths progression (ascending fourths = descending fifths)
const CIRCLE_OF_FOURTHS: ChordRoot[] = ['C', 'F', 'A#', 'D#', 'G#', 'C#', 'F#', 'B', 'E', 'A', 'D', 'G'];

// Random progression (sequential through all chords)
const RANDOM_PROGRESSION: ChordRoot[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F', 'F#', 'C#', 'G#', 'D#', 'A#', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];

const SHARP_TO_FLAT: Record<ChordRoot, FlatRoot> = {
  'A': 'A',
  'A#': 'Bb',
  'B': 'B',
  'C': 'C',
  'C#': 'Db',
  'D': 'D',
  'D#': 'Eb',
  'E': 'E',
  'F': 'F',
  'F#': 'Gb',
  'G': 'G',
  'G#': 'Ab',
};

const FLAT_TO_SHARP: Record<FlatRoot, ChordRoot> = {
  'A': 'A',
  'Bb': 'A#',
  'B': 'B',
  'C': 'C',
  'Db': 'C#',
  'D': 'D',
  'Eb': 'D#',
  'E': 'E',
  'F': 'F',
  'Gb': 'F#',
  'G': 'G',
  'Ab': 'G#',
};

const QUALITY_SUFFIXES: Record<ChordQuality, string> = {
  major: '',
  minor: 'm',
  '7th': '7',
  '5th': '5',
  diminished: 'dim',
};

export function convertSharpToFlat(root: ChordRoot): FlatRoot {
  return SHARP_TO_FLAT[root];
}

export function convertFlatToSharp(root: FlatRoot): ChordRoot {
  return FLAT_TO_SHARP[root];
}

export function getChordDisplay(root: ChordRoot, quality: ChordQuality): string {
  const suffix = QUALITY_SUFFIXES[quality];
  return `${root}${suffix}`;
}



export function generateRandomChord(
  enabledQualities: ChordQuality[],
  progressionMode: ChordProgressionMode,
  lastChord?: Chord
): Chord {
  if (enabledQualities.length === 0) {
    throw new Error('No chord qualities enabled');
  }

  let newChord: Chord;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    let selectedRoot: ChordRoot;
    
    if (progressionMode === 'circle_of_fifths') {
      // Pick a random root from the circle of fifths
      selectedRoot = CIRCLE_OF_FIFTHS[Math.floor(Math.random() * CIRCLE_OF_FIFTHS.length)];
    } else if (progressionMode === 'circle_of_fourths') {
      // Pick a random root from the circle of fourths
      selectedRoot = CIRCLE_OF_FOURTHS[Math.floor(Math.random() * CIRCLE_OF_FOURTHS.length)];
    } else {
      // 'random' - pick randomly from the progression array
      selectedRoot = RANDOM_PROGRESSION[Math.floor(Math.random() * RANDOM_PROGRESSION.length)];
    }
    
    const randomQuality = enabledQualities[Math.floor(Math.random() * enabledQualities.length)];
    const display = getChordDisplay(selectedRoot, randomQuality);
    
    newChord = {
      root: selectedRoot,
      quality: randomQuality,
      display,
    };
    
    attempts++;
  } while (
    lastChord && 
    newChord.root === lastChord.root && 
    newChord.quality === lastChord.quality &&
    attempts < maxAttempts
  );

  return newChord;
}



export function getTimeSignatureBeats(timeSignature: string): number {
  const [numerator] = timeSignature.split('/').map(Number);
  return numerator;
}

export function getNextChordEveryOptions(timeSignature: string): number[] {
  const beats = getTimeSignatureBeats(timeSignature);
  const options = [1, 2, 3, 4];
  
  if (beats >= 6) {
    options.push(6, 8);
  }
  
  return options;
}
