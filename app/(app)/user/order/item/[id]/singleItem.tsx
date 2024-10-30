import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AlterContext } from '@/contexts/AlterProvider';
import CustomImage from '@/components/ui/CustomImage';
import { Order } from '@/types/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import ImageUpload from '../../ImageUpload';
import { CustomInput } from '@/components/ui/CustomInput';
import { useCreateReviewMutation } from '@/services/redux/query/appQuery';
import LoadingApp from '@/components/ui/LoadingApp';

type Props = {
  order: Order;
};
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
export default function SingleItem({ order }: Props) {
  const { setAlertModal, setIsAlertModal, setMessages } =
    useContext(AlterContext);
  const [
    review,
    {
      isSuccess: isSuccessReview,
      isLoading: isLoadingReview,
      isError: isErrorReview,
      error: errorReview,
    },
  ] = useCreateReviewMutation();
  const [visibleModal, setVisibleModal] = useState(false);
  const [images, setImages] = useState<string[] | []>([]);
  const [uploadImages, setUploadImages] = useState<string[] | []>([]);
  const [content, setContent] = useState('');
  const [rate, setRate] = useState(5);

  const handleStarClick = useCallback((selectedRate: number) => {
    setRate(selectedRate);
  }, []);
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
      option_id: order?.option?.id,
      content: content,
      rate: rate,
      images_preview: uploadImages,
    });
  }, [review, uploadImages, order, content, rate]);
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
  if (isLoadingReview) return <LoadingApp />;
  return (
    <>
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
                <Text>{order?.option?.product?.name}</Text>
              </View>
              <View className='flex-row gap-2'>
                <Text className='font-medium'>Đánh giá:</Text>
                <View className='flex-row'>
                  {Array.from({ length: 5 }).map((_, index) => {
                    return (
                      <Pressable onPress={() => handleStarClick(index + 1)}>
                        {rate >= index + 1 ? (
                          <FontAwesome name='star' size={20} color='#ef4444' />
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
                          className='relative w-20 h-20 bg-red-500'
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
                    <View className='flex justify-end items-center p2-4'>
                      <Pressable className='border-neutral-500 px-4 py-2'>
                        <Text className='font-bold text-center'>Hủy</Text>
                      </Pressable>
                      <Pressable className='bg-red-500 border-red-500 px-4 py-2'>
                        <Text className='font-bold text-center'>Đánh giá</Text>
                      </Pressable>
                    </View>
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
      <View className='flex-row justify-between items-start'>
        <View>
          <CustomImage
            width={120}
            height={90}
            src={order?.option?.images_preview?.[0]?.url}
            alt={order?.option?.images_preview?.[0]?.alt}
          />
        </View>
        <View className='ml-4 flex-1'>
          <View className='flex-row justify-between items-center'>
            <Text className='font-medium' numberOfLines={1}>
              {order?.option?.product?.name}
            </Text>
          </View>
          {order?.option?.version && (
            <Text className='text-xs text-neutral-500'>
              Phiên bản: {order?.option?.version}
            </Text>
          )}
          {order?.option?.color && (
            <Text className='text-xs text-neutral-500'>
              Màu sắc: {order?.option?.color}
            </Text>
          )}
          {order?.option?.volume && (
            <Text className='text-xs text-neutral-500'>
              Thể tích: {order?.option?.volume}
            </Text>
          )}
          {order?.option?.weight && (
            <Text className='text-xs text-neutral-500'>
              Cân nặng: {order?.option?.weight}
            </Text>
          )}
          {order?.option?.length && (
            <Text className='text-xs text-neutral-500'>
              Chiều dài: {order?.option?.length}
            </Text>
          )}
          {order?.option?.width && (
            <Text className='text-xs text-neutral-500'>
              Chiều rộng: {order?.option?.width}
            </Text>
          )}
          {order?.option?.height && (
            <Text className='text-xs text-neutral-500'>
              Chiều cao: {order?.option?.height}
            </Text>
          )}
          <View className='flex-row justify-between'>
            <Text className='text-neutral-500'>x{order?.amount}</Text>
            <Text className='text-right'>
              {order?.option?.price_preview?.preview}
            </Text>
          </View>
        </View>
      </View>
    </>
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
