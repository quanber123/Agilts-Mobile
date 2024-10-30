import React from 'react';
import { Stack } from 'expo-router';

export default function ProductDetailsScreen() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ef4444' },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen
        name='index'
        options={{ headerShown: true, title: 'Sản phẩm chi tiết' }}
      />
    </Stack>
  );
}
