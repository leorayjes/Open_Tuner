import { useState, useCallback, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import { AudioBufferCallback } from '../models/types';
// Metro resolves AudioCapture.web.ts on web, AudioCapture.ts on native
import { useAudioCaptureImpl } from './AudioCapture';

export type PermissionStatus = 'undetermined' | 'granted' | 'denied';

export interface AudioCaptureControls {
  start: (onBuffer: AudioBufferCallback) => Promise<void>;
  stop: () => void;
  active: boolean;
  permissionStatus: PermissionStatus;
}

/**
 * Unified hook for real-time microphone capture.
 * Internally delegates to the platform-specific AudioCapture implementation.
 */
export function useAudioCapture(): AudioCaptureControls {
  const [active, setActive] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('undetermined');
  const callbackRef = useRef<AudioBufferCallback>(() => {});

  const stableCallback = useCallback<AudioBufferCallback>(
    (buffer, sampleRate) => callbackRef.current(buffer, sampleRate),
    [],
  );

  // Delegate to platform-specific implementation
  useAudioCaptureImpl(stableCallback, active);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      // On web, getUserMedia handles the permission prompt.
      // We optimistically grant here; actual errors surface in AudioCapture.web.ts.
      setPermissionStatus('granted');
      return true;
    }

    try {
      const { requestRecordingPermissionsAsync } = await import('expo-audio');
      const { granted } = await requestRecordingPermissionsAsync();
      setPermissionStatus(granted ? 'granted' : 'denied');
      return granted;
    } catch (err) {
      console.warn('[useAudioCapture] Permission request failed:', err);
      setPermissionStatus('denied');
      return false;
    }
  }, []);

  const start = useCallback(
    async (onBuffer: AudioBufferCallback) => {
      callbackRef.current = onBuffer;

      if (permissionStatus !== 'granted') {
        const granted = await requestPermission();
        if (!granted) return;
      }

      setActive(true);
    },
    [permissionStatus, requestPermission],
  );

  const stop = useCallback(() => {
    setActive(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setActive(false);
    };
  }, []);

  return { start, stop, active, permissionStatus };
}
