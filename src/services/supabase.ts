import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

// Environment variables configured for Supabase Public Client
// Exposed securely via Expo public envs (never service-role key)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://fitverse-ai-demo.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';

export const isSupabaseConfigured =
  Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const supabaseService = {
  /**
   * Register a new user with Email and Password
   */
  async signUp(email: string, pass: string, name: string) {
    if (!isSupabaseConfigured) {
      return { user: { id: `usr_${Date.now()}`, email, user_metadata: { name } }, session: { access_token: `token_${Date.now()}` }, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { name },
      },
    });

    if (error) throw error;

    if (data.user) {
      // Create initial user_profile record
      await supabase.from('user_profiles').upsert({
        id: data.user.id,
        email,
        name,
        created_at: new Date().toISOString(),
      });
    }

    return data;
  },

  /**
   * Log in an existing user with Email and Password
   */
  async signIn(email: string, pass: string) {
    if (!isSupabaseConfigured) {
      return { user: { id: `usr_${Date.now()}`, email }, session: { access_token: `token_${Date.now()}` }, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Log out current session
   */
  async signOut() {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Send password reset email
   */
  async resetPassword(email: string) {
    if (!isSupabaseConfigured) return { success: true };
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return { success: true };
  },

  /**
   * Fetch current authenticated user session
   */
  async getSession() {
    if (!isSupabaseConfigured) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  /**
   * Get user profile from public.user_profiles
   */
  async fetchProfile(userId: string): Promise<Partial<UserProfile> | null> {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      age: data.age,
      gender: data.gender,
      heightCm: data.height_cm,
      weightKg: data.current_weight_kg,
      primaryGoal: data.primary_goal,
      environment: data.environment,
      equipment: data.available_equipment,
      workoutDuration: data.workout_duration,
      nutritionStyle: data.nutrition_style,
      restrictions: data.dietary_restrictions,
      premium: data.is_premium,
      streakDays: data.streak_days,
      joinedDate: data.created_at,
    };
  },

  /**
   * Upsert user profile into public.user_profiles
   */
  async saveProfile(profile: UserProfile): Promise<void> {
    if (!isSupabaseConfigured) return;

    await supabase.from('user_profiles').upsert({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      age: profile.age,
      gender: profile.gender,
      height_cm: profile.heightCm,
      current_weight_kg: profile.weightKg,
      target_weight_kg: (profile as any).targetWeightKg,
      primary_goal: profile.primaryGoal,
      environment: profile.environment,
      available_equipment: profile.equipment,
      workout_duration: profile.workoutDuration,
      nutrition_style: profile.nutritionStyle,
      dietary_restrictions: profile.restrictions,
      is_premium: profile.premium,
      streak_days: profile.streakDays,
      updated_at: new Date().toISOString(),
    });
  },

  /**
   * Account Deletion
   */
  async deleteAccount(userId: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    await supabase.from('user_profiles').delete().eq('id', userId);
    await supabase.auth.signOut();
  },
};
