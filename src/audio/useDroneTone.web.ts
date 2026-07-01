/**
 * useDroneTone — Web implementation using the Web Audio API.
 *
 * Creates an OscillatorNode (sine wave) that drones at the target frequency
 * until the user toggles it off.  Frequency updates smoothly when the selected
 * string changes so there is no click or restart.
 */
import { useRef, useState, useEffect, useCallback } from 'react';

export interface DroneToneControls {
  isDroning: boolean;
  toggleDrone: () => void;
  stopDrone: () => void;
}

export function useDroneTone(frequency: number | null): DroneToneControls {
  const [isDroning, setIsDroning] = useState(false);
  const ctxRef  = useRef<AudioContext | null>(null);
  const oscRef  = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const tearDown = useCallback(() => {
    try { oscRef.current?.stop(); } catch (_) { /* already stopped */ }
    oscRef.current?.disconnect();
    gainRef.current?.disconnect();
    oscRef.current  = null;
    gainRef.current = null;
  }, []);

  const stopDrone = useCallback(() => {
    if (gainRef.current && ctxRef.current) {
      // Ramp gain to 0 over 60 ms to avoid a click, then disconnect
      const gain = gainRef.current;
      const t = ctxRef.current.currentTime;
      gain.gain.setValueAtTime(gain.gain.value, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.06);
      setTimeout(tearDown, 150);
    } else {
      tearDown();
    }
    setIsDroning(false);
  }, [tearDown]);

  const startDrone = useCallback(async (freq: number) => {
    // Lazily create the AudioContext inside the user-gesture callback
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    const ctx = ctxRef.current;

    // resume() returns a Promise — must await so the context is truly running
    // before we start the oscillator.
    if (ctx.state !== 'running') await ctx.resume();

    tearDown(); // stop any previous oscillator

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    // Set gain directly (not via the scheduling API) so there is no
    // scheduling-vs-current-time race that could leave gain stuck at 0.
    gain.gain.value = 0;

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    // Ramp gain up after the oscillator has started
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.06);

    oscRef.current  = osc;
    gainRef.current = gain;
    setIsDroning(true);
  }, [tearDown]);

  const toggleDrone = useCallback(() => {
    if (isDroning) {
      stopDrone();
    } else if (frequency !== null) {
      startDrone(frequency).catch(console.error);
    }
  }, [isDroning, frequency, startDrone, stopDrone]);

  // Smoothly slide to the new pitch when the selected string changes mid-drone
  useEffect(() => {
    if (isDroning && frequency !== null && oscRef.current && ctxRef.current) {
      oscRef.current.frequency.setTargetAtTime(
        frequency,
        ctxRef.current.currentTime,
        0.05,
      );
    }
  }, [frequency, isDroning]);

  // Release resources on unmount
  useEffect(() => () => tearDown(), [tearDown]);

  return { isDroning, toggleDrone, stopDrone };
}
