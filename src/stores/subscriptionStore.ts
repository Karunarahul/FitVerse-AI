import { create } from 'zustand';
import { storage } from '../services/storage';

interface SubscriptionState {
  isPremium: boolean;
  selectedPlan: 'monthly' | 'yearly';
  tierName: string;
  expiresAt: string | null;
  setSelectedPlan: (plan: 'monthly' | 'yearly') => void;
  upgradeToPremium: (plan?: 'monthly' | 'yearly') => Promise<void>;
  cancelSubscription: () => Promise<void>;
  loadSubscription: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  isPremium: true,
  selectedPlan: 'yearly',
  tierName: 'Elite Tier Member',
  expiresAt: '2027-01-01',

  setSelectedPlan: (selectedPlan) => set({ selectedPlan }),

  upgradeToPremium: async (plan) => {
    const chosen = plan || get().selectedPlan;
    const updated = {
      isPremium: true,
      selectedPlan: chosen,
      tierName: 'Elite Tier Member',
      expiresAt: chosen === 'yearly' ? '2027-10-01' : '2026-11-01',
    };
    set(updated);
    await storage.setItem(storage.KEYS.SUBSCRIPTION, updated);
  },

  cancelSubscription: async () => {
    const updated = {
      isPremium: false,
      selectedPlan: 'monthly' as const,
      tierName: 'Free Tier',
      expiresAt: null,
    };
    set(updated);
    await storage.setItem(storage.KEYS.SUBSCRIPTION, updated);
  },

  loadSubscription: async () => {
    const saved = await storage.getItem<any>(storage.KEYS.SUBSCRIPTION);
    if (saved) {
      set(saved);
    }
  },
}));
