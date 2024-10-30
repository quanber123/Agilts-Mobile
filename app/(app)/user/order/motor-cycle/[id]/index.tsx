import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  Modal,
  StyleSheet,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useCreateReviewMutation,
  useGetOrderMotorcycleDetailsQuery,
} from '@/services/redux/query/appQuery';
import { router, useLocalSearchParams } from 'expo-router';
import LoadingApp from '@/components/ui/LoadingApp';
import { statusOrder } from '@/config/status_order';
import CustomImage from '@/components/ui/CustomImage';
import ImageUpload from '../../ImageUpload';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CustomInput } from '@/components/ui/CustomInput';
import { AlterContext } from '@/contexts/AlterProvider';

function getRatingText(rate: number) {
  switch (rate) {
    case 1:
      return 'Tệ';
    case 2:
      return 'Không hài lòng';
    case 3:
      return 'Hài lòng';
    case 4:
      return 'Vừa ý';
    case 5:
      return 'Xuất sắc';
    default:
      return '';
  }
}
export default function OrderDetails() {
  const { setAlertModal, setIsAlertModal, setMessages } =
    useContext(AlterContext);
  const [visibleModal, setVisibleModal] = useState(false);
  const [images, setImages] = useState<string[] | []>([]);
  const [uploadImages, setUploadImages] = useState<string[] | []>([]);
  const [content, setContent] = useState('');
  const { id } = useLocalSearchParams();
  const {
    data,
    isSuccess,
    isFetching: isLoading,
  } = useGetOrderMotorcycleDetailsQuery(id);
  const [
    review,
    {
      isSuccess: isSuccessReview,
      isLoading: isLoadingReview,
      isError: isErrorReview,
      error: errorReview,
    },
  ] = useCreateReviewMutation();
  const [rate, setRate] = useState(5);
  const handleStarClick = useCallback((selectedRate: number) => {
    setRate(selectedRate);
  }, []);
  const curStatus = useMemo(() => {
    return (
      isSuccess &&
      data &&
      statusOrder?.find((o) => o.includesValue.includes(data?.status_preview))
    );
  }, [isSuccess, data]);
  const handleSetImages = useCallback((image: string) => {
    setImages((prevImages) => {
      return [...prevImages, image];
    });
  }, []);
  const handleSetUploadImages = useCallback((image: string) => {
    setImages((prevImages) => {
      return [...prevImages, image];
    });
  }, []);
  const removeImage = useCallback((id: number) => {
    setUploadImages((prevImages) => {
      return prevImages.filter((_, index) => index !== id);
    });
    setImages((prevImages) => {
      return prevImages.filter((_, index) => index !== id);
    });
  }, []);
  const handlePostReview = useCallback(async () => {
    await review({
      option_id: data?.option?.id,
      content: content,
      rate: rate,
      images_preview: uploadImages,
    });
  }, [review, uploadImages, data, content, rate]);
  useEffect(() => {
    if (isSuccessReview) {
      setAlertModal('success');
      setIsAlertModal(true);
      setMessages('Đánh giá sản phẩm thành công');
      setVisibleModal(false);
      setImages([]);
      setUploadImages([]);
    }
    if (isErrorReview && errorReview) {
      setAlertModal('error');
      setIsAlertModal(true);
      setMessages((errorReview as any)?.data?.message);
      setVisibleModal(false);
    }
  }, [isSuccessReview, isErrorReview, errorReview]);
  if (isLoading || isLoadingReview) return <LoadingApp />;
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
        <View className='flex-row justify-end'>
          <Pressable onPress={() => setVisibleModal(true)}>
            <Text className='text-blue-500 font-bold'>Đánh giá</Text>
          </Pressable>
          <Modal
            visible={visibleModal}
            animationType='fade'
            transparent={true}
            statusBarTranslucent={true}
          >
            <View
              className='flex-1 justify-center items-center'
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <View className='w-11/12 h-2/3 bg-white p-4'>
                <View className='mb-8 flex-row justify-between items-center'>
                  <Text className='text-lg font-bold'>Đánh giá sản phẩm</Text>
                  <Pressable onPress={() => setVisibleModal(false)}>
                    <FontAwesome6 name='xmark' size={24} color='black' />
                  </Pressable>
                </View>
                <View className='my-2 flex-row gap-2'>
                  <Text className='font-medium'>Tên sản phẩm:</Text>
                  <Text>{data?.option?.product?.name}</Text>
                </View>
                <View className='flex-row gap-2'>
                  <Text className='font-medium'>Đánh giá:</Text>
                  <View className='flex-row'>
                    {Array.from({ length: 5 }).map((_, index) => {
                      return (
                        <Pressable onPress={() => handleStarClick(index + 1)}>
                          {rate >= index + 1 ? (
                            <FontAwesome
                              name='star'
                              size={20}
                              color='#ef4444'
                            />
                          ) : (
                            <FontAwesome
                              name='star-o'
                              size={20}
                              color='#ef4444'
                            />
                          )}
                        </Pressable>
                      );
                    })}
                  </View>

                  <Text className='text-red-500 font-medium'>
                    ({getRatingText(rate)})
                  </Text>
                </View>
                <View className='my-4'>
                  <ImageUpload
                    setImagesUpload={handleSetUploadImages}
                    setImages={handleSetImages}
                  />
                </View>
                {images?.length > 0 && (
                  <View className='flex-row justify-between h-[80px]'>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={true}
                      style={styles.scrollView}
                      className='flex-1'
                    >
                      {images?.map((img, index) => {
                        return (
                          <View
                            style={styles.box}
                            className='relative w-20 h-200'
                          >
                            <CustomImage
                              width={80}
                              height={80}
                              src={img}
                              alt={`img-upload-${index}`}
                            />
                            <Pressable
                              className='absolute top-1 right-1'
                              onPress={() => removeImage(index)}
                            >
                              <FontAwesome6
                                name='xmark'
                                size={20}
                                color='black'
                              />
                            </Pressable>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
                <View>
                  <CustomInput
                    className='border border-neutral-300'
                    multiline
                    numberOfLines={8}
                    value={content}
                    nativeID='content'
                    onChangeText={(text) => setContent(text)}
                    placeholder='Hãy chia sẻ những điều bạn thích về sản phẩm này với người khác.'
                  />
                </View>
                <View className='mt-auto flex-row justify-end items-center gap-x-4'>
                  <Pressable
                    className='border px-6 py-2 border-neutral-800'
                    disabled={isLoadingReview}
                    onPress={() => setVisibleModal(false)}
                  >
                    <Text className='text-center font-bold'>Hủy</Text>
                  </Pressable>
                  <Pressable
                    className='border px-6 py-2 border-red-500 bg-red-500'
                    disabled={isLoadingReview}
                    onPress={handlePostReview}
                  >
                    <Text className='text-center font-bold text-white'>
                      Đánh giá
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
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

const styles = StyleSheet.create({
  scrollView: {
    paddingVertical: 4,
  },
  box: {
    marginHorizontal: 10,
  },
});
