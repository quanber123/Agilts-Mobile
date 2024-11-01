import React from 'react';
import { Stack } from 'expo-router';

export default function DeliveryScreen() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ef4444' },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          headerShown: true,
          title: 'Phương thức vận chuyển',
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}
