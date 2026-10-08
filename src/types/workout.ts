export interface Exercise {
  id: string;
  name: string;
  primaryMuscle: string;
  sets: number;
  reps: string;
  restSeconds: number;
  targetWeight?: number;
  completedSets: number;
  instructions?: string[];
  imageUrl?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  phase: string;
  durationMinutes: number;
  calories: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  targetMuscles: string[];
  aiPrediction: string;
  exercises: Exercise[];
  createdAt?: string;
  adaptationNote?: string;
}

export interface LiveWorkoutState {
  planId: string;
  exerciseIndex: number;
  currentSet: number;
  elapsedSeconds: number;
  isPaused: boolean;
  heartRate: number;
  caloriesBurned: number;
  completedExercises: string[];
}
