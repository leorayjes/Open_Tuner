import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  isInTune: boolean;
}

export function InTuneFlash({ isInTune }: Props) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isInTune) {
      opacity.value = withSequence(
        withTiming(0.35, { duration: 120 }),
        withTiming(0, { duration: 900 }),
      );
    }
  }, [isInTune, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, style]} />;
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: '#4caf50',
    pointerEvents: 'none',
  },
});
