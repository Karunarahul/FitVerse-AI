import { create } from 'zustand';

export interface OnboardingData {
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

interface OnboardingState {
  data: OnboardingData;
  setPersonalInfo: (info: { name: string; age: number; gender: string }) => void;
  setBodyMetrics: (metrics: { heightCm: number; weightKg: number; activityLevel: string }) => void;
  setWorkoutGoals: (goals: {
    primaryGoal: string;
    environment: string;
    equipment: string[];
    workoutDuration: number;
  }) => void;
  setNutrition: (nutrition: { nutritionStyle: string; restrictions: string[] }) => void;
  reset: () => void;
}

const defaultOnboarding: OnboardingData = {
  name: 'Alex',
  age: 25,
  gender: 'Male',
  heightCm: 178,
  weightKg: 74.5,
  activityLevel: 'Athlete',
  primaryGoal: 'Build',
  environment: 'Commercial Facility',
  equipment: ['Barbell', 'Dumbbells'],
  workoutDuration: 45,
  nutritionStyle: 'Omnivore',
  restrictions: ['Gluten Free'],
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  data: defaultOnboarding,

  setPersonalInfo: (info) =>
    set((state) => ({ data: { ...state.data, ...info } })),

  setBodyMetrics: (metrics) =>
    set((state) => ({ data: { ...state.data, ...metrics } })),

  setWorkoutGoals: (goals) =>
    set((state) => ({ data: { ...state.data, ...goals } })),

  setNutrition: (nutrition) =>
    set((state) => ({ data: { ...state.data, ...nutrition } })),

  reset: () => set({ data: defaultOnboarding }),
}));
