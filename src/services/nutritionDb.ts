import { supabase, isSupabaseConfigured } from './supabase';

export interface FoodLogEntry {
  id?: string;
  user_id?: string;
  food_name: string;
  meal_type: string;
  serving_grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodium_mg?: number;
  calcium_mg?: number;
  iron_mg?: number;
  potassium_mg?: number;
  image_url?: string;
  ai_recognized?: boolean;
  logged_at?: string;
}

export const nutritionDb = {
  /**
   * Persist a food log directly to Supabase public.food_logs
   */
  async saveFoodLog(entry: FoodLogEntry): Promise<FoodLogEntry> {
    if (!isSupabaseConfigured) {
      console.warn('[NutritionDb] Supabase not configured: saving locally.');
      return { ...entry, id: `local_food_${Date.now()}` };
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) {
      throw new Error('User must be authenticated to log meals.');
    }

    const payload = {
      user_id: userId,
      food_name: entry.food_name,
      meal_type: entry.meal_type || 'Lunch',
      serving_grams: entry.serving_grams,
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fat: entry.fat,
      fiber: entry.fiber || 0,
      sodium_mg: entry.sodium_mg || 0,
      calcium_mg: entry.calcium_mg || 0,
      iron_mg: entry.iron_mg || 0,
      potassium_mg: entry.potassium_mg || 0,
      image_url: entry.image_url || null,
      ai_recognized: Boolean(entry.ai_recognized),
      logged_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('food_logs')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('[NutritionDb] Insert food_log error:', error.message);
      throw new Error(`Failed to save food log: ${error.message}`);
    }

    return data;
  },

  /**
   * Fetch today's confirmed food logs for the authenticated user
   */
  async fetchTodayFoodLogs(userId: string): Promise<FoodLogEntry[]> {
    if (!isSupabaseConfigured || !userId) return [];

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', todayStart.toISOString())
      .order('logged_at', { ascending: false });

    if (error) {
      console.warn('[NutritionDb] Fetch food_logs error:', error.message);
      return [];
    }

    return data || [];
  },

  /**
   * Persist a hydration log directly to Supabase public.water_logs
   */
  async saveWaterLog(amountLiters: number): Promise<void> {
    if (!isSupabaseConfigured) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return;

    const { error } = await supabase.from('water_logs').insert({
      user_id: userId,
      amount_liters: amountLiters,
      logged_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('[NutritionDb] Insert water_log error:', error.message);
    }
  },

  /**
   * Calculate today's confirmed water total from Supabase
   */
  async fetchTodayWaterTotal(userId: string): Promise<number> {
    if (!isSupabaseConfigured || !userId) return 0;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('water_logs')
      .select('amount_liters')
      .eq('user_id', userId)
      .gte('logged_at', todayStart.toISOString());

    if (error || !data) return 0;

    const sum = data.reduce((acc, row) => acc + (Number(row.amount_liters) || 0), 0);
    return parseFloat(sum.toFixed(2));
  },
};
