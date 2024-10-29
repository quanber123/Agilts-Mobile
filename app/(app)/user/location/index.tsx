import { View, Text, Pressable } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { LocationContext } from '../contexts/LocationProvider';
import {
  useGetDistrictsQuery,
  useGetProvincesQuery,
  useGetWardsQuery,
} from '@/services/redux/query/countryQuery';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import ListItem from '@/components/ui/ListItem';
import { ProvinceContext } from '@/contexts/ProvinceProvider';
export default function LocationScreen() {
  const router = useRouter();
  const {
    location,
    setLocation,
    resetLocation,
    typeActionLocation,
    setTypeActionLocation,
  } = useContext(LocationContext);
  const { provinces, isLoadingProvince, loadMoreProvince } =
    useContext(ProvinceContext);
  const [districts, setDistricts] = useState<any[]>([]);
  const [curPageDistrict, setCurPageDistrict] = useState(1);
  const [hasMoreDistrict, setHasMoreDistrict] = useState(true);
  const [wards, setWards] = useState<any[]>([]);
  const [curPageWard, setCurPageWard] = useState(1);
  const [hasMoreWard, setHasMoreWard] = useState(true);
  const {
    data: districtsData,
    isFetching: isLoadingDistricts,
    isSuccess: isSuccessDistrict,
  } = useGetDistrictsQuery(
    { provinceCode: location.province.code, page: curPageDistrict },
    {
      skip: !location.province.code,
      refetchOnReconnect: true,
    }
  );
  const {
    data: wardsData,
    isFetching: isLoadingWards,
    isSuccess: isSuccessWard,
  } = useGetWardsQuery(
    { districtCode: location.district.code, page: curPageWard },
    { skip: !location.district.code, refetchOnReconnect: true }
  );
  const loadMoreDistrict = useCallback(() => {
    if (hasMoreDistrict && !isLoadingDistricts && isSuccessDistrict) {
      setCurPageDistrict((prevPage) => prevPage + 1);
    }
  }, [hasMoreDistrict, isLoadingDistricts, isSuccessDistrict]);
  useEffect(() => {
    if (
      !isLoadingDistricts &&
      isSuccessDistrict &&
      districtsData &&
      hasMoreDistrict
    ) {
      if (districtsData?.data?.length === 0) {
        setDistricts((prevDistricts) => [...prevDistricts]);
      } else {
        setDistricts((prevDistricts) => [
          ...prevDistricts,
          ...districtsData?.data,
        ]);
      }
      if (curPageDistrict + 1 > districtsData?.total_pages) {
        setHasMoreDistrict(false);
      }
    }
  }, [isLoadingDistricts, districtsData, hasMoreDistrict]);
  const loadMoreWard = useCallback(() => {
    if (hasMoreWard && !isLoadingWards && isSuccessWard) {
      setCurPageWard((prevPage) => prevPage + 1);
    }
  }, [hasMoreWard, isLoadingWards, isSuccessWard]);
  useEffect(() => {
    if (!isLoadingWards && isSuccessWard && wardsData && hasMoreWard) {
      if (wardsData?.data?.length === 0) {
        setWards((prevWards) => [...prevWards]);
      } else {
        setWards((prevWards) => [...prevWards, ...wardsData?.data]);
      }
      if (curPageWard + 1 > wardsData?.total_pages) {
        setHasMoreWard(false);
      }
    }
  }, [isLoadingWards, wardsData, isSuccessWard, hasMoreWard]);
  const handleSelectedWard = useCallback(
    (w: any) => {
      setLocation((prevLocation) => {
        return {
          ...prevLocation,
          ward: {
            code: w?.id,
            name: w?.name,
          },
        };
      });
      if (typeActionLocation === 'add') {
        setTypeActionLocation(null);
        router.back();
      }
    },
    [typeActionLocation, router]
  );
  useEffect(() => {
    if (typeActionLocation === 'update') {
      if (provinces) {
        const curProvince = provinces?.find((d: any) => {
          return d?.name === location?.province?.name;
        });
        if (curProvince) {
          setLocation((prevLocation) => {
            return {
              ...prevLocation,
              province: {
                code: curProvince?.id,
                name: curProvince?.name,
              },
            };
          });
        }
      }
      if (districtsData) {
        const curDistrict = districtsData?.data?.find((d: any) => {
          return d?.name === location?.district?.name;
        });
        if (curDistrict) {
          setLocation((prevLocation) => {
            return {
              ...prevLocation,
              district: {
                code: curDistrict?.id,
                name: curDistrict?.name,
              },
            };
          });
        }
      }
    }
  }, [typeActionLocation, provinces, districtsData]);

  return (
    <View>
      {location.province.name && (
        <View className='p-4 flex-row justify-between'>
          <Text>Khu vực được chọn</Text>
          <Pressable onPress={resetLocation}>
            <Text className='text-red-500'> Thiết lập lại</Text>
          </Pressable>
        </View>
      )}
      {location.province.name && (
        <View className='p-4 bg-white flex-row gap-2 items-center'>
          <Text className='relative w-2 h-2 bg-red-500 rounded-full'></Text>
          <Text>{location.province.name}</Text>
        </View>
      )}
      {location.district.name && (
        <View className='p-4 bg-white flex-row gap-2 items-center'>
          <Text className='w-2 h-2 bg-red-500 rounded-full'></Text>
          <Text>{location.district.name}</Text>
        </View>
      )}
      {location.ward.name && (
        <View className='p-4 bg-white flex-row gap-2 items-center'>
          <Text className='w-2 h-2 bg-red-500 rounded-full'></Text>
          <Text>{location.ward.name}</Text>
        </View>
      )}
      {!location.province.name && (
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Text className='p-4'>Tỉnh/Thành phố</Text>
          <ListItem
            data={provinces}
            renderItem={({ item }: any) => (
              <Pressable
                className='p-4 border-b border-neutral-200 flex-row justify-between items-center'
                key={item?.id}
                onPress={() =>
                  setLocation((prevLocation) => {
                    return {
                      ...prevLocation,
                      province: {
                        code: item?.id,
                        name: item?.name,
                      },
                    };
                  })
                }
              >
                <Text
                  className={`${
                    location?.province?.name === item?.name
                      ? 'text-red-500'
                      : ''
                  }`}
                >
                  {item?.name}
                </Text>
                {location?.province?.name === item?.name && (
                  <Feather name='check' size={18} color='#ef4444' />
                )}
              </Pressable>
            )}
            onEndReached={loadMoreProvince}
            onEndReachedThreshold={0.1}
            isLoading={isLoadingProvince}
            isPaginate={true}
          />
        </ScrollView>
      )}
      {!location.district.name && (
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Text className='p-4'>Quận/Huyện</Text>
          <ListItem
            data={districts}
            renderItem={({ item }: any) => (
              <Pressable
                className='p-4 border-b border-neutral-200 flex-row justify-between items-center'
                key={item?.id}
                onPress={() =>
                  setLocation((prevLocation) => {
                    return {
                      ...prevLocation,
                      district: {
                        code: item?.id,
                        name: item?.name,
                      },
                    };
                  })
                }
              >
                <Text
                  className={`${
                    location?.district?.name === item?.name
                      ? 'text-red-500'
                      : ''
                  }`}
                >
                  {item?.name}
                </Text>
                {location?.district?.name === item?.name && (
                  <Feather name='check' size={18} color='#ef4444' />
                )}
              </Pressable>
            )}
            onEndReached={loadMoreDistrict}
            onEndReachedThreshold={0.1}
            isLoading={isLoadingDistricts}
            isPaginate={true}
          />
        </ScrollView>
      )}
      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Text className='p-4'>Phường/Xã</Text>
        <ListItem
          data={wards}
          renderItem={({ item }: any) => (
            <Pressable
              className='p-4 border-b border-neutral-200 flex-row justify-between items-center'
              key={item?.id}
              onPress={() => handleSelectedWard(item)}
            >
              <Text
                className={`${
                  location?.ward?.name === item?.name ? 'text-red-500' : ''
                }`}
              >
                {item?.name}
              </Text>
              {location?.ward?.name === item?.name && (
                <Feather name='check' size={18} color='#ef4444' />
              )}
            </Pressable>
          )}
          onEndReached={loadMoreWard}
          onEndReachedThreshold={0.1}
          isLoading={isLoadingWards}
          isPaginate={true}
        />
      </ScrollView>
    </View>
  );
}
