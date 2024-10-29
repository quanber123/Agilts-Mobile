import React from 'react';
import { Stack } from 'expo-router';

export default function OrderScreen() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ef4444' },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen name='[id]/index' options={{ headerShown: false }} />
    </Stack>
  );
}
