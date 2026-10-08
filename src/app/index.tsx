import React, { useEffect } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AIOrb } from '../components/AIOrb';
import { colors, typography } from '../theme';
import { useAuthStore } from '../stores/authStore';

export default function SplashScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const subtitleOpacity = useSharedValue(0);

  useEffect(() => {
    // Splash animation sequence
    opacity.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.ease) });
    scale.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.back(1.2)) });
    subtitleOpacity.value = withDelay(400, withTiming(1, { duration: 700 }));

    // Auto-advance after 2.4s
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(app)/home');
      } else {
        router.replace('/(auth)/welcome');
      }
    }, 2400);

    return () => clearTimeout(timer);
  }, [isAuthenticated, opacity, router, scale, subtitleOpacity]);

  const animatedContainer = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const animatedSubtitle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2E0D0F', '#1C0706', '#100404']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[styles.content, animatedContainer]}>
        {/* Glowing Neural Center */}
        <View style={styles.orbWrapper}>
          <AIOrb size={130} glowColor="crimson" />
        </View>

        {/* Title */}
        <Text style={[styles.title, { fontSize: Math.min(36, width * 0.09) }]}>
          FITVERSE <Text style={styles.aiTag}>AI</Text>
        </Text>

        {/* Technical Subtitle */}
        <Animated.View style={animatedSubtitle}>
          <Text style={styles.subtitle}>AI POWERED PERSONALIZED FITNESS</Text>
          <View style={styles.statusBar}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>NEURAL ENGINE ONLINE</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  orbWrapper: {
    marginBottom: 36,
  },
  title: {
    ...typography.hero,
    color: colors.textPrimary,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  aiTag: {
    color: colors.primaryAction,
  },
  subtitle: {
    ...typography.tech,
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 2.2,
    textAlign: 'center',
    marginTop: 10,
    textTransform: 'uppercase',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(255, 84, 74, 0.08)',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255, 84, 74, 0.25)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 8,
  },
  statusText: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});
