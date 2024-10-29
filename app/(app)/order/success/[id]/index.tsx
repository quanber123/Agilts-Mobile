import { View, Text, Pressable, Linking } from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Href, router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useGetOrderDetailsQuery,
  useGetOrderMotorcycleDetailsQuery,
} from '@/services/redux/query/appQuery';
import NotFoundScreen from '@/app/+not-found';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingApp from '@/components/ui/LoadingApp';
import AntDesign from '@expo/vector-icons/AntDesign';
import { AlterContext } from '@/contexts/AlterProvider';

export default function SuccessScreen() {
  const { id } = useLocalSearchParams();
  const [curType, setCurType] = useState<string | null>(null);
  const { setAlertModal, setIsAlertModal, setMessages } =
    useContext(AlterContext);
  useEffect(() => {
    const fetchCurType = async () => {
      const type = await AsyncStorage.getItem('cur_order');
      setCurType(type);
    };

    fetchCurType();
  }, []);
  const {
    data: orderMotorData,
    isSuccess: isSuccessOrderMotor,
    isFetching: isLoadingOrderMotor,
    isError: isErrorOrderMotor,
  } = useGetOrderMotorcycleDetailsQuery(id, {
    skip: curType !== 'motor-cycle',
  });
  const {
    data: orderData,
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
  useEffect(() => {
    if (
      isSuccessOrder &&
      orderData?.status_preview === 'Chờ thanh toán' &&
      orderData?.payment_checkout_url !== '' &&
      orderData?.payment_checkout_url !== null &&
      orderData?.payment_method_preview === 'Chuyển khoản ngân hàng'
    ) {
      Linking.openURL(orderData?.payment_checkout_url).catch(() => {
        setAlertModal('error');
        setIsAlertModal(true);
        setMessages(
          'Lỗi khi mở đường dẫn. Hãy truy cập vào đơn chi tiết và thử lại sau!'
        );
      });
    }
    if (
      isSuccessOrderMotor &&
      orderMotorData?.status_preview === 'Chờ thanh toán' &&
      orderMotorData?.payment_checkout_url !== '' &&
      orderMotorData?.payment_checkout_url !== null &&
      orderMotorData?.payment_method_preview === 'Chuyển khoản ngân hàng'
    ) {
      Linking.openURL(orderMotorData?.payment_checkout_url).catch(() => {
        setAlertModal('error');
        setIsAlertModal(true);
        setMessages(
          'Lỗi khi mở đường dẫn. Hãy truy cập vào đơn chi tiết và thử lại sau!'
        );
      });
    }
  }, [isSuccessOrder, orderData, isSuccessOrderMotor, orderMotorData]);
  if (isLoadingOrder || isLoadingOrderMotor) return <LoadingApp />;
  return isSuccessOrder ||
    (isSuccessOrderMotor && !isErrorOrder && !isErrorOrderMotor) ? (
    <SafeAreaView className='flex-1 justify-center items-center gap-y-6'>
      <AntDesign name='checkcircle' size={48} color='#ef4444' />
      <Text className='uppercase text-lg tracking-[1px] text-neutral-800'>
        Agilts cảm ơn bạn đã đặt hàng!
      </Text>
      <Text className='text-neutral-800'>
        Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể.
      </Text>
      <View className='bg-red-500 px-4 py-6 justify-center items-center'>
        <Text className='text-white'>
          Đơn hàng{' '}
          {curType === 'motor-cycle' ? orderMotorData?.id : orderData?.id} đã
          được đặt vào{' '}
          {curType === 'motor-cycle'
            ? orderMotorData?.created_at
            : orderData?.created_at}
        </Text>
        <View className='my-2 flex-row justify-center items-center gap-x-4'>
          <Pressable
            className='bg-white px-4 py-2'
            onPress={() =>
              router.push(
                `/user/order/${curType === 'motor-cycle' ? 'motor-cycle' : 'item'}/${curType === 'motor-cycle' ? orderMotorData?.id : orderData?.id}` as Href<string>
              )
            }
          >
            <Text>Xem chi tiết</Text>
          </Pressable>
          <Pressable className='bg-neutral-800 px-4 py-2'>
            <Text className='text-white' onPress={handleBack}>
              Về trang chủ
            </Text>
          </Pressable>
        </View>
      </View>
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
