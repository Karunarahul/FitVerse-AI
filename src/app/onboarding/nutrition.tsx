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
import { Ionicons } from '@expo/vector-icons';
import { NeuralBackground } from '../../components/NeuralBackground';
import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors, typography, radii, spacing } from '../../theme';
import { useOnboardingStore } from '../../stores/onboardingStore';
import {
  calculateBMR,
  calculateTDEE,
  calculateMacroTargets,
} from '../../utils/calculations';

const DIET_STYLES = [
  'Omnivore',
  'Keto',
  'Paleo',
  'Vegan',
  'Vegetarian',
  'Pescatarian',
];

const RESTRICTIONS = [
  'Gluten Free',
  'Dairy Free',
  'Nut Free',
  'Shellfish Free',
  'Low Sodium',
  'No Added Sugar',
];

export default function NutritionScreen() {
  const router = useRouter();
  const { data, setNutrition } = useOnboardingStore();

  const [nutritionStyle, setNutritionStyle] = useState(data.nutritionStyle || 'Omnivore');
  const [restrictions, setRestrictions] = useState<string[]>(data.restrictions || ['Gluten Free']);

  // Dynamic Macro Synthesis Calculation
  const { calories, proteinGrams, carbsGrams, fatsGrams } = useMemo(() => {
    const bmr = calculateBMR(data.weightKg, data.heightCm, data.age, data.gender);
    const tdee = calculateTDEE(bmr, data.activityLevel);
    let target = tdee;

    if (data.primaryGoal === 'Build') target += 350;
    else if (data.primaryGoal === 'Burn') target = Math.max(1500, tdee - 450);
    else if (data.primaryGoal === 'Endure') target += 150;

    return calculateMacroTargets(target, data.primaryGoal);
  }, [data.weightKg, data.heightCm, data.age, data.gender, data.activityLevel, data.primaryGoal]);

  const toggleRestriction = (item: string) => {
    if (restrictions.includes(item)) {
      setRestrictions(restrictions.filter((r) => r !== item));
    } else {
      setRestrictions([...restrictions, item]);
    }
  };

  const handleNext = () => {
    setNutrition({
      nutritionStyle,
      restrictions,
    });
    router.push('/onboarding/generating');
  };

  return (
    <NeuralBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          stepIndicator="4/4"
          title="Fine-Tune Your Engine"
          subtitle="Precision nutrition protocols tailored to metabolic requirements."
          showBack
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Live AI Macro Synthesis Preview */}
          <GlassCard level={3} glow="ai" style={styles.synthesisCard}>
            <View style={styles.synthesisHeader}>
              <View style={styles.synthesisBadge}>
                <Ionicons name="sparkles" size={12} color={colors.aiAccent} />
                <Text style={styles.synthesisTag}>AI METABOLIC SYNTHESIS</Text>
              </View>
              <Text style={styles.caloriesNumber}>{calories} KCAL</Text>
            </View>

            <Text style={styles.synthesisSubtitle}>
              Caloric baseline for {data.primaryGoal || 'Hypertrophy'} phase ({nutritionStyle})
            </Text>

            {/* Macro Bars */}
            <View style={styles.macroRow}>
              <View style={styles.macroBox}>
                <Text style={styles.macroLabel}>PROTEIN</Text>
                <Text style={[styles.macroValue, { color: colors.primaryAction }]}>
                  {proteinGrams}g
                </Text>
                <View style={styles.macroTrack}>
                  <View style={[styles.macroFill, { backgroundColor: colors.primaryAction, width: '75%' }]} />
                </View>
              </View>

              <View style={styles.macroBox}>
                <Text style={styles.macroLabel}>CARBS</Text>
                <Text style={[styles.macroValue, { color: colors.aiAccent }]}>
                  {carbsGrams}g
                </Text>
                <View style={styles.macroTrack}>
                  <View style={[styles.macroFill, { backgroundColor: colors.aiAccent, width: '65%' }]} />
                </View>
              </View>

              <View style={styles.macroBox}>
                <Text style={styles.macroLabel}>FATS</Text>
                <Text style={[styles.macroValue, { color: colors.warning }]}>
                  {fatsGrams}g
                </Text>
                <View style={styles.macroTrack}>
                  <View style={[styles.macroFill, { backgroundColor: colors.warning, width: '50%' }]} />
                </View>
              </View>
            </View>
          </GlassCard>

          {/* Dietary Style */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NUTRITIONAL PHILOSOPHY</Text>
            <View style={styles.dietGrid}>
              {DIET_STYLES.map((style) => {
                const isSelected = nutritionStyle === style;
                return (
                  <TouchableOpacity
                    key={style}
                    onPress={() => setNutritionStyle(style)}
                    activeOpacity={0.8}
                    style={[styles.dietCard, isSelected && styles.dietCardActive]}
                  >
                    <Text style={[styles.dietText, isSelected && styles.dietTextActive]}>
                      {style}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={16} color={colors.primaryAction} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Restrictions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DIETARY RESTRICTIONS & ALLERGENS</Text>
            <View style={styles.chipsRow}>
              {RESTRICTIONS.map((res) => {
                const isSelected = restrictions.includes(res);
                return (
                  <TouchableOpacity
                    key={res}
                    onPress={() => toggleRestriction(res)}
                    activeOpacity={0.8}
                    style={[styles.chip, isSelected && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {res}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Generate Button */}
          <View style={styles.bottomArea}>
            <PrimaryButton
              title="GENERATE NEURAL PLAN"
              onPress={handleNext}
              style={styles.generateBtn}
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
    paddingBottom: 32,
  },
  synthesisCard: {
    marginBottom: 24,
    padding: 18,
  },
  synthesisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  synthesisBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  synthesisTag: {
    ...typography.techSmall,
    color: colors.aiAccent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  caloriesNumber: {
    ...typography.techLarge,
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  synthesisSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  macroRow: {
    flexDirection: 'row',
    gap: 12,
  },
  macroBox: {
    flex: 1,
    backgroundColor: 'rgba(32, 15, 13, 0.5)',
    padding: 10,
    borderRadius: radii.md,
  },
  macroLabel: {
    ...typography.techSmall,
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 2,
  },
  macroValue: {
    ...typography.tech,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  macroTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  macroFill: {
    height: '100%',
    borderRadius: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 1.0,
    marginBottom: 10,
  },
  dietGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dietCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceL2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.input,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  dietCardActive: {
    borderColor: colors.borderActive,
    backgroundColor: 'rgba(255, 84, 74, 0.08)',
  },
  dietText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    fontSize: 13,
  },
  dietTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.surfaceL2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
  },
  chipActive: {
    borderColor: colors.borderActive,
    backgroundColor: 'rgba(255, 84, 74, 0.15)',
  },
  chipText: {
    ...typography.techSmall,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.primaryAction,
    fontWeight: '700',
  },
  bottomArea: {
    marginTop: 8,
  },
  generateBtn: {
    width: '100%',
  },
});
