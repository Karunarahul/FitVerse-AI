import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { NeuralBackground } from '../../components/NeuralBackground';
import { GlassCard } from '../../components/GlassCard';
import { MetricCard } from '../../components/MetricCard';
import { ProgressRing } from '../../components/ProgressRing';
import { PrimaryButton } from '../../components/PrimaryButton';
import { GlassButton } from '../../components/GlassButton';
import { colors, typography, radii, spacing } from '../../theme';
import { useUserStore } from '../../stores/userStore';
import { useWorkoutStore } from '../../stores/workoutStore';
import { useNutritionStore } from '../../stores/nutritionStore';
import { useAnalyticsStore } from '../../stores/analyticsStore';

export default function HomeScreen() {
  const router = useRouter();

  const profile = useUserStore((s) => s.profile);
  const workoutPlan = useWorkoutStore((s) => s.currentPlan);
  const nutritionPlan = useNutritionStore((s) => s.currentPlan);
  const addHydration = useNutritionStore((s) => s.addHydration);
  const stats = useAnalyticsStore((s) => s.stats);

  const handleAddHydration = (amount: number) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}
    }
    addHydration(amount);
  };

  return (
    <NeuralBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greetingTitle}>
              Good morning,{'\n'}
              <Text style={styles.userName}>{profile.name || 'Alex'}</Text>
            </Text>
            <Text style={styles.greetingSubtitle}>
              Your physical prime awaits. Day {stats.currentStreakDays} streak active.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(app)/profile')}
            activeOpacity={0.8}
            style={styles.avatarButton}
          >
            <Ionicons name="person" size={18} color={colors.primaryAction} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Streak & Activity Ring Banner */}
          <GlassCard level={3} glow="crimson" style={styles.streakCard}>
            <View style={styles.streakLeft}>
              <View style={styles.streakBadge}>
                <Ionicons name="flame" size={16} color={colors.primaryAction} />
                <Text style={styles.streakDays}>{stats.currentStreakDays} DAYS</Text>
              </View>
              <Text style={styles.streakTitle}>Current Streak</Text>
              <Text style={styles.streakSubtitle}>
                Biometrics indicate heightened physical readiness today.
              </Text>
            </View>

            <ProgressRing
              size={105}
              strokeWidth={8}
              progress={stats.dailyGoalCompletionPercent}
              sublabel="DAILY GOAL"
            />
          </GlassCard>

          {/* Telemetry Metric Cards Grid */}
          <View style={styles.metricsGrid}>
            <MetricCard
              label="HEART RATE"
              value={stats.heartRateBpm}
              unit="BPM"
              subtitle="Resting: Optimal"
              accentColor={colors.primaryAction}
              icon={<Ionicons name="heart" size={18} color={colors.primaryAction} />}
              style={styles.metricCard}
            />

            <MetricCard
              label="DAILY STEPS"
              value={stats.stepsCurrent.toLocaleString()}
              unit="/ 10k"
              subtitle="84% of daily target"
              progressPercent={(stats.stepsCurrent / stats.stepsTarget) * 100}
              accentColor={colors.aiAccent}
              icon={<Ionicons name="footsteps" size={18} color={colors.aiAccent} />}
              style={styles.metricCard}
            />

            <MetricCard
              label="SLEEP TELEMETRY"
              value={stats.sleepDuration}
              unit=""
              subtitle={`Quality: ${stats.sleepQuality}`}
              accentColor={colors.success}
              icon={<Ionicons name="moon" size={18} color={colors.success} />}
              style={styles.metricCard}
            />

            <MetricCard
              label="CONSISTENCY"
              value={stats.consistencyScore}
              unit={`+${stats.consistencyChange}`}
              subtitle="Elite Tier Ranking"
              accentColor={colors.warning}
              icon={<Ionicons name="trending-up" size={18} color={colors.warning} />}
              style={styles.metricCard}
            />
          </View>

          {/* Today's Focus: AI Generated Workout */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>TODAY{"'"}S FOCUS</Text>
            <View style={styles.aiTag}>
              <Ionicons name="sparkles" size={11} color={colors.aiAccent} />
              <Text style={styles.aiTagText}>AI GENERATED PROGRAM</Text>
            </View>
          </View>

          <GlassCard level={3} style={styles.focusCard}>
            <View style={styles.focusHeader}>
              <View>
                <Text style={styles.focusPhase}>{workoutPlan.phase.toUpperCase()}</Text>
                <Text style={styles.focusTitle}>{workoutPlan.name}</Text>
              </View>
              <View style={styles.difficultyBadge}>
                <Text style={styles.difficultyText}>{workoutPlan.difficulty.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.focusMetaRow}>
              <View style={styles.focusMetaItem}>
                <Ionicons name="time-outline" size={16} color={colors.primaryAction} />
                <Text style={styles.focusMetaText}>{workoutPlan.durationMinutes} Min</Text>
              </View>
              <View style={styles.focusMetaItem}>
                <Ionicons name="flame-outline" size={16} color={colors.primaryAction} />
                <Text style={styles.focusMetaText}>{workoutPlan.calories} kcal</Text>
              </View>
              <View style={styles.focusMetaItem}>
                <Ionicons name="flash-outline" size={16} color={colors.aiAccent} />
                <Text style={styles.focusMetaText}>{workoutPlan.exercises.length} Exercises</Text>
              </View>
            </View>

            <PrimaryButton
              title="VIEW PLAN →"
              onPress={() => router.push('/(app)/plans')}
              style={styles.viewPlanBtn}
            />
          </GlassCard>

          {/* Fuel & Hydration Protocol Card */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>FUEL & HYDRATION</Text>
            <TouchableOpacity onPress={() => router.push('/nutrition')}>
              <Text style={styles.viewAllText}>MANAGE DIET →</Text>
            </TouchableOpacity>
          </View>

          <GlassCard level={2} style={styles.fuelCard}>
            {/* Calories Overview */}
            <View style={styles.fuelTopRow}>
              <View>
                <Text style={styles.fuelLabel}>CALORIC CONSUMPTION</Text>
                <Text style={styles.fuelValue}>
                  {nutritionPlan.consumedCalories || 1840} / {nutritionPlan.calories} kcal
                </Text>
              </View>
              <View style={styles.calorieBadge}>
                <Text style={styles.calorieBadgeText}>
                  {Math.round(((nutritionPlan.consumedCalories || 1840) / nutritionPlan.calories) * 100)}%
                </Text>
              </View>
            </View>

            {/* Macros Breakdown */}
            <View style={styles.macrosList}>
              <View style={styles.macroRow}>
                <Text style={styles.macroTitle}>Protein</Text>
                <Text style={styles.macroNumbers}>
                  {nutritionPlan.consumedProtein || 120} / {nutritionPlan.proteinGrams}g
                </Text>
              </View>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${Math.min(100, ((nutritionPlan.consumedProtein || 120) / nutritionPlan.proteinGrams) * 100)}%`,
                      backgroundColor: colors.primaryAction,
                    },
                  ]}
                />
              </View>

              <View style={styles.macroRow}>
                <Text style={styles.macroTitle}>Carbohydrates</Text>
                <Text style={styles.macroNumbers}>
                  {nutritionPlan.consumedCarbs || 160} / {nutritionPlan.carbsGrams}g
                </Text>
              </View>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${Math.min(100, ((nutritionPlan.consumedCarbs || 160) / nutritionPlan.carbsGrams) * 100)}%`,
                      backgroundColor: colors.aiAccent,
                    },
                  ]}
                />
              </View>

              <View style={styles.macroRow}>
                <Text style={styles.macroTitle}>Healthy Fats</Text>
                <Text style={styles.macroNumbers}>
                  {nutritionPlan.consumedFats || 45} / {nutritionPlan.fatsGrams}g
                </Text>
              </View>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${Math.min(100, ((nutritionPlan.consumedFats || 45) / nutritionPlan.fatsGrams) * 100)}%`,
                      backgroundColor: colors.warning,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Hydration with dynamic interactive buttons */}
            <View style={styles.hydrationContainer}>
              <View style={styles.hydrationHeader}>
                <View style={styles.hydrationLabelRow}>
                  <Ionicons name="water" size={16} color={colors.aiAccent} />
                  <Text style={styles.hydrationTitle}>Hydration</Text>
                </View>
                <Text style={styles.hydrationValue}>
                  {nutritionPlan.hydrationLiters} / {nutritionPlan.hydrationTargetLiters} L
                </Text>
              </View>

              <View style={styles.hydrationTrack}>
                <View
                  style={[
                    styles.hydrationFill,
                    {
                      width: `${Math.min(100, (nutritionPlan.hydrationLiters / nutritionPlan.hydrationTargetLiters) * 100)}%`,
                    },
                  ]}
                />
              </View>

              <View style={styles.hydrationButtons}>
                <GlassButton
                  title="+0.25 L"
                  onPress={() => handleAddHydration(0.25)}
                  variant="ai"
                  size="small"
                />
                <GlassButton
                  title="+0.50 L"
                  onPress={() => handleAddHydration(0.5)}
                  variant="ai"
                  size="small"
                />
              </View>
            </View>
          </GlassCard>

          {/* Bottom space for custom BottomNav */}
          <View style={{ height: 80 }} />
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.horizontal,
    paddingTop: 12,
    paddingBottom: 16,
  },
  greetingTitle: {
    ...typography.hero,
    fontSize: 26,
    color: colors.textPrimary,
    lineHeight: 30,
  },
  userName: {
    color: colors.primaryAction,
  },
  greetingSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceL2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.horizontal,
    paddingBottom: 40,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 20,
  },
  streakLeft: {
    flex: 1,
    paddingRight: 16,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  streakDays: {
    ...typography.tech,
    color: colors.primaryAction,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.0,
  },
  streakTitle: {
    ...typography.h3,
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  streakSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    width: '48%',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(107, 211, 253, 0.1)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
  },
  aiTagText: {
    ...typography.techSmall,
    color: colors.aiAccent,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  viewAllText: {
    ...typography.techSmall,
    color: colors.primaryAction,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  focusCard: {
    padding: 20,
    marginBottom: 24,
  },
  focusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  focusPhase: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1.1,
    marginBottom: 2,
  },
  focusTitle: {
    ...typography.h2,
    fontSize: 22,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  difficultyBadge: {
    backgroundColor: 'rgba(255, 84, 74, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 84, 74, 0.3)',
  },
  difficultyText: {
    ...typography.techSmall,
    color: colors.primaryAction,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.0,
  },
  focusMetaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  focusMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  focusMetaText: {
    ...typography.techSmall,
    color: colors.textSecondary,
    fontSize: 12,
  },
  viewPlanBtn: {
    width: '100%',
  },
  fuelCard: {
    padding: 18,
    marginBottom: 16,
  },
  fuelTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  fuelLabel: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1.0,
  },
  fuelValue: {
    ...typography.techLarge,
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  calorieBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
  },
  calorieBadgeText: {
    ...typography.techSmall,
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  macrosList: {
    gap: 10,
    marginBottom: 18,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  macroTitle: {
    ...typography.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  macroNumbers: {
    ...typography.techSmall,
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
  hydrationContainer: {
    backgroundColor: 'rgba(32, 15, 13, 0.5)',
    borderRadius: radii.md,
    padding: 14,
  },
  hydrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hydrationLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hydrationTitle: {
    ...typography.techSmall,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  hydrationValue: {
    ...typography.techSmall,
    color: colors.aiAccent,
    fontSize: 12,
    fontWeight: '800',
  },
  hydrationTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginBottom: 12,
  },
  hydrationFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.aiAccent,
  },
  hydrationButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
});
