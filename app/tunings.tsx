import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { useTunings } from '../src/tunings/useTunings';
import { INSTRUMENT_LIST } from '../src/tunings/instruments';
import { Tuning, InstrumentId } from '../src/models/types';

export default function TuningsScreen() {
  const {
    presets,
    custom,
    activeTuning,
    activeInstrumentId,
    setActiveInstrument,
    setActiveTuning,
    deleteCustomTuning,
  } = useTunings();

  const handleDelete = (tuning: Tuning) => {
    Alert.alert(
      'Delete Tuning',
      `Delete "${tuning.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCustomTuning(tuning.id),
        },
      ],
    );
  };

  const renderTuningItem = ({ item }: { item: Tuning }) => {
    const isActive = activeTuning?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.item, isActive && styles.itemActive]}
        onPress={() => setActiveTuning(item)}
        onLongPress={item.source === 'custom' ? () => handleDelete(item) : undefined}
        activeOpacity={0.7}
      >
        <View style={styles.itemInner}>
          <View>
            <Text style={[styles.itemName, isActive && styles.itemNameActive]}>
              {item.name}
            </Text>
            <Text style={styles.itemStrings}>
              {item.strings.map((s) => `${s.targetNote.name}${s.targetNote.octave}`).join(' · ')}
            </Text>
          </View>
          {isActive && <View style={styles.activeDot} />}
        </View>
        {item.source === 'custom' && (
          <Text style={styles.customBadge}>Custom</Text>
        )}
      </TouchableOpacity>
    );
  };

  type ListRow =
    | { type: 'header'; title: string }
    | ({ type: 'item' } & Tuning);

  const sections: Array<{ title: string; data: Tuning[] }> = [
    { title: 'Presets', data: presets },
    ...(custom.length > 0 ? [{ title: 'My Tunings', data: custom }] : []),
  ];

  const listData: ListRow[] = sections.flatMap((s) => [
    { type: 'header' as const, title: s.title },
    ...s.data.map((d) => ({ type: 'item' as const, ...d })),
  ]);

  return (
    <SafeAreaView style={styles.root}>
      {/* Instrument switcher */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.switcherScroll}
        contentContainerStyle={styles.switcherContent}
      >
        {INSTRUMENT_LIST.map((instrument) => {
          const isSelected = instrument.id === activeInstrumentId;
          return (
            <TouchableOpacity
              key={instrument.id}
              style={[styles.switcherBtn, isSelected && styles.switcherBtnSelected]}
              onPress={() => setActiveInstrument(instrument.id as InstrumentId)}
              activeOpacity={0.7}
            >
              <Text style={[styles.switcherLabel, isSelected && styles.switcherLabelSelected]}>
                {instrument.displayName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Tuning list */}
      <FlatList
        data={listData}
        keyExtractor={(item, i) => ('id' in item ? item.id : `header-${i}`)}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return <Text style={styles.sectionHeader}>{item.title}</Text>;
          }
          return renderTuningItem({ item: item as Tuning });
        }}
        contentContainerStyle={styles.list}
      />

      {custom.length > 0 && (
        <Text style={styles.hint}>Long-press a custom tuning to delete it.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#111',
  },
  switcherScroll: {
    flexGrow: 0,
  },
  switcherContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  switcherBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  switcherBtnSelected: {
    borderColor: '#4caf50',
    backgroundColor: '#1a3d1e',
  },
  switcherLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  switcherLabelSelected: {
    color: '#8bc34a',
  },
  list: {
    padding: 16,
    gap: 6,
  },
  sectionHeader: {
    fontSize: 12,
    color: '#555',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  item: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    marginBottom: 2,
  },
  itemActive: {
    borderColor: '#4caf50',
    backgroundColor: '#192419',
  },
  itemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ddd',
    marginBottom: 3,
  },
  itemNameActive: {
    color: '#fff',
  },
  itemStrings: {
    fontSize: 12,
    color: '#666',
    letterSpacing: 0.5,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4caf50',
  },
  customBadge: {
    fontSize: 10,
    color: '#7b9e7d',
    marginTop: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  hint: {
    textAlign: 'center',
    color: '#444',
    fontSize: 11,
    paddingVertical: 8,
  },
});
