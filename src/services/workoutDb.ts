import { supabase, isSupabaseConfigured } from './supabase';

export interface WorkoutSessionPayload {
  id?: string;
  user_id?: string;
  plan_id?: string | null;
  name: string;
  duration_seconds: number;
  calories_burned: number;
  average_heart_rate?: number;
  max_heart_rate?: number;
  perceived_exertion_rpe?: number;
  completed_at?: string;
}

export interface WorkoutSetPayload {
  id?: string;
  session_id?: string;
  user_id?: string;
  exercise_name: string;
  set_number: number;
  weight_kg: number;
  reps_completed: number;
  rpe?: number;
  rest_seconds?: number;
  completed?: boolean;
}

export const workoutDb = {
  /**
   * Persist completed workout session to Supabase public.workout_sessions
   */
  async saveWorkoutSession(sessionData: WorkoutSessionPayload): Promise<string> {
    if (!isSupabaseConfigured) {
      console.warn('[WorkoutDb] Supabase not configured: session recorded locally.');
      return `local_session_${Date.now()}`;
    }

    const { data: authData } = await supabase.auth.getSession();
    const userId = authData?.session?.user?.id;

    if (!userId) {
      throw new Error('User must be authenticated to save workout sessions.');
    }

    const { data, error } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: userId,
        plan_id: sessionData.plan_id || null,
        name: sessionData.name || 'Strength Session',
        duration_seconds: sessionData.duration_seconds || 0,
        calories_burned: sessionData.calories_burned || 0,
        average_heart_rate: sessionData.average_heart_rate || 140,
        max_heart_rate: sessionData.max_heart_rate || 165,
        perceived_exertion_rpe: sessionData.perceived_exertion_rpe || 8,
        completed_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('[WorkoutDb] Save session error:', error.message);
      throw new Error(`Failed to persist workout session: ${error.message}`);
    }

    return data.id;
  },

  /**
   * Persist completed sets for progressive overload tracking in public.workout_sets
   */
  async saveWorkoutSets(sessionId: string, sets: WorkoutSetPayload[]): Promise<void> {
    if (!isSupabaseConfigured || !sets.length) return;

    const { data: authData } = await supabase.auth.getSession();
    const userId = authData?.session?.user?.id;
    if (!userId) return;

    const rows = sets.map((s) => ({
      session_id: sessionId,
      user_id: userId,
      exercise_name: s.exercise_name,
      set_number: s.set_number,
      weight_kg: s.weight_kg,
      reps_completed: s.reps_completed,
      rpe: s.rpe || 8,
      rest_seconds: s.rest_seconds || 90,
      completed: s.completed !== false,
      created_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('workout_sets').insert(rows);

    if (error) {
      console.warn('[WorkoutDb] Save workout sets error:', error.message);
    }
  },

  /**
   * Fetch historical workout sessions
   */
  async fetchWorkoutHistory(userId: string): Promise<WorkoutSessionPayload[]> {
    if (!isSupabaseConfigured || !userId) return [];

    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(30);

    if (error) {
      console.warn('[WorkoutDb] Fetch history error:', error.message);
      return [];
    }

    return data || [];
  },
};
