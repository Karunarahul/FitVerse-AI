import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NeuralBackground } from '../../components/NeuralBackground';
import { GlassCard } from '../../components/GlassCard';
import { ExerciseCard } from '../../components/ExerciseCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors, typography, radii, spacing } from '../../theme';
import { useWorkoutStore } from '../../stores/workoutStore';

export default function PlansScreen() {
  const router = useRouter();
  const { currentPlan, startLiveWorkout } = useWorkoutStore();

  const handleStartWorkout = () => {
    startLiveWorkout(currentPlan.id);
    router.push('/workout/live');
  };

  return (
    <NeuralBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.phaseBadge}>
              <Text style={styles.phaseText}>{currentPlan.phase.toUpperCase()}</Text>
            </View>
            <Text style={styles.title}>{currentPlan.name}</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Plan Telemetry Overview Card */}
          <GlassCard level={3} style={styles.metaCard}>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={18} color={colors.primaryAction} />
                <Text style={styles.metaValue}>{currentPlan.durationMinutes} Min</Text>
                <Text style={styles.metaLabel}>DURATION</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.metaItem}>
                <Ionicons name="flame-outline" size={18} color={colors.primaryAction} />
                <Text style={styles.metaValue}>{currentPlan.calories} kcal</Text>
                <Text style={styles.metaLabel}>BURN</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.metaItem}>
                <Ionicons name="shield-outline" size={18} color={colors.aiAccent} />
                <Text style={[styles.metaValue, { color: colors.aiAccent }]}>
                  {currentPlan.difficulty}
                </Text>
                <Text style={styles.metaLabel}>INTENSITY</Text>
              </View>
            </View>

            {/* Target Muscles */}
            <View style={styles.targetSection}>
              <Text style={styles.targetLabel}>TARGET BIOMECHANICS</Text>
              <View style={styles.musclesRow}>
                {currentPlan.targetMuscles.map((muscle) => (
                  <View key={muscle} style={styles.muscleBadge}>
                    <Text style={styles.muscleText}>{muscle}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* AI Prediction Box */}
            <View style={styles.aiPredictionBox}>
              <Ionicons name="sparkles" size={16} color={colors.aiAccent} />
              <View style={styles.predictionContent}>
                <Text style={styles.predictionTag}>AI PERFORMANCE VECTOR</Text>
                <Text style={styles.predictionText}>{currentPlan.aiPrediction}</Text>
              </View>
            </View>
          </GlassCard>

          {/* Exercise List */}
          <View style={styles.exerciseSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>PROTOCOL EXERCISES</Text>
              <Text style={styles.exerciseCount}>{currentPlan.exercises.length} MOVEMENTS</Text>
            </View>

            {currentPlan.exercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index}
                onPress={handleStartWorkout}
              />
            ))}
          </View>

          {/* Bottom space for button & Nav */}
          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Floating Action Button */}
        <View style={styles.floatingActionArea}>
          <PrimaryButton
            title="START WORKOUT"
            icon={<Ionicons name="play" size={18} color="#FFF" />}
            onPress={handleStartWorkout}
            style={styles.startBtn}
          />
        </View>
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
    paddingHorizontal: spacing.horizontal,
    paddingTop: 12,
    paddingBottom: 16,
  },
  phaseBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 84, 74, 0.12)',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 84, 74, 0.3)',
    marginBottom: 6,
  },
  phaseText: {
    ...typography.techSmall,
    color: colors.primaryAction,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  title: {
    ...typography.hero,
    fontSize: 28,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: spacing.horizontal,
  },
  metaCard: {
    padding: 18,
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaValue: {
    ...typography.tech,
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  metaLabel: {
    ...typography.techSmall,
    fontSize: 9,
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: colors.borderSubtle,
  },
  targetSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 14,
    marginBottom: 14,
  },
  targetLabel: {
    ...typography.techSmall,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1.0,
    marginBottom: 8,
  },
  musclesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
  },
  muscleText: {
    ...typography.techSmall,
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  aiPredictionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(107, 211, 253, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(107, 211, 253, 0.25)',
    borderRadius: radii.md,
    padding: 12,
    gap: 12,
  },
  predictionContent: {
    flex: 1,
  },
  predictionTag: {
    ...typography.techSmall,
    color: colors.aiAccent,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.0,
  },
  predictionText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontSize: 13,
    marginTop: 2,
  },
  exerciseSection: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeader: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 1.0,
  },
  exerciseCount: {
    ...typography.techSmall,
    color: colors.primaryAction,
    fontSize: 11,
    fontWeight: '700',
  },
  floatingActionArea: {
    position: 'absolute',
    bottom: 74,
    left: spacing.horizontal,
    right: spacing.horizontal,
  },
  startBtn: {
    width: '100%',
  },
});
