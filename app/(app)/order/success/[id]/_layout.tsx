import React from 'react';
import { Stack } from 'expo-router';

export default function OrderDetailScreen() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ef4444' },
        headerTintColor: 'white',
        headerShown: false,
      }}
    >
      <Stack.Screen name='index' options={{ headerShown: false }} />
    </Stack>
  );
}
