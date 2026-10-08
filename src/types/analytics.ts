export interface WeightDataPoint {
  date: string;
  weightKg: number;
}

export interface CalorieDataPoint {
  day: string;
  calories: number;
}

export interface UserStats {
  consistencyScore: number;
  consistencyChange: number;
  totalWorkoutsCompleted: number;
  totalWorkoutsTarget: number;
  averageBurnKcal: number;
  currentStreakDays: number;
  dailyGoalCompletionPercent: number;
  heartRateBpm: number;
  stepsCurrent: number;
  stepsTarget: number;
  sleepDuration: string;
  sleepQuality: 'Optimal' | 'Good' | 'Fair' | 'Poor';
  weightTrend: WeightDataPoint[];
  weeklyOutputPercent: number;
  aiInsight: {
    headline: string;
    details: string;
    recommendation: string;
    confidence: number;
  };
}
