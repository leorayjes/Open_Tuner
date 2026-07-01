/**
 * Web Audio API implementation of real-time audio capture.
 * Metro resolves this file instead of AudioCapture.ts when bundling for web.
 */
import { useEffect, useRef } from 'react';
import { AudioBufferCallback } from '../models/types';

const SAMPLE_RATE = 44100;
const BUFFER_SIZE = 2048;

export function useAudioCaptureImpl(
  onBuffer: AudioBufferCallback,
  active: boolean,
): void {
  const contextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const onBufferRef = useRef(onBuffer);

  // Keep callback ref up to date without triggering the effect
  useEffect(() => {
    onBufferRef.current = onBuffer;
  });

  useEffect(() => {
    if (!active) {
      processorRef.current?.disconnect();
      contextRef.current?.close().catch(() => {});
      processorRef.current = null;
      contextRef.current = null;
      return;
    }

    let cancelled = false;
    let stream: MediaStream | null = null;

    navigator.mediaDevices
      .getUserMedia({ audio: { sampleRate: SAMPLE_RATE, channelCount: 1 }, video: false })
      .then((mediaStream) => {
        if (cancelled) {
          mediaStream.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = mediaStream;

        const ctx = new AudioContext({ sampleRate: SAMPLE_RATE });
        contextRef.current = ctx;

        const source = ctx.createMediaStreamSource(mediaStream);

        // ScriptProcessorNode is deprecated but has universal browser support.
        // AudioWorklet is the modern replacement but requires serving a worker file.
        const processor = ctx.createScriptProcessor(BUFFER_SIZE, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          const channelData = e.inputBuffer.getChannelData(0);
          onBufferRef.current(new Float32Array(channelData), ctx.sampleRate);
        };

        source.connect(processor);
        // Must connect to destination to keep the graph running
        processor.connect(ctx.destination);
      })
      .catch((err) => {
        console.warn('[AudioCapture.web] Microphone error:', err);
      });

    return () => {
      cancelled = true;
      processorRef.current?.disconnect();
      processorRef.current = null;
      contextRef.current?.close().catch(() => {});
      contextRef.current = null;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [active]);
}
