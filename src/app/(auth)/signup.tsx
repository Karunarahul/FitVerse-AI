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
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors, typography, radii, spacing } from '../../theme';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useAuthStore } from '../../stores/authStore';

export default function SignupScreen() {
  const router = useRouter();
  const setPersonalInfo = useOnboardingStore((s) => s.setPersonalInfo);
  const register = useAuthStore((s) => s.register);

  const [name, setName] = useState('Alex Vance');
  const [email, setEmail] = useState('alex.vance@fitverse.ai');
  const [password, setPassword] = useState('password123');

  const handleCreate = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Required Fields', 'Please supply your identity name and email.');
      return;
    }
    setPersonalInfo({ name: name.trim(), age: 25, gender: 'Male' });
    await register(name, email);
    router.push('/onboarding/personal-info');
  };

  return (
    <NeuralBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.brandTitle}>FITVERSE AI</Text>
              <View style={{ width: 36 }} />
            </View>

            <View style={styles.heroArea}>
              <Text style={styles.title}>Create Engine</Text>
              <Text style={styles.subtitle}>
                Register your athlete profile to start continuous biological adaptation.
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>FULL NAME / ALIAS</Text>
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

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL ARCHITECTURE</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@domain.com"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>SECURITY KEY</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Create security key"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry
                    style={styles.input}
                  />
                </View>
              </View>

              <PrimaryButton
                title="COMMENCE CALIBRATION →"
                onPress={handleCreate}
                style={styles.submitBtn}
              />
            </View>

            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              style={styles.loginLink}
            >
              <Text style={styles.loginText}>
                Already have an engine? <Text style={styles.loginHighlight}>Sign In</Text>
              </Text>
            </TouchableOpacity>
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
    paddingTop: 8,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    ...typography.tech,
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryAction,
    letterSpacing: 1.5,
  },
  heroArea: {
    marginBottom: 28,
  },
  title: {
    ...typography.hero,
    fontSize: 28,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceL2,
    borderRadius: radii.input,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: 14,
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
  submitBtn: {
    marginTop: 10,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 28,
    paddingVertical: 8,
  },
  loginText: {
    ...typography.body,
    color: colors.textMuted,
    fontSize: 13,
  },
  loginHighlight: {
    color: colors.primaryAction,
    fontWeight: '700',
  },
});
