/**
 * useDroneTone — Web implementation using the Web Audio API.
 *
 * Uses an AudioBufferSourceNode (looping single-cycle sine wave) instead of
 * an OscillatorNode.  This avoids the AudioParam scheduling races that caused
 * the gain to silently stay at 0.
 *
 * Each time the target frequency changes while droning, the source is rebuilt
 * and restarted so the loop always aligns cleanly on phase 0.
 */
import { useRef, useState, useEffect, useCallback } from 'react';

export interface DroneToneControls {
  isDroning: boolean;
  toggleDrone: () => void;
  stopDrone: () => void;
}

/** Build a one-cycle sine wave AudioBuffer at the given frequency. */
function makeSineBuffer(ctx: AudioContext, frequency: number): AudioBuffer {
  const sampleRate     = ctx.sampleRate;
  const samplesPerCycle = Math.round(sampleRate / frequency);
  const buffer         = ctx.createBuffer(1, samplesPerCycle, sampleRate);
  const channel        = buffer.getChannelData(0);
  for (let i = 0; i < samplesPerCycle; i++) {
    channel[i] = Math.sin((2 * Math.PI * i) / samplesPerCycle) * 0.4;
  }
  return buffer;
}

/** The live playback state kept in a ref so we can stop/replace it. */
interface DroneState {
  ctx: AudioContext;
  src: AudioBufferSourceNode;
  gain: GainNode;
}

export function useDroneTone(frequency: number | null): DroneToneControls {
  const [isDroning, setIsDroning] = useState(false);
  const droneRef    = useRef<DroneState | null>(null);
  const activeFreq  = useRef<number | null>(null);

  /** Stop the current source and close the AudioContext. */
  const tearDown = useCallback(() => {
    if (!droneRef.current) return;
    const { ctx, src, gain } = droneRef.current;
    try { src.stop(); } catch (_) { /* already stopped */ }
    src.disconnect();
    gain.disconnect();
    ctx.close().catch(() => {});
    droneRef.current = null;
    activeFreq.current = null;
  }, []);

  const stopDrone = useCallback(() => {
    tearDown();
    setIsDroning(false);
  }, [tearDown]);

  const startDrone = useCallback((freq: number) => {
    // Replace any existing drone
    if (droneRef.current) tearDown();

    const ctx  = new AudioContext();
    const buf  = makeSineBuffer(ctx, freq);
    const src  = ctx.createBufferSource();
    const gain = ctx.createGain();

    src.buffer = buf;
    src.loop   = true;

    gain.gain.value = 0.5;

    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();

    droneRef.current  = { ctx, src, gain };
    activeFreq.current = freq;
    setIsDroning(true);
  }, [tearDown]);

  const toggleDrone = useCallback(() => {
    if (isDroning) {
      stopDrone();
    } else if (frequency !== null) {
      startDrone(frequency);
    }
  }, [isDroning, frequency, startDrone, stopDrone]);

  // Rebuild the source when the selected string changes while droning
  useEffect(() => {
    if (isDroning && frequency !== null && frequency !== activeFreq.current) {
      startDrone(frequency);
    }
  }, [frequency, isDroning, startDrone]);

  // Clean up on unmount
  useEffect(() => () => tearDown(), [tearDown]);

  return { isDroning, toggleDrone, stopDrone };
}
