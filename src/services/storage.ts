import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_PROFILE: '@fitverse_user_profile',
  AUTH_TOKEN: '@fitverse_auth_token',
  WORKOUT_PLAN: '@fitverse_workout_plan',
  NUTRITION_PLAN: '@fitverse_nutrition_plan',
  USER_STATS: '@fitverse_user_stats',
  SUBSCRIPTION: '@fitverse_subscription',
  ONBOARDING_DONE: '@fitverse_onboarding_done',
  HYDRATION: '@fitverse_hydration',
};

export const storage = {
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const json = JSON.stringify(value);
      await AsyncStorage.setItem(key, json);
    } catch (e) {
      console.warn('Storage setItem failed:', key, e);
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const json = await AsyncStorage.getItem(key);
      return json != null ? (JSON.parse(json) as T) : null;
    } catch (e) {
      console.warn('Storage getItem failed:', key, e);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn('Storage removeItem failed:', key, e);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.warn('Storage clearAll failed:', e);
    }
  },

  KEYS,
};
