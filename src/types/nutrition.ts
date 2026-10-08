export interface Meal {
  id: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | string;
  name: string;
  description: string;
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fats: number;    // in grams
  imageUrl?: string;
  ingredients?: string[];
}

export interface NutritionPlan {
  id?: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  consumedCalories?: number;
  consumedProtein?: number;
  consumedCarbs?: number;
  consumedFats?: number;
  hydrationLiters: number;
  hydrationTargetLiters: number;
  meals: Meal[];
}
