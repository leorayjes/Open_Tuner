import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useTunings } from '../src/tunings/useTunings';
import { INSTRUMENTS } from '../src/tunings/instruments';
import { NoteSelector } from '../src/components/NoteSelector';
import { NoteName, TuningString } from '../src/models/types';
import { makeNote, noteToFrequency } from '../src/pitch/noteUtils';

const DEFAULT_GUITAR_STRINGS: TuningString[] = [
  { stringIndex: 0, displayName: '6 (low)', targetNote: makeNote('E', 2) },
  { stringIndex: 1, displayName: '5', targetNote: makeNote('A', 2) },
  { stringIndex: 2, displayName: '4', targetNote: makeNote('D', 3) },
  { stringIndex: 3, displayName: '3', targetNote: makeNote('G', 3) },
  { stringIndex: 4, displayName: '2', targetNote: makeNote('B', 3) },
  { stringIndex: 5, displayName: '1 (high)', targetNote: makeNote('E', 4) },
];

export default function CustomTuningScreen() {
  const { addCustomTuning, activeInstrumentId, setActiveTuning } = useTunings();
  const instrument = INSTRUMENTS[activeInstrumentId];

  const [name, setName] = useState('');
  const [strings, setStrings] = useState<TuningString[]>(DEFAULT_GUITAR_STRINGS);
  const [saving, setSaving] = useState(false);

  const updateString = (index: number, note: NoteName, octave: number) => {
    setStrings((prev) =>
      prev.map((s) =>
        s.stringIndex === index
          ? {
              ...s,
              targetNote: {
                name: note,
                octave,
                frequency: noteToFrequency(note, octave),
              },
            }
          : s,
      ),
    );
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Name required', 'Please enter a name for this tuning.');
      return;
    }

    setSaving(true);
    try {
      const tuning = await addCustomTuning({
        name: trimmedName,
        instrumentId: activeInstrumentId,
        strings,
      });
      await setActiveTuning(tuning);
      router.replace('/');
    } catch (err) {
      Alert.alert('Error', 'Could not save tuning. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionLabel}>Tuning Name</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="e.g. My Open C Tuning"
          placeholderTextColor="#555"
          value={name}
          onChangeText={setName}
          maxLength={50}
          returnKeyType="done"
          autoFocus
        />

        <Text style={styles.sectionLabel}>Strings — {instrument?.displayName ?? 'Guitar'}</Text>
        {strings.map((s) => (
          <View key={s.stringIndex} style={styles.stringRow}>
            <Text style={styles.stringLabel}>{s.displayName}</Text>
            <NoteSelector
              selectedNote={s.targetNote.name}
              selectedOctave={s.targetNote.octave}
              onNoteChange={(note) => updateString(s.stringIndex, note, s.targetNote.octave)}
              onOctaveChange={(octave) => updateString(s.stringIndex, s.targetNote.name, octave)}
              octaveRange={instrument?.octaveRange ?? [1, 5]}
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Tuning'}</Text>
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
  content: {
    padding: 20,
    gap: 8,
    paddingBottom: 100,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#555',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    padding: 14,
    fontSize: 16,
    color: '#fff',
  },
  stringRow: {
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    marginBottom: 6,
    gap: 8,
  },
  stringLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 36,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  saveBtn: {
    backgroundColor: '#2e7d32',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
