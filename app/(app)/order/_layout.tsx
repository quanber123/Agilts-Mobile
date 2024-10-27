import React from 'react';
import { Tabs } from 'expo-router';
import { OptionMotorProvider } from './motor-cycle/OptionMotorProvider';

export default function ProductTypeLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#ef4444' },
        headerTintColor: 'white',
      }}
    >
      <Tabs.Screen name='item' options={{ headerShown: false }} />
      <OptionMotorProvider>
        <Tabs.Screen name='motor-cycle' options={{ headerShown: false }} />
      </OptionMotorProvider>
    </Tabs>
  );
}
