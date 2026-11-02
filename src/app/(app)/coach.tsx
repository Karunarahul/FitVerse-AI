import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { NeuralBackground } from '../../components/NeuralBackground';
import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { AIOrb } from '../../components/AIOrb';
import { colors, typography, radii, shadows } from '../../theme';
import { useUserStore } from '../../stores/userStore';
import { useWorkoutStore } from '../../stores/workoutStore';
import { useNutritionStore } from '../../stores/nutritionStore';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { requestApi } from '../../services/api';

let messageCounter = 0;
function createMessageId(prefix: string): string {
  messageCounter += 1;
  return `${prefix}_${Date.now()}_${messageCounter}`;
}

function getCurrentTimeString(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  suggestions?: string[];
  actionType?: 'apply_workout' | 'apply_diet' | 'log_water' | 'info';
  actionPayload?: any;
}

const QUICK_PROMPTS = [
  'How much protein have I consumed today?',
  'Suggest a high-protein Indian vegetarian dinner.',
  'Create a 5-day muscle-building workout split.',
  'Analyze my weekly calorie intake & deficit.',
  'Adjust my workout intensity based on my recovery.',
];

export default function AICoachScreen() {
  const profile = useUserStore((s) => s.profile);
  const workoutPlan = useWorkoutStore((s) => s.currentPlan);
  const nutritionPlan = useNutritionStore((s) => s.currentPlan);
  const stats = useAnalyticsStore((s) => s.stats);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'coach',
      text: `Greetings ${profile.name || 'Athlete'}. I am your FitVerse AI Performance Coach.\n\nI have evaluated your target of ${profile.primaryGoal || 'hypertrophy'} (${(profile as any).targetWeightKg || 78}kg target), your current ${workoutPlan.name} plan, and today's nutritional intake.\n\nHow can I calibrate your protocol today?`,
      timestamp: 'Just now',
      suggestions: [
        'How much protein left today?',
        'Suggest high-protein Indian meal',
        'Review current split',
      ],
    },
  ]);

  useEffect(() => {
    // Auto scroll to latest message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }

    const userMsg: ChatMessage = {
      id: createMessageId('user'),
      sender: 'user',
      text,
      timestamp: getCurrentTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Gather real contextual state for the coach
      const context = {
        user: {
          name: profile.name,
          goal: profile.primaryGoal,
          weight: profile.weightKg,
          targetWeight: (profile as any).targetWeightKg || 78,
          experience: (profile as any).experience || 'Intermediate',
          equipment: profile.equipment,
          restrictions: profile.restrictions,
          nutritionStyle: profile.nutritionStyle,
        },
        currentWorkout: {
          name: workoutPlan.name,
          phase: workoutPlan.phase,
          exercisesCount: workoutPlan.exercises.length,
        },
        nutritionToday: {
          caloriesTarget: nutritionPlan.calories,
          proteinTarget: nutritionPlan.proteinGrams,
          carbsTarget: nutritionPlan.carbsGrams,
          fatTarget: nutritionPlan.fatsGrams,
          hydrationLiters: nutritionPlan.hydrationLiters,
        },
        analytics: {
          streak: stats.currentStreakDays,
          weeklyWorkouts: stats.totalWorkoutsCompleted,
          recoveryRate: '94%',
        },
      };

      // Call server AI Coach endpoint (falls back gracefully to deterministic intelligence)
      const res = await requestApi<{ response: string; suggestions?: string[]; actionType?: any }>('/api/ai/coach/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text, context }),
      });

      let replyText = '';
      let replySuggestions: string[] | undefined = undefined;

      if (res.success && res.data?.response) {
        replyText = res.data.response;
        replySuggestions = res.data.suggestions;
      } else {
        // Deterministic contextual intelligence fallback based on the actual user query
        replyText = generateDeterministicCoachReply(text, context);
        replySuggestions = ['Calculate tomorrow macros', 'Modify rest timer', 'Explain exercise form'];
      }

      const coachMsg: ChatMessage = {
        id: createMessageId('coach'),
        sender: 'coach',
        text: replyText,
        timestamp: getCurrentTimeString(),
        suggestions: replySuggestions,
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: createMessageId('coach_err'),
        sender: 'coach',
        text: `Based on your profile (${profile.weightKg}kg, ${profile.primaryGoal}), maintain 2.0g/kg protein (${Math.round((profile.weightKg || 74) * 2)}g) and hydrate with at least 3.2L water daily.`,
        timestamp: getCurrentTimeString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <NeuralBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          title="FitVerse AI Coach"
          subtitle="Adaptive Biometric & Performance Intelligence"
        />

        {/* AI Status Pill Header */}
        <View style={styles.statusRow}>
          <View style={styles.statusIndicator}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>NEURAL ENGINE ACTIVE • GEMINI 1.5 HYBRID</Text>
          </View>
          <AIOrb size={28} glowColor="ai" />
        </View>

        {/* Message Stream */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((item) => (
            <View
              key={item.id}
              style={[
                styles.messageRow,
                item.sender === 'user' ? styles.userRow : styles.coachRow,
              ]}
            >
              {item.sender === 'coach' && (
                <View style={styles.coachAvatar}>
                  <Ionicons name="sparkles" size={14} color={colors.aiAccent} />
                </View>
              )}

              <View style={{ maxWidth: '82%' }}>
                <GlassCard
                  level={item.sender === 'user' ? 2 : 3}
                  glow={item.sender === 'user' ? 'crimson' : 'ai'}
                  style={[
                    styles.bubble,
                    item.sender === 'user' ? styles.userBubble : styles.coachBubble,
                  ]}
                >
                  <Text style={styles.bubbleText}>{item.text}</Text>
                  <Text style={styles.timestampText}>{item.timestamp}</Text>
                </GlassCard>

                {/* Follow-up suggestions */}
                {item.suggestions && item.suggestions.length > 0 && (
                  <View style={styles.suggestionContainer}>
                    {item.suggestions.map((sug, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.suggestionChip}
                        onPress={() => handleSendMessage(sug)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="arrow-forward" size={11} color={colors.aiAccent} />
                        <Text style={styles.suggestionText}>{sug}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.messageRow, styles.coachRow]}>
              <View style={styles.coachAvatar}>
                <Ionicons name="sparkles" size={14} color={colors.aiAccent} />
              </View>
              <GlassCard level={2} glow="ai" style={styles.typingCard}>
                <ActivityIndicator size="small" color={colors.aiAccent} />
                <Text style={styles.typingText}>Analyzing biometric data...</Text>
              </GlassCard>
            </View>
          )}
        </ScrollView>

        {/* Quick Prompts Carousel */}
        <View style={styles.quickPromptSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickPromptScroll}>
            {QUICK_PROMPTS.map((prompt, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickPromptChip}
                onPress={() => handleSendMessage(prompt)}
                activeOpacity={0.8}
              >
                <Text style={styles.quickPromptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Bar */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask your coach anything about workouts or diet..."
              placeholderTextColor={colors.textMuted}
              value={inputMessage}
              onChangeText={setInputMessage}
              multiline
              maxLength={400}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputMessage.trim() && styles.sendButtonDisabled,
              ]}
              onPress={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isTyping}
              activeOpacity={0.8}
            >
              <Ionicons
                name="send"
                size={18}
                color={inputMessage.trim() ? colors.textDark : colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </NeuralBackground>
  );
}

// Deterministic intelligence fallback generator
function generateDeterministicCoachReply(query: string, ctx: any): string {
  const lower = query.toLowerCase();

  if (lower.includes('protein')) {
    const proteinTarget = ctx.nutritionToday.proteinTarget || 180;
    return `Today's protein benchmark is set to ${proteinTarget}g (calculated at ~2.2g per kg of lean mass). \n\nTo hit your remainder efficiently, consider 150g grilled paneer, 200g Greek yogurt, or 3 whole eggs with moong dal chilla.`;
  }

  if (lower.includes('indian') || lower.includes('dinner') || lower.includes('vegetarian')) {
    return `Here is an optimal high-protein Indian performance meal:\n\n• 150g Sautéed Paneer Tikka (approx 28g Protein, 4g Carbs, 26g Fats)\n• 1 Cup Thick Yellow Tadka Dal (12g Protein, 22g Carbs)\n• 2 Whole Wheat Phulkas / Rotis (6g Protein, 30g Carbs)\n• 1 Bowl Cucumber-Mint Curd (4g Protein)\n\nTotal Macro Profile: ~50g Protein | ~58g Carbs | ~620 kcal.`;
  }

  if (lower.includes('split') || lower.includes('5-day') || lower.includes('workout')) {
    return `Here is your customized 5-Day Hypertrophy Split based on your ${ctx.user.goal} objective:\n\n1. Day 1: Push (Barbell Incline Press, Dips, Lateral Raises)\n2. Day 2: Pull (Weighted Pull-ups, Barbell Rows, Face Pulls)\n3. Day 3: Legs & Core (Squats, Romanian Deadlifts, Calves)\n4. Day 4: Rest / Active Zone 2 Mobility\n5. Day 5: Upper Hypertrophy (Dumbbell Bench, Lat Pulldowns)\n6. Day 6: Lower & Conditioning (Bulgarian Split Squats, Leg Curls)\n7. Day 7: Complete Neuromuscular Recovery`;
  }

  if (lower.includes('weight') || lower.includes('gain') || lower.includes('loss')) {
    return `Your baseline weight is logged at ${ctx.user.weight}kg with a goal of ${ctx.user.targetWeight}kg. To guarantee progressive mass accumulation, maintain a 350-400 kcal surplus above your TDEE (~${ctx.nutritionToday.caloriesTarget} kcal) while keeping your protein at ${ctx.nutritionToday.proteinTarget}g.`;
  }

  return `I have calibrated your request against your profile: ${ctx.user.experience || 'Intermediate'} level, training for ${ctx.user.goal}. Keep adherence high: your current streak is ${ctx.analytics.streak} days. Stay consistent on sleep (7.5h+) to maximize hormonal response.`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingBottom: 72, // Leave space for BottomNav
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(107, 211, 253, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(107, 211, 253, 0.3)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.aiAccent,
    marginRight: 6,
  },
  statusText: {
    ...typography.techSmall,
    color: colors.aiAccent,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  coachRow: {
    justifyContent: 'flex-start',
  },
  coachAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(107, 211, 253, 0.15)',
    borderWidth: 1,
    borderColor: colors.aiAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: 'rgba(255, 84, 74, 0.18)',
    borderBottomRightRadius: 4,
  },
  coachBubble: {
    backgroundColor: 'rgba(46, 27, 24, 0.92)',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    ...typography.body,
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 21,
  },
  timestampText: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  suggestionContainer: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(107, 211, 253, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(107, 211, 253, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
    gap: 4,
  },
  suggestionText: {
    ...typography.bodySmall,
    color: colors.aiAccent,
    fontSize: 11,
    fontWeight: '600',
  },
  typingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    gap: 8,
  },
  typingText: {
    ...typography.bodySmall,
    color: colors.aiAccent,
    fontSize: 12,
    fontStyle: 'italic',
  },
  quickPromptSection: {
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(174, 135, 131, 0.15)',
  },
  quickPromptScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  quickPromptChip: {
    backgroundColor: 'rgba(46, 27, 24, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(174, 135, 131, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
  },
  quickPromptText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(41, 23, 21, 0.95)',
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(174, 135, 131, 0.3)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    ...shadows.card,
  },
  textInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    fontSize: 13,
    maxHeight: 80,
    paddingVertical: 6,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryAction,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(174, 135, 131, 0.2)',
  },
});
