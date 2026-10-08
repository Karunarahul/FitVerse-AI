import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { NeuralBackground } from '../../components/NeuralBackground';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { GlassButton } from '../../components/GlassButton';
import { colors, typography, radii, spacing } from '../../theme';
import { useWorkoutStore } from '../../stores/workoutStore';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { formatTime } from '../../utils/formatters';

export default function LiveWorkoutScreen() {
  const router = useRouter();
  const {
    currentPlan,
    activeSession,
    tickTimer,
    togglePause,
    completeSet,
    skipExercise,
    finishWorkout,
    startLiveWorkout,
  } = useWorkoutStore();

  const recordWorkoutCompleted = useAnalyticsStore((s) => s.recordWorkoutCompleted);

  // Initialize session if not active
  useEffect(() => {
    if (!activeSession) {
      startLiveWorkout(currentPlan.id);
    }
  }, [activeSession, currentPlan.id, startLiveWorkout]);

  // Live Timer Interval: runs every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [tickTimer]);

  const session = activeSession || {
    exerciseIndex: 0,
    currentSet: 1,
    elapsedSeconds: 0,
    isPaused: false,
    heartRate: 142,
    caloriesBurned: 24,
    completedExercises: [],
  };

  const currentExercise = currentPlan.exercises[session.exerciseIndex] || currentPlan.exercises[0];
  const nextExercise = currentPlan.exercises[session.exerciseIndex + 1];

  const handleTogglePause = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    togglePause();
  };

  const handleCompleteSet = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
    }
    const result = completeSet();
    if (result.workoutFinished) {
      handleFinishWorkout();
    }
  };

  const handleFinishWorkout = () => {
    const summary = finishWorkout();
    recordWorkoutCompleted(summary.caloriesBurned);

    Alert.alert(
      'Workout Completed! 🔥',
      `Session Logged: ${formatTime(summary.elapsedSeconds)} duration with ${summary.caloriesBurned} kcal burned. Biometric telemetry and streak updated!`,
      [
        {
          text: 'VIEW TELEMETRY',
          onPress: () => router.replace('/(app)/home'),
        },
      ]
    );
  };

  return (
    <NeuralBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Telemetry Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-down" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.statusPill}>
            <View style={[styles.statusDot, session.isPaused && styles.statusDotPaused]} />
            <Text style={styles.statusPillText}>
              {session.isPaused ? 'SESSION PAUSED' : 'LIVE PROTOCOL ACTIVE'}
            </Text>
          </View>

          <TouchableOpacity onPress={handleFinishWorkout} style={styles.finishTopBtn}>
            <Text style={styles.finishTopText}>FINISH</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Timer Display Card */}
          <GlassCard level={3} glow={session.isPaused ? 'none' : 'crimson'} style={styles.timerCard}>
            <Text style={styles.timerLabel}>ELAPSED DURATION</Text>
            <Text style={styles.timerDisplay}>{formatTime(session.elapsedSeconds)}</Text>

            {/* Live Metrics Row */}
            <View style={styles.telemetryRow}>
              <View style={styles.telemetryItem}>
                <Ionicons name="heart" size={16} color={colors.primaryAction} />
                <Text style={styles.telemetryVal}>{session.heartRate} BPM</Text>
              </View>

              <View style={styles.telemetryDivider} />

              <View style={styles.telemetryItem}>
                <Ionicons name="flame" size={16} color={colors.primaryAction} />
                <Text style={styles.telemetryVal}>{session.caloriesBurned} KCAL</Text>
              </View>

              <View style={styles.telemetryDivider} />

              <View style={styles.telemetryItem}>
                <Ionicons name="barbell" size={16} color={colors.aiAccent} />
                <Text style={[styles.telemetryVal, { color: colors.aiAccent }]}>
                  TARGET: {currentExercise.reps}
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Current Exercise Detail Card */}
          <GlassCard level={2} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View style={styles.setBadge}>
                <Text style={styles.setBadgeText}>
                  SET {session.currentSet} OF {currentExercise.sets}
                </Text>
              </View>
              <Text style={styles.muscleTag}>{currentExercise.primaryMuscle.toUpperCase()}</Text>
            </View>

            <Text style={styles.exerciseTitle}>{currentExercise.name}</Text>

            {/* Target Weight / Reps Card */}
            <View style={styles.targetGrid}>
              <View style={styles.targetBox}>
                <Text style={styles.targetBoxLabel}>TARGET LOAD</Text>
                <Text style={styles.targetBoxValue}>
                  {currentExercise.targetWeight ? `${currentExercise.targetWeight} lb` : 'Bodyweight'}
                </Text>
              </View>

              <View style={styles.targetBox}>
                <Text style={styles.targetBoxLabel}>TARGET REPS</Text>
                <Text style={styles.targetBoxValue}>{currentExercise.reps}</Text>
              </View>

              <View style={styles.targetBox}>
                <Text style={styles.targetBoxLabel}>REST INTERVAL</Text>
                <Text style={styles.targetBoxValue}>{currentExercise.restSeconds}s</Text>
              </View>
            </View>

            {/* Form & Biomechanics Cues */}
            {currentExercise.instructions && currentExercise.instructions.length > 0 && (
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionHeader}>BIOMECHANICAL CUES</Text>
                {currentExercise.instructions.map((ins, i) => (
                  <View key={i} style={styles.cueRow}>
                    <Text style={styles.cueBullet}>▸</Text>
                    <Text style={styles.cueText}>{ins}</Text>
                  </View>
                ))}
              </View>
            )}
          </GlassCard>

          {/* Next Exercise Up */}
          {nextExercise && (
            <GlassCard level={1} style={styles.nextCard}>
              <View style={styles.nextRow}>
                <View>
                  <Text style={styles.nextLabel}>UP NEXT</Text>
                  <Text style={styles.nextTitle}>{nextExercise.name}</Text>
                </View>
                <Text style={styles.nextSets}>
                  {nextExercise.sets} Sets × {nextExercise.reps}
                </Text>
              </View>
            </GlassCard>
          )}

          <View style={{ height: 130 }} />
        </ScrollView>

        {/* Live Workout Interactive Control Deck */}
        <View style={styles.controlDeck}>
          <View style={styles.deckTopRow}>
            <GlassButton
              title={session.isPaused ? 'RESUME' : 'PAUSE'}
              onPress={handleTogglePause}
              variant="neutral"
              size="medium"
              icon={
                <Ionicons
                  name={session.isPaused ? 'play' : 'pause'}
                  size={16}
                  color={colors.textPrimary}
                />
              }
              style={styles.deckBtn}
            />

            <GlassButton
              title="SKIP"
              onPress={skipExercise}
              variant="neutral"
              size="medium"
              icon={<Ionicons name="play-skip-forward" size={16} color={colors.textPrimary} />}
              style={styles.deckBtn}
            />
          </View>

          <PrimaryButton
            title={`COMPLETE SET ${session.currentSet}/${currentExercise.sets} ✓`}
            onPress={handleCompleteSet}
            style={styles.completeSetBtn}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.horizontal,
    paddingTop: 8,
    paddingBottom: 14,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 84, 74, 0.12)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
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
  statusDotPaused: {
    backgroundColor: colors.warning,
  },
  statusPillText: {
    ...typography.techSmall,
    color: colors.primaryAction,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.0,
  },
  finishTopBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  finishTopText: {
    ...typography.techSmall,
    color: colors.textPrimary,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  scrollContent: {
    paddingHorizontal: spacing.horizontal,
  },
  timerCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 20,
  },
  timerLabel: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  timerDisplay: {
    ...typography.techLarge,
    fontSize: 48,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 2,
    marginBottom: 16,
  },
  telemetryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(32, 15, 13, 0.6)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radii.input,
  },
  telemetryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  telemetryVal: {
    ...typography.techSmall,
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  telemetryDivider: {
    width: 1,
    height: 18,
    backgroundColor: colors.borderSubtle,
  },
  exerciseCard: {
    padding: 20,
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  setBadge: {
    backgroundColor: 'rgba(255, 84, 74, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 84, 74, 0.3)',
  },
  setBadgeText: {
    ...typography.techSmall,
    color: colors.primaryAction,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  muscleTag: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1.0,
  },
  exerciseTitle: {
    ...typography.hero,
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  targetGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  targetBox: {
    flex: 1,
    backgroundColor: 'rgba(32, 15, 13, 0.5)',
    borderRadius: radii.md,
    padding: 12,
    alignItems: 'center',
  },
  targetBoxLabel: {
    ...typography.techSmall,
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 4,
    textAlign: 'center',
  },
  targetBoxValue: {
    ...typography.tech,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  instructionsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 14,
    gap: 6,
  },
  instructionHeader: {
    ...typography.techSmall,
    fontSize: 10,
    color: colors.aiAccent,
    letterSpacing: 1.0,
    marginBottom: 4,
  },
  cueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  cueBullet: {
    color: colors.primaryAction,
    fontSize: 11,
  },
  cueText: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  nextCard: {
    padding: 16,
    marginBottom: 16,
  },
  nextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextLabel: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1.0,
    marginBottom: 2,
  },
  nextTitle: {
    ...typography.h3,
    fontSize: 15,
    color: colors.textPrimary,
  },
  nextSets: {
    ...typography.techSmall,
    color: colors.aiAccent,
    fontSize: 11,
    fontWeight: '700',
  },
  controlDeck: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(22, 8, 7, 0.94)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(174, 135, 131, 0.2)',
    paddingHorizontal: spacing.horizontal,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 10,
  },
  deckTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  deckBtn: {
    flex: 1,
  },
  completeSetBtn: {
    width: '100%',
  },
});
