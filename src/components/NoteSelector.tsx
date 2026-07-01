import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NoteName } from '../models/types';
import { NOTE_NAMES } from '../pitch/noteUtils';

interface Props {
  selectedNote: NoteName;
  selectedOctave: number;
  onNoteChange: (note: NoteName) => void;
  onOctaveChange: (octave: number) => void;
  octaveRange: [number, number];
  label?: string;
}

export function NoteSelector({
  selectedNote,
  selectedOctave,
  onNoteChange,
  onOctaveChange,
  octaveRange,
  label,
}: Props) {
  const octaves = Array.from(
    { length: octaveRange[1] - octaveRange[0] + 1 },
    (_, i) => i + octaveRange[0],
  );

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.row}>
        {/* Note picker */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.noteList}
        >
          {NOTE_NAMES.map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.chip, selectedNote === n && styles.chipSelected]}
              onPress={() => onNoteChange(n)}
            >
              <Text style={[styles.chipText, selectedNote === n && styles.chipTextSelected]}>
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Octave picker */}
        <View style={styles.octavePicker}>
          {octaves.map((o) => (
            <TouchableOpacity
              key={o}
              style={[styles.octaveBtn, selectedOctave === o && styles.octaveBtnSelected]}
              onPress={() => onOctaveChange(o)}
            >
              <Text
                style={[styles.octaveText, selectedOctave === o && styles.octaveTextSelected]}
              >
                {o}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noteList: {
    gap: 6,
    paddingRight: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  chipSelected: {
    borderColor: '#4caf50',
    backgroundColor: '#1a3d1e',
  },
  chipText: {
    fontSize: 14,
    color: '#aaa',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
  },
  octavePicker: {
    flexDirection: 'row',
    gap: 4,
  },
  octaveBtn: {
    width: 32,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  octaveBtnSelected: {
    borderColor: '#4caf50',
    backgroundColor: '#1a3d1e',
  },
  octaveText: {
    fontSize: 14,
    color: '#aaa',
  },
  octaveTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
});
