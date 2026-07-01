import { Tuning } from '../models/types';
import { makeNote } from '../pitch/noteUtils';

// Baroque A=415 Hz multiplier (shifts all strings down ~1 semitone)
const BAROQUE_RATIO = 415 / 440;

export const GUITAR_PRESETS: Tuning[] = [
  {
    id: 'guitar-standard',
    name: 'Standard (EADGBe)',
    instrumentId: 'guitar',
    source: 'preset',
    strings: [
      { stringIndex: 0, displayName: '6 (E2)', targetNote: makeNote('E', 2) },
      { stringIndex: 1, displayName: '5 (A2)', targetNote: makeNote('A', 2) },
      { stringIndex: 2, displayName: '4 (D3)', targetNote: makeNote('D', 3) },
      { stringIndex: 3, displayName: '3 (G3)', targetNote: makeNote('G', 3) },
      { stringIndex: 4, displayName: '2 (B3)', targetNote: makeNote('B', 3) },
      { stringIndex: 5, displayName: '1 (e4)', targetNote: makeNote('E', 4) },
    ],
  },
  {
    id: 'guitar-drop-d',
    name: 'Drop D (DADGBe)',
    instrumentId: 'guitar',
    source: 'preset',
    strings: [
      { stringIndex: 0, displayName: '6 (D2)', targetNote: makeNote('D', 2) },
      { stringIndex: 1, displayName: '5 (A2)', targetNote: makeNote('A', 2) },
      { stringIndex: 2, displayName: '4 (D3)', targetNote: makeNote('D', 3) },
      { stringIndex: 3, displayName: '3 (G3)', targetNote: makeNote('G', 3) },
      { stringIndex: 4, displayName: '2 (B3)', targetNote: makeNote('B', 3) },
      { stringIndex: 5, displayName: '1 (e4)', targetNote: makeNote('E', 4) },
    ],
  },
  {
    id: 'guitar-dadgad',
    name: 'DADGAD',
    instrumentId: 'guitar',
    source: 'preset',
    strings: [
      { stringIndex: 0, displayName: '6 (D2)', targetNote: makeNote('D', 2) },
      { stringIndex: 1, displayName: '5 (A2)', targetNote: makeNote('A', 2) },
      { stringIndex: 2, displayName: '4 (D3)', targetNote: makeNote('D', 3) },
      { stringIndex: 3, displayName: '3 (G3)', targetNote: makeNote('G', 3) },
      { stringIndex: 4, displayName: '2 (A3)', targetNote: makeNote('A', 3) },
      { stringIndex: 5, displayName: '1 (D4)', targetNote: makeNote('D', 4) },
    ],
  },
  {
    id: 'guitar-open-g',
    name: 'Open G (DGDGBd)',
    instrumentId: 'guitar',
    source: 'preset',
    strings: [
      { stringIndex: 0, displayName: '6 (D2)', targetNote: makeNote('D', 2) },
      { stringIndex: 1, displayName: '5 (G2)', targetNote: makeNote('G', 2) },
      { stringIndex: 2, displayName: '4 (D3)', targetNote: makeNote('D', 3) },
      { stringIndex: 3, displayName: '3 (G3)', targetNote: makeNote('G', 3) },
      { stringIndex: 4, displayName: '2 (B3)', targetNote: makeNote('B', 3) },
      { stringIndex: 5, displayName: '1 (D4)', targetNote: makeNote('D', 4) },
    ],
  },
  {
    id: 'guitar-open-d',
    name: 'Open D (DADf#ad)',
    instrumentId: 'guitar',
    source: 'preset',
    strings: [
      { stringIndex: 0, displayName: '6 (D2)', targetNote: makeNote('D', 2) },
      { stringIndex: 1, displayName: '5 (A2)', targetNote: makeNote('A', 2) },
      { stringIndex: 2, displayName: '4 (D3)', targetNote: makeNote('D', 3) },
      { stringIndex: 3, displayName: '3 (F#3)', targetNote: makeNote('F#', 3) },
      { stringIndex: 4, displayName: '2 (A3)', targetNote: makeNote('A', 3) },
      { stringIndex: 5, displayName: '1 (D4)', targetNote: makeNote('D', 4) },
    ],
  },
  {
    id: 'guitar-open-e',
    name: 'Open E (EBEg#be)',
    instrumentId: 'guitar',
    source: 'preset',
    strings: [
      { stringIndex: 0, displayName: '6 (E2)', targetNote: makeNote('E', 2) },
      { stringIndex: 1, displayName: '5 (B2)', targetNote: makeNote('B', 2) },
      { stringIndex: 2, displayName: '4 (E3)', targetNote: makeNote('E', 3) },
      { stringIndex: 3, displayName: '3 (G#3)', targetNote: makeNote('G#', 3) },
      { stringIndex: 4, displayName: '2 (B3)', targetNote: makeNote('B', 3) },
      { stringIndex: 5, displayName: '1 (E4)', targetNote: makeNote('E', 4) },
    ],
  },
  {
    id: 'guitar-half-down',
    name: '½ Step Down (Eb Ab Db Gb Bb Eb)',
    instrumentId: 'guitar',
    source: 'preset',
    strings: [
      { stringIndex: 0, displayName: '6 (Eb2)', targetNote: makeNote('D#', 2) },
      { stringIndex: 1, displayName: '5 (Ab2)', targetNote: makeNote('G#', 2) },
      { stringIndex: 2, displayName: '4 (Db3)', targetNote: makeNote('C#', 3) },
      { stringIndex: 3, displayName: '3 (Gb3)', targetNote: makeNote('F#', 3) },
      { stringIndex: 4, displayName: '2 (Bb3)', targetNote: makeNote('A#', 3) },
      { stringIndex: 5, displayName: '1 (Eb4)', targetNote: makeNote('D#', 4) },
    ],
  },
  {
    id: 'guitar-whole-down',
    name: 'Whole Step Down (D std)',
    instrumentId: 'guitar',
    source: 'preset',
    strings: [
      { stringIndex: 0, displayName: '6 (D2)', targetNote: makeNote('D', 2) },
      { stringIndex: 1, displayName: '5 (G2)', targetNote: makeNote('G', 2) },
      { stringIndex: 2, displayName: '4 (C3)', targetNote: makeNote('C', 3) },
      { stringIndex: 3, displayName: '3 (F3)', targetNote: makeNote('F', 3) },
      { stringIndex: 4, displayName: '2 (A3)', targetNote: makeNote('A', 3) },
      { stringIndex: 5, displayName: '1 (D4)', targetNote: makeNote('D', 4) },
    ],
  },
  {
    id: 'guitar-drop-c',
    name: 'Drop C (CGCFAd)',
    instrumentId: 'guitar',
    source: 'preset',
    strings: [
      { stringIndex: 0, displayName: '6 (C2)', targetNote: makeNote('C', 2) },
      { stringIndex: 1, displayName: '5 (G2)', targetNote: makeNote('G', 2) },
      { stringIndex: 2, displayName: '4 (C3)', targetNote: makeNote('C', 3) },
      { stringIndex: 3, displayName: '3 (F3)', targetNote: makeNote('F', 3) },
      { stringIndex: 4, displayName: '2 (A3)', targetNote: makeNote('A', 3) },
      { stringIndex: 5, displayName: '1 (D4)', targetNote: makeNote('D', 4) },
    ],
  },
  {
    id: 'guitar-12string',
    name: '12-String Standard (EADGBe)',
    instrumentId: 'guitar',
    source: 'preset',
    strings: [
      // Course 6 — octave pair
      { stringIndex: 0,  displayName: '6  (E2)',  targetNote: makeNote('E', 2) },
      { stringIndex: 1,  displayName: "6' (E3)",  targetNote: makeNote('E', 3) },
      // Course 5 — octave pair
      { stringIndex: 2,  displayName: '5  (A2)',  targetNote: makeNote('A', 2) },
      { stringIndex: 3,  displayName: "5' (A3)",  targetNote: makeNote('A', 3) },
      // Course 4 — octave pair
      { stringIndex: 4,  displayName: '4  (D3)',  targetNote: makeNote('D', 3) },
      { stringIndex: 5,  displayName: "4' (D4)",  targetNote: makeNote('D', 4) },
      // Course 3 — octave pair
      { stringIndex: 6,  displayName: '3  (G3)',  targetNote: makeNote('G', 3) },
      { stringIndex: 7,  displayName: "3' (G4)",  targetNote: makeNote('G', 4) },
      // Course 2 — unison pair
      { stringIndex: 8,  displayName: '2  (B3)',  targetNote: makeNote('B', 3) },
      { stringIndex: 9,  displayName: "2' (B3)",  targetNote: makeNote('B', 3) },
      // Course 1 — unison pair
      { stringIndex: 10, displayName: '1  (E4)',  targetNote: makeNote('E', 4) },
      { stringIndex: 11, displayName: "1' (E4)",  targetNote: makeNote('E', 4) },
    ],
  },
  {
    id: 'guitar-baroque',
    name: 'Baroque (A=415)',
    instrumentId: 'guitar',
    source: 'preset',
    strings: [
      {
        stringIndex: 0,
        displayName: '6 (E2 @415)',
        targetNote: { name: 'D#', octave: 2, frequency: makeNote('E', 2).frequency * BAROQUE_RATIO },
      },
      {
        stringIndex: 1,
        displayName: '5 (A2 @415)',
        targetNote: { name: 'G#', octave: 2, frequency: makeNote('A', 2).frequency * BAROQUE_RATIO },
      },
      {
        stringIndex: 2,
        displayName: '4 (D3 @415)',
        targetNote: { name: 'C#', octave: 3, frequency: makeNote('D', 3).frequency * BAROQUE_RATIO },
      },
      {
        stringIndex: 3,
        displayName: '3 (G3 @415)',
        targetNote: { name: 'F#', octave: 3, frequency: makeNote('G', 3).frequency * BAROQUE_RATIO },
      },
      {
        stringIndex: 4,
        displayName: '2 (B3 @415)',
        targetNote: { name: 'A#', octave: 3, frequency: makeNote('B', 3).frequency * BAROQUE_RATIO },
      },
      {
        stringIndex: 5,
        displayName: '1 (e4 @415)',
        targetNote: { name: 'D#', octave: 4, frequency: makeNote('E', 4).frequency * BAROQUE_RATIO },
      },
    ],
  },
];

// Bass presets
export const BASS_PRESETS: Tuning[] = [
  {
    id: 'bass-standard',
    name: 'Standard (EADg)',
    instrumentId: 'bass',
    source: 'preset',
    strings: [
      { stringIndex: 0, displayName: '4 (E1)', targetNote: makeNote('E', 1) },
      { stringIndex: 1, displayName: '3 (A1)', targetNote: makeNote('A', 1) },
      { stringIndex: 2, displayName: '2 (D2)', targetNote: makeNote('D', 2) },
      { stringIndex: 3, displayName: '1 (G2)', targetNote: makeNote('G', 2) },
    ],
  },
];

// Ukulele presets
export const UKULELE_PRESETS: Tuning[] = [
  {
    id: 'ukulele-standard',
    name: 'Standard (GCEA)',
    instrumentId: 'ukulele',
    source: 'preset',
    strings: [
      { stringIndex: 0, displayName: '4 (G4)', targetNote: makeNote('G', 4) },
      { stringIndex: 1, displayName: '3 (C4)', targetNote: makeNote('C', 4) },
      { stringIndex: 2, displayName: '2 (E4)', targetNote: makeNote('E', 4) },
      { stringIndex: 3, displayName: '1 (A4)', targetNote: makeNote('A', 4) },
    ],
  },
];

export const VIOLIN_PRESETS: Tuning[] = [
  {
    id: 'violin-standard',
    name: 'Standard (GDAe)',
    instrumentId: 'violin',
    source: 'preset',
    strings: [
      { stringIndex: 0, displayName: '4 (G3)', targetNote: makeNote('G', 3) },
      { stringIndex: 1, displayName: '3 (D4)', targetNote: makeNote('D', 4) },
      { stringIndex: 2, displayName: '2 (A4)', targetNote: makeNote('A', 4) },
      { stringIndex: 3, displayName: '1 (E5)', targetNote: makeNote('E', 5) },
    ],
  },
  {
    id: 'violin-baroque',
    name: 'Baroque (A=415)',
    instrumentId: 'violin',
    source: 'preset',
    // All strings tuned to A=415 Hz reference — approximately one semitone
    // below modern concert pitch (A=440 Hz).
    strings: [
      {
        stringIndex: 0,
        displayName: '4 (G3 @415)',
        targetNote: { name: 'F#', octave: 3, frequency: makeNote('G', 3).frequency * BAROQUE_RATIO },
      },
      {
        stringIndex: 1,
        displayName: '3 (D4 @415)',
        targetNote: { name: 'C#', octave: 4, frequency: makeNote('D', 4).frequency * BAROQUE_RATIO },
      },
      {
        stringIndex: 2,
        displayName: '2 (A4 @415)',
        targetNote: { name: 'G#', octave: 4, frequency: makeNote('A', 4).frequency * BAROQUE_RATIO },
      },
      {
        stringIndex: 3,
        displayName: '1 (E5 @415)',
        targetNote: { name: 'D#', octave: 5, frequency: makeNote('E', 5).frequency * BAROQUE_RATIO },
      },
    ],
  },
];

export const MANDOLIN_PRESETS: Tuning[] = [
  {
    id: 'mandolin-standard',
    name: 'Standard (GDAe)',
    instrumentId: 'mandolin',
    source: 'preset',
    strings: [
      { stringIndex: 0, displayName: '4 (G3)', targetNote: makeNote('G', 3) },
      { stringIndex: 1, displayName: '3 (D4)', targetNote: makeNote('D', 4) },
      { stringIndex: 2, displayName: '2 (A4)', targetNote: makeNote('A', 4) },
      { stringIndex: 3, displayName: '1 (E5)', targetNote: makeNote('E', 5) },
    ],
  },
  {
    id: 'mandolin-octave',
    name: 'Octave Mandolin (GDAe)',
    instrumentId: 'mandolin',
    source: 'preset',
    strings: [
      { stringIndex: 0, displayName: '4 (G2)', targetNote: makeNote('G', 2) },
      { stringIndex: 1, displayName: '3 (D3)', targetNote: makeNote('D', 3) },
      { stringIndex: 2, displayName: '2 (A3)', targetNote: makeNote('A', 3) },
      { stringIndex: 3, displayName: '1 (E4)', targetNote: makeNote('E', 4) },
    ],
  },
];

export const ALL_PRESETS: Tuning[] = [
  ...GUITAR_PRESETS,
  ...BASS_PRESETS,
  ...UKULELE_PRESETS,
  ...VIOLIN_PRESETS,
  ...MANDOLIN_PRESETS,
];

export function getPresetsByInstrument(instrumentId: string): Tuning[] {
  return ALL_PRESETS.filter((t) => t.instrumentId === instrumentId);
}

export function getPresetById(id: string): Tuning | undefined {
  return ALL_PRESETS.find((t) => t.id === id);
}
