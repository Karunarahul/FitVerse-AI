import React, { useState } from 'react';
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
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors, typography, radii, spacing } from '../../theme';
import { useOnboardingStore } from '../../stores/onboardingStore';

const GOALS = [
  { key: 'Burn', title: 'Burn', subtitle: 'Weight Loss & Caloric Expenditure', icon: 'flame-outline' as const },
  { key: 'Build', title: 'Build', subtitle: 'Hypertrophy & Muscle Gain', icon: 'barbell-outline' as const },
  { key: 'Endure', title: 'Endure', subtitle: 'Cardiovascular Stamina & VO2 Max', icon: 'pulse-outline' as const },
  { key: 'Maintain', title: 'Maintain', subtitle: 'Equilibrium & Functional Health', icon: 'shield-checkmark-outline' as const },
];

const ENVIRONMENTS = [
  { key: 'Commercial Facility', label: 'Commercial Facility', icon: 'business-outline' as const },
  { key: 'Home Gym', label: 'Home Gym', icon: 'home-outline' as const },
  { key: 'Outdoor', label: 'Outdoor / Trail', icon: 'trail-sign-outline' as const },
];

const EQUIPMENT_OPTIONS = ['Barbell', 'Dumbbells', 'Bodyweight', 'Bands', 'Cables', 'Kettlebell'];

const DURATIONS = [15, 45, 60, 120];

export default function WorkoutGoalsScreen() {
  const router = useRouter();
  const { data, setWorkoutGoals } = useOnboardingStore();

  const [primaryGoal, setPrimaryGoal] = useState(data.primaryGoal || 'Build');
  const [environment, setEnvironment] = useState(data.environment || 'Commercial Facility');
  const [equipment, setEquipment] = useState<string[]>(data.equipment || ['Barbell', 'Dumbbells']);
  const [workoutDuration, setWorkoutDuration] = useState(data.workoutDuration || 45);

  const toggleEquipment = (item: string) => {
    if (equipment.includes(item)) {
      if (equipment.length > 1) {
        setEquipment(equipment.filter((e) => e !== item));
      }
    } else {
      setEquipment([...equipment, item]);
    }
  };

  const handleNext = () => {
    setWorkoutGoals({
      primaryGoal,
      environment,
      equipment,
      workoutDuration,
    });
    router.push('/onboarding/nutrition');
  };

  return (
    <NeuralBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          stepIndicator="3/4"
          title="Customize Your Engine"
          subtitle="Configure target adaptations, training grounds and available equipment."
          showBack
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Primary Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PRIMARY OBJECTIVE</Text>
            <View style={styles.goalsGrid}>
              {GOALS.map((g) => {
                const isSelected = primaryGoal === g.key;
                return (
                  <TouchableOpacity
                    key={g.key}
                    onPress={() => setPrimaryGoal(g.key)}
                    activeOpacity={0.8}
                    style={[styles.goalCard, isSelected && styles.goalCardActive]}
                  >
                    <View style={[styles.goalIconCircle, isSelected && styles.goalIconActive]}>
                      <Ionicons
                        name={g.icon}
                        size={22}
                        color={isSelected ? colors.primaryAction : colors.textMuted}
                      />
                    </View>
                    <View style={styles.goalInfo}>
                      <Text style={[styles.goalTitle, isSelected && styles.goalTitleActive]}>
                        {g.title}
                      </Text>
                      <Text style={styles.goalSubtitle}>{g.subtitle}</Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={18} color={colors.primaryAction} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Environment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TRAINING ENVIRONMENT</Text>
            <View style={styles.envGrid}>
              {ENVIRONMENTS.map((env) => {
                const isSelected = environment === env.key;
                return (
                  <TouchableOpacity
                    key={env.key}
                    onPress={() => setEnvironment(env.key)}
                    activeOpacity={0.8}
                    style={[styles.envCard, isSelected && styles.envCardActive]}
                  >
                    <Ionicons
                      name={env.icon}
                      size={18}
                      color={isSelected ? colors.primaryAction : colors.textMuted}
                    />
                    <Text style={[styles.envText, isSelected && styles.envTextActive]}>
                      {env.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Available Equipment Multi-Select */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AVAILABLE GEAR (MULTI-SELECT)</Text>
            <View style={styles.chipsRow}>
              {EQUIPMENT_OPTIONS.map((item) => {
                const isSelected = equipment.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => toggleEquipment(item)}
                    activeOpacity={0.8}
                    style={[styles.chip, isSelected && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Session Duration Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TARGET SESSION DURATION</Text>
            <View style={styles.durationRow}>
              {DURATIONS.map((mins) => {
                const isSelected = workoutDuration === mins;
                return (
                  <TouchableOpacity
                    key={mins}
                    onPress={() => setWorkoutDuration(mins)}
                    activeOpacity={0.8}
                    style={[styles.durationBtn, isSelected && styles.durationBtnActive]}
                  >
                    <Text style={[styles.durationVal, isSelected && styles.durationValActive]}>
                      {mins}
                    </Text>
                    <Text style={[styles.durationUnit, isSelected && styles.durationUnitActive]}>
                      MIN
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Action Button */}
          <View style={styles.bottomArea}>
            <PrimaryButton
              title="INITIALIZE PROTOCOL →"
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
    paddingBottom: 32,
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
  goalsGrid: {
    gap: 10,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceL2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.input,
    padding: 14,
  },
  goalCardActive: {
    borderColor: colors.borderActive,
    backgroundColor: 'rgba(255, 84, 74, 0.08)',
  },
  goalIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalIconActive: {
    backgroundColor: 'rgba(255, 84, 74, 0.15)',
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
  },
  goalTitleActive: {
    color: colors.primaryAction,
  },
  goalSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  envGrid: {
    gap: 8,
  },
  envCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceL2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.input,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  envCardActive: {
    borderColor: colors.borderActive,
    backgroundColor: 'rgba(255, 84, 74, 0.08)',
  },
  envText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  envTextActive: {
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
  durationRow: {
    flexDirection: 'row',
    gap: 10,
  },
  durationBtn: {
    flex: 1,
    backgroundColor: colors.surfaceL2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.input,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBtnActive: {
    borderColor: colors.borderActive,
    backgroundColor: 'rgba(255, 84, 74, 0.12)',
  },
  durationVal: {
    ...typography.techLarge,
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  durationValActive: {
    color: colors.primaryAction,
  },
  durationUnit: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 10,
  },
  durationUnitActive: {
    color: colors.primaryAction,
    fontWeight: '700',
  },
  bottomArea: {
    marginTop: 10,
  },
  nextBtn: {
    width: '100%',
  },
});
