import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { supabaseService, isSupabaseConfigured, supabase } from './supabase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  /**
   * Request permissions and retrieve device push token
   */
  async registerForPushNotifications(): Promise<string | null> {
    if (Platform.OS === 'web') return null;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync().catch(() => null);
      const token = tokenData?.data || null;

      if (token && isSupabaseConfigured) {
        const session = await supabaseService.getValidSession();
        if (session?.user?.id) {
          await supabase.from('push_subscriptions').upsert({
            user_id: session.user.id,
            device_token: token,
            platform: Platform.OS,
            remind_workouts: true,
            remind_meals: true,
            remind_water: true,
            daily_summary: true,
            updated_at: new Date().toISOString(),
          });
        }
      }

      return token;
    } catch (e) {
      console.warn('Failed to register push token:', e);
      return null;
    }
  },

  /**
   * Schedule daily recurring fitness and hydration reminders
   */
  async scheduleFitnessReminders() {
    if (Platform.OS === 'web') return;

    try {
      // Cancel previous scheduled reminders to avoid duplicates
      await Notifications.cancelAllScheduledNotificationsAsync();

      // 1. Morning Workout Priming (08:30 AM)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'FitVerse AI ⚡ Neural Primer',
          body: 'Your daily workout split is ready. Train today to maintain your active streak.',
          data: { screen: 'workout' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 8,
          minute: 30,
        },
      });

      // 2. Afternoon Hydration Check (02:00 PM)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Hydration Target 💧',
          body: 'Drink 500ml water to sustain optimal cellular volumization and recovery.',
          data: { screen: 'nutrition' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 14,
          minute: 0,
        },
      });

      // 3. Evening Protocol & Meal Review (08:00 PM)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'FitVerse AI • Protocol Review 📊',
          body: 'Review today’s protein and caloric intake with your AI Personal Coach.',
          data: { screen: 'coach' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 20,
          minute: 0,
        },
      });
    } catch (e) {
      console.warn('Could not schedule local notifications:', e);
    }
  },
};
