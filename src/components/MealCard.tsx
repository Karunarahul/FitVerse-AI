import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';
import { Meal } from '../types';
import { colors, typography, radii } from '../theme';

export interface MealCardProps {
  meal: Meal;
  onSwap: () => void;
  isSwapping?: boolean;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  onSwap,
  isSwapping = false,
  onPress,
  style,
}) => {
  return (
    <GlassCard level={2} bordered style={[styles.card, style]} onPress={onPress}>
      <View style={styles.topRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{meal.type.toUpperCase()}</Text>
        </View>

        <View style={styles.calorieBadge}>
          <Text style={styles.calorieText}>{meal.calories} KCAL</Text>
        </View>
      </View>

      <Text style={styles.title}>{meal.name}</Text>
      <Text style={styles.description}>{meal.description}</Text>

      {/* Macros Row & Swap Button */}
      <View style={styles.bottomRow}>
        <View style={styles.macroPills}>
          <View style={[styles.pill, styles.pillProtein]}>
            <Text style={styles.pillLabel}>P</Text>
            <Text style={styles.pillValue}>{meal.protein}g</Text>
          </View>

          <View style={[styles.pill, styles.pillCarbs]}>
            <Text style={styles.pillLabel}>C</Text>
            <Text style={styles.pillValue}>{meal.carbs}g</Text>
          </View>

          <View style={[styles.pill, styles.pillFats]}>
            <Text style={styles.pillLabel}>F</Text>
            <Text style={styles.pillValue}>{meal.fats}g</Text>
          </View>
        </View>

        <GlassButton
          title={isSwapping ? 'SYNTHESIZING...' : 'SWAP'}
          onPress={onSwap}
          loading={isSwapping}
          variant="ai"
          size="small"
        />
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: radii.card,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 84, 74, 0.12)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 84, 74, 0.25)',
  },
  categoryText: {
    ...typography.techSmall,
    color: colors.primaryAction,
    fontSize: 10,
    fontWeight: '700',
  },
  calorieBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
  },
  calorieText: {
    ...typography.techSmall,
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    ...typography.h3,
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroPills: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(32, 15, 13, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  pillProtein: {
    borderColor: 'rgba(255, 84, 74, 0.4)',
  },
  pillCarbs: {
    borderColor: 'rgba(107, 211, 253, 0.4)',
  },
  pillFats: {
    borderColor: 'rgba(255, 165, 2, 0.4)',
  },
  pillLabel: {
    ...typography.techSmall,
    fontSize: 10,
    color: colors.textMuted,
    marginRight: 4,
    fontWeight: '700',
  },
  pillValue: {
    ...typography.techSmall,
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
