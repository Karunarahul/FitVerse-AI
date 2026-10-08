import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { Exercise } from '../types';
import { colors, typography, radii } from '../theme';

export interface ExerciseCardProps {
  exercise: Exercise;
  index?: number;
  isActive?: boolean;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  isActive = false,
  onPress,
  style,
}) => {
  const isCompleted = exercise.completedSets >= exercise.sets;

  return (
    <GlassCard
      level={isActive ? 3 : 2}
      glow={isActive ? 'crimson' : 'none'}
      bordered
      style={[styles.card, isActive && styles.activeCard, style]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <View style={styles.titleArea}>
          {typeof index === 'number' && (
            <Text style={styles.indexNum}>{String(index + 1).padStart(2, '0')}</Text>
          )}
          <View>
            <Text style={[styles.name, isCompleted && styles.completedText]}>
              {exercise.name}
            </Text>
            <Text style={styles.muscle}>{exercise.primaryMuscle.toUpperCase()}</Text>
          </View>
        </View>

        {isCompleted ? (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          </View>
        ) : (
          <View style={styles.activeBadge}>
            <Text style={styles.activeSets}>
              {exercise.completedSets}/{exercise.sets} SETS
            </Text>
          </View>
        )}
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>SETS</Text>
          <Text style={styles.metricValue}>{exercise.sets}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>REPS</Text>
          <Text style={styles.metricValue}>{exercise.reps}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>REST</Text>
          <Text style={styles.metricValue}>{exercise.restSeconds}s</Text>
        </View>

        {typeof exercise.targetWeight === 'number' && (
          <>
            <View style={styles.divider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>LOAD</Text>
              <Text style={[styles.metricValue, { color: colors.primaryAction }]}>
                {exercise.targetWeight} lb
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Set progress dots */}
      <View style={styles.dotsRow}>
        {Array.from({ length: exercise.sets }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.setDot,
              i < exercise.completedSets && styles.setDotCompleted,
              i === exercise.completedSets && isActive && styles.setDotCurrent,
            ]}
          />
        ))}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: radii.card,
    marginBottom: 12,
  },
  activeCard: {
    borderColor: colors.borderActive,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indexNum: {
    ...typography.tech,
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryAction,
    marginRight: 12,
  },
  name: {
    ...typography.h3,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  completedText: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  muscle: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  completedBadge: {
    padding: 4,
  },
  activeBadge: {
    backgroundColor: 'rgba(255, 84, 74, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 84, 74, 0.3)',
  },
  activeSets: {
    ...typography.techSmall,
    color: colors.primaryAction,
    fontSize: 11,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(32, 15, 13, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 10,
    marginBottom: 2,
  },
  metricValue: {
    ...typography.tech,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: colors.borderSubtle,
  },
  dotsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 6,
  },
  setDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  setDotCompleted: {
    backgroundColor: colors.primaryAction,
  },
  setDotCurrent: {
    backgroundColor: colors.aiAccent,
  },
});
