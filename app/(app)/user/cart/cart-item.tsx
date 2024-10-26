import { View, Text } from 'react-native';
import React, { useMemo } from 'react';
import Checkbox from 'expo-checkbox';
import CustomImage from '@/components/ui/CustomImage';
import { Cart } from '@/types/types';
type Props = {
  cart: Cart;
  selctedKeys: number[];
};
export default function CartItem({ cart, selctedKeys }: Props) {
  const ischeck = useMemo(() => {
    const valid = selctedKeys?.find((k) => k === cart?.id);
    if (valid) return true;
    return false;
  }, [selctedKeys]);
  return (
    <View className='my-2 flex-row justify-start items-start'>
      <Checkbox className='my-2' value={ischeck} />
      <View className='flex-row items-center'>
        <CustomImage
          width={120}
          height={80}
          src={cart?.option?.images_preview?.[0]?.url}
          alt={cart?.option?.images_preview?.[0]?.alt}
        />
        <View>
          <Text numberOfLines={1}>{cart?.option?.product?.name}</Text>
        </View>
      </View>
    </View>
  );
}
