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
      <Stack.Screen
        name='index'
        options={{
          headerShown: true,
          headerTitle: 'Thiết lập tài khoản',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name='information/index'
        options={{
          headerShown: true,
          title: 'Thông tin cá nhân',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name='password/index'
        options={{
          headerShown: true,
          title: 'Đổi mật khẩu',
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}
