import { create } from 'zustand';
import { aiService } from '../services/ai';
import { ChatMessage, PlanGenerationRequest, PlanAdaptationResponse } from '../types';
import { useWorkoutStore } from './workoutStore';
import { useNutritionStore } from './nutritionStore';
import { useUserStore } from './userStore';
import { useAnalyticsStore } from './analyticsStore';

interface AIState {
  // Plan Generation
  isGeneratingPlan: boolean;
  generationStep: number; // 1: Biometric, 2: Workout Vectors, 3: Nutrition Macros, 4: Complete
  generationError: string | null;
  aiSynthesisMessage: string | null;
  generatePlan: (request: PlanGenerationRequest) => Promise<boolean>;

  // Plan Adaptation
  isAdapting: boolean;
  adaptationResult: PlanAdaptationResponse | null;
  adaptCurrentPlan: () => Promise<boolean>;

  // AI Coach Chat
  coachMessages: ChatMessage[];
  isCoachTyping: boolean;
  sendCoachMessage: (text: string) => Promise<void>;
  resetCoachChat: () => void;
}

const initialMessages: ChatMessage[] = [
  {
    id: 'msg_init',
    sender: 'assistant',
    text: 'Greetings Alex. I am your FitVerse Neural Engine. I have synced your 14-day telemetry and current hypertrophy phase. How can I optimize your protocol today?',
    timestamp: 'Just now',
  },
];

export const useAIStore = create<AIState>((set, get) => ({
  isGeneratingPlan: false,
  generationStep: 0,
  generationError: null,
  aiSynthesisMessage: null,

  generatePlan: async (request: PlanGenerationRequest) => {
    set({ isGeneratingPlan: true, generationStep: 1, generationError: null });

    try {
      // Step 1: Biometric Data Digested
      await new Promise((r) => setTimeout(r, 700));
      set({ generationStep: 2 });

      // Step 2: Synthesizing Workout Vectors
      const responsePromise = aiService.generateFitnessPlan(request);
      await new Promise((r) => setTimeout(r, 800));
      set({ generationStep: 3 });

      // Step 3: Optimizing Nutrition Macros
      const response = await responsePromise;
      await new Promise((r) => setTimeout(r, 600));
      set({ generationStep: 4, aiSynthesisMessage: response.aiSynthesis });

      // Apply to stores
      useWorkoutStore.getState().setPlan(response.workoutPlan);
      useNutritionStore.getState().setPlan(response.nutritionPlan);
      useUserStore.getState().updateProfile({
        name: request.name,
        age: request.age,
        gender: request.gender,
        heightCm: request.heightCm,
        weightKg: request.weightKg,
        activityLevel: request.activityLevel,
        primaryGoal: request.primaryGoal,
        environment: request.environment,
        equipment: request.equipment,
        workoutDuration: request.workoutDuration,
        nutritionStyle: request.nutritionStyle,
        restrictions: request.restrictions,
      });

      set({ isGeneratingPlan: false });
      return true;
    } catch (err: any) {
      console.warn('AI generation error:', err);
      set({
        isGeneratingPlan: false,
        generationError: err.message || 'AI Generation Failed. Please retry.',
      });
      return false;
    }
  },

  isAdapting: false,
  adaptationResult: null,

  adaptCurrentPlan: async () => {
    set({ isAdapting: true });
    try {
      const user = useUserStore.getState().profile;
      const stats = useAnalyticsStore.getState().stats;
      const currentPlan = useWorkoutStore.getState().currentPlan;

      // Minimum wait for AI neural visual effect
      const [res] = await Promise.all([
        aiService.adaptWorkout(user, stats, currentPlan),
        new Promise((r) => setTimeout(r, 1200)),
      ]);

      useWorkoutStore.getState().setPlan(res.updatedPlan);
      useAnalyticsStore.getState().updateAIInsight({
        headline: 'Plan Adapted via AI Analysis',
        details: res.rationale,
        recommendation: res.message,
        confidence: 97,
      });

      set({ isAdapting: false, adaptationResult: res });
      return true;
    } catch (e) {
      console.warn('AI Adaptation error:', e);
      set({ isAdapting: false });
      return false;
    }
  },

  coachMessages: initialMessages,
  isCoachTyping: false,

  sendCoachMessage: async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Now',
    };

    set((state) => ({
      coachMessages: [...state.coachMessages, userMsg],
      isCoachTyping: true,
    }));

    try {
      const profile = useUserStore.getState().profile;
      const reply = await aiService.coachChat(text, {
        profile,
        currentGoal: profile.primaryGoal,
      });

      const aiMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: 'Now',
      };

      set((state) => ({
        coachMessages: [...state.coachMessages, aiMsg],
        isCoachTyping: false,
      }));
    } catch {
      set((state) => ({
        coachMessages: [
          ...state.coachMessages,
          {
            id: `msg_err_${Date.now()}`,
            sender: 'assistant',
            text: 'I am calibrating additional telemetry. Your current form and consistency remain optimal.',
            timestamp: 'Now',
          },
        ],
        isCoachTyping: false,
      }));
    }
  },

  resetCoachChat: () => {
    set({ coachMessages: initialMessages, isCoachTyping: false });
  },
}));
