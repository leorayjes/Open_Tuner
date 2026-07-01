import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TuningString } from '../models/types';

interface Props {
  strings: TuningString[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

// Explicit height so the horizontal ScrollView never clips its children on web.
// Calculated: paddingVertical(8*2) + border(1*2) + paddingVertical(10*2) + label(14) + gap(2) + note(22) = 76
const SCROLL_HEIGHT = 84;

export function StringSelector({ strings, selectedIndex, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}
    >
      {strings.map((s) => {
        const isSelected = s.stringIndex === selectedIndex;
        return (
          <TouchableOpacity
            key={s.stringIndex}
            style={[styles.button, isSelected && styles.buttonSelected]}
            onPress={() => onSelect(s.stringIndex)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {s.displayName}
            </Text>
            <Text style={[styles.note, isSelected && styles.noteSelected]}>
              {s.targetNote.name}{s.targetNote.octave}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    height: SCROLL_HEIGHT,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    minWidth: 72,
  },
  buttonSelected: {
    borderColor: '#4caf50',
    backgroundColor: '#1a3d1e',
  },
  label: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  labelSelected: {
    color: '#8bc34a',
  },
  note: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ccc',
  },
  noteSelected: {
    color: '#fff',
  },
});
