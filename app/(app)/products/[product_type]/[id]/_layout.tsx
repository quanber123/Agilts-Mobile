import React from 'react';
import { Stack } from 'expo-router';

export default function ProductDetailsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ef4444' },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen name='index' options={{ headerShown: false }} />
    </Stack>
  );
}