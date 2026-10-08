import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NeuralBackground } from '../../components/NeuralBackground';
import { ScreenHeader } from '../../components/ScreenHeader';
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors, typography, radii, spacing } from '../../theme';
import { useOnboardingStore } from '../../stores/onboardingStore';

const GENDER_OPTIONS = ['Male', 'Female', 'Other / Prefer not to say'];

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { data, setPersonalInfo } = useOnboardingStore();

  const [name, setName] = useState(data.name || 'Alex');
  const [age, setAge] = useState(String(data.age || 25));
  const [gender, setGender] = useState(data.gender || 'Male');

  const handleNext = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your athlete alias or name.');
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 14 || ageNum > 100) {
      Alert.alert('Invalid Age', 'Please provide a realistic age between 14 and 100.');
      return;
    }

    setPersonalInfo({
      name: name.trim(),
      age: ageNum,
      gender,
    });

    router.push('/onboarding/body-metrics');
  };

  return (
    <NeuralBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScreenHeader
            stepIndicator="1/4"
            title="Identity Core"
            subtitle="Let's establish your baseline to calibrate the AI model."
            showBack
          />

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.form}>
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ATHLETE IDENTIFIER</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter athlete alias"
                    placeholderTextColor={colors.textMuted}
                    style={styles.input}
                  />
                </View>
              </View>

              {/* Age Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CHRONOLOGICAL AGE</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="calendar-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    value={age}
                    onChangeText={setAge}
                    placeholder="25"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={3}
                    style={styles.input}
                  />
                  <Text style={styles.unitSuffix}>YRS</Text>
                </View>
              </View>

              {/* Gender Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>BIOLOGICAL PROFILE / GENDER</Text>
                <View style={styles.genderOptions}>
                  {GENDER_OPTIONS.map((opt) => {
                    const isSelected = gender === opt;
                    return (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => setGender(opt)}
                        activeOpacity={0.8}
                        style={[
                          styles.genderCard,
                          isSelected && styles.genderCardActive,
                        ]}
                      >
                        <View style={[styles.radioDot, isSelected && styles.radioDotActive]} />
                        <Text style={[styles.genderText, isSelected && styles.genderTextActive]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            <View style={styles.bottomArea}>
              <PrimaryButton
                title="INITIALIZE DATA →"
                onPress={handleNext}
                style={styles.nextBtn}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.horizontal,
    paddingBottom: 28,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  form: {
    gap: 20,
    marginTop: 10,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 1.0,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceL2,
    borderRadius: radii.input,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
  },
  unitSuffix: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontWeight: '700',
  },
  genderOptions: {
    gap: 10,
  },
  genderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceL2,
    borderRadius: radii.input,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  genderCardActive: {
    borderColor: colors.borderActive,
    backgroundColor: 'rgba(255, 84, 74, 0.08)',
  },
  radioDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.borderSubtle,
    marginRight: 12,
  },
  radioDotActive: {
    borderColor: colors.primaryAction,
    backgroundColor: colors.primaryAction,
  },
  genderText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  genderTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  bottomArea: {
    marginTop: 32,
  },
  nextBtn: {
    width: '100%',
  },
});
