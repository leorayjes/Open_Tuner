import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { usePitchDetector } from '../src/pitch/usePitchDetector';
import { useTunings } from '../src/tunings/useTunings';
import { TunerNeedle } from '../src/components/TunerNeedle';
import { CentsMeter } from '../src/components/CentsMeter';
import { NoteDisplay } from '../src/components/NoteDisplay';
import { StringSelector } from '../src/components/StringSelector';
import { InTuneFlash } from '../src/components/InTuneFlash';
import { noteLabel } from '../src/pitch/noteUtils';
import { useDroneTone } from '../src/audio/useDroneTone';

export default function TunerScreen() {
  const { pitch, startListening, stopListening, active } = usePitchDetector();
  const { activeTuning, isLoaded } = useTunings();
  const [selectedString, setSelectedString] = useState(0);
  const [wasInTune, setWasInTune] = useState(false);

  const activeStringData = activeTuning?.strings[selectedString];
  const targetNote = activeStringData?.targetNote;
  const targetLabel = targetNote ? noteLabel(targetNote) : undefined;

  const { isDroning, toggleDrone } = useDroneTone(targetNote?.frequency ?? null);

  useEffect(() => {
    if (pitch.isInTune && !wasInTune) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
    }
    setWasInTune(pitch.isInTune);
  }, [pitch.isInTune, wasInTune]);

  const handleToggle = useCallback(async () => {
    if (active) {
      stopListening();
    } else {
      await startListening();
    }
  }, [active, startListening, stopListening]);

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <InTuneFlash isInTune={pitch.isInTune} />

      <View style={styles.header}>
        <Text style={styles.tuningName}>{activeTuning?.name ?? 'No tuning selected'}</Text>
      </View>

      {/* needleWrapper centers the fixed-width TunerNeedle in the full-width column */}
      <View style={styles.needleWrapper}>
        <TunerNeedle cents={pitch.centsDeviation} size={280} />
      </View>

      <View style={styles.meterRow}>
        <CentsMeter cents={pitch.centsDeviation} />
      </View>

      <NoteDisplay pitch={pitch} targetNoteName={targetLabel} />

      {activeTuning && (
        <StringSelector
          strings={activeTuning.strings}
          selectedIndex={selectedString}
          onSelect={setSelectedString}
        />
      )}

      <View style={styles.buttonRow}>
        {/* Microphone toggle */}
        <TouchableOpacity
          style={[styles.listenBtn, active && styles.listenBtnActive]}
          onPress={handleToggle}
          activeOpacity={0.8}
        >
          <View style={[styles.micDot, active && styles.micDotActive]} />
          <Text style={styles.listenText}>
            {active ? 'Listening...' : 'Tap to Listen'}
          </Text>
        </TouchableOpacity>

        {/* Reference drone toggle */}
        <TouchableOpacity
          style={[styles.droneBtn, isDroning && styles.droneBtnActive]}
          onPress={toggleDrone}
          activeOpacity={0.8}
          disabled={targetNote === undefined}
        >
          <View style={[styles.droneDot, isDroning && styles.droneDotActive]} />
          <Text style={[styles.droneText, isDroning && styles.droneTextActive]}>
            {isDroning ? 'Reference On' : 'Play Reference'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#111',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  tuningName: {
    fontSize: 15,
    color: '#888',
    letterSpacing: 0.5,
  },
  needleWrapper: {
    alignItems: 'center',
  },
  meterRow: {
    paddingVertical: 12,
  },
  buttonRow: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
    paddingBottom: 32,
  },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  listenBtnActive: {
    borderColor: '#4caf50',
    backgroundColor: '#1a2e1a',
  },
  micDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#555',
  },
  micDotActive: {
    backgroundColor: '#f44336',
  },
  listenText: {
    color: '#ccc',
    fontSize: 15,
    fontWeight: '500',
  },
  // ── Reference drone button ──────────────────────────────────────────────────
  droneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    backgroundColor: '#161616',
  },
  droneBtnActive: {
    borderColor: '#8b5cf6',
    backgroundColor: '#1e1529',
  },
  droneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#444',
  },
  droneDotActive: {
    backgroundColor: '#a78bfa',
  },
  droneText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  droneTextActive: {
    color: '#c4b5fd',
  },
});
