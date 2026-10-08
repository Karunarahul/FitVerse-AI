import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NeuralBackground } from '../components/NeuralBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { Toggle } from '../components/Toggle';
import { colors, typography, radii, spacing } from '../theme';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';

export default function SettingsScreen() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const profile = useUserStore((s) => s.profile);
  const tierName = useSubscriptionStore((s) => s.tierName);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [autonomousAdaptation, setAutonomousAdaptation] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Terminate Session',
      'Are you sure you want to log out of your FitVerse AI engine?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'LOG OUT',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  return (
    <NeuralBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Settings" subtitle="System configuration and neural preferences" showBack />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Athlete Profile Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>ATHLETE ARCHITECTURE</Text>
            <GlassCard level={2} style={styles.card}>
              <TouchableOpacity
                onPress={() => router.push('/(app)/profile')}
                activeOpacity={0.7}
                style={styles.row}
              >
                <View style={styles.rowLeft}>
                  <Ionicons name="person-outline" size={18} color={colors.primaryAction} />
                  <View>
                    <Text style={styles.rowTitle}>Account Credentials</Text>
                    <Text style={styles.rowSubtitle}>{profile.name} • {profile.email}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                onPress={() => router.push('/onboarding/body-metrics')}
                activeOpacity={0.7}
                style={styles.row}
              >
                <View style={styles.rowLeft}>
                  <Ionicons name="fitness-outline" size={18} color={colors.aiAccent} />
                  <View>
                    <Text style={styles.rowTitle}>Body Metrics Calibration</Text>
                    <Text style={styles.rowSubtitle}>{profile.weightKg} kg • {profile.heightCm} cm</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                onPress={() => router.push('/onboarding/workout-goals')}
                activeOpacity={0.7}
                style={styles.row}
              >
                <View style={styles.rowLeft}>
                  <Ionicons name="barbell-outline" size={18} color={colors.warning} />
                  <View>
                    <Text style={styles.rowTitle}>Training Goals & Gear</Text>
                    <Text style={styles.rowSubtitle}>{profile.primaryGoal} • {profile.environment}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                onPress={() => router.push('/nutrition')}
                activeOpacity={0.7}
                style={styles.row}
              >
                <View style={styles.rowLeft}>
                  <Ionicons name="nutrition-outline" size={18} color={colors.success} />
                  <View>
                    <Text style={styles.rowTitle}>Nutrition & Dietary Styles</Text>
                    <Text style={styles.rowSubtitle}>{profile.nutritionStyle} • {profile.restrictions.join(', ') || 'No Restrictions'}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </GlassCard>
          </View>

          {/* AI Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>NEURAL ENGINE PREFERENCES</Text>
            <GlassCard level={2} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Ionicons name="sparkles-outline" size={18} color={colors.aiAccent} />
                  <View>
                    <Text style={styles.rowTitle}>Autonomous Adaptation</Text>
                    <Text style={styles.rowSubtitle}>Auto-recalibrate sets & volume weekly</Text>
                  </View>
                </View>
                <Toggle value={autonomousAdaptation} onValueChange={setAutonomousAdaptation} />
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Ionicons name="notifications-outline" size={18} color={colors.primaryAction} />
                  <View>
                    <Text style={styles.rowTitle}>Protocol Reminders</Text>
                    <Text style={styles.rowSubtitle}>Hydration & training window nudges</Text>
                  </View>
                </View>
                <Toggle value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Ionicons name="hardware-chip-outline" size={18} color={colors.textPrimary} />
                  <View>
                    <Text style={styles.rowTitle}>Haptic Telemetry</Text>
                    <Text style={styles.rowSubtitle}>Vibrational feedback during set completion</Text>
                  </View>
                </View>
                <Toggle value={hapticsEnabled} onValueChange={setHapticsEnabled} />
              </View>
            </GlassCard>
          </View>

          {/* Subscription & Privacy */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>MEMBERSHIP & SECURITY</Text>
            <GlassCard level={2} style={styles.card}>
              <TouchableOpacity
                onPress={() => router.push('/premium')}
                activeOpacity={0.7}
                style={styles.row}
              >
                <View style={styles.rowLeft}>
                  <Ionicons name="diamond-outline" size={18} color={colors.primaryAction} />
                  <View>
                    <Text style={styles.rowTitle}>Subscription Tier</Text>
                    <Text style={styles.rowSubtitle}>{tierName}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Ionicons name="shield-outline" size={18} color={colors.success} />
                  <View>
                    <Text style={styles.rowTitle}>Anonymous Telemetry</Text>
                    <Text style={styles.rowSubtitle}>Encrypted locally on device</Text>
                  </View>
                </View>
                <Toggle value={dataSharing} onValueChange={setDataSharing} />
              </View>
            </GlassCard>
          </View>

          {/* Session Termination Button */}
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            style={styles.logoutButton}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.error} />
            <Text style={styles.logoutText}>TERMINATE SESSION (LOG OUT)</Text>
          </TouchableOpacity>

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
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 1.0,
    marginBottom: 10,
  },
  card: {
    padding: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    paddingRight: 10,
  },
  rowTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontSize: 14,
  },
  rowSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginHorizontal: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.3)',
    borderRadius: radii.card,
    paddingVertical: 16,
    marginTop: 10,
  },
  logoutText: {
    ...typography.techSmall,
    color: colors.error,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.0,
  },
});
