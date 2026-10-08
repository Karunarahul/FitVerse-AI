import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NeuralBackground } from '../components/NeuralBackground';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { AIOrb } from '../components/AIOrb';
import { colors, typography, radii, spacing } from '../theme';
import { useSubscriptionStore } from '../stores/subscriptionStore';

const BENEFITS = [
  {
    icon: 'sparkles' as const,
    title: 'AI Adaptive Coaching',
    desc: 'Autonomous daily volume and load recalibration based on biometric recovery.',
  },
  {
    icon: 'analytics' as const,
    title: 'Advanced Telemetry',
    desc: 'Longitudinal HRV, nervous system readiness, and predicted 1RM trajectories.',
  },
  {
    icon: 'nutrition' as const,
    title: 'Unlimited Meal Swaps',
    desc: 'Instant neural macro matching respecting any allergy or dietary restriction.',
  },
  {
    icon: 'watch' as const,
    title: 'Wearable Integration',
    desc: 'Continuous live sync with Apple Watch, Whoop 4.0, Garmin and Oura Ring.',
  },
];

export default function PremiumScreen() {
  const router = useRouter();
  const { selectedPlan, setSelectedPlan, upgradeToPremium, isPremium } = useSubscriptionStore();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    await upgradeToPremium(selectedPlan);
    setLoading(false);

    Alert.alert(
      'Elite Tier Activated 👑',
      `Welcome to FitVerse Premium (${selectedPlan === 'yearly' ? 'Annual Plan' : 'Monthly Plan'}). All neural adaptation models are now unlocked!`,
      [{ text: 'CONTINUE', onPress: () => router.back() }]
    );
  };

  return (
    <NeuralBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerBadge}>FITVERSE ELITE</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Banner */}
          <View style={styles.heroArea}>
            <View style={styles.orbWrapper}>
              <AIOrb size={80} glowColor="crimson" />
            </View>
            <Text style={styles.title}>FitVerse Premium</Text>
            <Text style={styles.subtitle}>Unlock Elite Performance</Text>
            <Text style={styles.description}>
              The adaptive operating system designed for serious athletes, powerlifters, and high-performance individuals.
            </Text>
          </View>

          {/* Benefits Grid */}
          <View style={styles.benefitsList}>
            {BENEFITS.map((item, i) => (
              <GlassCard key={i} level={2} style={styles.benefitCard}>
                <View style={styles.benefitIcon}>
                  <Ionicons name={item.icon} size={20} color={colors.primaryAction} />
                </View>
                <View style={styles.benefitInfo}>
                  <Text style={styles.benefitTitle}>{item.title}</Text>
                  <Text style={styles.benefitDesc}>{item.desc}</Text>
                </View>
              </GlassCard>
            ))}
          </View>

          {/* Pricing Tier Selectors */}
          <View style={styles.plansSection}>
            <Text style={styles.plansHeader}>SELECT PROTOCOL</Text>

            {/* Yearly Plan (Highlighted) */}
            <TouchableOpacity
              onPress={() => setSelectedPlan('yearly')}
              activeOpacity={0.8}
              style={[
                styles.planCard,
                selectedPlan === 'yearly' && styles.planCardActive,
              ]}
            >
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>SAVE 30%</Text>
              </View>

              <View style={styles.planCardTop}>
                <View>
                  <Text style={styles.planName}>Annual Protocol</Text>
                  <Text style={styles.planSub}>$20.00 / month billed annually</Text>
                </View>
                <Text style={styles.planPrice}>$240</Text>
              </View>
            </TouchableOpacity>

            {/* Monthly Plan */}
            <TouchableOpacity
              onPress={() => setSelectedPlan('monthly')}
              activeOpacity={0.8}
              style={[
                styles.planCard,
                selectedPlan === 'monthly' && styles.planCardActive,
              ]}
            >
              <View style={styles.planCardTop}>
                <View>
                  <Text style={styles.planName}>Monthly Protocol</Text>
                  <Text style={styles.planSub}>Billed monthly, cancel anytime</Text>
                </View>
                <Text style={styles.planPrice}>$29</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Upgrade Action Button */}
          <View style={styles.bottomArea}>
            <PrimaryButton
              title={isPremium ? 'CURRENT PLAN ACTIVE ✓' : 'UPGRADE TO PREMIUM →'}
              loading={loading}
              onPress={handleUpgrade}
              style={styles.upgradeBtn}
            />
            <Text style={styles.guaranteeText}>
              Includes 7-day risk-free biometric trial. Instant neural calibration.
            </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.horizontal,
    paddingTop: 8,
    paddingBottom: 14,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadge: {
    ...typography.techSmall,
    color: colors.primaryAction,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingHorizontal: spacing.horizontal,
    paddingBottom: 36,
  },
  heroArea: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  orbWrapper: {
    marginBottom: 16,
  },
  title: {
    ...typography.hero,
    fontSize: 30,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.primaryAction,
    marginTop: 4,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    maxWidth: 300,
  },
  benefitsList: {
    gap: 10,
    marginBottom: 24,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  benefitIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 84, 74, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  benefitInfo: {
    flex: 1,
  },
  benefitTitle: {
    ...typography.h3,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  benefitDesc: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 16,
    marginTop: 2,
  },
  plansSection: {
    marginBottom: 24,
  },
  plansHeader: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 1.0,
    marginBottom: 12,
  },
  planCard: {
    backgroundColor: colors.surfaceL2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.card,
    padding: 18,
    marginBottom: 12,
    position: 'relative',
  },
  planCardActive: {
    borderColor: colors.borderActive,
    backgroundColor: 'rgba(255, 84, 74, 0.08)',
  },
  saveBadge: {
    position: 'absolute',
    top: -10,
    right: 18,
    backgroundColor: colors.primaryAction,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
  },
  saveBadgeText: {
    ...typography.techSmall,
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  planCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    ...typography.h3,
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  planSub: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  planPrice: {
    ...typography.techLarge,
    fontSize: 26,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  bottomArea: {
    alignItems: 'center',
  },
  upgradeBtn: {
    width: '100%',
    marginBottom: 10,
  },
  guaranteeText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 11,
  },
});
