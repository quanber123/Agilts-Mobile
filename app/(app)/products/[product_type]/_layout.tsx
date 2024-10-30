import React, { useMemo } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { productsType } from '@/config/products_type';

export default function ProductTypeScreen() {
  const { product_type } = useLocalSearchParams();
  const curType = useMemo(() => {
    return productsType?.find((t) => t.key === product_type);
  }, [product_type]);
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
          title: curType ? curType?.value : 'Sản phẩm',
        }}
      />
      <Stack.Screen name='[product_type]' options={{ headerShown: false }} />
    </Stack>
  );
}