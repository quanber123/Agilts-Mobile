import React from 'react';
import { Stack } from 'expo-router';

export default function PaymentScreen() {
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
          title: 'Phương thức thanh toán',
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}
