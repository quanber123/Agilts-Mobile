import { Text, Pressable } from 'react-native';
import React, { useContext } from 'react';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { UserContext } from '@/contexts/UserProvider';

export default function CartButton() {
  const { cart } = useContext(UserContext);
  return (
    <Pressable className='relative' onPress={() => router.push('/user/cart')}>
      <Feather name='shopping-cart' size={24} color='white' />
      {cart?.length > 0 && (
        <Text className='absolute -top-1/3 -right-2 bg-red-500 text-white border border-white w-5 h-5 rounded-full text-sm text-center'>
          {cart?.length}
        </Text>
      )}
    </Pressable>
  );
}
