import { create } from 'zustand';
import { UserProfile, BodyMetrics } from '../types';
import { demoUser } from '../utils/demoData';
import { storage } from '../services/storage';
import { calculateBMI, calculateBMR, calculateHydrationTarget } from '../utils/calculations';

interface UserState {
  profile: UserProfile;
  isLoaded: boolean;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => Promise<void>;
  loadProfile: () => Promise<void>;
  getBodyMetrics: () => BodyMetrics;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: demoUser,
  isLoaded: false,

  setProfile: (profile: UserProfile) => {
    set({ profile });
    storage.setItem(storage.KEYS.USER_PROFILE, profile);
  },

  updateProfile: async (partial: Partial<UserProfile>) => {
    const updated = { ...get().profile, ...partial };
    set({ profile: updated });
    await storage.setItem(storage.KEYS.USER_PROFILE, updated);
  },

  loadProfile: async () => {
    const stored = await storage.getItem<UserProfile>(storage.KEYS.USER_PROFILE);
    if (stored) {
      set({ profile: stored, isLoaded: true });
    } else {
      set({ profile: demoUser, isLoaded: true });
    }
  },

  getBodyMetrics: () => {
    const p = get().profile;
    const { bmi } = calculateBMI(p.weightKg, p.heightCm);
    const bmr = calculateBMR(p.weightKg, p.heightCm, p.age, p.gender);
    const hydrationTargetL = calculateHydrationTarget(p.weightKg, p.activityLevel);

    return {
      heightCm: p.heightCm,
      weightKg: p.weightKg,
      age: p.age,
      gender: p.gender,
      activityLevel: p.activityLevel,
      bmi,
      bmr,
      hydrationTargetL,
      bodyFatPercentage: 18,
      muscleMassKg: 62,
    };
  },
}));
