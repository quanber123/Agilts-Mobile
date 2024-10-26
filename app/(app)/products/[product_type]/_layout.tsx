import React, { useMemo } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { productsType } from '@/config/products_type';

export default function ProductTypeLayout() {
  const { product_type } = useLocalSearchParams();
  const curType = useMemo(() => {
    return productsType.find((p) => p.key === product_type);
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
        options={{ headerShown: false, title: curType?.value }}
      />
      <Stack.Screen
        name='[id]'
        options={{ headerShown: true, title: 'Sản phẩm chi tiết' }}
      />
    </Stack>
  );
}
