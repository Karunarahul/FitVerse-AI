import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NeuralBackground } from '../../components/NeuralBackground';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SecondaryButton } from '../../components/SecondaryButton';
import { colors, typography, spacing } from '../../theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  return (
    <NeuralBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Brand Tag */}
          <View style={styles.brandRow}>
            <View style={styles.brandDot} />
            <Text style={styles.brandText}>FITVERSE AI</Text>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={[styles.heroTitle, { fontSize: Math.min(38, width * 0.1) }]}>
              Train Smarter{'\n'}
              <Text style={styles.heroGradientText}>with AI</Text>
            </Text>

            <Text style={styles.heroSubtitle}>
              Personalized workouts and nutrition generated for your body and goals.
            </Text>
          </View>

          {/* Feature Cards Grid */}
          <View style={styles.featuresContainer}>
            <GlassCard level={2} style={styles.featureCard}>
              <View style={[styles.iconWrapper, { backgroundColor: 'rgba(255, 84, 74, 0.12)' }]}>
                <Ionicons name="barbell" size={20} color={colors.primaryAction} />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>AI Workouts</Text>
                <Text style={styles.featureDesc}>
                  Adaptive splits, weights, and periodization built from your biological feedback.
                </Text>
              </View>
            </GlassCard>

            <GlassCard level={2} style={styles.featureCard}>
              <View style={[styles.iconWrapper, { backgroundColor: 'rgba(107, 211, 253, 0.12)' }]}>
                <Ionicons name="nutrition" size={20} color={colors.aiAccent} />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>Smart Nutrition</Text>
                <Text style={styles.featureDesc}>
                  Caloric and macro precision with instant AI-powered 1-tap meal swaps.
                </Text>
              </View>
            </GlassCard>

            <GlassCard level={2} style={styles.featureCard}>
              <View style={[styles.iconWrapper, { backgroundColor: 'rgba(46, 213, 115, 0.12)' }]}>
                <Ionicons name="analytics" size={20} color={colors.success} />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>Progress Analytics</Text>
                <Text style={styles.featureDesc}>
                  Real-time telemetry, recovery scores, and automated weekly plan adaptations.
                </Text>
              </View>
            </GlassCard>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <PrimaryButton
              title="GET STARTED →"
              onPress={() => router.push('/onboarding/personal-info')}
              style={styles.actionBtn}
            />

            <SecondaryButton
              title="SIGN IN"
              onPress={() => router.push('/(auth)/login')}
              style={styles.actionBtn}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </NeuralBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.horizontal,
    paddingTop: 16,
    paddingBottom: 32,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryAction,
    marginRight: 8,
  },
  brandText: {
    ...typography.tech,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heroSection: {
    marginBottom: 28,
  },
  heroTitle: {
    ...typography.hero,
    color: colors.textPrimary,
    fontWeight: '900',
    lineHeight: 44,
  },
  heroGradientText: {
    color: colors.primaryAction,
  },
  heroSubtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginTop: 12,
    lineHeight: 24,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  featureDesc: {
    ...typography.body,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  actions: {
    gap: 12,
  },
  actionBtn: {
    width: '100%',
  },
});
