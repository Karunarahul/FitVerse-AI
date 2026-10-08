import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NeuralBackground } from '../../components/NeuralBackground';
import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { Slider } from '../../components/Slider';
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors, typography, radii, spacing } from '../../theme';
import { useOnboardingStore } from '../../stores/onboardingStore';
import {
  calculateBMI,
  calculateBMR,
  calculateHydrationTarget,
} from '../../utils/calculations';

const ACTIVITY_LEVELS = [
  { key: 'Sedentary', label: 'Sedentary', desc: 'Minimal daily movement' },
  { key: 'Active', label: 'Active', desc: '3–4 training sessions/wk' },
  { key: 'Athlete', label: 'Athlete', desc: '5–6 intense sessions/wk' },
  { key: 'Elite', label: 'Elite', desc: '2x daily high-load training' },
];

export default function BodyMetricsScreen() {
  const router = useRouter();
  const { data, setBodyMetrics } = useOnboardingStore();

  const [heightCm, setHeightCm] = useState(data.heightCm || 178);
  const [weightKg, setWeightKg] = useState(data.weightKg || 74.5);
  const [activityLevel, setActivityLevel] = useState(data.activityLevel || 'Athlete');

  // Dynamic calculations: updates in real-time
  const { bmi, category } = useMemo(() => calculateBMI(weightKg, heightCm), [weightKg, heightCm]);
  const bmr = useMemo(
    () => calculateBMR(weightKg, heightCm, data.age || 25, data.gender || 'Male'),
    [weightKg, heightCm, data.age, data.gender]
  );
  const hydration = useMemo(
    () => calculateHydrationTarget(weightKg, activityLevel),
    [weightKg, activityLevel]
  );

  const handleNext = () => {
    setBodyMetrics({
      heightCm,
      weightKg,
      activityLevel,
    });
    router.push('/onboarding/workout-goals');
  };

  return (
    <NeuralBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          stepIndicator="2/4"
          title="Body Metrics Calibration"
          subtitle="Precision biometrics fuel our AI load and metabolic calculations."
          showBack
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Live Biometric Telemetry Display */}
          <GlassCard level={3} glow="ai" style={styles.telemetryCard}>
            <View style={styles.telemetryHeader}>
              <Text style={styles.telemetryTag}>DYNAMIC TELEMETRY CALIBRATION</Text>
            </View>

            <View style={styles.statsRow}>
              {/* BMI */}
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>BODY MASS INDEX</Text>
                <Text style={styles.statValue}>{bmi}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
              </View>

              <View style={styles.statDivider} />

              {/* BMR */}
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>BASAL RATE</Text>
                <Text style={styles.statValue}>{bmr}</Text>
                <Text style={styles.unitText}>KCAL / DAY</Text>
              </View>

              <View style={styles.statDivider} />

              {/* Hydration */}
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>HYDRATION</Text>
                <Text style={[styles.statValue, { color: colors.aiAccent }]}>{hydration}L</Text>
                <Text style={styles.unitText}>TARGET / DAY</Text>
              </View>
            </View>
          </GlassCard>

          {/* Interactive Metric Sliders */}
          <View style={styles.slidersContainer}>
            <GlassCard level={2} style={styles.sliderCard}>
              <Slider
                label="STATURE / HEIGHT"
                value={heightCm}
                min={130}
                max={220}
                step={1}
                unit="cm"
                onValueChange={setHeightCm}
              />
            </GlassCard>

            <GlassCard level={2} style={styles.sliderCard}>
              <Slider
                label="BODY MASS / WEIGHT"
                value={weightKg}
                min={40}
                max={180}
                step={0.5}
                unit="kg"
                onValueChange={setWeightKg}
              />
            </GlassCard>
          </View>

          {/* Activity Level Selector */}
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>ACTIVITY COEFFICIENT</Text>
            <View style={styles.activityGrid}>
              {ACTIVITY_LEVELS.map((act) => {
                const isSelected = activityLevel === act.key;
                return (
                  <TouchableOpacity
                    key={act.key}
                    onPress={() => setActivityLevel(act.key)}
                    activeOpacity={0.8}
                    style={[
                      styles.activityCard,
                      isSelected && styles.activityCardActive,
                    ]}
                  >
                    <View style={styles.actTop}>
                      <Text style={[styles.actLabel, isSelected && styles.actLabelActive]}>
                        {act.label}
                      </Text>
                      {isSelected && <View style={styles.activePill} />}
                    </View>
                    <Text style={styles.actDesc}>{act.desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Next Button */}
          <View style={styles.bottomArea}>
            <PrimaryButton
              title="CALIBRATE ENGINE →"
              onPress={handleNext}
              style={styles.nextBtn}
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
    paddingBottom: 28,
  },
  telemetryCard: {
    marginBottom: 20,
    padding: 18,
  },
  telemetryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  telemetryTag: {
    ...typography.techSmall,
    color: colors.aiAccent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 44,
    backgroundColor: colors.borderSubtle,
  },
  statLabel: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 9,
    letterSpacing: 0.6,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    ...typography.techLarge,
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  unitText: {
    ...typography.techSmall,
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },
  categoryBadge: {
    backgroundColor: 'rgba(46, 213, 115, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
    marginTop: 4,
  },
  categoryText: {
    ...typography.techSmall,
    color: colors.success,
    fontSize: 10,
    fontWeight: '700',
  },
  slidersContainer: {
    gap: 12,
    marginBottom: 20,
  },
  sliderCard: {
    padding: 16,
  },
  activitySection: {
    marginBottom: 28,
  },
  sectionTitle: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 1.0,
    marginBottom: 10,
  },
  activityGrid: {
    gap: 10,
  },
  activityCard: {
    backgroundColor: colors.surfaceL2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.input,
    padding: 14,
  },
  activityCardActive: {
    borderColor: colors.borderActive,
    backgroundColor: 'rgba(255, 84, 74, 0.08)',
  },
  actTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  actLabel: {
    ...typography.tech,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actLabelActive: {
    color: colors.primaryAction,
  },
  activePill: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryAction,
  },
  actDesc: {
    ...typography.caption,
    color: colors.textMuted,
  },
  bottomArea: {
    marginTop: 8,
  },
  nextBtn: {
    width: '100%',
  },
});
