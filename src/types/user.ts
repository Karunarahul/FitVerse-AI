export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other / Prefer not to say' | string;
  heightCm: number;
  weightKg: number;
  activityLevel: 'Sedentary' | 'Active' | 'Athlete' | 'Elite' | string;
  primaryGoal: 'Burn' | 'Build' | 'Endure' | 'Maintain' | string;
  environment: 'Home Gym' | 'Commercial Facility' | 'Outdoor' | string;
  equipment: string[];
  workoutDuration: number; // in minutes (15, 45, 60, 120)
  nutritionStyle: 'Omnivore' | 'Keto' | 'Paleo' | 'Vegan' | 'Vegetarian' | 'Pescatarian' | string;
  restrictions: string[];
  premium: boolean;
  streakDays: number;
  joinedDate: string;
  avatarUrl?: string;
  currentPhase?: string;
  lastWorkoutCompletedAt?: string;
}

export interface BodyMetrics {
  heightCm: number;
  weightKg: number;
  age: number;
  gender: string;
  activityLevel: string;
  bmi: number;
  bmr: number;
  hydrationTargetL: number;
  bodyFatPercentage?: number;
  muscleMassKg?: number;
}
