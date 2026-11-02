import { create } from 'zustand';
import { authService, isDevDemoAllowed } from '../services/auth';
import { requestApi } from '../services/api';
import { UserProfile } from '../types';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, pass: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<{ emailConfirmationRequired: boolean }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  deleteAccount: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  authError: null,

  clearError: () => set({ authError: null }),

  checkAuth: async () => {
    try {
      const { token, user } = await authService.getSession();
      const hasAuth = Boolean(token && user);
      set({
        token,
        user: hasAuth ? user : null,
        isAuthenticated: hasAuth,
        isLoading: false,
        authError: null,
      });
      return hasAuth;
    } catch {
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  },

  login: async (email: string, pass: string) => {
    set({ isLoading: true, authError: null });
    try {
      const { token, user } = await authService.login(email, pass);
      set({ token, user, isAuthenticated: true, isLoading: false, authError: null });
    } catch (e: any) {
      set({ isLoading: false, authError: e.message || 'Authentication failed.' });
      throw e;
    }
  },

  demoLogin: async () => {
    set({ isLoading: true, authError: null });
    try {
      if (!isDevDemoAllowed()) {
        throw new Error('Demo mode is disabled. Please provide valid production credentials.');
      }
      const { token, user } = await authService.loginAsDevDemo();
      set({ token, user, isAuthenticated: true, isLoading: false, authError: null });
    } catch (e: any) {
      set({ isLoading: false, authError: e.message || 'Demo access unavailable.' });
      throw e;
    }
  },

  register: async (name: string, email: string, pass: string) => {
    set({ isLoading: true, authError: null });
    try {
      const { token, user, emailConfirmationRequired } = await authService.register(name, email, pass);
      const isAuthed = Boolean(token);
      set({
        token,
        user: isAuthed ? user : null,
        isAuthenticated: isAuthed,
        isLoading: false,
        authError: null,
      });
      return { emailConfirmationRequired };
    } catch (e: any) {
      set({ isLoading: false, authError: e.message || 'Registration failed.' });
      throw e;
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, authError: null });
    try {
      const res = await authService.resetPassword(email);
      set({ isLoading: false });
      return res;
    } catch (e: any) {
      set({ isLoading: false, authError: e.message || 'Password reset failed.' });
      throw e;
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true });
    try {
      // Secure server-side account deletion
      await requestApi('/api/user/account', {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('[FitVerse Auth] Remote account deletion warning:', err);
    } finally {
      await authService.logout();
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    await authService.logout();
    set({ token: null, user: null, isAuthenticated: false, authError: null });
  },
}));
