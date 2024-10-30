import { View, Text, SafeAreaView, TextInput, Pressable } from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
  useGetProductFilterQuery,
  useGetProductsQuery,
} from '@/services/redux/query/appQuery';
import SingleProduct from '@/components/ui/SingleProduct';
import { Product } from '@/types/types';
import ListItem from '@/components/ui/ListItem';
import FilterDialog from './components/FilterDialog';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ParamsContext } from './ParamsProvider';

export default function ProductTypeScreen() {
  const urlParams = useLocalSearchParams();
  const { params, setParams } = useContext(ParamsContext);
  const [searchValue, setSearchValue] = useState(params?.search as string);
  const [products, setProducts] = useState<Product[]>([]);
  const [curPage, setCurPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  function formatParams(obj: Record<string, any>): string {
    return Object.entries(obj)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');
  }

  const formattedString: string = useMemo(() => {
    return formatParams(params ?? {}) || '';
  }, [params]);

  const { data: filterData, isSuccess: isSuccessFilter } =
    useGetProductFilterQuery({
      type: urlParams?.product_type,
      search: formattedString,
    });

  const {
    data: productsData,
    isSuccess: isSuccessProduct,
    isFetching: isFetchingProduct,
  } = useGetProductsQuery({
    type: urlParams?.product_type,
    search: `page=${curPage}&${formattedString}`,
  });
  const loadMore = useCallback(() => {
    if (hasMore && !isFetchingProduct && isSuccessProduct) {
      setCurPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isFetchingProduct, isSuccessProduct]);

  useEffect(() => {
    if (!isFetchingProduct && isSuccessProduct && productsData) {
      setProducts((prevProducts) =>
        curPage === 1
          ? productsData.data
          : [...prevProducts, ...productsData.data]
      );
      setHasMore(curPage < productsData.total_pages);
    }
  }, [isFetchingProduct, isSuccessProduct, productsData]);

  const handleSearch = () => {
    setParams((prevParams: any) => {
      return { ...prevParams, search: searchValue };
    });
    setProducts([]);
    setCurPage(1);
  };
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='px-4 my-4 flex-row justify-between items-center'>
        <View className='flex-1 border border-neutral-300 flex-row items-stretch'>
          <TextInput
            className='flex-1 p-2'
            nativeID='search'
            value={searchValue}
            onChangeText={setSearchValue}
            placeholder='VD: CBR500...'
          />
          <Pressable
            className='justify-center items-center px-2'
            onPress={handleSearch}
          >
            <AntDesign name='search1' size={24} color='black' />
          </Pressable>
        </View>
        <View className='ml-4'>
          {isSuccessFilter && filterData && (
            <FilterDialog filters={filterData} />
          )}
        </View>
      </View>
      {products.length > 0 ? (
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
          isPaginate
          isLoading={isFetchingProduct}
        />
      ) : (
        !isFetchingProduct && (
          <View className='flex-1 justify-center items-center'>
            <Text className='text-xl font-bold'>Không có sản phẩm!</Text>
          </View>
        )
      )}
    </SafeAreaView>
  );
}
