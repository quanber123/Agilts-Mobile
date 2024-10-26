import { View, Text, FlatList, Pressable } from 'react-native';
import React, { useCallback, useContext, useEffect } from 'react';
import { LocationContext } from '../contexts/LocationProvider';
import {
  useGetDistrictsQuery,
  useGetProvincesQuery,
  useGetWardsQuery,
} from '@/services/redux/query/countryQuery';
import { Feather } from '@expo/vector-icons';
import LoadingApp from '@/components/ui/LoadingApp';
import { useRouter } from 'expo-router';
export default function LocationScreen() {
  const router = useRouter();
  const {
    location,
    setLocation,
    resetLocation,
    typeActionLocation,
    setTypeActionLocation,
  } = useContext(LocationContext);
  const { data: provinceData, isLoading: isLoadingProvince } =
    useGetProvincesQuery(null);
  const { data: districtsData, isLoading: isLoadingDistricts } =
    useGetDistrictsQuery(location.province.code, {
      skip: !location.province.code,
      refetchOnReconnect: true,
    });
  const { data: wardsData, isLoading: isLoadingWards } = useGetWardsQuery(
    location.district.code,
    { skip: !location.district.code, refetchOnReconnect: true }
  );
  const handleSelectedWard = useCallback(
    (w: any) => {
      setLocation((prevLocation) => {
        return {
          ...prevLocation,
          ward: {
            code: w?.id,
            name: w?.full_name,
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
      if (provinceData) {
        const curProvince = provinceData?.data?.find((d: any) => {
          return d?.full_name === location?.province?.name;
        });
        if (curProvince) {
          setLocation((prevLocation) => {
            return {
              ...prevLocation,
              province: {
                code: curProvince?.id,
                name: curProvince?.full_name,
              },
            };
          });
        }
      }
      if (districtsData) {
        const curDistrict = districtsData?.data?.find((d: any) => {
          return d?.full_name === location?.district?.name;
        });
        if (curDistrict) {
          setLocation((prevLocation) => {
            return {
              ...prevLocation,
              district: {
                code: curDistrict?.id,
                name: curDistrict?.full_name,
              },
            };
          });
        }
      }
    }
  }, [typeActionLocation, provinceData, districtsData]);
  if (isLoadingProvince || isLoadingDistricts || isLoadingWards)
    return <LoadingApp />;
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
        <View>
          <Text className='p-4'>Tỉnh/Thành phố</Text>
          <FlatList
            className='flex-col bg-white'
            data={provinceData?.data}
            renderItem={({ item }) => (
              <Pressable
                className='p-4 border-b border-neutral-200 flex-row justify-between items-center'
                key={item?.id}
                onPress={() =>
                  setLocation((prevLocation) => {
                    return {
                      ...prevLocation,
                      province: {
                        code: item?.id,
                        name: item?.full_name,
                      },
                    };
                  })
                }
              >
                <Text
                  className={`${
                    location?.province?.name === item?.full_name
                      ? 'text-red-500'
                      : ''
                  }`}
                >
                  {item?.full_name}
                </Text>
                {location?.province?.name === item?.full_name && (
                  <Feather name='check' size={18} color='#ef4444' />
                )}
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
          ></FlatList>
        </View>
      )}
      {!location.district.name && (
        <View>
          <Text className='p-4'>Quận/Huyện</Text>
          <FlatList
            className='flex-col bg-white'
            data={districtsData?.data}
            renderItem={({ item }) => (
              <Pressable
                className='p-4 border-b border-neutral-200 flex-row justify-between items-center'
                key={item?.id}
                onPress={() =>
                  setLocation((prevLocation) => {
                    return {
                      ...prevLocation,
                      district: {
                        code: item?.id,
                        name: item?.full_name,
                      },
                    };
                  })
                }
              >
                <Text
                  className={`${
                    location?.district?.name === item?.full_name
                      ? 'text-red-500'
                      : ''
                  }`}
                >
                  {item?.full_name}
                </Text>
                {location?.district?.name === item?.full_name && (
                  <Feather name='check' size={18} color='#ef4444' />
                )}
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
          ></FlatList>
        </View>
      )}
      <View>
        <Text className='p-4'>Phường/Xã</Text>
        <FlatList
          className='flex-col bg-white'
          data={wardsData?.data}
          renderItem={({ item }) => (
            <Pressable
              className='p-4 border-b border-neutral-200 flex-row justify-between items-center'
              key={item?.id}
              onPress={() => handleSelectedWard(item)}
            >
              <Text
                className={`${
                  location?.ward?.name === item?.full_name ? 'text-red-500' : ''
                }`}
              >
                {item?.full_name}
              </Text>
              {location?.ward?.name === item?.full_name && (
                <Feather name='check' size={18} color='#ef4444' />
              )}
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        ></FlatList>
      </View>
    </View>
  );
}
