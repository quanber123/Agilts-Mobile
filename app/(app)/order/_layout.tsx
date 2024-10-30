import React from 'react';
import { Stack } from 'expo-router';
import { OptionMotorProvider } from './motor-cycle/OptionMotorProvider';
import { BranchProvider } from '@/contexts/BranchProvider';

export default function OrderScreen() {
  return (
    <BranchProvider>
      <OptionMotorProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#ef4444' },
            headerTintColor: 'white',
          }}
        >
          <Stack.Screen
            name='item/index'
            options={{ headerShown: false, title: 'Đặt hàng' }}
          />
          <Stack.Screen
            name='motor-cycle/index'
            options={{ headerShown: true, title: 'Đặt xe máy' }}
          />
          <Stack.Screen name='success' options={{ headerShown: false }} />
          <Stack.Screen name='cancel' options={{ headerShown: false }} />
        </Stack>
      </OptionMotorProvider>
    </BranchProvider>
  );
}
