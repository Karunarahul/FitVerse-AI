import React from 'react';
import { Stack } from 'expo-router';

export default function WorkoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#200F0D' },
      }}
    >
      <Stack.Screen name="live" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
