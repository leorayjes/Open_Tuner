import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PitchResult } from '../models/types';
import { formatCents, noteLabel } from '../pitch/noteUtils';

interface Props {
  pitch: PitchResult;
  targetNoteName?: string;
}

export function NoteDisplay({ pitch, targetNoteName }: Props) {
  const { closestNote, detectedHz, centsDeviation } = pitch;

  const noteText = closestNote ? closestNote.name : '--';
  const octaveText = closestNote ? String(closestNote.octave) : '';
  const hzText = detectedHz ? `${detectedHz.toFixed(1)} Hz` : '';
  const centsText = formatCents(centsDeviation);

  const isTuned = pitch.isInTune;

  return (
    <View style={styles.container}>
      {targetNoteName && (
        <Text style={styles.target}>Target: {targetNoteName}</Text>
      )}
      <View style={styles.noteRow}>
        <Text style={[styles.noteName, isTuned && styles.inTune]}>{noteText}</Text>
        {octaveText ? (
          <Text style={[styles.octave, isTuned && styles.inTune]}>{octaveText}</Text>
        ) : null}
      </View>
      {hzText ? <Text style={styles.hz}>{hzText}</Text> : null}
      <Text style={[styles.cents, isTuned && styles.inTuneCents]}>{centsText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  target: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
    letterSpacing: 1,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteName: {
    fontSize: 80,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 88,
  },
  octave: {
    fontSize: 32,
    fontWeight: '400',
    color: '#aaa',
    marginTop: 12,
    marginLeft: 4,
  },
  hz: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
  cents: {
    fontSize: 22,
    color: '#ccc',
    marginTop: 8,
    fontVariant: ['tabular-nums'],
  },
  inTune: {
    color: '#4caf50',
  },
  inTuneCents: {
    color: '#4caf50',
  },
});
