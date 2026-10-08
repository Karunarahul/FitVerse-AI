import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NeuralBackground } from '../../components/NeuralBackground';
import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { ExerciseCard } from '../../components/ExerciseCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors, typography, radii, spacing } from '../../theme';
import { useWorkoutStore } from '../../stores/workoutStore';

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { currentPlan, startLiveWorkout } = useWorkoutStore();

  const handleStart = () => {
    startLiveWorkout((id as string) || currentPlan.id);
    router.push('/workout/live');
  };

  return (
    <NeuralBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          title={currentPlan.name}
          subtitle={`${currentPlan.phase} • ${currentPlan.durationMinutes} Min • ${currentPlan.calories} kcal`}
          showBack
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* AI Biomechanical Focus */}
          <GlassCard level={3} glow="ai" style={styles.summaryCard}>
            <View style={styles.headerRow}>
              <View style={styles.badge}>
                <Ionicons name="sparkles" size={12} color={colors.aiAccent} />
                <Text style={styles.badgeText}>NEURAL PLAN PREDICTION</Text>
              </View>
              <Text style={styles.difficultyText}>{currentPlan.difficulty.toUpperCase()}</Text>
            </View>

            <Text style={styles.predictionText}>{currentPlan.aiPrediction}</Text>

            <View style={styles.musclesRow}>
              {currentPlan.targetMuscles.map((m) => (
                <View key={m} style={styles.musclePill}>
                  <Text style={styles.musclePillText}>{m}</Text>
                </View>
              ))}
            </View>
          </GlassCard>

          {/* Exercises */}
          <View style={styles.exerciseSection}>
            <Text style={styles.sectionHeader}>SCHEDULED MOVEMENTS ({currentPlan.exercises.length})</Text>
            {currentPlan.exercises.map((ex, i) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                index={i}
                onPress={handleStart}
              />
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={styles.floatingActionArea}>
          <PrimaryButton
            title="START WORKOUT NOW"
            icon={<Ionicons name="play" size={18} color="#FFF" />}
            onPress={handleStart}
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
  scrollContent: {
    paddingHorizontal: spacing.horizontal,
    paddingBottom: 20,
  },
  summaryCard: {
    padding: 18,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(107, 211, 253, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
  },
  badgeText: {
    ...typography.techSmall,
    color: colors.aiAccent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.0,
  },
  difficultyText: {
    ...typography.techSmall,
    color: colors.primaryAction,
    fontSize: 11,
    fontWeight: '700',
  },
  predictionText: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 14,
  },
  musclesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  musclePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
  },
  musclePillText: {
    ...typography.techSmall,
    color: colors.textSecondary,
    fontSize: 11,
  },
  exerciseSection: {
    marginTop: 8,
  },
  sectionHeader: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 1.0,
    marginBottom: 12,
  },
  floatingActionArea: {
    position: 'absolute',
    bottom: 24,
    left: spacing.horizontal,
    right: spacing.horizontal,
  },
});
