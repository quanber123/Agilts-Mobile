import { View, Text, SafeAreaView, Pressable, TextInput } from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import {
  useGetCSRFCookieMutation,
  useUpdateAddressMutation,
} from '@/services/redux/query/appQuery';
import LoadingApp from '@/components/ui/LoadingApp';
import { defaultCountry } from '@/constants/Config';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LocationContext } from '../contexts/LocationProvider';
import { UserContext } from '@/contexts/UserProvider';
export default function UpdateAddressScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [getCsrfCookie, { isLoading: isLoadingCsrfCookie }] =
    useGetCSRFCookieMutation();
  const { previousRoute, addresses } = useContext(UserContext);
  const { location, setLocation, setTypeActionLocation, resetLocation } =
    useContext(LocationContext);
  const [contact, setContact] = useState({
    customer_name: '',
    customer_phone_number: '',
  });
  const [addressDetails, setAddressDetails] = useState('');
  const [settings, setSettings] = useState({
    type: 0,
    default: false,
  });
  const disabledForm = useMemo(() => {
    return (
      !contact.customer_name ||
      !contact.customer_phone_number ||
      !addressDetails ||
      !location.province.name ||
      !location.district.name ||
      !location.ward.name
    );
  }, [contact, addressDetails, location]);
  const [
    updateAddress,
    {
      isLoading: isLoadingUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
      isSuccess: isSuccessUpdate,
    },
  ] = useUpdateAddressMutation();
  const errors = useMemo(() => {
    return isErrorUpdate && (errorUpdate as any)?.data;
  }, [errorUpdate, isErrorUpdate]);
  const handleUpdateAddress = useCallback(async () => {
    await getCsrfCookie(null);
    await updateAddress({
      body: {
        country: defaultCountry,
        ...contact,
        ...settings,
        province_id: location.province.code,
        district_id: location.district.code,
        ward_id: location.ward.code,
        address_detail: addressDetails,
      },
      id: id,
    });
  }, [
    getCsrfCookie,
    updateAddress,
    contact,
    settings,
    location,
    addressDetails,
    id,
  ]);
  useEffect(() => {
    const curAddress = addresses.find((a) => {
      return a.id === Number(id);
    });
    if (curAddress) {
      setSettings({
        type: curAddress.type,
        default: curAddress.default,
      });
      setContact((prevCon) => {
        return {
          ...prevCon,
          customer_name: curAddress?.customer_name,
          customer_phone_number: curAddress?.customer_phone_number,
        };
      });
      setAddressDetails(curAddress.address_detail);
      setLocation((prevLocation: any) => {
        return {
          ...prevLocation,
          province: {
            code: curAddress?.province?.id,
            name: curAddress?.province?.name,
          },
          district: {
            code: curAddress?.district?.id,
            name: curAddress?.district?.name,
          },
          ward: {
            code: curAddress?.ward?.id,
            name: curAddress?.ward?.name,
          },
        };
      });
    }
  }, [id, addresses, setLocation]);
  useEffect(() => {
    if (isSuccessUpdate) {
      router.push(previousRoute !== '/' ? previousRoute : '/user/addresses');
      resetLocation();
      setTypeActionLocation(null);
    }
  }, [isSuccessUpdate, router]);
  if (isLoadingCsrfCookie || isLoadingUpdate) return <LoadingApp />;
  return (
    <SafeAreaView className='flex-1 flex-col gap-4'>
      <View>
        <Text className='font-medium px-4 py-2 text-neutral-500'>Liên hệ</Text>
        <View className='bg-white flex-col'>
          <TextInput
            nativeID='customer_name'
            className='px-4 py-2 border-b border-neutral-200'
            placeholder='Họ và tên'
            value={contact.customer_name}
            onChangeText={(value) =>
              setContact((prevContact) => {
                return { ...prevContact, customer_name: value };
              })
            }
          />
          {errors?.errors?.customer_name?.[0] && (
            <Text className='px-4 py-2 text-red-500 font-semibold'>
              {errors?.errors?.customer_name?.[0]}
            </Text>
          )}
          <TextInput
            nativeID='customer_phone_number'
            className='px-4 py-2'
            placeholder='Số điện thoại'
            keyboardType='numeric'
            value={contact.customer_phone_number}
            onChangeText={(value) =>
              setContact((prevContact) => {
                return { ...prevContact, customer_phone_number: value };
              })
            }
          />
          {errors?.errors?.customer_phone_number?.[0] && (
            <Text className='px-4 py-2 text-red-500 font-semibold'>
              {errors?.errors?.customer_phone_number?.[0]}
            </Text>
          )}
        </View>
      </View>
      <View>
        <Text className='font-medium px-4 py-2 text-neutral-500'>Địa chỉ</Text>
        <View className='bg-white flex-col'>
          {!location.province.name &&
            !location.district.name &&
            !location.ward.name && (
              <Pressable
                className='px-4 py-3 flex-row justify-between items-center border-b border-neutral-200'
                disabled={isLoadingUpdate}
                onPress={() => {
                  setTypeActionLocation('update');
                  router.push('/user/location');
                }}
              >
                <Text className='text-neutral-500'>
                  Tình/Thành phố, Quận/Huyện, Phường/Xã
                </Text>
                <FontAwesome6 name='chevron-right' size={12} color='#737373' />
              </Pressable>
            )}
          {location.province.name &&
            location.district.name &&
            location.ward.name && (
              <Pressable
                className='px-4 py-3 flex-col gap-2 border-b border-neutral-200'
                disabled={isLoadingUpdate}
                onPress={() => {
                  setTypeActionLocation('update');
                  router.push('/user/location');
                }}
              >
                <Text className='text-neutral-800'>
                  {location.province.name}
                </Text>
                <Text className='text-neutral-800'>
                  {location.district.name}
                </Text>
                <Text className='text-neutral-800'>{location.ward.name}</Text>
              </Pressable>
            )}
          {errors?.errors?.province_id && (
            <Text className='px-4 py-2 text-red-500 font-semibold'>
              {errors?.errors?.province_id?.[0]}
            </Text>
          )}
          {errors?.errors?.district_id && (
            <Text className='px-4 py-2 text-red-500 font-semibold'>
              {errors?.errors?.district_id?.[0]}
            </Text>
          )}
          {errors?.errors?.ward_id && (
            <Text className='px-4 py-2 text-red-500 font-semibold'>
              {errors?.errors?.ward_id?.[0]}
            </Text>
          )}
          <TextInput
            className='px-4 py-2'
            placeholder='Tên đường, Tòa nhà, Số nhà.'
            value={addressDetails}
            onChangeText={(value) => setAddressDetails(value)}
          />
          {errors?.errors?.address_detail && (
            <Text className='px-4 py-2 text-red-500 font-semibold'>
              {errors?.errors?.address_detail?.[0]}
            </Text>
          )}
        </View>
      </View>
      <View>
        <Text className='font-medium px-4 py-2 text-neutral-500'>Cài đặt</Text>
        <View className='bg-white flex-col'>
          <View className='px-4 py-3 flex-row justify-between items-center border-b border-neutral-200'>
            <Text>Loại địa chỉ:</Text>
            <View className='flex-row items-center gap-4'>
              <Pressable
                className={`${
                  settings.type === 0
                    ? 'border border-red-500'
                    : 'bg-neutral-200'
                } transition-colors px-2 py-1`}
                onPress={() =>
                  setSettings((prevSettings) => {
                    return { ...prevSettings, type: 0 };
                  })
                }
                disabled={isLoadingUpdate}
              >
                <Text
                  className={`text-sm ${
                    settings.type === 0 ? 'text-red-500' : ''
                  }`}
                >
                  Nhà riêng
                </Text>
              </Pressable>
              <Pressable
                className={`${
                  settings.type === 1
                    ? 'border border-red-500'
                    : 'bg-neutral-200'
                } transition-colors px-2 py-1`}
                onPress={() =>
                  setSettings((prevSettings) => {
                    return { ...prevSettings, type: 1 };
                  })
                }
                disabled={isLoadingUpdate}
              >
                <Text
                  className={`text-sm ${
                    settings.type === 1 ? 'text-red-500' : ''
                  }`}
                >
                  Văn phòng
                </Text>
              </Pressable>
            </View>
          </View>
          <View className='px-4 py-3 flex-row justify-between items-center border-b border-neutral-200'>
            <Text>Đặt làm địa chỉ mặc định</Text>
            <Pressable
              className={`w-[72px] h-[32px] ${
                settings.default ? 'bg-green-500' : 'bg-neutral-200'
              } transition-colors rounded-3xl flex-row items-center px-[2px]`}
              onPress={() =>
                setSettings((prevSettings) => {
                  return { ...prevSettings, default: !settings.default };
                })
              }
              disabled={isLoadingUpdate}
            >
              <Text
                className={`w-[36px] h-[30px] bg-white rounded-full ${
                  settings.default ? 'translate-x-8' : 'translate-x-0'
                } transition-all duration-150`}
              ></Text>
            </Pressable>
          </View>
        </View>
      </View>
      <Pressable
        className={`mt-6 py-4 flex-row justify-center items-center gap-x-2 ${
          disabledForm ? 'bg-neutral-300' : 'bg-red-500'
        }`}
        disabled={disabledForm || isLoadingUpdate}
        onPress={handleUpdateAddress}
      >
        <Text
          className={`font-medium uppercase ${
            disabledForm ? 'text-neutral-500' : 'text-white'
          }`}
        >
          Hoàn thành
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
