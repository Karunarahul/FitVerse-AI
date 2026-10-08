import { create } from 'zustand';
import { NutritionPlan } from '../types';
import { demoNutrition } from '../utils/demoData';
import { storage } from '../services/storage';
import { aiService } from '../services/ai';

interface NutritionState {
  currentPlan: NutritionPlan;
  swappingMealId: string | null;
  setPlan: (plan: NutritionPlan) => void;
  loadPersistedPlan: () => Promise<void>;
  swapMeal: (mealId: string, style?: string, restrictions?: string[], goal?: string) => Promise<void>;
  addHydration: (amountL: number) => void;
  logMealConsumed: (mealId: string) => void;
}

export const useNutritionStore = create<NutritionState>((set, get) => ({
  currentPlan: demoNutrition,
  swappingMealId: null,

  setPlan: (plan: NutritionPlan) => {
    set({ currentPlan: plan });
    storage.setItem(storage.KEYS.NUTRITION_PLAN, plan);
  },

  loadPersistedPlan: async () => {
    const saved = await storage.getItem<NutritionPlan>(storage.KEYS.NUTRITION_PLAN);
    if (saved) {
      set({ currentPlan: saved });
    }
  },

  swapMeal: async (mealId: string, style = 'Omnivore', restrictions = ['Gluten Free'], goal = 'Build') => {
    const plan = get().currentPlan;
    const targetMeal = plan.meals.find((m) => m.id === mealId);
    if (!targetMeal) return;

    set({ swappingMealId: mealId });
    try {
      const replacement = await aiService.swapMeal({
        currentMeal: targetMeal,
        nutritionStyle: style,
        restrictions,
        primaryGoal: goal,
      });

      const updatedMeals = plan.meals.map((m) => (m.id === mealId ? replacement : m));
      const updatedPlan: NutritionPlan = {
        ...plan,
        meals: updatedMeals,
      };

      set({ currentPlan: updatedPlan, swappingMealId: null });
      storage.setItem(storage.KEYS.NUTRITION_PLAN, updatedPlan);
    } catch (e) {
      console.warn('Swap meal failed:', e);
      set({ swappingMealId: null });
    }
  },

  addHydration: (amountL: number) => {
    const plan = get().currentPlan;
    const updatedHydration = parseFloat((plan.hydrationLiters + amountL).toFixed(2));
    const updatedPlan: NutritionPlan = {
      ...plan,
      hydrationLiters: updatedHydration,
    };
    set({ currentPlan: updatedPlan });
    storage.setItem(storage.KEYS.NUTRITION_PLAN, updatedPlan);
  },

  logMealConsumed: (mealId: string) => {
    const plan = get().currentPlan;
    const meal = plan.meals.find((m) => m.id === mealId);
    if (!meal) return;

    const updatedPlan: NutritionPlan = {
      ...plan,
      consumedCalories: (plan.consumedCalories || 0) + meal.calories,
      consumedProtein: (plan.consumedProtein || 0) + meal.protein,
      consumedCarbs: (plan.consumedCarbs || 0) + meal.carbs,
      consumedFats: (plan.consumedFats || 0) + meal.fats,
    };
    set({ currentPlan: updatedPlan });
    storage.setItem(storage.KEYS.NUTRITION_PLAN, updatedPlan);
  },
}));
