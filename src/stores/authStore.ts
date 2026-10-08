import { create } from 'zustand';
import { authService } from '../services/auth';
import { UserProfile } from '../types';
import { demoUser } from '../utils/demoData';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const { token, user } = await authService.getSession();
      const hasAuth = !!token;
      set({
        token,
        user: user || demoUser,
        isAuthenticated: hasAuth,
        isLoading: false,
      });
      return hasAuth;
    } catch {
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  },

  login: async (email: string, pass: string) => {
    set({ isLoading: true });
    try {
      const { token, user } = await authService.login(email, pass);
      set({ token, user, isAuthenticated: true, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  demoLogin: async () => {
    set({ isLoading: true });
    try {
      const { token, user } = await authService.login(demoUser.email, 'password123');
      set({ token, user, isAuthenticated: true, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  register: async (name: string, email: string) => {
    set({ isLoading: true });
    try {
      const { token, user } = await authService.register(name, email);
      set({ token, user, isAuthenticated: true, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
