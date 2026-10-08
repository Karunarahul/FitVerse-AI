import { WorkoutPlan } from './workout';
import { NutritionPlan, Meal } from './nutrition';

export interface PlanGenerationRequest {
  name: string;
  age: number;
  gender: string;
  heightCm: number;
  weightKg: number;
  activityLevel: string;
  primaryGoal: string;
  environment: string;
  equipment: string[];
  workoutDuration: number;
  nutritionStyle: string;
  restrictions: string[];
}

export interface PlanGenerationResponse {
  workoutPlan: WorkoutPlan;
  nutritionPlan: NutritionPlan;
  aiSynthesis: string;
}

export interface MealSwapRequest {
  currentMeal: Meal;
  nutritionStyle: string;
  restrictions: string[];
  primaryGoal: string;
}

export interface ProgressAnalysisResponse {
  insight: string;
  recommendation: string;
  confidence: number;
  adaptations: string[];
}

export interface PlanAdaptationResponse {
  message: string;
  volumeAdjustmentPercent: number;
  intensityAdjustmentPercent: number;
  rationale: string;
  updatedPlan: WorkoutPlan;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
}
