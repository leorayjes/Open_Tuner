/**
 * Android / native audio capture implementation using expo-audio.
 *
 * expo-audio's AudioRecorder does not provide real-time raw PCM buffers in
 * the same way as the Web Audio API. This implementation uses a polling
 * approach with the AudioRecorder to get audio data.
 *
 * NOTE: For best real-time performance on Android, consider using
 * @siteed/expo-audio-stream which provides raw PCM Float32Array buffers.
 * This file can be swapped out without touching any other part of the app.
 */
import { useEffect, useRef } from 'react';
import { AudioBufferCallback } from '../models/types';

export function useAudioCaptureImpl(
  onBuffer: AudioBufferCallback,
  active: boolean,
): void {
  const onBufferRef = useRef(onBuffer);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    onBufferRef.current = onBuffer;
  });

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // TODO: Replace this stub with a real-time PCM stream implementation.
    // Recommended library: @siteed/expo-audio-stream
    // It provides an onAudioStream callback with Float32Array buffers.
    //
    // Example:
    //   import { ExpoAudioStream } from '@siteed/expo-audio-stream';
    //   ExpoAudioStream.startRecording({
    //     sampleRate: 44100,
    //     channels: 1,
    //     encoding: 'pcm_32bit',
    //     onAudioStream: (data) => {
    //       onBufferRef.current(data.buffer, 44100);
    //     },
    //   });
    //
    // For now, the Android version is a no-op placeholder.
    // The web version (AudioCapture.web.ts) is fully functional.
    console.log('[AudioCapture] Android audio capture — install @siteed/expo-audio-stream for real-time PCM');

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active]);
}
