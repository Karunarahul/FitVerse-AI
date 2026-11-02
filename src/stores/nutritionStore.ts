import { create } from 'zustand';
import { NutritionPlan, Meal } from '../types';
import { demoNutrition } from '../utils/demoData';
import { storage } from '../services/storage';
import { aiService } from '../services/ai';
import { nutritionDb, FoodLogEntry } from '../services/nutritionDb';
import { supabase } from '../services/supabase';

interface NutritionState {
  currentPlan: NutritionPlan;
  swappingMealId: string | null;
  setPlan: (plan: NutritionPlan) => void;
  loadPersistedPlan: () => Promise<void>;
  swapMeal: (mealId: string, style?: string, restrictions?: string[], goal?: string) => Promise<void>;
  addHydration: (amountL: number) => void;
  logMealConsumed: (mealId: string) => void;
  addLoggedFood: (entry: FoodLogEntry) => Promise<void>;
}

export const useNutritionStore = create<NutritionState>((set, get) => ({
  currentPlan: demoNutrition,
  swappingMealId: null,

  setPlan: (plan: NutritionPlan) => {
    set({ currentPlan: plan });
    storage.setItem(storage.KEYS.NUTRITION_PLAN, plan);
  },

  loadPersistedPlan: async () => {
    // 1. Load local cache
    const saved = await storage.getItem<NutritionPlan>(storage.KEYS.NUTRITION_PLAN);
    let plan = saved || demoNutrition;

    // 2. Sync today's confirmed water and food logs from Supabase
    try {
      const { data } = await supabase.auth.getSession();
      const userId = data?.session?.user?.id;
      if (userId) {
        const [waterTotal, confirmedLogs] = await Promise.all([
          nutritionDb.fetchTodayWaterTotal(userId),
          nutritionDb.fetchTodayFoodLogs(userId),
        ]);

        if (waterTotal > 0) {
          plan = { ...plan, hydrationLiters: waterTotal };
        }

        if (confirmedLogs.length > 0) {
          const syncedMeals: Meal[] = confirmedLogs.map((log) => ({
            id: log.id || `log_${Date.now()}`,
            type: (log.meal_type as any) || 'Lunch',
            name: log.food_name,
            description: `${log.serving_grams}g logged`,
            calories: Math.round(Number(log.calories)),
            protein: Number(log.protein),
            carbs: Number(log.carbs),
            fats: Number(log.fat),
            imageUrl: log.image_url || undefined,
          }));

          // Merge without duplicates
          const existingIds = new Set(plan.meals.map((m) => m.id));
          const uniqueNew = syncedMeals.filter((m) => !existingIds.has(m.id));
          if (uniqueNew.length > 0) {
            plan = { ...plan, meals: [...uniqueNew, ...plan.meals] };
          }
        }
      }
    } catch (e) {
      console.warn('[NutritionStore] Remote sync warning:', e);
    }

    set({ currentPlan: plan });
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

    // Persist to Supabase
    nutritionDb.saveWaterLog(amountL).catch(() => {});
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

  addLoggedFood: async (entry: FoodLogEntry) => {
    const plan = get().currentPlan;

    // 1. Persist to Supabase public.food_logs
    const saved = await nutritionDb.saveFoodLog(entry);

    // 2. Update local state
    const newMeal: Meal = {
      id: saved.id || `meal_${Date.now()}`,
      type: (entry.meal_type as any) || 'Lunch',
      name: entry.food_name,
      description: `${entry.serving_grams}g portion logged`,
      calories: Math.round(Number(entry.calories)),
      protein: Number(entry.protein),
      carbs: Number(entry.carbs),
      fats: Number(entry.fat),
      imageUrl: entry.image_url || undefined,
    };

    const updatedPlan: NutritionPlan = {
      ...plan,
      meals: [newMeal, ...plan.meals],
      calories: plan.calories + newMeal.calories,
      proteinGrams: plan.proteinGrams + newMeal.protein,
      carbsGrams: plan.carbsGrams + newMeal.carbs,
      fatsGrams: plan.fatsGrams + newMeal.fats,
    };

    set({ currentPlan: updatedPlan });
    storage.setItem(storage.KEYS.NUTRITION_PLAN, updatedPlan);
  },
}));
