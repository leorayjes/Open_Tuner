import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line, Circle, Text as SvgText, Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  cents: number | null;   // -50 to +50
  size?: number;
}

const SPRING_CONFIG = { damping: 18, stiffness: 160 };
const MAX_ANGLE = 45; // degrees from center

export function TunerNeedle({ cents, size = 260 }: Props) {
  const rotation = useSharedValue(0);

  const cx = size / 2;
  const cy = size * 0.82;
  const radius = size * 0.72;
  const needleLen = size * 0.68;
  const isInTune = cents !== null && Math.abs(cents) <= 5;

  useEffect(() => {
    const clamped = Math.max(-50, Math.min(50, cents ?? 0));
    rotation.value = withSpring((clamped / 50) * MAX_ANGLE, SPRING_CONFIG);
  }, [cents, rotation]);

  /**
   * Rotate around the BOTTOM center of the needle (the pivot at cy).
   *
   * The needle View's bottom center is at local position (0, +needleLen/2).
   * To keep that point fixed during rotation, the correct transform order is:
   *   translateY(−L/2)  →  rotateZ(angle)  →  translateY(+L/2)
   *
   * Proof: a point at local (0, L/2):
   *   1. → (0, 0)         after translateY(−L/2)
   *   2. → (0, 0)         after rotateZ (rotation around origin has no effect on origin)
   *   3. → (0, L/2)  ✓   after translateY(+L/2)
   */
  const needleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -(needleLen / 2) },
      { rotateZ: `${rotation.value}deg` },
      { translateY: needleLen / 2 },
    ],
  }));

  // Arc path from −MAX_ANGLE to +MAX_ANGLE around the top (−90°)
  const startAngleDeg = -90 - MAX_ANGLE;
  const endAngleDeg = -90 + MAX_ANGLE;

  function polarToXY(angleDeg: number, r: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const arcStart = polarToXY(startAngleDeg, radius);
  const arcEnd = polarToXY(endAngleDeg, radius);
  const arcPath = `M ${arcStart.x} ${arcStart.y} A ${radius} ${radius} 0 0 1 ${arcEnd.x} ${arcEnd.y}`;

  const ticks = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50];

  return (
    <View style={[styles.container, { width: size, height: size * 0.7 }]}>
      {/* Static SVG: arc, tick marks, pivot dot */}
      <Svg
        width={size}
        height={size * 0.7}
        viewBox={`0 0 ${size} ${size * 0.7}`}
        style={StyleSheet.absoluteFill}
      >
        {/* Arc track */}
        <Path
          d={arcPath}
          stroke="#333"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />

        {/* Tick marks every 10 cents */}
        {ticks.map((t) => {
          const angleDeg = -90 + (t / 50) * MAX_ANGLE;
          const tickLen = t % 10 === 0 ? 14 : 8;
          const inner = polarToXY(angleDeg, radius - tickLen);
          const outer = polarToXY(angleDeg, radius + 2);
          const isCenter = t === 0;
          return (
            <Line
              key={t}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke={isCenter ? '#666' : '#444'}
              strokeWidth={isCenter ? 2 : 1}
            />
          );
        })}

        {/* Center "0" label */}
        <SvgText
          x={cx}
          y={cy - radius + 30}
          textAnchor="middle"
          fill="#555"
          fontSize={11}
        >
          0
        </SvgText>

        {/* Pivot circle */}
        <Circle
          cx={cx}
          cy={cy}
          r={6}
          fill={isInTune ? '#4caf50' : '#999'}
        />
      </Svg>

      {/*
        Animated needle as a plain View — avoids react-native-svg's `origin` prop
        which renders as the invalid DOM attribute `transform-origin` on web.

        Layout: top = needleTopY (visible), bottom = cy (below container, clipped).
        Rotation around bottom center is achieved via the double-translate above.
      */}
      <Animated.View
        style={[
          styles.needle,
          {
            height: needleLen,
            left: cx - 1.5,
            top: cy - needleLen,
            backgroundColor: isInTune ? '#4caf50' : '#e0e0e0',
          },
          needleStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  needle: {
    position: 'absolute',
    width: 3,
    borderRadius: 1.5,
  },
});
