/**
 * useDroneTone — Native (Android) implementation.
 *
 * Strategy:
 *   1. Synthesise a short, seamlessly-looping WAV buffer for the target pitch.
 *   2. Write it to the Expo cache directory via expo-file-system.
 *   3. Play it with expo-audio's AudioPlayer, looping until toggled off.
 *
 * The WAV buffer contains an integer number of sine-wave cycles so the
 * loop seam is phase-aligned and click-free.
 *
 * Requires: npx expo install expo-file-system
 */
import { useRef, useState, useEffect, useCallback } from 'react';
import * as FileSystem from 'expo-file-system';
import { createAudioPlayer } from 'expo-audio';

export interface DroneToneControls {
  isDroning: boolean;
  toggleDrone: () => void;
  stopDrone: () => void;
}

// ─── WAV synthesis ────────────────────────────────────────────────────────────

/**
 * Build a mono 16-bit PCM WAV containing an integer number of sine cycles.
 * Choosing numSamples = numCycles * round(sampleRate / frequency) keeps the
 * loop seam nearly phase-aligned, avoiding audible clicks on loop repeat.
 */
function generateSineWav(frequency: number, sampleRate = 44100): Uint8Array {
  const samplesPerCycle  = Math.round(sampleRate / frequency);
  const minSamples       = Math.ceil(0.05 * sampleRate); // at least 50 ms
  const numCycles        = Math.max(5, Math.ceil(minSamples / samplesPerCycle));
  const numSamples       = numCycles * samplesPerCycle;

  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view   = new DataView(buffer);

  const str = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };

  // RIFF header
  str(0, 'RIFF');
  view.setUint32(4,  36 + numSamples * 2, true);
  str(8, 'WAVE');
  // fmt chunk
  str(12, 'fmt ');
  view.setUint32(16, 16,             true); // chunk size
  view.setUint16(20,  1,             true); // PCM
  view.setUint16(22,  1,             true); // mono
  view.setUint32(24, sampleRate,     true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32,  2,             true); // block align
  view.setUint16(34, 16,             true); // bits per sample
  // data chunk
  str(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // PCM samples — pure sine wave at 40 % amplitude
  const peak = 0.4 * 32767;
  for (let i = 0; i < numSamples; i++) {
    const sample = Math.sin((2 * Math.PI * i) / samplesPerCycle);
    view.setInt16(44 + i * 2, Math.round(sample * peak), true);
  }

  return new Uint8Array(buffer);
}

/** Convert a Uint8Array to a base64 string in chunks (avoids stack overflow). */
function uint8ToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/** Write a WAV for the given frequency to the Expo cache directory. */
async function buildToneFile(frequency: number): Promise<string> {
  const wav  = generateSineWav(frequency);
  const b64  = uint8ToBase64(wav);
  // Round to nearest Hz for the filename so nearby notes reuse the same file
  const uri  = `${FileSystem.cacheDirectory}drone_${Math.round(frequency)}hz.wav`;
  await FileSystem.writeAsStringAsync(uri, b64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return uri;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

type Player = ReturnType<typeof createAudioPlayer>;

export function useDroneTone(frequency: number | null): DroneToneControls {
  const [isDroning, setIsDroning]  = useState(false);
  const playerRef                   = useRef<Player | null>(null);
  const activeFreqRef               = useRef<number | null>(null);

  const releasePlayer = useCallback(() => {
    if (playerRef.current) {
      try { playerRef.current.pause(); }  catch (_) { /* ignore */ }
      try { playerRef.current.remove(); } catch (_) { /* ignore */ }
      playerRef.current = null;
    }
  }, []);

  const stopDrone = useCallback(() => {
    releasePlayer();
    activeFreqRef.current = null;
    setIsDroning(false);
  }, [releasePlayer]);

  const startDrone = useCallback(async (freq: number) => {
    releasePlayer();

    const uri    = await buildToneFile(freq);
    const player = createAudioPlayer({ uri });
    player.loop  = true;
    player.play();

    playerRef.current     = player;
    activeFreqRef.current = freq;
    setIsDroning(true);
  }, [releasePlayer]);

  const toggleDrone = useCallback(() => {
    if (isDroning) {
      stopDrone();
    } else if (frequency !== null) {
      startDrone(frequency);
    }
  }, [isDroning, frequency, startDrone, stopDrone]);

  // Rebuild and replay when the selected string changes while the drone is on
  useEffect(() => {
    if (isDroning && frequency !== null && frequency !== activeFreqRef.current) {
      startDrone(frequency);
    }
  }, [frequency, isDroning, startDrone]);

  // Release player when the component unmounts
  useEffect(() => () => releasePlayer(), [releasePlayer]);

  return { isDroning, toggleDrone, stopDrone };
}
