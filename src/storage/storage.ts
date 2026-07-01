import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Typed key-value storage wrapper.
 * Uses AsyncStorage on native and localStorage on web (via the same package).
 */
export async function storageGet<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function storageSet<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export async function storageRemove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

export const STORAGE_KEYS = {
  CUSTOM_TUNINGS: 'open_tuner:custom_tunings',
  LAST_INSTRUMENT: 'open_tuner:last_instrument',
  LAST_TUNING: 'open_tuner:last_tuning',
  IN_TUNE_THRESHOLD: 'open_tuner:in_tune_threshold',
} as const;
