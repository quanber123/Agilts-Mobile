import { View, Text, SafeAreaView, Pressable } from 'react-native';
import React, { useContext, useMemo } from 'react';
import { UserContext } from '@/contexts/UserProvider';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';

export default function AddressScreen() {
  const router = useRouter();
  const { addresses } = useContext(UserContext);
  const renderedAddress = useMemo(() => {
    return addresses?.map((a) => {
      return (
        <Pressable
          className='p-4 border-b border-neutral-200 flex-col gap-2'
          key={a.id}
          onPress={() => router.push(`/user/update-address/${a.id}`)}
        >
          <Text className='font-bold'>{a?.customer_name}</Text>
          <Text>{a?.customer_phone_number}</Text>
          <Text className='text-neutral-600'>{a.address_preview}</Text>
          {a.default && (
            <Text className='w-[72px] px-1 border border-red-500 text-red-500 text-center text-sm'>
              Mặc định
            </Text>
          )}
        </Pressable>
      );
    });
  }, [addresses]);
  return (
    <SafeAreaView className='flex-1'>
      <Text className='font-medium px-4 py-2 text-lg'>Địa chỉ</Text>
      <View className='bg-white flex-col'>
        {renderedAddress.length === 0 && (
          <View className='py-4 border-b border-neutral-200'>
            <Text className='text-center text-lg'>
              Bạn chưa có địa chỉ nào.
            </Text>
          </View>
        )}
        {renderedAddress.length > 0 && (
          <View className='flex-col'>{renderedAddress}</View>
        )}
        <Pressable
          className='py-4 flex-row justify-center items-center gap-x-2'
          onPress={() => router.push('/user/add-address')}
        >
          <AntDesign name='pluscircleo' size={18} color='#ef4444' />
          <Text className='text-red-500 font-medium'>Thêm địa chỉ mới</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
