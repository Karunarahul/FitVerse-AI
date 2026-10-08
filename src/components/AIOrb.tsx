import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface AIOrbProps {
  size?: number;
  glowColor?: 'ai' | 'crimson';
  style?: ViewStyle;
}

export const AIOrb: React.FC<AIOrbProps> = ({
  size = 120,
  glowColor = 'ai',
  style,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.65);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Pulse animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Opacity breathing
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.95, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Subtle rotation
    rotate.value = withRepeat(
      withTiming(360, { duration: 12000, easing: Easing.linear }),
      -1,
      false
    );
  }, [opacity, rotate, scale]);

  const animatedOuterGlow = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedCore = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  const isAI = glowColor === 'ai';
  const primaryGlow = isAI ? 'rgba(107, 211, 253, 0.4)' : 'rgba(255, 84, 74, 0.45)';
  const innerColors = isAI ? (['#6BD3FD', '#1D4ED8'] as const) : (['#FF544A', '#880E4F'] as const);

  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      {/* Outer Glow Halo */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            width: size * 1.35,
            height: size * 1.35,
            borderRadius: (size * 1.35) / 2,
            backgroundColor: primaryGlow,
          },
          animatedOuterGlow,
        ]}
      />

      {/* Middle Concentric Ring */}
      <View
        style={[
          styles.middleRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: isAI ? 'rgba(107, 211, 253, 0.5)' : 'rgba(255, 84, 74, 0.5)',
          },
        ]}
      />

      {/* Rotating Core Gradient */}
      <Animated.View
        style={[
          styles.core,
          {
            width: size * 0.72,
            height: size * 0.72,
            borderRadius: (size * 0.72) / 2,
          },
          animatedCore,
        ]}
      >
        <LinearGradient
          colors={innerColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Specular highlight */}
        <View style={styles.specular} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerRing: {
    position: 'absolute',
  },
  middleRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    opacity: 0.6,
  },
  core: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  specular: {
    position: 'absolute',
    top: 6,
    left: 12,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});
