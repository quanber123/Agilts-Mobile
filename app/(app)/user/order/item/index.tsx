import { View, Text, SafeAreaView, Pressable, ScrollView } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useGetOrdersQuery } from '@/services/redux/query/appQuery';
import { Order } from '@/types/types';
import ListItem from '@/components/ui/ListItem';
import CustomImage from '@/components/ui/CustomImage';
import { statusOrder } from '@/config/status_order';
import StatusOrder from '../status-order';
import { router } from 'expo-router';

export default function UserOrderItemScreen() {
  const [curPage, setCurPage] = useState(1);
  const [curStatus, setCurStatus] = useState('');
  const [orders, setOrders] = useState<Order[] | []>([]);
  const [hasMore, setHasMore] = useState(true);
  const handleChangeStatus = useCallback((s: string) => {
    setCurStatus(s);
  }, []);
  const { data, isFetching, isSuccess } = useGetOrdersQuery(
    `page=${curPage}&${curStatus && `status=${curStatus}`}`
  );
  const loadMore = useCallback(() => {
    if (hasMore && !isFetching && isSuccess) {
      setCurPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isFetching, isSuccess]);

  useEffect(() => {
    if (!isFetching && isSuccess && data) {
      setOrders((prevOrders) =>
        curPage === 1 ? data.data : [...prevOrders, ...data.data]
      );
      setHasMore(curPage < data.total_pages);
    }
  }, [isFetching, isSuccess, data]);
  return (
    <SafeAreaView className='flex-1 bg-white p-2'>
      <View className='pb-6'>
        <StatusOrder
          status={curStatus}
          handleChangeStatus={handleChangeStatus}
        />
      </View>
      {orders?.length > 0 ? (
        <ScrollView>
          <ListItem
            customClass='bg-white flex-1'
            contentContainerStyle={40}
            data={orders}
            renderItem={({ item }: { item: Order; index: number }) => (
              <View className='w-full border-b border-neutral-300 pb-4'>
                {item?.options?.map((o) => {
                  const s = statusOrder?.find((status) =>
                    status.includesValue.includes(item?.status_preview)
                  );
                  return (
                    <View key={o?.id} className='gap-2'>
                      <View className='justify-between items-center flex-row'>
                        <Text className='font-bold'>
                          {item?.payment_method_preview}
                        </Text>
                        <Text
                          style={{ borderColor: s?.color, color: s?.color }}
                          className={`border rounded-2xl text-xs px-2`}
                        >
                          {s?.name}
                        </Text>
                      </View>
                      <View className='flex-row justify-between items-start'>
                        <View>
                          <CustomImage
                            width={120}
                            height={90}
                            src={o?.option?.images_preview?.[0]?.url}
                            alt={o?.option?.images_preview?.[0]?.alt}
                          />
                        </View>
                        <View className='ml-4 flex-1'>
                          <View className='flex-row justify-between items-center'>
                            <Text className='font-medium' numberOfLines={1}>
                              {o?.option?.product?.name}
                            </Text>
                          </View>
                          {o?.option?.version && (
                            <Text className='text-xs text-neutral-500'>
                              Phiên bản: {o?.option?.version}
                            </Text>
                          )}
                          {o?.option?.color && (
                            <Text className='text-xs text-neutral-500'>
                              Màu sắc: {o?.option?.color}
                            </Text>
                          )}
                          {o?.option?.volume && (
                            <Text className='text-xs text-neutral-500'>
                              Thể tích: {o?.option?.volume}
                            </Text>
                          )}
                          {o?.option?.weight && (
                            <Text className='text-xs text-neutral-500'>
                              Cân nặng: {o?.option?.weight}
                            </Text>
                          )}
                          {o?.option?.length && (
                            <Text className='text-xs text-neutral-500'>
                              Chiều dài: {o?.option?.length}
                            </Text>
                          )}
                          {o?.option?.width && (
                            <Text className='text-xs text-neutral-500'>
                              Chiều rộng: {o?.option?.width}
                            </Text>
                          )}
                          {o?.option?.height && (
                            <Text className='text-xs text-neutral-500'>
                              Chiều cao: {o?.option?.height}
                            </Text>
                          )}
                          <View className='w-full'>
                            <Text className='text-right'>
                              Tổng tiền: {item?.total_preview?.preview}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View className='flex-row justify-end'>
                        <Pressable
                          onPress={() =>
                            router.push(`/user/order/item/${item?.id}`)
                          }
                        >
                          <Text className='text-blue-500 font-bold'>
                            Xem chi tiết
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            isPaginate
            isLoading={isFetching}
          />
        </ScrollView>
      ) : (
        <View className='flex-1 justify-center items-center'>
          <Text className='text-xl font-bold'>Hiện chưa có đơn hàng!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
