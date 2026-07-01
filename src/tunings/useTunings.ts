/**
 * useTunings — shared tuning state via React Context.
 *
 * All tabs call useTunings() and receive the SAME instance.
 * Wrap the root layout with <TuningsProvider> once; every child
 * that calls useTunings() shares the same state without prop-drilling.
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Tuning, InstrumentId } from '../models/types';
import { storageGet, storageSet, STORAGE_KEYS } from '../storage/storage';
import { getPresetsByInstrument } from './presets';
import { INSTRUMENTS } from './instruments';

export interface TuningsState {
  presets: Tuning[];
  custom: Tuning[];
  all: Tuning[];
  activeTuning: Tuning | null;
  activeInstrumentId: InstrumentId;
  setActiveInstrument: (id: InstrumentId) => void;
  setActiveTuning: (tuning: Tuning) => void;
  addCustomTuning: (tuning: Omit<Tuning, 'id' | 'source' | 'createdAt'>) => Promise<Tuning>;
  updateCustomTuning: (tuning: Tuning) => Promise<void>;
  deleteCustomTuning: (id: string) => Promise<void>;
  isLoaded: boolean;
}

const TuningsContext = createContext<TuningsState | null>(null);

function generateId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function TuningsProvider({ children }: { children: ReactNode }) {
  const [activeInstrumentId, setActiveInstrumentId] = useState<InstrumentId>('guitar');
  const [customTunings, setCustomTunings] = useState<Tuning[]>([]);
  const [activeTuningId, setActiveTuningId] = useState<string>('guitar-standard');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [savedCustom, savedInstrument, savedTuningId] = await Promise.all([
        storageGet<Tuning[]>(STORAGE_KEYS.CUSTOM_TUNINGS),
        storageGet<InstrumentId>(STORAGE_KEYS.LAST_INSTRUMENT),
        storageGet<string>(STORAGE_KEYS.LAST_TUNING),
      ]);
      if (savedCustom) setCustomTunings(savedCustom);
      if (savedInstrument && INSTRUMENTS[savedInstrument]) setActiveInstrumentId(savedInstrument);
      if (savedTuningId) setActiveTuningId(savedTuningId);
      setIsLoaded(true);
    })();
  }, []);

  const presets = getPresetsByInstrument(activeInstrumentId);
  const custom = customTunings.filter((t) => t.instrumentId === activeInstrumentId);
  const all = [...presets, ...custom];
  const activeTuning = all.find((t) => t.id === activeTuningId) ?? presets[0] ?? null;

  const setActiveInstrument = useCallback(async (id: InstrumentId) => {
    setActiveInstrumentId(id);
    const defaultId = INSTRUMENTS[id]?.defaultTuningId;
    if (defaultId) setActiveTuningId(defaultId);
    await storageSet(STORAGE_KEYS.LAST_INSTRUMENT, id);
    if (defaultId) await storageSet(STORAGE_KEYS.LAST_TUNING, defaultId);
  }, []);

  const setActiveTuning = useCallback(async (tuning: Tuning) => {
    setActiveTuningId(tuning.id);
    await storageSet(STORAGE_KEYS.LAST_TUNING, tuning.id);
  }, []);

  const persistCustom = useCallback(async (updated: Tuning[]) => {
    setCustomTunings(updated);
    await storageSet(STORAGE_KEYS.CUSTOM_TUNINGS, updated);
  }, []);

  const addCustomTuning = useCallback(
    async (partial: Omit<Tuning, 'id' | 'source' | 'createdAt'>): Promise<Tuning> => {
      const newTuning: Tuning = {
        ...partial,
        id: generateId(),
        source: 'custom',
        createdAt: Date.now(),
      };
      await persistCustom([...customTunings, newTuning]);
      return newTuning;
    },
    [customTunings, persistCustom],
  );

  const updateCustomTuning = useCallback(
    async (updated: Tuning) => {
      await persistCustom(customTunings.map((t) => (t.id === updated.id ? updated : t)));
    },
    [customTunings, persistCustom],
  );

  const deleteCustomTuning = useCallback(
    async (id: string) => {
      await persistCustom(customTunings.filter((t) => t.id !== id));
      if (activeTuningId === id) {
        const fallback = INSTRUMENTS[activeInstrumentId]?.defaultTuningId ?? 'guitar-standard';
        setActiveTuningId(fallback);
        await storageSet(STORAGE_KEYS.LAST_TUNING, fallback);
      }
    },
    [customTunings, persistCustom, activeTuningId, activeInstrumentId],
  );

  const value: TuningsState = {
    presets,
    custom,
    all,
    activeTuning,
    activeInstrumentId,
    setActiveInstrument,
    setActiveTuning,
    addCustomTuning,
    updateCustomTuning,
    deleteCustomTuning,
    isLoaded,
  };

  return React.createElement(TuningsContext.Provider, { value }, children);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTunings(): TuningsState {
  const ctx = useContext(TuningsContext);
  if (!ctx) throw new Error('useTunings must be used inside <TuningsProvider>');
  return ctx;
}
