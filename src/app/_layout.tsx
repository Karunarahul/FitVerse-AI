import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { useWorkoutStore } from '../stores/workoutStore';
import { useNutritionStore } from '../stores/nutritionStore';
import { useAnalyticsStore } from '../stores/analyticsStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';

export default function RootLayout() {
  useEffect(() => {
    // Restore all persisted states upon app startup
    useAuthStore.getState().checkAuth();
    useUserStore.getState().loadProfile();
    useWorkoutStore.getState().loadPersistedPlan();
    useNutritionStore.getState().loadPersistedPlan();
    useAnalyticsStore.getState().loadPersistedStats();
    useSubscriptionStore.getState().loadSubscription();
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#200F0D' }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#200F0D' },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
          <Stack.Screen name="onboarding" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="(app)" options={{ animation: 'fade' }} />
          <Stack.Screen name="workout" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="nutrition" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="premium" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
