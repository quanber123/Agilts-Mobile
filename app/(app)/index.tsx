import CustomImage from '@/components/ui/CustomImage';
import ListItem from '@/components/ui/ListItem';
import SingleProduct from '@/components/ui/SingleProduct';
import {
  useGetProductsQuery,
  useGetSettingsQuery,
} from '@/services/redux/query/appQuery';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, Pressable } from 'react-native';
import PagerView from 'react-native-pager-view';

export default function HomeScreen() {
  const [curBanner, setCurBanner] = useState(0);
  const {
    data: settingData,
    isSuccess: isSuccessSetting,
    isLoading: isLoadingSetting,
  } = useGetSettingsQuery('homepage');
  const {
    data: motorData,
    isSuccess: isSuccessMotor,
    isLoading: isLoadingMotor,
  } = useGetProductsQuery({
    type: 'motor-cycle',
    search: '',
    perPage: 8,
  });
  const {
    data: squarePartsData,
    isSuccess: isSuccessSquareParts,
    isLoading: isLoadingSquareParts,
  } = useGetProductsQuery({
    type: 'square-parts',
    search: '',
    perPage: 8,
  });
  const {
    data: accessoriesData,
    isSuccess: isSuccessAccessories,
    isLoading: isLoadingAccessories,
  } = useGetProductsQuery({
    type: 'accessories',
    search: '',
    perPage: 8,
  });
  const handleNextCarousel = useCallback(() => {
    if (isSuccessSetting) {
      setCurBanner((prevBanner) => {
        if (
          prevBanner + 1 >
          settingData?.[0]?.value_preview?.banners?.length - 1
        ) {
          return 0;
        } else {
          return prevBanner + 1;
        }
      });
    }
  }, [isSuccessSetting, settingData?.[0]?.value_preview?.banners]);
  useEffect(() => {
    if (isSuccessSetting && settingData) {
      const timeoutId = setInterval(() => {
        handleNextCarousel();
      }, settingData?.[0]?.value_preview?.time_to_automatically_switch_banners || 3000);
      return () => clearInterval(timeoutId);
    }
  }, [isSuccessSetting, settingData]);
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView className='flex-col gap-8'>
        {!isLoadingSetting && settingData && (
          <PagerView className='h-[300px]' initialPage={curBanner}>
            {settingData?.[0]?.value_preview?.banners?.map(
              (b: any, index: number) => {
                return (
                  <View className='relative h-[140px]' key={index + 1}>
                    <CustomImage
                      width={500}
                      height={300}
                      src={b?.image?.url}
                      alt={b?.image?.alt}
                    />

                    <View
                      className='absolute w-full h-[220px] top-0 left-0 flex justify-center items-start px-6'
                      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    >
                      <Text className='text-red-500 font-bold'>
                        {b?.banner_description} | {b?.subtitle}
                      </Text>
                      <Text className='my-2 text-white text-lg font-bold'>
                        {b?.title}
                      </Text>
                      <Text className='text-neutral-300'>{b?.description}</Text>
                    </View>
                  </View>
                );
              }
            )}
          </PagerView>
        )}
        {isSuccessMotor && motorData?.data?.length > 0 && !isLoadingMotor && (
          <View className='flex-1 px-2 flex-col gap-4'>
            <Text className='text-xl font-bold'>Xe máy</Text>
            <ListItem
              data={motorData?.data}
              renderItem={({ item, index }: any) => (
                <SingleProduct key={index} product={item} />
              )}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              contentContainerStyle={40}
            />
            <View className='w-full flex-row justify-center items-center'>
              <Pressable
                className='mx-auto w-[120px] bg-neutral-800 px-4 py-2'
                onPress={() => router.push(`/products/motor-cycle`)}
              >
                <Text className='text-white text-center font-semibold'>
                  Xem thêm
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        {isSuccessSquareParts &&
          squarePartsData?.data?.length > 0 &&
          !isLoadingSquareParts && (
            <View className='flex-1 px-2 flex-col gap-4'>
              <Text className='text-xl font-bold'>Phụ tùng</Text>
              <ListItem
                data={squarePartsData?.data}
                renderItem={({ item, index }: any) => (
                  <SingleProduct key={index} product={item} />
                )}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                contentContainerStyle={40}
              />
              <View className='w-full flex-row justify-center items-center'>
                <Pressable
                  className='mx-auto w-[120px] bg-neutral-800 px-4 py-2'
                  onPress={() => router.push(`/products/square-parts`)}
                >
                  <Text className='text-white text-center font-semibold'>
                    Xem thêm
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        {isSuccessAccessories &&
          accessoriesData?.data?.length > 0 &&
          !isLoadingAccessories && (
            <View className='flex-1 px-2 flex-col gap-4'>
              <Text className='text-xl font-bold'>Xe máy</Text>
              <ListItem
                data={accessoriesData?.data}
                renderItem={({ item, index }: any) => (
                  <SingleProduct key={index} product={item} />
                )}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                contentContainerStyle={40}
              />
              <View className='w-full flex-row justify-center items-center'>
                <Pressable
                  className='mx-auto w-[120px] bg-neutral-800 px-4 py-2'
                  onPress={() => router.push(`/products/accessories`)}
                >
                  <Text className='text-white text-center font-semibold'>
                    Xem thêm
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
}
