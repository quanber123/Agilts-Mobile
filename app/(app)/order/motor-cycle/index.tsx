import { View, Text, Pressable, Modal } from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
} from 'react';
import { Href, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '@/contexts/UserProvider';
import { Picker } from '@react-native-picker/picker';
import ListItem from '@/components/ui/ListItem';
import {
  license_plate_registration_option,
  registration_options,
} from '@/constants/Config';
import { OptionMotorContext } from './OptionMotorProvider';
import { BranchContext } from '@/contexts/BranchProvider';
import CustomImage from '@/components/ui/CustomImage';
import { ProductOption } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from '@expo/vector-icons/Feather';
import {
  useCreateOrderMotorcycleMutation,
  usePostPriceQuoteMutation,
} from '@/services/redux/query/appQuery';
import { AlterContext } from '@/contexts/AlterProvider';
import LoadingApp from '@/components/ui/LoadingApp';
import { ScrollView } from 'react-native-gesture-handler';
import Entypo from '@expo/vector-icons/Entypo';
import { ListPayment, PaymentContext } from '@/contexts/PaymentProvider';
import { CustomInput } from '@/components/ui/CustomInput';

export default function OrderMotorCycle() {
  const [isPending, startTransition] = useTransition();
  const { setAlertModal, setIsAlertModal, setMessages } =
    useContext(AlterContext);
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
  const [supportRegistration, setSupportRegistration] = useState(false);
  const { curPayment, setCurPayment } = useContext(PaymentContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [note, setNote] = useState('');
  const [motorcycle, setMotorcycle] = useState<ProductOption | null>(null);
  const {
    branchOption,
    registrationOptions,
    licensePlateRegistrationOption,
    setBranchOption,
    setRegistrationOptions,
    setLicensePlateRegistrationOption,
  } = useContext(OptionMotorContext);
  const { branches, isLoadingBranch, loadMoreBranch } =
    useContext(BranchContext);
  const [
    createOrder,
    {
      data: orderData,
      isSuccess: isSuccessOrder,
      isLoading: isLoadingOrder,
      isError: isErrorOrder,
      error: errorOrder,
    },
  ] = useCreateOrderMotorcycleMutation();
  const { defaultAddress, setPreviousRoute } = useContext(UserContext);
  const handleRedirect = useCallback(
    (prevRoute: Href<string>, nextRoute: Href<string>) => {
      setPreviousRoute(prevRoute);
      router.push(nextRoute);
    },
    [router, setPreviousRoute]
  );
  useEffect(() => {
    (async () => {
      const curItem = await AsyncStorage.getItem('order_now_motor_cycle');
      if (curItem !== null) {
        setMotorcycle(JSON.parse(curItem));
      }
    })();
  }, []);
  useEffect(() => {
    if (curPayment?.validRoute?.includes('motor-cycle')) {
      setCurPayment(ListPayment[1]);
    } else {
      setCurPayment(null);
    }
  }, [setCurPayment, curPayment?.validRoute]);
  const handlePostPriceQuote = useCallback(async () => {
    if (motorcycle) {
      const bodyData = {
        option_id: motorcycle?.id,
        motorcycle_registration_support: supportRegistration,
        registration_option: registrationOptions?.value,
        license_plate_registration_option:
          licensePlateRegistrationOption?.value,
      };
      await postPriceQuote({ type: 'fee-motorcycle', body: bodyData });
    }
  }, [
    motorcycle,
    supportRegistration,
    registrationOptions,
    licensePlateRegistrationOption,
    postPriceQuote,
  ]);
  const handleCreateOrder = useCallback(async () => {
    if (motorcycle) {
      const bodyData: any = {
        address_id: defaultAddress?.id,
        branch_id: branchOption?.id,
        option_id: motorcycle?.id,
        motorcycle_registration_support: supportRegistration,
        registration_option: registrationOptions?.value,
        license_plate_registration_option:
          licensePlateRegistrationOption?.value,
        return_url: `Agilts-Mobile://order/success/{id}`,
        cancel_url: `Agilts-Mobile://order/cancel/{id}`,
        payment_method: curPayment?.id,
        note: '',
      };
      if (supportRegistration) {
        bodyData.registration_option = registrationOptions?.value;
        bodyData.license_plate_registration_option =
          licensePlateRegistrationOption?.value;
      }
      await createOrder(bodyData);
    }
  }, [
    motorcycle,
    supportRegistration,
    registrationOptions,
    licensePlateRegistrationOption,
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
        await AsyncStorage.removeItem('order_now_motor_cycle');
        await AsyncStorage.setItem('cur_order', 'motor-cycle');
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
  return motorcycle ? (
    <SafeAreaView className='flex-1'>
      <ScrollView className='px-2 flex-col gap-y-6'>
        <Text className='font-bold text-red-500'>
          Lưu ý: Đơn hàng chỉ có hiệu lực 15 ngày kể từ khi đặt hàng.
        </Text>
        <View>
          <View>
            <View className='my-2 flex-row justify-between items-center gap-2'>
              <Text className='font-bold text-lg'>Thông tin người nhận</Text>
              {defaultAddress ? (
                <Pressable
                  disabled={isPending || isLoadingPriceQuote || isLoadingOrder}
                  onPress={() =>
                    handleRedirect('/order/motor-cycle', '/user/addresses')
                  }
                >
                  <Text className='text-blue-500 font-medium'>Thay đổi</Text>
                </Pressable>
              ) : (
                <Pressable>
                  disabled={isPending || isLoadingPriceQuote || isLoadingOrder}
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
                <Text numberOfLines={1}>{defaultAddress?.address_preview}</Text>
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
        <View className='flex-col'>
          <View className='mb-2 flex-row justify-between items-center gap-x-4'>
            <Text className='text-lg font-bold'>Hỗ trợ đăng ký xe:</Text>
            <Pressable
              disabled={isPending || isLoadingPriceQuote || isLoadingOrder}
              className={`relative w-[42px] h-[20px] rounded-xl ${
                supportRegistration ? 'bg-green-500' : 'bg-red-500'
              }`}
              onPress={() =>
                setSupportRegistration((prevToggle) => !prevToggle)
              }
            >
              <View
                className={`absolute top-0  left-0 bg-white rounded-full w-[20px] h-[20px] ${
                  supportRegistration ? ' translate-x-6' : 'translate-x-0'
                }`}
              ></View>
            </Pressable>
          </View>
          {supportRegistration && (
            <View className='flex-col gap-2'>
              <View>
                <Text className='font-medium mb-2'>Lệ phí trước bạ</Text>
                <View className='border border-neutral-300 rounded-md overflow-hidden'>
                  <Picker
                    aria-disabled={isPending || isLoadingPriceQuote}
                    selectedValue={registrationOptions}
                    onValueChange={(itemValue) =>
                      setRegistrationOptions(
                        registration_options.find(
                          (o) => o.value === Number(itemValue)
                        ) || registration_options[0]
                      )
                    }
                  >
                    {registration_options?.map((o) => {
                      return (
                        <Picker.Item
                          key={o?.label}
                          label={o?.label}
                          value={o?.value}
                        />
                      );
                    })}
                  </Picker>
                </View>
              </View>
              <View>
                <Text className='font-medium mb-2'>
                  Tùy chọn đăng ký biển số
                </Text>
                <View className='border border-neutral-300 rounded-md overflow-hidden'>
                  <Picker
                    aria-disabled={isPending || isLoadingPriceQuote}
                    selectedValue={licensePlateRegistrationOption}
                    onValueChange={(itemValue) =>
                      setLicensePlateRegistrationOption(
                        license_plate_registration_option.find(
                          (o) => o.value === Number(itemValue)
                        ) || license_plate_registration_option[0]
                      )
                    }
                  >
                    {license_plate_registration_option?.map((o) => {
                      return (
                        <Picker.Item
                          key={o?.label}
                          label={o?.label}
                          value={o?.value}
                        />
                      );
                    })}
                  </Picker>
                </View>
              </View>
            </View>
          )}
        </View>
        <View className='flex-col gap-2'>
          <Text className='text-lg font-bold'>Chi nhánh</Text>
          <Pressable
            disabled={isPending || isLoadingPriceQuote}
            onPress={() => setModalVisible(true)}
            className='border border-neutral-300 p-4'
          >
            <Text className='text-neutral-800'>
              {branchOption ? branchOption?.address_preview : 'Chọn chi nhánh'}
            </Text>
          </Pressable>
          <Modal
            visible={modalVisible}
            animationType='fade'
            transparent={true}
            statusBarTranslucent={true}
          >
            <SafeAreaView className='flex-1 bg-white'>
              <Text className='text-lg font-bold p-2'>Danh sách chi nhánh</Text>
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
        <View>
          <View className='flex-row justify-between items-center p-2'>
            <Text className='text-lg font-bold'>Sản phẩm</Text>
            <Pressable
              disabled={isPending || isLoadingPriceQuote || isLoadingOrder}
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
          <View className='my-4 flex-row items-start'>
            <View className='w-[150px] h-[120px]'>
              <CustomImage
                width={120}
                height={80}
                src={motorcycle?.images_preview?.[0]?.url as string}
                alt={motorcycle?.images_preview?.[0]?.alt as string}
              />
            </View>
            <View className='flex-1'>
              <Text numberOfLines={1}>{motorcycle?.sku}</Text>
              {motorcycle?.type_preview && (
                <Text className='text-xs text-neutral-500'>
                  Loại sản phẩm: {motorcycle?.type_preview}
                </Text>
              )}
              {motorcycle?.version && (
                <Text className='text-xs text-neutral-500'>
                  Phiên bản: {motorcycle?.version}
                </Text>
              )}
              {motorcycle?.color && (
                <Text className='text-xs text-neutral-500'>
                  Màu sắc: {motorcycle?.color}
                </Text>
              )}
              {motorcycle?.volume && (
                <Text className='text-xs text-neutral-500'>
                  Thể tích: {motorcycle?.volume}
                </Text>
              )}
              <View className='flex-row justify-between'>
                <Text className='text-sm'>
                  {motorcycle?.price_preview?.preview}
                </Text>
                <Text className='text-neutral-600'>x1</Text>
              </View>
            </View>
          </View>
        </View>
        {isSuccessPriceQuote && priceQuoteData && (
          <View className='w-full border border-neutral-300'>
            <View className='flex-row justify-between items-center border-b border-neutral-300 p-2'>
              <Text className='w-1/2'>Phí xử lý</Text>
              <Text className='w-1/2 text-right font-medium'>
                {priceQuoteData?.handling_fee_preview?.preview}
              </Text>
            </View>
            <View className='flex-row justify-between items-center border-b border-neutral-300 p-2'>
              <Text className='w-1/2'>Phí hỗ trợ đăng ký xe</Text>
              <Text className='w-1/2 text-right font-medium'>
                {
                  priceQuoteData?.license_plate_registration_fee_preview
                    ?.preview
                }
              </Text>
            </View>
            <View className='flex-row justify-between items-center border-b border-neutral-300 p-2'>
              <Text className='w-1/2'>Lệ phí trước bạ</Text>
              <Text className='w-1/2 text-right font-medium'>
                {priceQuoteData?.registration_fee_preview?.preview}
              </Text>
            </View>
            <View className='flex-row justify-between items-center border-b border-neutral-300 p-2'>
              <Text className='w-1/2'>Lệ phí đăng ký biển số</Text>
              <Text className='w-1/2 text-right font-medium'>
                {priceQuoteData?.handling_fee_preview?.preview}
              </Text>
            </View>
            <View className='flex-row justify-between items-center border-b border-neutral-300 p-2'>
              <Text>Tổng tiền</Text>
              <Text className='w-1/2 text-right font-medium'>
                {priceQuoteData?.total_preview?.preview}
              </Text>
            </View>
          </View>
        )}
        <View>
          <Pressable
            className='flex-row justify-between items-center pb-4'
            onPress={() => {
              setPreviousRoute('/order/motor-cycle');
              router.push('/payments');
            }}
            disabled={isPending || isLoadingPriceQuote || isLoadingOrder}
          >
            <Text className='text-lg font-bold'>Phương thức thanh toán</Text>
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
      </ScrollView>
      <View>
        <Pressable
          disabled={
            isPending ||
            isLoadingPriceQuote ||
            isLoadingOrder ||
            !defaultAddress ||
            !curPayment ||
            !branchOption
          }
          className={`mt-6 ${
            !defaultAddress || !curPayment || !branchOption
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
    </SafeAreaView>
  ) : (
    <SafeAreaView className='flex-1 justify-center items-center'>
      <Text className='text-2xl font-bold text-center'>
        Bạn chưa có sản phẩm
      </Text>
      <Pressable
        className='w-[120px] my-4 px-4 py-3 bg-black'
        onPress={() => router.push('/')}
      >
        <Text className='text-center text-white font-bold'>Về trang chủ</Text>
      </Pressable>
    </SafeAreaView>
  );
}
