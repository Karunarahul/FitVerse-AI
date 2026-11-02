import { storage } from './storage';
import { supabaseService, isSupabaseConfigured } from './supabase';
import { UserProfile } from '../types';
import { demoUser } from '../utils/demoData';

// Explicit development-only demo mode check
export const isDevDemoAllowed = (): boolean => {
  return process.env.EXPO_PUBLIC_DEMO_MODE === 'true';
};

export const authService = {
  /**
   * Real Supabase authentication. Never fabricates tokens.
   */
  async login(email: string, pass: string): Promise<{ token: string; user: UserProfile }> {
    if (!isSupabaseConfigured) {
      if (isDevDemoAllowed()) {
        console.warn('[FitVerse Auth] Supabase not configured: using explicit dev demo credentials.');
        const token = `dev_demo_token_${Date.now()}`;
        const user: UserProfile = { ...demoUser, email: email || demoUser.email };
        await storage.setItem(storage.KEYS.AUTH_TOKEN, token);
        await storage.setItem(storage.KEYS.USER_PROFILE, user);
        return { token, user };
      }
      throw new Error('Supabase authentication is not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your environment.');
    }

    // Call real Supabase Auth. Any invalid password, missing user, etc. will throw real error!
    const { user: authUser, session } = await supabaseService.signIn(email, pass);

    // Fetch real profile from user_profiles table using authenticated user UUID
    const remoteProfile = await supabaseService.fetchProfile(authUser.id);

    const userProfile: UserProfile = {
      ...demoUser,
      id: authUser.id,
      email: authUser.email || email,
      ...(remoteProfile || {}),
    };

    await storage.setItem(storage.KEYS.AUTH_TOKEN, session.access_token);
    await storage.setItem(storage.KEYS.USER_PROFILE, userProfile);

    return { token: session.access_token, user: userProfile };
  },

  /**
   * Real Supabase registration. Never fabricates tokens.
   */
  async register(name: string, email: string, pass: string): Promise<{ token: string | null; user: UserProfile; emailConfirmationRequired: boolean }> {
    if (!isSupabaseConfigured) {
      if (isDevDemoAllowed()) {
        console.warn('[FitVerse Auth] Supabase not configured: using explicit dev demo registration.');
        const token = `dev_demo_token_${Date.now()}`;
        const user: UserProfile = { ...demoUser, id: `usr_${Date.now()}`, name, email };
        await storage.setItem(storage.KEYS.AUTH_TOKEN, token);
        await storage.setItem(storage.KEYS.USER_PROFILE, user);
        return { token, user, emailConfirmationRequired: false };
      }
      throw new Error('Supabase authentication is not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your environment.');
    }

    if (!pass || pass.length < 6) {
      throw new Error('Password must be at least 6 characters in length.');
    }

    const { user: authUser, session } = await supabaseService.signUp(email, pass, name);

    if (!authUser) {
      throw new Error('Failed to register user account with Supabase.');
    }

    const userProfile: UserProfile = {
      ...demoUser,
      id: authUser.id,
      name: name || 'Athlete',
      email: authUser.email || email,
    };

    const token = session?.access_token || null;
    const emailConfirmationRequired = !session;

    if (token) {
      await storage.setItem(storage.KEYS.AUTH_TOKEN, token);
      await storage.setItem(storage.KEYS.USER_PROFILE, userProfile);
    }

    return { token, user: userProfile, emailConfirmationRequired };
  },

  /**
   * Explicit development-only demo access
   */
  async loginAsDevDemo(): Promise<{ token: string; user: UserProfile }> {
    if (!isDevDemoAllowed()) {
      throw new Error('Demo mode is disabled in production environments. Please log in with valid credentials.');
    }

    const token = `dev_demo_token_${Date.now()}`;
    const user: UserProfile = { ...demoUser };
    await storage.setItem(storage.KEYS.AUTH_TOKEN, token);
    await storage.setItem(storage.KEYS.USER_PROFILE, user);
    return { token, user };
  },

  /**
   * Real Supabase session validation and restoration
   */
  async getSession(): Promise<{ token: string | null; user: UserProfile | null }> {
    if (isSupabaseConfigured) {
      const validSession = await supabaseService.getValidSession();
      if (validSession?.user) {
        const remoteProfile = await supabaseService.fetchProfile(validSession.user.id);
        const user: UserProfile = {
          ...demoUser,
          id: validSession.user.id,
          email: validSession.user.email || '',
          ...(remoteProfile || {}),
        };
        await storage.setItem(storage.KEYS.AUTH_TOKEN, validSession.access_token);
        await storage.setItem(storage.KEYS.USER_PROFILE, user);
        return { token: validSession.access_token, user };
      }

      // If Supabase session is invalid or expired, clear local storage
      await storage.removeItem(storage.KEYS.AUTH_TOKEN);
      return { token: null, user: null };
    }

    // If dev demo mode is explicitly enabled
    if (isDevDemoAllowed()) {
      const storedToken = await storage.getItem<string>(storage.KEYS.AUTH_TOKEN);
      const storedUser = await storage.getItem<UserProfile>(storage.KEYS.USER_PROFILE);
      if (storedToken && storedUser) {
        return { token: storedToken, user: storedUser };
      }
    }

    return { token: null, user: null };
  },

  /**
   * Log out current session
   */
  async logout(): Promise<void> {
    await supabaseService.signOut();
    await storage.removeItem(storage.KEYS.AUTH_TOKEN);
    await storage.removeItem(storage.KEYS.USER_PROFILE);
  },

  /**
   * Password reset request
   */
  async resetPassword(email: string): Promise<{ success: boolean; message?: string }> {
    return supabaseService.resetPassword(email);
  },
};
