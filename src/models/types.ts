// ─────────────────────────────────────────────
// Core note representation
// ─────────────────────────────────────────────

/** The 12 chromatic note names using sharps */
export type NoteName =
  | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F'
  | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

/**
 * A musical note at a specific octave (scientific pitch notation).
 * E.g., standard guitar low E string = { name: 'E', octave: 2 }
 */
export interface Note {
  name: NoteName;
  octave: number;       // 0–8
  frequency: number;    // Hz, equal temperament at A4=440
}

// ─────────────────────────────────────────────
// Tuning data model
// ─────────────────────────────────────────────

/**
 * A single string in a tuning.
 * stringIndex 0 = lowest-pitched (thickest) string.
 */
export interface TuningString {
  stringIndex: number;
  displayName: string;  // e.g. "6 (low E)", "1 (high e)"
  targetNote: Note;
}

export type TuningSource = 'preset' | 'custom';

/**
 * A complete tuning for an instrument.
 * Custom tunings are serialized to AsyncStorage as JSON.
 */
export interface Tuning {
  id: string;
  name: string;
  instrumentId: InstrumentId;
  source: TuningSource;
  strings: TuningString[];  // ordered by stringIndex ascending
  createdAt?: number;       // Date.now(), only on custom tunings
}

// ─────────────────────────────────────────────
// Instrument data model
// ─────────────────────────────────────────────

export type InstrumentId = 'guitar' | 'bass' | 'ukulele' | 'violin' | 'mandolin';

export interface Instrument {
  id: InstrumentId;
  displayName: string;
  stringCount: number;
  defaultTuningId: string;
  octaveRange: [number, number];  // min, max octave for custom tuning UI
}

// ─────────────────────────────────────────────
// Pitch detection output
// ─────────────────────────────────────────────

export interface PitchResult {
  detectedHz: number | null;
  closestNote: Note | null;
  centsDeviation: number | null;  // negative = flat, positive = sharp
  isInTune: boolean;              // true when |centsDeviation| <= IN_TUNE_THRESHOLD
}

// ─────────────────────────────────────────────
// Audio buffer callback
// ─────────────────────────────────────────────

export type AudioBufferCallback = (buffer: Float32Array, sampleRate: number) => void;

// ─────────────────────────────────────────────
// Persisted app state schema
// ─────────────────────────────────────────────

export interface StoredAppState {
  customTunings: Tuning[];
  lastActiveInstrumentId: InstrumentId;
  lastActiveTuningId: string;
  inTuneThresholdCents: number;
}
