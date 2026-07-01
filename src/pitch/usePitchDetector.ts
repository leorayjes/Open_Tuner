import { useState, useCallback, useRef } from 'react';
import { PitchResult, AudioBufferCallback } from '../models/types';
import { detectPitch } from './yin';
import { frequencyToNote } from './noteUtils';
import { useAudioCapture, AudioCaptureControls } from '../audio/useAudioCapture';

const THROTTLE_MS = 60;   // Emit a new result at most every 60ms (~16 fps)
const SILENCE_DB = -60;   // Ignore buffers below this RMS level (dB)

function rmsDb(buffer: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  const rms = Math.sqrt(sum / buffer.length);
  return rms > 0 ? 20 * Math.log10(rms) : -Infinity;
}

export interface PitchDetectorControls extends AudioCaptureControls {
  pitch: PitchResult;
  startListening: () => Promise<void>;
  stopListening: () => void;
}

const NULL_PITCH: PitchResult = {
  detectedHz: null,
  closestNote: null,
  centsDeviation: null,
  isInTune: false,
};

export function usePitchDetector(): PitchDetectorControls {
  const [pitch, setPitch] = useState<PitchResult>(NULL_PITCH);
  const lastEmitRef = useRef(0);
  const audioCapture = useAudioCapture();

  const onBuffer = useCallback<AudioBufferCallback>((buffer, sampleRate) => {
    const now = Date.now();
    if (now - lastEmitRef.current < THROTTLE_MS) return;

    // Skip silent frames
    if (rmsDb(buffer) < SILENCE_DB) {
      // Only clear the display if we've been silent for a while
      return;
    }

    const hz = detectPitch(buffer, sampleRate);

    if (hz <= 0) {
      // No pitch detected — keep last result for a short moment before clearing
      return;
    }

    lastEmitRef.current = now;
    const result = frequencyToNote(hz);
    setPitch(result);
  }, []);

  const startListening = useCallback(async () => {
    await audioCapture.start(onBuffer);
  }, [audioCapture, onBuffer]);

  const stopListening = useCallback(() => {
    audioCapture.stop();
    setPitch(NULL_PITCH);
  }, [audioCapture]);

  return {
    ...audioCapture,
    pitch,
    startListening,
    stopListening,
  };
}
