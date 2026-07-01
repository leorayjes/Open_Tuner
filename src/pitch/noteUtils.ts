import { Note, NoteName, PitchResult } from '../models/types';

export const NOTE_NAMES: NoteName[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B',
];

export const A4_HZ = 440.0;
const A4_MIDI = 69;
export const IN_TUNE_THRESHOLD_CENTS = 5;

/**
 * Returns the frequency in Hz for a given note name and octave.
 * Uses equal temperament: f = 440 * 2^((midi - 69) / 12)
 */
export function noteToFrequency(name: NoteName, octave: number): number {
  const semitoneIndex = NOTE_NAMES.indexOf(name);
  const midiNote = (octave + 1) * 12 + semitoneIndex;
  return A4_HZ * Math.pow(2, (midiNote - A4_MIDI) / 12);
}

/**
 * Converts a frequency in Hz to the closest note, octave, and cents deviation.
 * centsDeviation: negative = flat, positive = sharp.
 */
export function frequencyToNote(hz: number): PitchResult {
  if (!hz || hz <= 0) {
    return {
      detectedHz: null,
      closestNote: null,
      centsDeviation: null,
      isInTune: false,
    };
  }

  // Continuous MIDI note number
  const midiExact = 12 * Math.log2(hz / A4_HZ) + A4_MIDI;
  const midiRounded = Math.round(midiExact);

  // Cents deviation from nearest semitone
  const centsDeviation = (midiExact - midiRounded) * 100;

  // Map MIDI to note name + octave
  const semitoneIndex = ((midiRounded % 12) + 12) % 12;
  const octave = Math.floor(midiRounded / 12) - 1;
  const name = NOTE_NAMES[semitoneIndex];

  const closestNote: Note = {
    name,
    octave,
    frequency: noteToFrequency(name, octave),
  };

  return {
    detectedHz: hz,
    closestNote,
    centsDeviation,
    isInTune: Math.abs(centsDeviation) <= IN_TUNE_THRESHOLD_CENTS,
  };
}

/**
 * Creates a Note object from name and octave.
 */
export function makeNote(name: NoteName, octave: number): Note {
  return { name, octave, frequency: noteToFrequency(name, octave) };
}

/**
 * Returns the display label for a note, e.g. "A4", "D#3".
 */
export function noteLabel(note: Note): string {
  return `${note.name}${note.octave}`;
}

/**
 * Formats cents deviation as a string with sign, e.g. "+3 ¢", "-12 ¢", "0 ¢".
 */
export function formatCents(cents: number | null): string {
  if (cents === null) return '--';
  const rounded = Math.round(cents);
  if (rounded === 0) return '0 ¢';
  return `${rounded > 0 ? '+' : ''}${rounded} ¢`;
}
