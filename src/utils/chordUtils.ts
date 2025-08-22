import { Chord, ChordQuality, ChordRoot, FlatRoot } from '../types';

const SHARP_ROOTS: ChordRoot[] = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const FLAT_ROOTS: FlatRoot[] = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];

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

export function getChordDisplay(root: ChordRoot, quality: ChordQuality, useFlats: boolean): string {
  const suffix = QUALITY_SUFFIXES[quality];
  
  if (useFlats) {
    const flatRoot = convertSharpToFlat(root);
    return `${flatRoot}${suffix}`;
  }
  
  return `${root}${suffix}`;
}

export function generateRandomChord(
  enabledQualities: ChordQuality[],
  useFlats: boolean,
  lastChord?: Chord
): Chord {
  if (enabledQualities.length === 0) {
    throw new Error('No chord qualities enabled');
  }

  const availableRoots = useFlats ? FLAT_ROOTS : SHARP_ROOTS;
  
  let newChord: Chord;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    const randomRoot = availableRoots[Math.floor(Math.random() * availableRoots.length)];
    const randomQuality = enabledQualities[Math.floor(Math.random() * enabledQualities.length)];
    
    const sharpRoot = useFlats ? convertFlatToSharp(randomRoot as FlatRoot) : randomRoot as ChordRoot;
    const display = getChordDisplay(sharpRoot, randomQuality, useFlats);
    
    newChord = {
      root: sharpRoot,
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
  } else if (beats >= 4) {
    options.push(4);
  }
  
  return options;
}
