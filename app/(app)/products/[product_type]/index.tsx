import { View, Text, SafeAreaView, TextInput, Pressable } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  useGetProductFilterQuery,
  useGetProductsQuery,
} from '@/services/redux/query/appQuery';
import { formatQueryToString } from '@/services/utils/format';
import SingleProduct from '@/components/ui/SingleProduct';
import { Product } from '@/types/types';
import ListItem from '@/components/ui/ListItem';
import FilterDialog from './components/FilterDialog';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ProductTypeScreen() {
  const params = useLocalSearchParams();
  const [searchValue, setSearchValue] = useState(params?.search as string);
  const [products, setProducts] = useState<Product[] | []>([]);
  const [curPage, setCurPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const queryString = useMemo(() => {
    return formatQueryToString(params, '');
  }, [params]);
  const {
    data: filterData,
    isLoading: isLoadingFilter,
    isSuccess: isSuccessFilter,
  } = useGetProductFilterQuery({
    type: params?.product_type,
    search: `${queryString}`,
  });
  const {
    data: productsData,
    isSuccess: isSuccessProduct,
    isLoading: isLoadingProduct,
    isFetching: isFetchingProduct,
  } = useGetProductsQuery({
    type: params?.product_type,
    search: `page=${curPage}&${queryString}`,
  });
  const loadMore = useCallback(() => {
    if (hasMore && !isFetchingProduct && isSuccessProduct) {
      setCurPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isFetchingProduct, isSuccessProduct]);
  useEffect(() => {
    if (!isFetchingProduct && isSuccessProduct && productsData && hasMore) {
      if (productsData?.data?.length === 0) {
        setProducts((prevProducts) => [...prevProducts]);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...productsData?.data]);
      }
      if (curPage + 1 > productsData?.total_pages) {
        setHasMore(false);
      }
    }
  }, [isFetchingProduct, isSuccessProduct, productsData, hasMore]);
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='px-4 my-4 flex-row justify-between items-center'>
        <View className='flex-1 border border-neutral-300 flex-row items-stretch'>
          <TextInput
            className='flex-1 p-2'
            nativeID='search'
            value={searchValue}
            onChangeText={(text) => setSearchValue(text)}
            placeholder='VD: CBR500...'
          />
          <Pressable
            className='justify-center items-center px-2'
            onPress={() => {
              router.setParams({ search: searchValue });
              setProducts([]);
            }}
          >
            <AntDesign name='search1' size={24} color='black' />
          </Pressable>
        </View>
        <View className='ml-4'>
          <FilterDialog filters={filterData} />
        </View>
      </View>
      {products?.length > 0 && (
        <ListItem
          data={products}
          renderItem={({ item, index }: any) => (
            <SingleProduct key={index} product={item} />
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={40}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          isPaginate={true}
          isLoading={isFetchingProduct}
        />
      )}
      {!isLoadingProduct && products?.length === 0 && (
        <View className='flex-1 justify-center items-center'>
          <Text className='text-xl font-bold'>Không có sản phẩm!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
