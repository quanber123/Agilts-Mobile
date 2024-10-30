import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useGetUserReviewQuery } from '@/services/redux/query/appQuery';
import { Review } from '@/types/types';
import ListItem from '@/components/ui/ListItem';
import CustomImage from '@/components/ui/CustomImage';
import { FontAwesome } from '@expo/vector-icons';

export default function ReviewScreen() {
  const [curPage, setCurPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [reviews, setReviews] = useState<Review[] | []>([]);
  const { data, isFetching, isSuccess } = useGetUserReviewQuery(
    `page=${curPage}`
  );
  const loadMore = useCallback(() => {
    if (hasMore && !isFetching && isSuccess) {
      setCurPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isFetching, isSuccess]);

  useEffect(() => {
    if (!isFetching && isSuccess && data) {
      setReviews((prevReviews) =>
        curPage === 1 ? data.data : [...prevReviews, ...data.data]
      );
      setHasMore(curPage < data.total_pages);
    }
  }, [isFetching, isSuccess, data]);
  return (
    <SafeAreaView className='flex-1 p-2'>
      {reviews?.length > 0 ? (
        <ListItem
          data={reviews}
          renderItem={({ item }: { item: Review }) => {
            return (
              <View className='gap-y-2 py-4 border-b border-neutral-300'>
                <View className='flex-row items-center gap-1'>
                  <Text className='font-bold'>Ngày tạo:</Text>
                  <Text>{item?.created_at}</Text>
                </View>
                <View className='flex-row items-center gap-1'>
                  <Text className='font-bold'>Đánh giá:</Text>
                  <View className='flex-row items-center gap-1'>
                    <Text className='text-red-500'>{item?.rate}</Text>
                    <FontAwesome name='star' size={16} color='#ef4444' />
                  </View>
                </View>
                <View className='flex-row items-center'>
                  <Text className='font-bold'>Nội dung:</Text>
                  <Text>{item?.content}</Text>
                </View>
                {item?.images_preview?.length > 0 && (
                  <View>
                    <Text className='font-bold my-1'>Ảnh</Text>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={true}
                      style={styles.scrollView}
                      className='flex-1'
                    >
                      {item?.images_preview?.map((img) => {
                        return (
                          <View
                            style={styles.box}
                            className='relative w-20 h-20'
                          >
                            <CustomImage
                              width={80}
                              height={80}
                              src={img?.url}
                              alt={img.alt}
                            />
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>
            );
          }}
          contentContainerStyle={40}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          isPaginate
          isLoading={isFetching}
        />
      ) : (
        <View className='flex-1 justify-center items-center'>
          <Text>Chưa có đánh giá</Text>
        </View>
      )}
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
