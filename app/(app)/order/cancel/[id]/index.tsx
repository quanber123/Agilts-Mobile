import { View, Text, Pressable } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useGetOrderDetailsQuery,
  useGetOrderMotorcycleDetailsQuery,
} from '@/services/redux/query/appQuery';
import NotFoundScreen from '@/app/+not-found';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingApp from '@/components/ui/LoadingApp';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function CancelScreen() {
  const { id } = useLocalSearchParams();
  const [curType, setCurType] = useState<string | null>(null);
  useEffect(() => {
    const fetchCurType = async () => {
      const type = await AsyncStorage.getItem('cur_order');
      setCurType(type);
    };

    fetchCurType();
  }, []);
  const {
    isSuccess: isSuccessOrderMotor,
    isFetching: isLoadingOrderMotor,
    isError: isErrorOrderMotor,
  } = useGetOrderMotorcycleDetailsQuery(id, {
    skip: curType !== 'motor-cycle',
  });
  const {
    isSuccess: isSuccessOrder,
    isFetching: isLoadingOrder,
    isError: isErrorOrder,
  } = useGetOrderDetailsQuery(id, {
    skip: curType !== 'item',
  });
  if (
    (isErrorOrderMotor || isErrorOrder) &&
    !isLoadingOrder &&
    !isLoadingOrderMotor
  )
    return <NotFoundScreen />;
  const handleBack = useCallback(async () => {
    await AsyncStorage.removeItem('cur_order');
    router.push('/');
  }, [router]);
  if (isLoadingOrder || isLoadingOrderMotor) return <LoadingApp />;
  return isSuccessOrder ||
    (isSuccessOrderMotor && !isErrorOrder && !isErrorOrderMotor) ? (
    <SafeAreaView className='flex-1 justify-center items-center gap-y-6'>
      <FontAwesome6 name='xmark-circle' size={48} color='#ef4444' />
      <Text className='text-center uppercase text-lg tracking-[1px] text-neutral-800'>
        Hủy Đơn Hàng Thành Công
      </Text>
      <Text className='text-center text-neutral-800'>
        Đơn hàng của bạn đã được hủy thành công. Nếu bạn có bất kỳ câu hỏi hoặc
        yêu cầu hỗ trợ nào, vui lòng liên hệ với đội ngũ chăm sóc khách hàng.
        Cảm ơn bạn đã ghé thăm và hy vọng sẽ được phục vụ bạn trong tương lai.
      </Text>
      <Pressable className='w-[120px] bg-neutral-800 px-4 py-2'>
        <Text className='text-white' onPress={handleBack}>
          Về trang chủ
        </Text>
      </Pressable>
    </SafeAreaView>
  ) : (
    <SafeAreaView className='flex-1 justify-center items-center px-4'>
      <Text className='text-6xl font-bold text-center'>404</Text>
      <Text className='text-lg font-bold text-center'>
        OOPS! Không tìm thấy đơn hàng đã đặt của bạn!
      </Text>
      <View className='flex-row items-center'>
        <Text>Đơn bạn đang tìm kiếm có thể đã bị xóa.</Text>
        <Pressable onPress={handleBack}>
          <Text className='font-semibold text-red-500'>Về trang chủ</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
