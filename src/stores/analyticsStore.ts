import { create } from 'zustand';
import { UserStats } from '../types';
import { demoStats } from '../utils/demoData';
import { storage } from '../services/storage';

interface AnalyticsState {
  stats: UserStats;
  timeFilter: '1M' | '3M' | 'YTD';
  setTimeFilter: (filter: '1M' | '3M' | 'YTD') => void;
  recordWorkoutCompleted: (caloriesBurned: number) => void;
  updateAIInsight: (insight: UserStats['aiInsight']) => void;
  loadPersistedStats: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  stats: demoStats,
  timeFilter: '1M',

  setTimeFilter: (timeFilter) => set({ timeFilter }),

  recordWorkoutCompleted: (caloriesBurned: number) => {
    const s = get().stats;
    const newTotal = s.totalWorkoutsCompleted + 1;
    const newStreak = s.currentStreakDays + 1;
    const newAvg = Math.round((s.averageBurnKcal * s.totalWorkoutsCompleted + caloriesBurned) / newTotal);
    const newWeekly = Math.min(100, Math.round((newTotal / s.totalWorkoutsTarget) * 100));

    const updated: UserStats = {
      ...s,
      totalWorkoutsCompleted: newTotal,
      currentStreakDays: newStreak,
      averageBurnKcal: newAvg,
      dailyGoalCompletionPercent: 100,
      weeklyOutputPercent: newWeekly,
      aiInsight: {
        headline: 'Supercompensation Detected',
        details: `Workout completed (+${caloriesBurned} kcal). Neuromuscular adaptation rate accelerated.`,
        recommendation: 'Hydrate 500ml and maintain 40g post-workout protein window.',
        confidence: 98,
      },
    };

    set({ stats: updated });
    storage.setItem(storage.KEYS.USER_STATS, updated);
  },

  updateAIInsight: (aiInsight) => {
    const updated = { ...get().stats, aiInsight };
    set({ stats: updated });
    storage.setItem(storage.KEYS.USER_STATS, updated);
  },

  loadPersistedStats: async () => {
    const saved = await storage.getItem<UserStats>(storage.KEYS.USER_STATS);
    if (saved) {
      set({ stats: saved });
    }
  },
}));
