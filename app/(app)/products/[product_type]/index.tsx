import { View, Text, SafeAreaView } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
  useGetProductFilterQuery,
  useGetProductsQuery,
} from '@/services/redux/query/appQuery';
import { formatQueryToString } from '@/services/utils/format';
import SingleProduct from '@/components/ui/SingleProduct';
import { Product } from '@/types/types';
import ListItem from '@/components/ui/ListItem';

export default function ProductTypeScreen() {
  const params = useLocalSearchParams();
  const [products, setProducts] = useState<Product[] | []>([]);
  const [curPage, setCurPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const queryString = useMemo(() => {
    return formatQueryToString(params, '');
  }, [params]);
  const {
    data: filterData,
    isLoading: isLoadingFilter,
    isError: isErrorFilter,
  } = useGetProductFilterQuery(params?.product_type);
  const {
    data: productsData,
    isSuccess: isSuccessProduct,
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
      {products?.length === 0 && (
        <View className='flex-1 justify-center items-center'>
          <Text className='text-xl font-bold'>Không có sản phẩm!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
