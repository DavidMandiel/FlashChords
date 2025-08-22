export type ChordQuality = 'major' | 'minor' | '7th' | '5th' | 'diminished';

export type ChordRoot = 'A' | 'A#' | 'B' | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#';

export type FlatRoot = 'A' | 'Bb' | 'B' | 'C' | 'Db' | 'D' | 'Eb' | 'E' | 'F' | 'Gb' | 'G' | 'Ab';

export type TimeSignature = '4/4' | '3/4' | '6/8';

export interface Chord {
  root: ChordRoot;
  quality: ChordQuality;
  display: string;
}

export interface MetronomeState {
  isPlaying: boolean;
  bpm: number;
  timeSignature: TimeSignature;
  beatCount: number;
  nextChordEveryBeats: number;
  countInEnabled: boolean;
}

export interface ChordPoolSettings {
  enabledQualities: ChordQuality[];
  useFlats: boolean;
}

export interface AppSettings {
  chordPool: ChordPoolSettings;
  metronome: Omit<MetronomeState, 'isPlaying' | 'beatCount'>;
}
