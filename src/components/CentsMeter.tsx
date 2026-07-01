import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  cents: number | null;
  maxCents?: number;
}

const SPRING_CONFIG = { damping: 20, stiffness: 180 };
// Height reserved above and below the track for the taller indicator pip
const PIP_OVERHANG = 8;
const TRACK_H = 8;
const PIP_H = TRACK_H + PIP_OVERHANG * 2; // 24
const CONTAINER_H = PIP_H + 4;             // total row height

export function CentsMeter({ cents, maxCents = 50 }: Props) {
  const position = useSharedValue(0.5);

  useEffect(() => {
    const clamped = Math.max(-maxCents, Math.min(maxCents, cents ?? 0));
    position.value = withSpring((clamped + maxCents) / (2 * maxCents), SPRING_CONFIG);
  }, [cents, maxCents, position]);

  // The indicator is an absolutely-positioned child of the outer container row,
  // so it can visually extend above/below the track without being clipped.
  const indicatorStyle = useAnimatedStyle(() => ({
    left: `${position.value * 100}%`,
  }));

  const isInTune = cents !== null && Math.abs(cents) <= 5;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>FLAT</Text>

      {/* Track + indicator live in a container that has enough height for both */}
      <View style={styles.trackArea}>
        {/* Background track */}
        <View style={styles.track}>
          {/* Green center zone ±5 cents = 10% of total width, centered */}
          <View style={styles.centerZone} />
          {/* Center tick */}
          <View style={styles.centerTick} />
        </View>

        {/* Indicator pip — sibling of track so it can overflow without clipping */}
        <Animated.View
          style={[
            styles.indicator,
            isInTune && styles.indicatorInTune,
            indicatorStyle,
          ]}
        />
      </View>

      <Text style={styles.label}>SHARP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  label: {
    fontSize: 11,
    color: '#666',
    letterSpacing: 1,
    width: 40,
    textAlign: 'center',
  },
  // Outer container for track + pip; height accommodates pip overhang
  trackArea: {
    flex: 1,
    height: CONTAINER_H,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: TRACK_H,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden', // clip only the zone and tick to track bounds
    position: 'relative',
    justifyContent: 'center',
  },
  centerZone: {
    position: 'absolute',
    width: '10%',
    height: '100%',
    left: '45%',
    backgroundColor: '#2d5a2f',
  },
  centerTick: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: '#555',
    left: '50%',
    transform: [{ translateX: -1 }],
  },
  // Pip is a sibling of track, positioned absolutely within trackArea
  indicator: {
    position: 'absolute',
    width: 8,
    height: PIP_H,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    top: (CONTAINER_H - PIP_H) / 2,
    transform: [{ translateX: -4 }],
  },
  indicatorInTune: {
    backgroundColor: '#4caf50',
  },
});
