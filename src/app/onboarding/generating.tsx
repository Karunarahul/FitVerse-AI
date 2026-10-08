import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NeuralBackground } from '../../components/NeuralBackground';
import { AIOrb } from '../../components/AIOrb';
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors, typography, radii, spacing } from '../../theme';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useAIStore } from '../../stores/aiStore';

export default function GeneratingScreen() {
  const router = useRouter();
  const { data } = useOnboardingStore();
  const { generatePlan, generationStep, generationError } = useAIStore();
  const [isFinished, setIsFinished] = useState(false);

  const retryGeneration = async () => {
    setIsFinished(false);
    const success = await generatePlan(data);
    if (success) {
      setIsFinished(true);
      setTimeout(() => {
        router.replace('/(app)/home');
      }, 1400);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      const success = await generatePlan(data);
      if (success && isMounted) {
        setIsFinished(true);
        setTimeout(() => {
          router.replace('/(app)/home');
        }, 1400);
      }
    };
    run();
    return () => {
      isMounted = false;
    };
  }, [data, generatePlan, router]);

  return (
    <NeuralBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Pulsing AI Neural Core */}
          <View style={styles.orbWrapper}>
            <AIOrb size={130} glowColor={isFinished ? 'crimson' : 'ai'} />
          </View>

          {/* Heading */}
          <Text style={styles.brandTitle}>FITVERSE AI</Text>
          <Text style={styles.subtitle}>
            {isFinished
              ? 'Your neural fitness protocol is ready.'
              : 'Analyzing your fitness profile & biometrics'}
          </Text>

          {/* Step Sequence Checklist */}
          <View style={styles.stepsContainer}>
            {/* Step 1 */}
            <View style={styles.stepRow}>
              <View
                style={[
                  styles.stepIcon,
                  generationStep >= 1 && styles.stepIconActive,
                  generationStep > 1 && styles.stepIconDone,
                ]}
              >
                {generationStep > 1 ? (
                  <Ionicons name="checkmark" size={14} color="#FFF" />
                ) : (
                  <View style={styles.pulsingDot} />
                )}
              </View>
              <Text
                style={[
                  styles.stepText,
                  generationStep >= 1 && styles.stepTextHighlight,
                ]}
              >
                Biometric Data Digested
              </Text>
            </View>

            {/* Step 2 */}
            <View style={styles.stepRow}>
              <View
                style={[
                  styles.stepIcon,
                  generationStep >= 2 && styles.stepIconActive,
                  generationStep > 2 && styles.stepIconDone,
                ]}
              >
                {generationStep > 2 ? (
                  <Ionicons name="checkmark" size={14} color="#FFF" />
                ) : generationStep === 2 ? (
                  <View style={styles.pulsingDot} />
                ) : (
                  <View style={styles.idleDot} />
                )}
              </View>
              <Text
                style={[
                  styles.stepText,
                  generationStep >= 2 && styles.stepTextHighlight,
                ]}
              >
                Synthesizing Workout Vectors
              </Text>
            </View>

            {/* Step 3 */}
            <View style={styles.stepRow}>
              <View
                style={[
                  styles.stepIcon,
                  generationStep >= 3 && styles.stepIconActive,
                  generationStep >= 4 && styles.stepIconDone,
                ]}
              >
                {generationStep >= 4 ? (
                  <Ionicons name="checkmark" size={14} color="#FFF" />
                ) : generationStep === 3 ? (
                  <View style={styles.pulsingDot} />
                ) : (
                  <View style={styles.idleDot} />
                )}
              </View>
              <Text
                style={[
                  styles.stepText,
                  generationStep >= 3 && styles.stepTextHighlight,
                ]}
              >
                Optimizing Nutrition Macros
              </Text>
            </View>
          </View>

          {/* Error & Retry */}
          {generationError && (
            <View style={styles.errorArea}>
              <Text style={styles.errorText}>{generationError}</Text>
              <PrimaryButton
                title="RETRY GENERATION"
                onPress={retryGeneration}
                style={styles.retryBtn}
              />
            </View>
          )}

          {/* Ready Banner */}
          {isFinished && (
            <View style={styles.readyBadge}>
              <Ionicons name="checkmark-done-circle" size={20} color={colors.success} />
              <Text style={styles.readyText}>PROTOCOL DEPLOYED TO DASHBOARD</Text>
            </View>
          )}
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.horizontal,
  },
  orbWrapper: {
    marginBottom: 28,
  },
  brandTitle: {
    ...typography.tech,
    color: colors.primaryAction,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2.0,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '800',
    marginBottom: 36,
    maxWidth: 290,
    lineHeight: 28,
  },
  stepsContainer: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.surfaceL2,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 20,
    gap: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stepIconActive: {
    backgroundColor: 'rgba(107, 211, 253, 0.2)',
    borderWidth: 1,
    borderColor: colors.aiAccent,
  },
  stepIconDone: {
    backgroundColor: colors.success,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.aiAccent,
  },
  idleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textMuted,
  },
  stepText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  stepTextHighlight: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  errorArea: {
    marginTop: 24,
    alignItems: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    marginBottom: 12,
  },
  retryBtn: {
    minWidth: 200,
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 28,
    backgroundColor: 'rgba(46, 213, 115, 0.12)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(46, 213, 115, 0.3)',
  },
  readyText: {
    ...typography.techSmall,
    color: colors.success,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.0,
  },
});
