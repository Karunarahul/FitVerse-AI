import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { BottomNav } from '../../components/BottomNav';

export default function AppLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#200F0D' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="home" />
        <Stack.Screen name="plans" />
        <Stack.Screen name="stats" />
        <Stack.Screen name="profile" />
      </Stack>

      {/* Global Persistent Bottom Navigation */}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#200F0D',
  },
});
