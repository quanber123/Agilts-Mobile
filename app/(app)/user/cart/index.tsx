import { View, Text, SafeAreaView } from 'react-native';
import React, { useContext, useMemo, useState } from 'react';
import { UserContext } from '@/contexts/UserProvider';
import Checkbox from 'expo-checkbox';
import { FlatList } from 'react-native-gesture-handler';
import CustomImage from '@/components/ui/CustomImage';

export default function CartScreen() {
  const { cart } = useContext(UserContext);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  return (
    <SafeAreaView className='flex-1 p-4'>
      <FlatList
        data={cart}
        renderItem={({ item }) => {
          return (
            <View className='my-2 flex-row justify-start items-start'>
              <Checkbox className='my-2' />
              <View className='flex-row items-center'>
                <CustomImage
                  width={120}
                  height={80}
                  src={item?.option?.images_preview?.[0]?.url}
                  alt={item?.option?.images_preview?.[0]?.alt}
                />
                <View>
                  <Text numberOfLines={1}>{item?.option?.product?.name}</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
