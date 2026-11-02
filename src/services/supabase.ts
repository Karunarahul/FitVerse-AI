import { createClient, Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

// Supabase Public configuration from environment
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured: boolean =
  Boolean(SUPABASE_URL) &&
  Boolean(SUPABASE_ANON_KEY) &&
  !SUPABASE_URL.includes('fitverse-ai-demo.supabase.co');

// Initialize real Supabase client with AsyncStorage session persistence
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder_anon_key',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export const supabaseService = {
  /**
   * Register a new user with real Supabase Auth
   */
  async signUp(email: string, pass: string, name: string): Promise<{ user: User | null; session: Session | null }> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: pass,
      options: {
        data: { name: name.trim() },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      // Upsert profile for the newly registered user using their verified Supabase UUID
      const { error: profileError } = await supabase.from('user_profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        name: name.trim() || 'Athlete',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.warn('[Supabase] Profile creation warning:', profileError.message);
      }
    }

    return { user: data.user, session: data.session };
  },

  /**
   * Real Supabase email/password login
   */
  async signIn(email: string, pass: string): Promise<{ user: User; session: Session }> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: pass,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error('Authentication succeeded but no session was returned.');
    }

    return { user: data.user, session: data.session };
  },

  /**
   * Log out session from Supabase
   */
  async signOut(): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('[Supabase] SignOut error:', error.message);
    }
  },

  /**
   * Send password reset email via Supabase
   */
  async resetPassword(email: string): Promise<{ success: boolean; message?: string }> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Cannot send password reset email.');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: 'Password reset link sent to your email.' };
  },

  /**
   * Validates and returns current active session from Supabase Auth
   */
  async getValidSession(): Promise<Session | null> {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      return null;
    }

    // Verify token expiration
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (data.session.expires_at && data.session.expires_at <= nowSeconds) {
      // Attempt refresh
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError || !refreshData.session) {
        return null;
      }
      return refreshData.session;
    }

    return data.session;
  },

  /**
   * Fetch authenticated user's profile from public.user_profiles
   */
  async fetchProfile(userId: string): Promise<Partial<UserProfile> | null> {
    if (!isSupabaseConfigured || !userId) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[Supabase] Fetch profile error:', error.message);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name || 'Athlete',
      email: data.email,
      age: data.age || 25,
      gender: data.gender || 'Prefer not to say',
      heightCm: data.height_cm ? Number(data.height_cm) : 178,
      weightKg: data.current_weight_kg ? Number(data.current_weight_kg) : 74.5,
      primaryGoal: data.primary_goal || 'Build',
      environment: data.environment || 'Commercial Facility',
      equipment: data.available_equipment || ['Barbell', 'Dumbbells', 'Cables'],
      workoutDuration: data.workout_duration || 45,
      nutritionStyle: data.nutrition_style || 'Omnivore',
      restrictions: data.dietary_restrictions || [],
      premium: Boolean(data.is_premium),
      streakDays: data.streak_days || 0,
      joinedDate: data.created_at,
    };
  },

  /**
   * Upsert authenticated user's profile
   */
  async saveProfile(profile: UserProfile): Promise<void> {
    if (!isSupabaseConfigured || !profile.id) return;

    const { error } = await supabase.from('user_profiles').upsert({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      age: profile.age,
      gender: profile.gender,
      height_cm: profile.heightCm,
      current_weight_kg: profile.weightKg,
      target_weight_kg: (profile as any).targetWeightKg || null,
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

    if (error) {
      console.error('[Supabase] Save profile error:', error.message);
      throw new Error(`Failed to save profile: ${error.message}`);
    }
  },

  /**
   * Log time-series biometric metric entry in public.body_metrics
   */
  async logBodyMetrics(metrics: {
    weight_kg: number;
    body_fat_percentage?: number;
    muscle_mass_kg?: number;
  }): Promise<void> {
    if (!isSupabaseConfigured) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return;

    const { error } = await supabase.from('body_metrics').insert({
      user_id: userId,
      weight_kg: metrics.weight_kg,
      body_fat_percentage: metrics.body_fat_percentage || 18,
      muscle_mass_kg: metrics.muscle_mass_kg || 62,
      recorded_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('[Supabase] Log body_metrics error:', error.message);
    }
  },
};
