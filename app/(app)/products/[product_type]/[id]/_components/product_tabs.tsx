import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Product, Review, SingleImage } from '@/types/types';
import RenderHTML from 'react-native-render-html';
import { FlatList } from 'react-native-gesture-handler';
import CustomImage from '@/components/ui/CustomImage';
import { formatQueryToString } from '@/services/utils/format';
import { useLocalSearchParams } from 'expo-router';
import { useGetProductReviewsQuery } from '@/services/redux/query/appQuery';
import ListStars from '@/components/ui/ListStars';
type Props = {
  description: string;
  specifications: any;
  video?: Product['videos_preview'];
  productId: number;
  avgReview: string;
  images: SingleImage[];
};
export default function ProductTabs({
  description,
  specifications,
  video,
  productId,
  avgReview,
  images,
}: Props) {
  const [reviews, setReviews] = useState<Review[] | []>([]);
  const [curPage, setCurPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const params = useLocalSearchParams();
  const [curTab, setCurTab] = useState(0);
  const { width } = useWindowDimensions();
  const queryString = useMemo(() => {
    return formatQueryToString(params, '', ['product_type', 'id']);
  }, [params]);
  const {
    data: reviewsData,
    isFetching: isFetchingReview,
    isSuccess: isSuccessReview,
  } = useGetProductReviewsQuery({
    id: params?.id,
    search: queryString,
  });
  const loadMore = useCallback(() => {
    if (hasMore && !isFetchingReview) {
      setCurPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isFetchingReview]);
  useEffect(() => {
    if (!isFetchingReview && isSuccessReview && reviewsData && hasMore) {
      if (reviewsData?.data?.length === 0) {
        setReviews((prevReviews) => [...prevReviews]);
      } else {
        setReviews((prevReviews) => [...prevReviews, ...reviewsData?.data]);
      }
      if (curPage + 1 > reviewsData?.total_pages) {
        setHasMore(false);
      }
    }
  }, [isFetchingReview, isSuccessReview, reviewsData, hasMore]);
  return (
    <View>
      <View className='flex-row justify-between items-center bg-white py-4'>
        <Pressable className='mx-2 font-medium' onPress={() => setCurTab(0)}>
          <Text
            className={`${
              curTab === 0 ? 'text-red-500' : ''
            } text-base font-medium`}
          >
            Mô tả
          </Text>
        </Pressable>
        <Pressable className='mx-2 font-medium' onPress={() => setCurTab(1)}>
          <Text
            className={`${
              curTab === 1 ? 'text-red-500' : ''
            } text-base font-medium`}
          >
            Thông số kỹ thuật
          </Text>
        </Pressable>
        <Pressable className='mx-2 font-medium' onPress={() => setCurTab(2)}>
          <Text
            className={`${
              curTab === 2 ? 'text-red-500' : ''
            } text-base font-medium`}
          >
            Thư viện ảnh
          </Text>
        </Pressable>
        <Pressable className='mx-2 font-medium' onPress={() => setCurTab(3)}>
          <Text
            className={`${
              curTab === 3 ? 'text-red-500' : ''
            } text-base font-medium`}
          >
            Đánh giá
          </Text>
        </Pressable>
      </View>
      {curTab === 0 && (
        <View className='mx-2 my-4'>
          {description ? (
            <RenderHTML
              contentWidth={width}
              source={{
                html: description,
              }}
              renderersProps={{
                img: {
                  enableExperimentalPercentWidth: true,
                },
              }}
            />
          ) : (
            <Text className='py-6 text-base font-semibold text-center'>
              Sản phẩm chưa có mô tả
            </Text>
          )}
        </View>
      )}
      {curTab === 1 && (
        <View className='mx-2 my-4'>
          {specifications?.length > 0 ? (
            <FlatList
              contentContainerStyle={{ gap: 20 }}
              data={specifications}
              keyExtractor={({ _, index }) => index?.toString()}
              renderItem={({ item, index }) => {
                return (
                  <View
                    className={`my-2 p-2 ${
                      index % 2 !== 0 ? 'bg-white' : ''
                    } flex-col gap-2`}
                  >
                    <Text className='font-semibold'>{item?.title}</Text>
                    <Text>{item?.description}</Text>
                  </View>
                );
              }}
            />
          ) : (
            <Text className='py-6 text-base font-semibold text-center'>
              Sản phẩm chưa có thông số kỹ thuật
            </Text>
          )}
        </View>
      )}
      {curTab === 2 && (
        <View className='mx-2 my-4'>
          {images?.length > 0 ? (
            <FlatList
              numColumns={3}
              contentContainerStyle={{ gap: 20 }}
              data={images}
              keyExtractor={(item) => item?.alt?.toString()}
              renderItem={({ item, index }) => {
                return (
                  <CustomImage
                    width={120}
                    height={100}
                    key={index}
                    src={item?.url}
                    alt={item?.alt}
                  />
                );
              }}
            />
          ) : (
            <Text className='py-6 text-base font-semibold text-center'>
              Sản phẩm chưa có thư viện ảnh
            </Text>
          )}
        </View>
      )}
      {curTab === 3 && (
        <View className='mx-2 my-4'>
          {!isFetchingReview && isSuccessReview && reviews?.length > 0 && (
            <View>
              <View className='mb-4 flex-row items-center'>
                <View className='flex-row items-end gap-2 mr-6'>
                  <Text className='text-2xl font-bold'>
                    {Number(avgReview).toFixed(1)}
                  </Text>
                  <Text className='text-lg font-semibold'>trên</Text>
                  <Text className='text-xl font-semibold'>5</Text>
                </View>
                <ListStars rating={avgReview} />
              </View>
              <FlatList
                contentContainerStyle={{ gap: 40 }}
                data={reviews}
                keyExtractor={(item) => item?.id?.toString()}
                renderItem={({ item, index }) => {
                  return (
                    <View key={index} className='flex-col'>
                      <ListStars rating={item?.rate.toString()} size={14} />
                      <View className='my-2 flex-col text-sm gap-y-2'>
                        <Text className='font-bold'>
                          {item?.customer?.name || 'Người dùng ẩn danh'}
                        </Text>
                        <Text className='text-neutral-500'>
                          {item?.created_at}
                        </Text>
                      </View>
                      {item?.option?.version && (
                        <Text className='my-1 text-sm text-neutral-600'>
                          Phiên bản:{' '}
                          <Text className='font-bold'>
                            {item?.option?.version}
                          </Text>
                        </Text>
                      )}
                      {item?.option?.volume && (
                        <Text className='my-1 text-sm text-neutral-600'>
                          Thể tích:{' '}
                          <Text className='font-bold'>
                            {item?.option?.volume}
                          </Text>
                        </Text>
                      )}
                      {item?.option?.color && (
                        <Text className='my-1 text-sm text-neutral-600'>
                          Màu sắc:{' '}
                          <Text className='font-bold'>
                            {item?.option?.color}
                          </Text>
                        </Text>
                      )}
                      <View className='my-2 text-sm text-neutral-500'>
                        <Text>{item?.content}</Text>
                        {item?.images_preview?.length > 0 && (
                          <View className='flex flex-wrap'>
                            {item?.images_preview.map((image, index) => (
                              <CustomImage
                                width={128}
                                height={128}
                                src={image?.url}
                                alt={image?.alt}
                              />
                            ))}
                          </View>
                        )}
                      </View>
                      {item?.reply && (
                        <View className='rounded-sm bg-white p-4'>
                          <Text className='font-medium'>
                            Phản hồi của {item?.reply?.employee?.name} -{' '}
                            {item?.reply?.created_at}
                          </Text>
                          <Text>{item?.reply?.content}</Text>
                        </View>
                      )}
                    </View>
                  );
                }}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  isFetchingReview ? (
                    <ActivityIndicator size='small' color='#ef4444' />
                  ) : null
                }
              />
            </View>
          )}
          {isSuccessReview && !isFetchingReview && reviews?.length === 0 && (
            <Text className='py-6 text-base font-semibold text-center'>
              Sản phẩm chưa có đánh giá
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
