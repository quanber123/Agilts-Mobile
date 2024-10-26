import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
  useGetProductFilterQuery,
  useGetProductsQuery,
} from '@/services/redux/query/appQuery';
import { formatQueryToString } from '@/services/utils/format';
import { FlatList } from 'react-native-gesture-handler';
import SingleProduct from '@/components/ui/SingleProduct';
import { Product } from '@/types/types';
import { productsType } from '@/config/products_type';
import { Feather } from '@expo/vector-icons';

export default function ProductTypeScreen() {
  const params = useLocalSearchParams();
  const [products, setProducts] = useState<Product[] | []>([]);
  const [curPage, setCurPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const queryString = useMemo(() => {
    return formatQueryToString(params, 'product_type');
  }, [params]);
  const curType = useMemo(() => {
    return productsType.find((p) => p.key === params.product_type);
  }, [params.product_type]);
  const {
    data: filterData,
    isLoading: isLoadingFilter,
    isError: isErrorFilter,
  } = useGetProductFilterQuery(params.product_type, {
    skip: !params.product_type,
  });
  const {
    data: productsData,
    isSuccess: isSuccessProduct,
    isFetching: isFetchingProduct,
  } = useGetProductsQuery(
    { type: params.product_type, search: `page=${curPage}&${queryString}` },
    { skip: !params.product_type }
  );
  const loadMore = useCallback(() => {
    if (hasMore && !isFetchingProduct) {
      setCurPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isFetchingProduct]);
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
      <View className='h-[120px] pt-4 bg-red-500 flex-row justify-between items-center px-4'>
        <Text className='text-xl font-semibold uppercase tracking-[4px] text-white'>
          {curType?.value}
        </Text>
        <Feather name='filter' size={26} color='white' />
      </View>
      {!isFetchingProduct && isSuccessProduct && products?.length > 0 && (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <SingleProduct key={index} product={item} />
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ gap: 40 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingProduct ? (
              <ActivityIndicator size='small' color='#ef4444' />
            ) : null
          }
        />
      )}
      {!isFetchingProduct && isSuccessProduct && products?.length === 0 && (
        <View className='flex-1 justify-center items-center'>
          <Text className='text-xl font-bold'>Không có sản phẩm!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
