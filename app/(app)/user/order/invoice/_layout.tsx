import React from 'react';
import { Stack } from 'expo-router';

export default function InvoiceScreen() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ef4444' },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen name='item' options={{ headerShown: false }} />
      <Stack.Screen name='motor-cycle' options={{ headerShown: false }} />
    </Stack>
  );
}
