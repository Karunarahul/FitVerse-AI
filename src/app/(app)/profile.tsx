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

export default function ProfileScreen() {
  const router = useRouter();

  const profile = useUserStore((s) => s.profile);
  const currentPlan = useWorkoutStore((s) => s.currentPlan);
  const tierName = useSubscriptionStore((s) => s.tierName);
  const { adaptCurrentPlan, isAdapting, coachMessages, isCoachTyping, sendCoachMessage } = useAIStore();

  const [chatVisible, setChatVisible] = useState(false);
  const [chatInput, setChatInput] = useState('');

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

          <TouchableOpacity
            onPress={() => router.push('/settings')}
            style={styles.settingsButton}
          >
            <Ionicons name="settings-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
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
              <Text style={[styles.metricVal, { color: colors.primaryAction }]}>62 kg</Text>
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
                <Text style={styles.goalTitle}>{profile.currentPhase || 'Hypertrophy Phase II'}</Text>
              </View>
              <Text style={styles.progressPercent}>65%</Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '65%' }]} />
            </View>
            <Text style={styles.goalSub}>Macro-cycle week 3 of 6 • Meso-intensity: 85%</Text>
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    ...typography.h3,
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
    ...typography.h3,
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
    ...typography.h3,
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
    ...typography.h3,
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1E0B09',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '80%',
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
    ...typography.h3,
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
  chatScrollView: {
    flex: 1,
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
