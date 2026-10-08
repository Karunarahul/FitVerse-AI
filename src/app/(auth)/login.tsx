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
import { Toggle } from '../../components/Toggle';
import { colors, typography, radii, spacing } from '../../theme';
import { useAuthStore } from '../../stores/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login, demoLogin, isLoading } = useAuthStore();

  const [email, setEmail] = useState('alex.vance@fitverse.ai');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace('/(app)/home');
    } catch {
      Alert.alert('Authentication Error', 'Unable to initialize session.');
    }
  };

  const handleDemoAccess = async () => {
    try {
      await demoLogin();
      router.replace('/(app)/home');
    } catch {
      Alert.alert('Demo Error', 'Unable to load demo credentials.');
    }
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
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.brandTitle}>FITVERSE AI</Text>
              <View style={styles.backPlaceholder} />
            </View>

            <View style={styles.heroArea}>
              <Text style={styles.title}>Initialize Session</Text>
              <Text style={styles.subtitle}>
                Access your personalized neural fitness protocols and recovery telemetry.
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
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
                    placeholder="Enter security key"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={!showPassword}
                    style={styles.input}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Options */}
              <View style={styles.optionsRow}>
                <View style={styles.rememberRow}>
                  <Toggle value={rememberMe} onValueChange={setRememberMe} />
                  <Text style={styles.rememberText}>Remember Me</Text>
                </View>

                <TouchableOpacity
                  onPress={() => Alert.alert('Reset Protocol', 'Password reset instructions have been dispatched to your email.')}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Primary Login */}
              <PrimaryButton
                title="INITIALIZE SESSION →"
                onPress={handleLogin}
                loading={isLoading}
                style={styles.submitBtn}
              />

              {/* Demo 1-Click Access for Live Presentation */}
              <TouchableOpacity
                onPress={handleDemoAccess}
                activeOpacity={0.8}
                style={styles.demoCard}
              >
                <View style={styles.demoBadge}>
                  <Ionicons name="flash" size={14} color={colors.aiAccent} />
                  <Text style={styles.demoBadgeText}>FAST DEMO PASS</Text>
                </View>
                <Text style={styles.demoText}>Continue as Alex Vance (Verified Athlete)</Text>
              </TouchableOpacity>
            </View>

            {/* Social Logins */}
            <View style={styles.socialSection}>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR CONNECT VIA</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                <TouchableOpacity
                  onPress={handleDemoAccess}
                  activeOpacity={0.8}
                  style={styles.socialBtn}
                >
                  <Ionicons name="logo-google" size={18} color={colors.textPrimary} />
                  <Text style={styles.socialBtnText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDemoAccess}
                  activeOpacity={0.8}
                  style={styles.socialBtn}
                >
                  <Ionicons name="logo-apple" size={18} color={colors.textPrimary} />
                  <Text style={styles.socialBtnText}>Apple</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => router.push('/onboarding/personal-info')}
                style={styles.createAccountBtn}
              >
                <Text style={styles.createAccountText}>
                  Need a new engine? <Text style={styles.createAccountHighlight}>Create Account</Text>
                </Text>
              </TouchableOpacity>
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
  backPlaceholder: {
    width: 36,
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
  eyeIcon: {
    padding: 6,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rememberText: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  forgotText: {
    ...typography.techSmall,
    color: colors.primaryAction,
    fontSize: 12,
  },
  submitBtn: {
    marginTop: 4,
  },
  demoCard: {
    backgroundColor: 'rgba(107, 211, 253, 0.08)',
    borderRadius: radii.input,
    borderWidth: 1,
    borderColor: 'rgba(107, 211, 253, 0.3)',
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  demoBadgeText: {
    ...typography.techSmall,
    color: colors.aiAccent,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1.2,
  },
  demoText: {
    ...typography.body,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  socialSection: {
    marginTop: 28,
    gap: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  dividerText: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1.0,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceL2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.pill,
    height: 46,
    gap: 8,
  },
  socialBtnText: {
    ...typography.techSmall,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 12,
  },
  createAccountBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  createAccountText: {
    ...typography.body,
    color: colors.textMuted,
    fontSize: 13,
  },
  createAccountHighlight: {
    color: colors.primaryAction,
    fontWeight: '700',
  },
});
