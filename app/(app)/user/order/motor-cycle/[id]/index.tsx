import { View, Text, SafeAreaView, ScrollView, Pressable } from 'react-native';
import React, { useMemo } from 'react';
import {
  useGetOrderDetailsQuery,
  useGetOrderMotorcycleDetailsQuery,
} from '@/services/redux/query/appQuery';
import { router, useLocalSearchParams } from 'expo-router';
import LoadingApp from '@/components/ui/LoadingApp';
import { statusOrder } from '@/config/status_order';
import ListItem from '@/components/ui/ListItem';
import { Order } from '@/types/types';
import CustomImage from '@/components/ui/CustomImage';

export default function OrderDetails() {
  const { id } = useLocalSearchParams();
  const {
    data,
    isSuccess,
    isFetching: isLoading,
  } = useGetOrderMotorcycleDetailsQuery(id);
  const curStatus = useMemo(() => {
    return (
      isSuccess &&
      data &&
      statusOrder?.find((o) => o.includesValue.includes(data?.status_preview))
    );
  }, [isSuccess, data]);
  if (isLoading) return <LoadingApp />;
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView className='gap-4'>
        <Text
          className='text-white px-4 py-2 text-base font-bold'
          style={{ backgroundColor: curStatus?.color }}
        >
          {curStatus?.name}
        </Text>
        <View className='px-2 pb-4 border-b border-neutral-300'>
          <Text className='font-bold mb-1'>
            Thông tin vận chuyển{' '}
            {data?.shipping_code ? `(${data?.shipping_code})` : ''}
          </Text>
          <Text>{data?.shipping_method_preview}</Text>
          <Text>Phí vận chuyển: {data?.shipping_fee_preview?.preview}</Text>
        </View>
        <View className='px-2 pb-4 border-b border-neutral-300'>
          <Text className='font-bold mb-1'>Địa chỉ nhận hàng</Text>
          <Text className='text-neutral-500'>
            {data?.address?.customer_name} |{' '}
            {data?.address?.customer_phone_number}
          </Text>
          <Text numberOfLines={1}>{data?.address?.address_preview}</Text>
        </View>
        <View className='px-2 pb-4 border-b border-neutral-300'>
          <Text className='font-bold mb-1'>Ghi chú</Text>
          <Text className='text-neutral-500'>
            {data?.note ? data?.note : 'Không có ghi chú'}
          </Text>
        </View>
        <View className='px-2 py-4 border-b border-neutral-300'>
          <View className='flex-row justify-between items-start'>
            <View>
              <CustomImage
                width={120}
                height={90}
                src={data?.option?.images_preview?.[0]?.url}
                alt={data?.option?.images_preview?.[0]?.alt}
              />
            </View>
            <View className='ml-4 flex-1'>
              <View className='flex-row justify-between items-center'>
                <Text className='font-medium' numberOfLines={1}>
                  {data?.option?.product?.name}
                </Text>
              </View>
              {data?.option?.version && (
                <Text className='text-xs text-neutral-500'>
                  Phiên bản: {data?.option?.version}
                </Text>
              )}
              {data?.option?.color && (
                <Text className='text-xs text-neutral-500'>
                  Màu sắc: {data?.option?.color}
                </Text>
              )}
              <View className='flex-row justify-between'>
                <Text className='text-neutral-500'>x{data?.amount}</Text>
                <Text className='text-right'>
                  {data?.option?.price_preview?.preview}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className='px-2 pb-4 border-b border-neutral-300'>
          <View className='flex-row justify-between items-center'>
            <Text className='font-bold'>Phí xử lý</Text>
            <Text>{data?.handling_fee_preview?.preview}</Text>
          </View>
          <View className='flex-row justify-between items-center'>
            <Text className='font-medium'>Phí hỗ trợ đăng ký xe</Text>
            <Text>
              {data?.motorcycle_registration_support_fee_preview?.preview}
            </Text>
          </View>
          <View className='flex-row justify-between items-center'>
            <Text className='font-medium'>Lệ phí trước bạ</Text>
            <Text>{data?.registration_fee_preview?.preview}</Text>
          </View>
          <View className='flex-row justify-between items-center'>
            <Text className='font-medium'>Lệ phí đăng ký biển số</Text>
            <Text>{data?.license_plate_registration_fee_preview?.preview}</Text>
          </View>
        </View>
        <View className='flex-row justify-end'>
          <Text className='text-lg font-bold'>
            Thành tiền: {data?.total_preview?.preview}
          </Text>
        </View>
        <View className='px-2 pb-4 border-b border-neutral-300'>
          <View className='flex-row justify-between items-center'>
            <Text className='font-bold'>Mã đơn hàng</Text>
            <Text>{data?.id}</Text>
          </View>
          <View className='flex-row justify-between items-center'>
            <Text className='font-medium'>Phương thức thanh toán</Text>
            <Text>{data?.payment_method_preview}</Text>
          </View>
        </View>
        <View className='flex-row justify-end p-2'>
          <Pressable
            onPress={() =>
              router.push(`/user/order/invoice/motor-cycle/${data?.id}`)
            }
          >
            <Text className='text-blue-500 font-bold'>Xem hóa đơn</Text>
          </Pressable>
        </View>
      </ScrollView>
      <View className='py-4 flex-row items-center justify-end gap-x-4'>
        {data?.payment_checkout_url &&
          data?.status_preview === 'Chờ thanh toán' && (
            <Pressable className='w-[45%] bg-neutral-800 border border-neutral-500 px-4 py-3'>
              <Text className='text-white font-bold text-center'>
                Thanh toán ngay
              </Text>
            </Pressable>
          )}
      </View>
    </SafeAreaView>
  );
}
