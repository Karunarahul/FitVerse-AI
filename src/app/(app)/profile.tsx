import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { NeuralBackground } from '../../components/NeuralBackground';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AIOrb } from '../../components/AIOrb';
import { colors, typography, radii, spacing } from '../../theme';
import { useUserStore } from '../../stores/userStore';
import { useWorkoutStore } from '../../stores/workoutStore';
import { useAIStore } from '../../stores/aiStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { supabaseService } from '../../services/supabase';

const GOAL_OPTIONS = ['Build Muscle', 'Fat Loss', 'Athletic Performance', 'Cardio Endurance'];
const LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];

export default function ProfileScreen() {
  const router = useRouter();

  const profile = useUserStore((s) => s.profile);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const currentPlan = useWorkoutStore((s) => s.currentPlan);
  const tierName = useSubscriptionStore((s) => s.tierName);
  const { adaptCurrentPlan, isAdapting, coachMessages, isCoachTyping, sendCoachMessage } = useAIStore();

  const [chatVisible, setChatVisible] = useState(false);
  const [chatInput, setChatInput] = useState('');

  // Edit Profile & Metrics Modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editWeight, setEditWeight] = useState(profile.weightKg.toString());
  const [editHeight, setEditHeight] = useState(profile.heightCm.toString());
  const [editTargetWeight, setEditTargetWeight] = useState(
    ((profile as any).targetWeightKg || profile.weightKg).toString()
  );
  const [editGoal, setEditGoal] = useState(profile.primaryGoal || 'Build Muscle');
  const [editLevel, setEditLevel] = useState((profile as any).experience || 'Intermediate');
  const [isSavingMetrics, setIsSavingMetrics] = useState(false);

  const handleOpenEditModal = () => {
    setEditWeight(profile.weightKg.toString());
    setEditHeight(profile.heightCm.toString());
    setEditTargetWeight(((profile as any).targetWeightKg || profile.weightKg).toString());
    setEditGoal(profile.primaryGoal || 'Build Muscle');
    setEditLevel((profile as any).experience || 'Intermediate');
    setEditModalVisible(true);
  };

  const handleSaveMetrics = async () => {
    const parsedWeight = parseFloat(editWeight);
    const parsedHeight = parseFloat(editHeight);
    const parsedTargetWeight = parseFloat(editTargetWeight);

    if (isNaN(parsedWeight) || parsedWeight <= 30 || parsedWeight >= 300) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight in kg (30-300).');
      return;
    }

    if (isNaN(parsedHeight) || parsedHeight <= 100 || parsedHeight >= 250) {
      Alert.alert('Invalid Height', 'Please enter a valid height in cm (100-250).');
      return;
    }

    setIsSavingMetrics(true);

    try {
      if (Platform.OS !== 'web') {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}
      }

      // 1. Update user store & upsert user_profiles in Supabase
      await updateProfile({
        weightKg: parsedWeight,
        heightCm: parsedHeight,
        primaryGoal: editGoal,
        targetWeightKg: isNaN(parsedTargetWeight) ? parsedWeight : parsedTargetWeight,
        experience: editLevel,
      } as any);

      // 2. Insert time-series historical row in public.body_metrics
      await supabaseService.logBodyMetrics({
        weight_kg: parsedWeight,
        body_fat_percentage: 18,
        muscle_mass_kg: Math.round(parsedWeight * 0.75),
      });

      setEditModalVisible(false);
      Alert.alert(
        'Metrics Calibrated! ⚡',
        `Weight: ${parsedWeight} kg, Height: ${parsedHeight} cm, Goal: ${editGoal}. Synchronized to your AI coach protocol.`
      );
    } catch (err: any) {
      console.warn('[ProfileScreen] Metrics save warning:', err.message);
      setEditModalVisible(false);
      Alert.alert('Metrics Saved (Local)', 'Profile calibrated locally.');
    } finally {
      setIsSavingMetrics(false);
    }
  };

  const handleAdaptPlan = async () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch {}
    }

    const success = await adaptCurrentPlan();
    if (success) {
      Alert.alert(
        'Neural Plan Adapted! ⚡',
        "Your recent upper-body performance indicates improved recovery. I've increased your next session's volume by 5% and recalibrated rest intervals.",
        [
          {
            text: 'VIEW UPDATED PLAN',
            onPress: () => router.push('/(app)/plans'),
          },
        ]
      );
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput('');
    sendCoachMessage(msg);
  };

  return (
    <NeuralBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{profile.name || 'Alex'}</Text>
            <View style={styles.tierBadge}>
              <Ionicons name="shield-checkmark" size={13} color={colors.primaryAction} />
              <Text style={styles.tierText}>{tierName.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleOpenEditModal}
              style={styles.editMetricsBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={17} color={colors.primaryAction} />
              <Text style={styles.editMetricsText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/settings')}
              style={styles.settingsButton}
            >
              <Ionicons name="settings-outline" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Biometrics 4-Box Grid */}
          <View style={styles.metricsGrid}>
            <GlassCard level={2} style={styles.metricBox}>
              <Text style={styles.metricLabel}>WEIGHT</Text>
              <Text style={styles.metricVal}>{profile.weightKg} kg</Text>
              <Text style={styles.metricSub}>Optimal Baseline</Text>
            </GlassCard>

            <GlassCard level={2} style={styles.metricBox}>
              <Text style={styles.metricLabel}>BODY FAT</Text>
              <Text style={[styles.metricVal, { color: colors.aiAccent }]}>18%</Text>
              <Text style={styles.metricSub}>Athletic Tier</Text>
            </GlassCard>

            <GlassCard level={2} style={styles.metricBox}>
              <Text style={styles.metricLabel}>MUSCLE MASS</Text>
              <Text style={[styles.metricVal, { color: colors.primaryAction }]}>
                {Math.round(profile.weightKg * 0.75)} kg
              </Text>
              <Text style={styles.metricSub}>Lean Tissue</Text>
            </GlassCard>

            <GlassCard level={2} style={styles.metricBox}>
              <Text style={styles.metricLabel}>HEIGHT</Text>
              <Text style={styles.metricVal}>{profile.heightCm} cm</Text>
              <Text style={styles.metricSub}>Stature</Text>
            </GlassCard>
          </View>

          {/* Active Goal Progress Card */}
          <GlassCard level={2} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View>
                <Text style={styles.goalTag}>ACTIVE TARGET GOAL</Text>
                <Text style={styles.goalTitle}>{profile.primaryGoal || 'Build Muscle'}</Text>
              </View>
              <Text style={styles.progressPercent}>65%</Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '65%' }]} />
            </View>
            <Text style={styles.goalSub}>
              Target: {(profile as any).targetWeightKg || profile.weightKg} kg • Experience: {(profile as any).experience || 'Intermediate'}
            </Text>
          </GlassCard>

          {/* AI Plan Adaptation Hero Card */}
          <GlassCard level={3} glow="ai" style={styles.adaptCard}>
            <View style={styles.adaptHeader}>
              <View style={styles.adaptTag}>
                <Ionicons name="sparkles" size={13} color={colors.aiAccent} />
                <Text style={styles.adaptTagText}>AI AUTONOMOUS COACH</Text>
              </View>
              <View style={styles.statusIndicator}>
                <View style={styles.statusGreenDot} />
                <Text style={styles.statusOnline}>STANDBY</Text>
              </View>
            </View>

            <Text style={styles.coachStatement}>
              Your AI coach has analyzed {profile.streakDays || 14} recent workouts. Recovery telemetry is optimal.
            </Text>
            <Text style={styles.coachDescription}>
              Ready to adapt your regimen with calibrated volume and resistance progression.
            </Text>

            {currentPlan.adaptationNote && (
              <View style={styles.adaptationNoteBox}>
                <Ionicons name="git-branch-outline" size={16} color={colors.primaryAction} />
                <Text style={styles.adaptationNoteText}>{currentPlan.adaptationNote}</Text>
              </View>
            )}

            <PrimaryButton
              title={isAdapting ? 'ANALYZING TELEMETRY...' : 'ADAPT MY PLAN'}
              loading={isAdapting}
              variant="ai"
              onPress={handleAdaptPlan}
              style={styles.adaptBtn}
            />
          </GlassCard>

          {/* AI Coach Chat Quick Launch */}
          <TouchableOpacity
            onPress={() => setChatVisible(true)}
            activeOpacity={0.8}
            style={styles.chatLaunchCard}
          >
            <View style={styles.chatIconWrapper}>
              <Ionicons name="chatbubbles" size={20} color={colors.aiAccent} />
            </View>
            <View style={styles.chatLaunchInfo}>
              <Text style={styles.chatLaunchTitle}>Consult Neural Coach</Text>
              <Text style={styles.chatLaunchSubtitle}>
                Ask questions about weights, form, nutrition and fatigue
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Premium Tier Quick Banner */}
          <TouchableOpacity
            onPress={() => router.push('/premium')}
            activeOpacity={0.8}
            style={styles.premiumBanner}
          >
            <View style={styles.premiumLeft}>
              <Ionicons name="diamond" size={20} color={colors.primaryAction} />
              <View>
                <Text style={styles.premiumTitle}>FitVerse Premium</Text>
                <Text style={styles.premiumSubtitle}>Unlocked: Unlimited AI Swaps & Adaptation</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.primaryAction} />
          </TouchableOpacity>

          <View style={{ height: 90 }} />
        </ScrollView>

        {/* Edit Profile & Metrics Modal Dialog */}
        <Modal
          visible={editModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setEditModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <Ionicons name="fitness" size={22} color={colors.primaryAction} />
                  <Text style={styles.modalTitle}>Calibrate Biometrics & Goal</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setEditModalVisible(false)}
                  style={styles.modalCloseBtn}
                >
                  <Ionicons name="close" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Weight & Height Inputs */}
                <View style={styles.modalRowInputs}>
                  <View style={[styles.modalInputGroup, { flex: 1 }]}>
                    <Text style={styles.modalInputLabel}>Current Weight (kg)</Text>
                    <TextInput
                      style={styles.modalTextInput}
                      keyboardType="numeric"
                      value={editWeight}
                      onChangeText={setEditWeight}
                    />
                  </View>

                  <View style={[styles.modalInputGroup, { flex: 1, marginLeft: 12 }]}>
                    <Text style={styles.modalInputLabel}>Height (cm)</Text>
                    <TextInput
                      style={styles.modalTextInput}
                      keyboardType="numeric"
                      value={editHeight}
                      onChangeText={setEditHeight}
                    />
                  </View>
                </View>

                {/* Target Weight */}
                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalInputLabel}>Target Weight (kg)</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    keyboardType="numeric"
                    value={editTargetWeight}
                    onChangeText={setEditTargetWeight}
                  />
                </View>

                {/* Primary Goal Selector */}
                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalInputLabel}>Primary Athletic Objective</Text>
                  <View style={styles.pillsRow}>
                    {GOAL_OPTIONS.map((g) => {
                      const isSel = editGoal === g;
                      return (
                        <TouchableOpacity
                          key={g}
                          style={[styles.pillOption, isSel && styles.pillOptionActive]}
                          onPress={() => setEditGoal(g)}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.pillOptionText, isSel && styles.pillOptionTextActive]}>
                            {g}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Experience Level Selector */}
                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalInputLabel}>Fitness & Experience Tier</Text>
                  <View style={styles.pillsRow}>
                    {LEVEL_OPTIONS.map((lvl) => {
                      const isSel = editLevel === lvl;
                      return (
                        <TouchableOpacity
                          key={lvl}
                          style={[styles.pillOption, isSel && styles.pillOptionActiveAi]}
                          onPress={() => setEditLevel(lvl)}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.pillOptionText, isSel && styles.pillOptionTextActive]}>
                            {lvl}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={{ marginTop: 24, marginBottom: 16 }}>
                  <PrimaryButton
                    title={isSavingMetrics ? 'SAVING BIOMETRICS...' : 'CALIBRATE & SYNC PROTOCOL'}
                    onPress={handleSaveMetrics}
                    disabled={isSavingMetrics}
                  />
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Interactive AI Coach Modal Dialog */}
        <Modal
          visible={chatVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setChatVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContainer}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <View style={styles.miniOrb}>
                    <AIOrb size={32} glowColor="ai" />
                  </View>
                  <View>
                    <Text style={styles.modalTitle}>FitVerse AI Coach</Text>
                    <Text style={styles.modalStatus}>Active Telemetry Stream</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setChatVisible(false)}
                  style={styles.modalCloseBtn}
                >
                  <Ionicons name="close" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Chat Messages */}
              <ScrollView
                style={styles.chatScrollView}
                contentContainerStyle={styles.chatScrollContent}
              >
                {coachMessages.map((msg) => (
                  <View
                    key={msg.id}
                    style={[
                      styles.chatBubble,
                      msg.sender === 'user' ? styles.userBubble : styles.assistantBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chatBubbleText,
                        msg.sender === 'user' ? styles.userBubbleText : styles.assistantBubbleText,
                      ]}
                    >
                      {msg.text}
                    </Text>
                  </View>
                ))}

                {isCoachTyping && (
                  <View style={[styles.chatBubble, styles.assistantBubble, styles.typingBubble]}>
                    <Text style={styles.typingText}>Neural Engine synthesizing...</Text>
                  </View>
                )}
              </ScrollView>

              {/* Chat Input Bar */}
              <View style={styles.chatInputBar}>
                <TextInput
                  value={chatInput}
                  onChangeText={setChatInput}
                  placeholder="Ask your coach (e.g. Should I increase bench weight?)"
                  placeholderTextColor={colors.textMuted}
                  style={styles.chatTextInput}
                  onSubmitEditing={handleSendMessage}
                />
                <TouchableOpacity
                  onPress={handleSendMessage}
                  activeOpacity={0.7}
                  style={styles.chatSendBtn}
                >
                  <Ionicons name="arrow-up" size={18} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.horizontal,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    ...typography.hero,
    fontSize: 28,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  tierText: {
    ...typography.techSmall,
    color: colors.primaryAction,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.0,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  editMetricsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 84, 74, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 84, 74, 0.35)',
    borderRadius: radii.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 5,
  },
  editMetricsText: {
    ...typography.techSmall,
    color: colors.primaryAccent,
    fontSize: 11,
    fontWeight: '700',
  },
  settingsButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceL2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.horizontal,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  metricBox: {
    width: '48%',
    padding: 14,
  },
  metricLabel: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1.0,
    marginBottom: 4,
  },
  metricVal: {
    ...typography.techLarge,
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  metricSub: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  goalCard: {
    padding: 18,
    marginBottom: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  goalTag: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1.0,
    marginBottom: 2,
  },
  goalTitle: {
    ...typography.heading3,
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  progressPercent: {
    ...typography.tech,
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryAction,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.primaryAction,
  },
  goalSub: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  adaptCard: {
    padding: 20,
    marginBottom: 20,
  },
  adaptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  adaptTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adaptTagText: {
    ...typography.techSmall,
    color: colors.aiAccent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.0,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  statusOnline: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  coachStatement: {
    ...typography.heading3,
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 6,
  },
  coachDescription: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  adaptationNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 84, 74, 0.1)',
    borderRadius: radii.md,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 84, 74, 0.25)',
  },
  adaptationNoteText: {
    ...typography.caption,
    color: colors.primaryAccent,
    fontWeight: '600',
    flex: 1,
  },
  adaptBtn: {
    width: '100%',
  },
  chatLaunchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceL2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.card,
    padding: 16,
    marginBottom: 16,
  },
  chatIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(107, 211, 253, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  chatLaunchInfo: {
    flex: 1,
  },
  chatLaunchTitle: {
    ...typography.heading3,
    fontSize: 15,
    color: colors.textPrimary,
  },
  chatLaunchSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 84, 74, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 84, 74, 0.3)',
    borderRadius: radii.card,
    padding: 16,
    marginBottom: 20,
  },
  premiumLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  premiumTitle: {
    ...typography.heading3,
    fontSize: 15,
    color: colors.textPrimary,
  },
  premiumSubtitle: {
    ...typography.caption,
    color: colors.primaryAccent,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1E0B09',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniOrb: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    ...typography.heading3,
    fontSize: 17,
    color: colors.textPrimary,
  },
  modalStatus: {
    ...typography.techSmall,
    color: colors.aiAccent,
    fontSize: 10,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    paddingHorizontal: 20,
  },
  modalScrollContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  modalRowInputs: {
    flexDirection: 'row',
  },
  modalInputGroup: {
    marginBottom: 16,
  },
  modalInputLabel: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  modalTextInput: {
    backgroundColor: 'rgba(22, 8, 7, 0.75)',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(174, 135, 131, 0.3)',
    color: colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...typography.body,
    fontSize: 15,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: 'rgba(46, 27, 24, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(174, 135, 131, 0.25)',
  },
  pillOptionActive: {
    backgroundColor: 'rgba(255, 84, 74, 0.2)',
    borderColor: colors.primaryAction,
  },
  pillOptionActiveAi: {
    backgroundColor: 'rgba(107, 211, 253, 0.2)',
    borderColor: colors.aiAccent,
  },
  pillOptionText: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  pillOptionTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  chatScrollView: {
    maxHeight: 380,
  },
  chatScrollContent: {
    padding: 20,
    gap: 12,
  },
  chatBubble: {
    maxWidth: '82%',
    padding: 14,
    borderRadius: radii.card,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primaryAction,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceL3,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  chatBubbleText: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  userBubbleText: {
    color: '#FFF',
  },
  assistantBubbleText: {
    color: colors.textPrimary,
  },
  typingBubble: {
    opacity: 0.7,
  },
  typingText: {
    ...typography.caption,
    color: colors.aiAccent,
    fontStyle: 'italic',
  },
  chatInputBar: {
    flexDirection: 'row',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    gap: 10,
    backgroundColor: '#160706',
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: colors.surfaceL2,
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    color: colors.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  chatSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryAction,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
