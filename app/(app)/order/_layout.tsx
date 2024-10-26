import React from 'react';
import { Stack } from 'expo-router';
import { OptionMotorProvider } from './motor-cycle/OptionMotorProvider';

export default function ProductTypeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ef4444' },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen name='item' options={{ headerShown: false }} />
      <OptionMotorProvider>
        <Stack.Screen name='motor-cycle' options={{ headerShown: false }} />
      </OptionMotorProvider>
    </Stack>
  );
}
