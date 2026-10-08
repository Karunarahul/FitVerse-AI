import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { NeuralBackground } from '../../components/NeuralBackground';
import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { MealCard } from '../../components/MealCard';
import { GlassButton } from '../../components/GlassButton';
import { colors, typography, radii, spacing } from '../../theme';
import { useNutritionStore } from '../../stores/nutritionStore';
import { useUserStore } from '../../stores/userStore';

export default function NutritionScreen() {
  const { currentPlan, swapMeal, swappingMealId, addHydration } = useNutritionStore();
  const profile = useUserStore((s) => s.profile);

  const handleSwap = (mealId: string) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}
    }
    swapMeal(
      mealId,
      profile.nutritionStyle || 'Omnivore',
      profile.restrictions || ['Gluten Free'],
      profile.primaryGoal || 'Build'
    );
  };

  const handleAddHydration = (amount: number) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    addHydration(amount);
  };

  return (
    <NeuralBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          title="Today's Protocol"
          subtitle={`Optimum fuel for ${profile.primaryGoal || 'hypertrophy'} phase.`}
          showBack
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Daily Macros Overview Card */}
          <GlassCard level={3} glow="ai" style={styles.macrosCard}>
            <View style={styles.macrosTop}>
              <View>
                <Text style={styles.macrosTag}>CALORIC CEILING</Text>
                <Text style={styles.caloriesText}>{currentPlan.calories} KCAL</Text>
              </View>

              <View style={styles.planBadge}>
                <Ionicons name="sparkles" size={12} color={colors.aiAccent} />
                <Text style={styles.planBadgeText}>AI MACRO SYNC</Text>
              </View>
            </View>

            <View style={styles.macroPillRow}>
              <View style={[styles.macroStat, styles.macroStatProtein]}>
                <Text style={styles.macroStatVal}>{currentPlan.proteinGrams}g</Text>
                <Text style={styles.macroStatLabel}>PROTEIN</Text>
              </View>

              <View style={[styles.macroStat, styles.macroStatCarbs]}>
                <Text style={styles.macroStatVal}>{currentPlan.carbsGrams}g</Text>
                <Text style={styles.macroStatLabel}>CARBS</Text>
              </View>

              <View style={[styles.macroStat, styles.macroStatFats]}>
                <Text style={styles.macroStatVal}>{currentPlan.fatsGrams}g</Text>
                <Text style={styles.macroStatLabel}>FATS</Text>
              </View>
            </View>
          </GlassCard>

          {/* Hydration Bar */}
          <GlassCard level={2} style={styles.hydrationCard}>
            <View style={styles.hydrationRow}>
              <View style={styles.hydrationLeft}>
                <Ionicons name="water" size={18} color={colors.aiAccent} />
                <View>
                  <Text style={styles.hydrationTitle}>Fluid Intake Telemetry</Text>
                  <Text style={styles.hydrationSubtitle}>
                    {currentPlan.hydrationLiters} / {currentPlan.hydrationTargetLiters} Liters
                  </Text>
                </View>
              </View>

              <View style={styles.hydrationActions}>
                <GlassButton
                  title="+0.25 L"
                  onPress={() => handleAddHydration(0.25)}
                  variant="ai"
                  size="small"
                />
                <GlassButton
                  title="+0.5 L"
                  onPress={() => handleAddHydration(0.5)}
                  variant="ai"
                  size="small"
                />
              </View>
            </View>
          </GlassCard>

          {/* Meals List */}
          <View style={styles.mealsSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>SCHEDULED MEALS ({currentPlan.meals.length})</Text>
              <Text style={styles.subtext}>1-TAP AI SWAP ENABLED</Text>
            </View>

            {currentPlan.meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                isSwapping={swappingMealId === meal.id}
                onSwap={() => handleSwap(meal.id)}
              />
            ))}
          </View>

          <View style={{ height: 40 }} />
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
    paddingBottom: 24,
  },
  macrosCard: {
    padding: 18,
    marginBottom: 16,
  },
  macrosTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  macrosTag: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1.0,
    marginBottom: 2,
  },
  caloriesText: {
    ...typography.techLarge,
    fontSize: 32,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(107, 211, 253, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(107, 211, 253, 0.3)',
  },
  planBadgeText: {
    ...typography.techSmall,
    color: colors.aiAccent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  macroPillRow: {
    flexDirection: 'row',
    gap: 10,
  },
  macroStat: {
    flex: 1,
    backgroundColor: 'rgba(32, 15, 13, 0.5)',
    borderRadius: radii.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  macroStatProtein: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primaryAction,
  },
  macroStatCarbs: {
    borderLeftWidth: 3,
    borderLeftColor: colors.aiAccent,
  },
  macroStatFats: {
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  macroStatVal: {
    ...typography.tech,
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  macroStatLabel: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  hydrationCard: {
    padding: 14,
    marginBottom: 20,
  },
  hydrationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hydrationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hydrationTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontSize: 13,
  },
  hydrationSubtitle: {
    ...typography.techSmall,
    color: colors.aiAccent,
    fontSize: 11,
    fontWeight: '700',
  },
  hydrationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  mealsSection: {
    marginTop: 4,
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
    letterSpacing: 1.0,
  },
  subtext: {
    ...typography.techSmall,
    color: colors.aiAccent,
    fontSize: 10,
    fontWeight: '700',
  },
});
