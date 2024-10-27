import { View, Text, SafeAreaView } from 'react-native';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { UserContext } from '@/contexts/UserProvider';
import { FlatList, Pressable } from 'react-native-gesture-handler';
import CartItem from './cart-item';
import Toast from 'react-native-toast-message';
import Checkbox from 'expo-checkbox';
import { formatPrice } from '@/services/utils/format';

export default function CartScreen() {
  const { cart } = useContext(UserContext);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  const handleCheck = useCallback((id: number) => {
    setSelectedKeys((prevKeys) => {
      if (prevKeys.includes(id)) return prevKeys?.filter((k) => k !== id);
      return [...prevKeys, id];
    });
  }, []);
  const handleSelectedAll = useCallback(() => {
    setSelectedKeys((prevkeys) => {
      if (prevkeys?.length === cart?.length) {
        return [];
      }
      return cart?.map((c) => c.id);
    });
  }, [cart]);
  const totalPrice = useMemo(() => {
    return cart
      ?.filter((c) => selectedKeys.includes(c?.id))
      .reduce((acc, curValue) => {
        return acc + curValue?.amount * curValue?.option?.price_preview?.raw;
      }, 0);
  }, [cart, selectedKeys]);
  return (
    <SafeAreaView className='flex-1'>
      <Toast />
      <FlatList
        className='p-4'
        data={cart}
        renderItem={({ item }) => {
          return (
            <CartItem
              cart={item}
              selctedKeys={selectedKeys}
              handleCheck={handleCheck}
            />
          );
        }}
      />
      <View className='sticky bottom-0 bg-white w-full flex-row justify-between items-stretch'>
        <View className='flex-row items-center px-3 py-4'>
          <Checkbox
            value={cart?.length === selectedKeys?.length}
            onValueChange={() => handleSelectedAll()}
            color={
              cart?.length === selectedKeys?.length ? '#ef4444' : undefined
            }
          />
          <Text className='mx-2'>Tất cả</Text>
        </View>
        <View className='flex-row items-center gap-2'>
          <View className='flex-row items-center gap-1'>
            <Text>Tổng thanh toán:</Text>
            <Text className='text-base text-red-500'>
              {formatPrice(totalPrice || 0)}
            </Text>
          </View>
          <Pressable
            className={`px-3 py-4 ${
              selectedKeys?.length > 0 ? 'bg-red-500' : 'bg-neutral-500'
            } flex-row justify-center items-center`}
            disabled={selectedKeys?.length === 0}
          >
            <Text className={`text-white`}>
              Đặt hàng ({selectedKeys?.length})
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
