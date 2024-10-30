import { View, Text, SafeAreaView, ScrollView, Pressable } from 'react-native';
import React, { useContext, useEffect, useMemo } from 'react';
import {
  useCancelOrderMutation,
  useGetOrderDetailsQuery,
} from '@/services/redux/query/appQuery';
import { useLocalSearchParams } from 'expo-router';
import LoadingApp from '@/components/ui/LoadingApp';
import { statusOrder } from '@/config/status_order';
import ListItem from '@/components/ui/ListItem';
import { Order } from '@/types/types';
import CustomImage from '@/components/ui/CustomImage';
import { AlterContext } from '@/contexts/AlterProvider';

export default function OrderDetails() {
  const { id } = useLocalSearchParams();
  const { setAlertModal, setIsAlertModal, setMessages } =
    useContext(AlterContext);
  const {
    data,
    isSuccess,
    isFetching: isLoading,
  } = useGetOrderDetailsQuery(id);
  const [
    cancelOrder,
    {
      isLoading: isLoadingCancel,
      isSuccess: isSuccessCancel,
      isError: isErrorCancel,
      error: errorCancel,
    },
  ] = useCancelOrderMutation();
  const curStatus = useMemo(() => {
    return (
      isSuccess &&
      data &&
      statusOrder?.find((o) => o.includesValue.includes(data?.status_preview))
    );
  }, [isSuccess, data]);
  useEffect(() => {
    if (isSuccessCancel) {
      setAlertModal('success');
      setIsAlertModal(true);
      setMessages('Hủy đơn hàng thành công!');
    }
    if (isErrorCancel && errorCancel) {
      setAlertModal('error');
      setIsAlertModal(true);
      setMessages((errorCancel as any)?.data?.message);
    }
  }, [isSuccessCancel, isErrorCancel, errorCancel]);
  if (isLoading || isLoadingCancel) return <LoadingApp />;
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
          <ListItem
            contentContainerStyle={40}
            data={(data as Order)?.options}
            renderItem={({ item }: { item: Order }) => {
              return (
                <View className='flex-row justify-between items-start'>
                  <View>
                    <CustomImage
                      width={120}
                      height={90}
                      src={item?.option?.images_preview?.[0]?.url}
                      alt={item?.option?.images_preview?.[0]?.alt}
                    />
                  </View>
                  <View className='ml-4 flex-1'>
                    <View className='flex-row justify-between items-center'>
                      <Text className='font-medium' numberOfLines={1}>
                        {item?.option?.product?.name}
                      </Text>
                    </View>
                    {item?.option?.version && (
                      <Text className='text-xs text-neutral-500'>
                        Phiên bản: {item?.option?.version}
                      </Text>
                    )}
                    {item?.option?.color && (
                      <Text className='text-xs text-neutral-500'>
                        Màu sắc: {item?.option?.color}
                      </Text>
                    )}
                    {item?.option?.volume && (
                      <Text className='text-xs text-neutral-500'>
                        Thể tích: {item?.option?.volume}
                      </Text>
                    )}
                    {item?.option?.weight && (
                      <Text className='text-xs text-neutral-500'>
                        Cân nặng: {item?.option?.weight}
                      </Text>
                    )}
                    {item?.option?.length && (
                      <Text className='text-xs text-neutral-500'>
                        Chiều dài: {item?.option?.length}
                      </Text>
                    )}
                    {item?.option?.width && (
                      <Text className='text-xs text-neutral-500'>
                        Chiều rộng: {item?.option?.width}
                      </Text>
                    )}
                    {item?.option?.height && (
                      <Text className='text-xs text-neutral-500'>
                        Chiều cao: {item?.option?.height}
                      </Text>
                    )}
                    <View className='flex-row justify-between'>
                      <Text className='text-neutral-500'>x{item?.amount}</Text>
                      <Text className='text-right'>
                        {item?.option?.price_preview?.preview}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
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
      </ScrollView>
      <View className='py-4 flex-row items-center justify-end gap-x-4'>
        {data?.payment_checkout_url &&
          data?.status_preview === 'Chờ thanh toán' && (
            <Pressable
              disabled={isLoadingCancel}
              className='w-[45%] bg-neutral-800 border border-neutral-500 px-4 py-3'
            >
              <Text className='text-white font-bold text-center'>
                Thanh toán ngay
              </Text>
            </Pressable>
          )}
        {(data?.status_preview === 'Chờ thanh toán' ||
          data?.status_preview === 'Chờ vận chuyển' ||
          data?.status_preview === 'Chờ nhận hàng') && (
          <Pressable
            disabled={isLoadingCancel}
            className='w-[45%] border border-neutral-500 px-4 py-3'
            onPress={async () => await cancelOrder(data?.id)}
          >
            <Text className='font-bold text-center'>Hủy đơn hàng</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
