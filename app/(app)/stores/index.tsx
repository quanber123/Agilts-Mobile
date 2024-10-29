import { View, Text, SafeAreaView } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useGetBranchesQuery } from '@/services/redux/query/appQuery';
import { useLocalSearchParams } from 'expo-router';
import { formatQueryToString } from '@/services/utils/format';
import { Branch } from '@/types/types';
import ListItem from '@/components/ui/ListItem';
import CustomImage from '@/components/ui/CustomImage';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import smallError from '../../../assets/images/not-found-img.avif';

export default function StoresScreen() {
  const params = useLocalSearchParams();
  const queryString = useMemo(() => {
    return formatQueryToString(params, '', []);
  }, [params]);
  const [branches, setBranches] = useState<Branch[] | []>([]);
  const [curPage, setCurPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { data, isFetching, isSuccess } = useGetBranchesQuery(
    `${queryString}&page=${curPage}`
  );
  const loadMoreBranch = useCallback(() => {
    if (hasMore && !isFetching && isSuccess) {
      setCurPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isFetching, isSuccess]);
  useEffect(() => {
    if (!isFetching && isSuccess && data && hasMore) {
      if (data?.data?.length === 0) {
        setBranches((prevBranches) => [...prevBranches]);
      } else {
        setBranches((prevBranches) => [...prevBranches, ...data?.data]);
      }
      if (curPage + 1 > data?.total_pages) {
        setHasMore(false);
      }
    }
  }, [isFetching, isSuccess, data, hasMore]);
  return (
    <SafeAreaView className='flex-1 p-2'>
      {branches?.length > 0 && (
        <ListItem
          contentContainerStyle={40}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          onEndReached={loadMoreBranch}
          numColumns={2}
          data={branches}
          renderItem={({ item }: { item: Branch }) => {
            return (
              <View
                key={item?.id}
                className='flex-1 max-w-[45%] flex-col gap-1'
              >
                <View>
                  <CustomImage
                    src={
                      item?.image_preview?.url
                        ? item?.image_preview?.url
                        : smallError
                    }
                    alt={item?.image_preview?.alt}
                  />
                </View>
                <View className='flex-row items-center gap-1'>
                  <EvilIcons name='location' size={24} color='#ef4444' />
                  <Text numberOfLines={2}>
                    {item?.address_preview
                      ? item?.address_preview
                      : 'Không có thông tin'}
                  </Text>
                </View>
                <View className='flex-row items-center gap-2'>
                  <Feather name='phone' size={18} color='#ef4444' />
                  <Text numberOfLines={1}>
                    {item?.phone_number
                      ? item?.phone_number
                      : 'Không có thông tin'}
                  </Text>
                </View>
              </View>
            );
          }}
          isPaginate={true}
          isLoading={isFetching}
        />
      )}
      {!isFetching && branches?.length === 0 && (
        <View className='flex-1 justify-center items-center'>
          <Text className='text-xl font-bold'>Không có cửa hàng!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
