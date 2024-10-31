import { View, Text, Pressable, Modal } from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
} from 'react';
import { Branch, Cart } from '@/types/types';
import { BranchContext } from '@/contexts/BranchProvider';
import {
  useCreateOrderMutation,
  usePostPriceQuoteMutation,
} from '@/services/redux/query/appQuery';
import { UserContext } from '@/contexts/UserProvider';
import { Href, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaymentContext } from '@/contexts/PaymentProvider';
import { AlterContext } from '@/contexts/AlterProvider';
import LoadingApp from '@/components/ui/LoadingApp';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import ListItem from '@/components/ui/ListItem';
import CustomImage from '@/components/ui/CustomImage';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import { DeliveryContext } from '@/contexts/DeliveryProvider';
import { formatPrice } from '@/services/utils/format';
import { CustomInput } from '@/components/ui/CustomInput';

export default function OrderItem() {
  const [isPending, startTransition] = useTransition();
  const { curDelivery } = useContext(DeliveryContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [note, setNote] = useState('');
  const { branches, loadMoreBranch, isLoadingBranch } =
    useContext(BranchContext);
  const { setAlertModal, setIsAlertModal, setMessages } =
    useContext(AlterContext);
  const { curPayment } = useContext(PaymentContext);
  const [options, setOptions] = useState<Cart[] | []>([]);
  const [branchOption, setBranchOption] = useState<Branch | null>(null);
  const [
    postPriceQuote,
    {
      data: priceQuoteData,
      isLoading: isLoadingPriceQuote,
      isSuccess: isSuccessPriceQuote,
      isError: isErrorPriceQuote,
      error: errorPriceQuote,
    },
  ] = usePostPriceQuoteMutation();
  const [
    createOrder,
    {
      data: orderData,
      isSuccess: isSuccessOrder,
      isLoading: isLoadingOrder,
      isError: isErrorOrder,
      error: errorOrder,
    },
  ] = useCreateOrderMutation();
  const { cart, defaultAddress, setPreviousRoute } = useContext(UserContext);
  const handleRedirect = useCallback(
    (prevRoute: Href<string>, nextRoute: Href<string>) => {
      setPreviousRoute(prevRoute);
      router.push(nextRoute);
    },
    [router, setPreviousRoute]
  );
  useEffect(() => {
    (async () => {
      const curItem = await AsyncStorage.getItem('order_now_item');
      if (curItem !== null) {
        const listId = JSON.parse(curItem);
        setOptions(
          cart?.filter((c) => listId?.includes?.(c?.option?.id)) || cart?.[0]
        );
      }
    })();
  }, [cart]);
  const handlePostPriceQuote = useCallback(async () => {
    if (options?.length > 0) {
      const bodyData = {
        options: options?.map((o) => {
          return {
            option_id: o?.option?.id,
            amount: o?.amount,
          };
        }),
        shipping_method: curDelivery?.id,
        address_id: defaultAddress?.id,
      };
      await postPriceQuote({ type: 'fee', body: bodyData });
    }
  }, [curDelivery, options, defaultAddress, postPriceQuote]);
  const handleCreateOrder = useCallback(async () => {
    if (options?.length > 0) {
      const bodyData: any = {
        options: options?.map((o) => {
          return {
            option_id: o?.option?.id,
            amount: o?.amount,
          };
        }),
        address_id: defaultAddress?.id,
        return_url: `Agilts-Mobile://order/success/{id}`,
        cancel_url: `Agilts-Mobile://order/cancel/{id}`,
        payment_method: curPayment?.id,
        shipping_method: curDelivery?.id,
        note: '',
      };
      if (curDelivery?.id === 0) {
        bodyData.branch_id = branchOption?.id;
      }
      await createOrder(bodyData);
    }
  }, [
    defaultAddress,
    curDelivery,
    options,
    curPayment,
    branchOption,
    createOrder,
  ]);
  useEffect(() => {
    if (isSuccessPriceQuote && priceQuoteData) {
      setAlertModal('success');
      setIsAlertModal(true);
      setMessages('Cập nhật báo giá thành công!');
    }
    if (isErrorPriceQuote && errorPriceQuote) {
      setAlertModal('error');
      setIsAlertModal(true);
      setMessages(
        (errorPriceQuote as any)?.data?.message || 'Cập nhật báo giá thất bại!'
      );
    }
  }, [isSuccessPriceQuote, priceQuoteData, isErrorPriceQuote, errorPriceQuote]);
  useEffect(() => {
    if (isSuccessOrder && orderData) {
      (async () => {
        await AsyncStorage.removeItem('order_now_item');
        await AsyncStorage.setItem('cur_order', 'item');
        router.push(`/order/success/${orderData?.id}`);
      })();
    }
    if (isErrorOrder && errorOrder) {
      setAlertModal('error');
      setIsAlertModal(true);
      setMessages((errorOrder as any)?.data?.message);
    }
  }, [isSuccessOrder, orderData, isErrorOrder, errorPriceQuote, router]);
  if (isPending || isLoadingPriceQuote) return <LoadingApp />;
  return (
    <SafeAreaView className='flex-1'>
      {options?.length > 0 ? (
        <View className='flex-1'>
          <ScrollView className='px-2 flex-col gap-y-6'>
            <Text className='font-bold text-red-500'>
              Lưu ý: Cập nhật báo giá trước khi đặt hàng.
            </Text>
            <View>
              <View>
                <View className='my-2 flex-row justify-between items-center gap-2'>
                  <Text className='font-bold text-lg'>
                    Thông tin người nhận
                  </Text>
                  {defaultAddress ? (
                    <Pressable
                      disabled={
                        isPending || isLoadingPriceQuote || isLoadingOrder
                      }
                      onPress={() =>
                        handleRedirect('/order/item', '/user/addresses')
                      }
                    >
                      <Text className='text-blue-500 font-medium'>
                        Thay đổi
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable>
                      disabled=
                      {isPending || isLoadingPriceQuote || isLoadingOrder}
                      <Text className='text-blue-500 font-medium'>
                        Thêm thông tin người nhận
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
              {defaultAddress ? (
                <View className='flex-col gap-y-1'>
                  <View className='flex-row gap-2'>
                    <Text className='font-semibold'>Người nhận:</Text>
                    <Text>{defaultAddress?.customer_name}</Text>
                  </View>
                  <View className='flex-row gap-2'>
                    <Text className='font-semibold'>Số điện thoại:</Text>
                    <Text>{defaultAddress?.customer_phone_number}</Text>
                  </View>
                  <View className='flex-row gap-2'>
                    <Text className='font-semibold'>Địa chỉ:</Text>
                    <Text numberOfLines={1}>
                      {defaultAddress?.address_preview}
                    </Text>
                  </View>
                </View>
              ) : (
                <View className='my-2'>
                  <Text className='font-bold text-center'>
                    Chưa có thông tin người nhận
                  </Text>
                </View>
              )}
            </View>
            <View className='my-2 gap-2'>
              <Text className='font-bold text-lg'>Ghi chú</Text>
              <CustomInput
                value={note}
                nativeID='note'
                onChangeText={(text) => setNote(text)}
                placeholder='Thêm ghi chú'
              />
            </View>
            <View>
              <View className='flex-row justify-between items-center p-2'>
                <Text className='text-lg font-bold'>Sản phẩm</Text>
                <Pressable
                  disabled={
                    isPending ||
                    isLoadingPriceQuote ||
                    isLoadingOrder ||
                    !defaultAddress
                  }
                  className='flex-row items-center justify-center bg-neutral-800 px-3 py-2 gap-x-2'
                  onPress={() =>
                    startTransition(() => {
                      handlePostPriceQuote();
                    })
                  }
                >
                  <Text className='text-white'>Báo giá</Text>
                  <Feather
                    className='mx-1'
                    name='refresh-ccw'
                    size={16}
                    color='white'
                  />
                </Pressable>
              </View>
              <View>
                <ListItem
                  customClass='flex-1'
                  data={options}
                  renderItem={({ item }: { item: Cart }) => {
                    return (
                      <View className='flex-1 my-2 flex-row items-start'>
                        <View className='w-[150px] h-[120px]'>
                          <CustomImage
                            width={120}
                            height={80}
                            src={
                              item?.option?.images_preview?.[0]?.url as string
                            }
                            alt={
                              item?.option?.images_preview?.[0]?.alt as string
                            }
                          />
                        </View>
                        <View className='flex-1'>
                          <Text numberOfLines={1}>{item?.option?.sku}</Text>
                          {item?.option?.type_preview && (
                            <Text className='text-xs text-neutral-500'>
                              Loại sản phẩm: {item?.option?.type_preview}
                            </Text>
                          )}
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
                          <View className='flex-1 flex-row justify-between'>
                            <Text className='text-sm'>
                              {item?.option?.price_preview?.preview}
                            </Text>
                            <Text className='text-neutral-600'>
                              x{item?.amount}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
            <View>
              <Pressable
                className='flex-row justify-between items-center pb-4'
                onPress={() => {
                  setPreviousRoute('/order/item');
                  router.push('/delivery');
                }}
                disabled={
                  isPending ||
                  isLoadingPriceQuote ||
                  isLoadingOrder ||
                  !defaultAddress
                }
              >
                <Text className='text-lg font-bold'>
                  Phương thức vận chuyển
                </Text>
                <View className='flex-row items-center gap-x-1'>
                  <Text className='text-neutral-500'>Xem tất cả</Text>
                  <Entypo name='chevron-right' size={18} color='black' />
                </View>
              </Pressable>
              {curDelivery && (
                <View className='flex-row items-center gap-2'>
                  {curDelivery?.icon}
                  <Text>{curDelivery?.name}</Text>
                </View>
              )}
            </View>

            {curDelivery?.id === 0 && (
              <View className='flex-col gap-2'>
                <Text className='text-lg font-bold'>Chi nhánh</Text>
                <Pressable
                  // disabled={isPending || isLoadingPriceQuote}
                  onPress={() => setModalVisible(true)}
                  className='border border-neutral-300 p-4'
                >
                  <Text className='text-neutral-800'>
                    {branchOption
                      ? branchOption?.address_preview
                      : 'Chọn chi nhánh'}
                  </Text>
                </Pressable>
                <Modal
                  visible={modalVisible}
                  animationType='fade'
                  transparent={true}
                  statusBarTranslucent={true}
                >
                  <SafeAreaView className='flex-1 bg-white'>
                    <Text className='text-lg font-bold p-2'>
                      Danh sách chi nhánh
                    </Text>
                    <ListItem
                      isLoading={isLoadingBranch}
                      isPaginate={true}
                      data={branches}
                      onEndReached={loadMoreBranch}
                      renderItem={({ item }: any) => {
                        return (
                          <Pressable
                            disabled={
                              isPending || isLoadingPriceQuote || isLoadingOrder
                            }
                            onPress={() => {
                              setBranchOption(item);
                              setModalVisible(false);
                            }}
                          >
                            <Text
                              className={`${
                                item?.id === branchOption?.id?.toString()
                                  ? 'text-red-500'
                                  : ''
                              } p-2 text-neutral-800 border-b border-neutral-300`}
                            >
                              {item?.address_preview}
                            </Text>
                          </Pressable>
                        );
                      }}
                    />
                  </SafeAreaView>
                </Modal>
              </View>
            )}
            <View>
              <Pressable
                className='flex-row justify-between items-center pb-4'
                onPress={() => {
                  setPreviousRoute('/order/item');
                  router.push('/payments');
                }}
                disabled={
                  isPending ||
                  isLoadingPriceQuote ||
                  isLoadingOrder ||
                  !defaultAddress
                }
              >
                <Text className='text-lg font-bold'>
                  Phương thức thanh toán
                </Text>
                <View className='flex-row items-center gap-x-1'>
                  <Text className='text-neutral-500'>Xem tất cả</Text>
                  <Entypo name='chevron-right' size={18} color='black' />
                </View>
              </Pressable>
              {curPayment && (
                <View className='flex-row items-center gap-2'>
                  {curPayment?.icon}
                  <Text>{curPayment?.name}</Text>
                </View>
              )}
            </View>
            <View className='flex-col gap-y-2'>
              <View className='flex-row justify-between items-center'>
                <Text className='font-medium'>Tổng tiền hàng</Text>
                <Text className='text-end font-bold'>
                  {priceQuoteData?.price_preview?.preview
                    ? priceQuoteData?.price_preview?.preview
                    : formatPrice(0)}
                </Text>
              </View>
              <View className='flex-row justify-between items-center'>
                <Text className='font-medium'>Phí xử lý</Text>
                <Text className='text-end font-bold'>
                  {priceQuoteData?.handling_fee_preview?.preview
                    ? priceQuoteData?.handling_fee_preview?.preview
                    : formatPrice(0)}
                </Text>
              </View>
              <View className='flex-row justify-between items-center'>
                <Text className='font-medium'>Phí vận chuyển</Text>
                <Text className='text-end font-bold'>
                  {priceQuoteData?.shipping_fee_preview?.preview
                    ? priceQuoteData?.shipping_fee_preview?.preview
                    : formatPrice(0)}
                </Text>
              </View>
              <View className='flex-row justify-between items-center'>
                <Text className='font-medium text-base'>Tổng thanh toán</Text>
                <Text className='text-end font-bold text-red-500 text-base'>
                  {priceQuoteData?.total_preview?.preview
                    ? priceQuoteData?.total_preview?.preview
                    : formatPrice(0)}
                </Text>
              </View>
            </View>
          </ScrollView>
          <View>
            <Pressable
              disabled={
                isPending ||
                isLoadingPriceQuote ||
                isLoadingOrder ||
                !defaultAddress ||
                !curPayment ||
                (curDelivery?.id === 0 && !branchOption ? true : false)
              }
              className={`mt-6 ${
                !defaultAddress ||
                !curPayment ||
                (curDelivery?.id === 0 && !branchOption ? true : false)
                  ? 'bg-neutral-800'
                  : 'bg-red-500'
              } py-3`}
              onPress={() =>
                startTransition(() => {
                  handleCreateOrder();
                })
              }
            >
              <Text className='text-white text-center font-bold'>Đặt hàng</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View className='flex-1 justify-center items-center gap-y-4'>
          <Text className='text-xl font-bold'>Chưa có sản phẩm!</Text>
          <Pressable
            className='px-6 py-2 bg-neutral-800'
            onPress={() => router.push('/')}
          >
            <Text className='text-white font-bold'>Về trang chủ</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
