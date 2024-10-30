import React from 'react';
import { Stack } from 'expo-router';

export default function OrderScreen() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ef4444' },
        headerTintColor: 'white',
        headerShown: false,
      }}
    >
      <Stack.Screen name='[id]' options={{ headerShown: false }} />
    </Stack>
  );
}
