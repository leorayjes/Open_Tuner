import { Instrument } from '../models/types';

export const INSTRUMENTS: Record<string, Instrument> = {
  guitar: {
    id: 'guitar',
    displayName: 'Guitar',
    stringCount: 6,
    defaultTuningId: 'guitar-standard',
    octaveRange: [1, 5],
  },
  bass: {
    id: 'bass',
    displayName: 'Bass',
    stringCount: 4,
    defaultTuningId: 'bass-standard',
    octaveRange: [0, 3],
  },
  ukulele: {
    id: 'ukulele',
    displayName: 'Ukulele',
    stringCount: 4,
    defaultTuningId: 'ukulele-standard',
    octaveRange: [3, 5],
  },
  violin: {
    id: 'violin',
    displayName: 'Violin',
    stringCount: 4,
    defaultTuningId: 'violin-standard',
    octaveRange: [3, 6],
  },
  mandolin: {
    id: 'mandolin',
    displayName: 'Mandolin',
    stringCount: 4,
    defaultTuningId: 'mandolin-standard',
    octaveRange: [2, 6],
  },
};

export const INSTRUMENT_LIST: Instrument[] = Object.values(INSTRUMENTS);
