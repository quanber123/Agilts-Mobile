import { FlatList, Pressable, Text } from 'react-native';
import React, { useMemo } from 'react';
import { router } from 'expo-router';
import { productsType } from '@/config/products_type';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductsScreen() {
  const renderedProductsType = useMemo(() => {
    return (
      <FlatList
        data={productsType}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Pressable
            className='px-12 py-4 flex-row justify-start items-center gap-x-4 border-b border-neutral-300'
            onPress={() => router.push(`/products/${item.key}`)}
          >
            {item.icon}
            <Text className='text-neutral-800'>{item.value}</Text>
          </Pressable>
        )}
      />
    );
  }, []);
  return <SafeAreaView className='flex-1'>{renderedProductsType}</SafeAreaView>;
}
