import { View, Text, SafeAreaView, Pressable, TextInput } from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { useCreateAddressMutation } from '@/services/redux/query/appQuery';
import LoadingApp from '@/components/ui/LoadingApp';
import { defaultCountry } from '@/constants/Config';
import { useRouter } from 'expo-router';
import { LocationContext } from '../contexts/LocationProvider';
import { CustomInput } from '@/components/ui/CustomInput';
export default function AddAddressScreen() {
  const router = useRouter();
  const { location, setTypeActionLocation, resetLocation } =
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
  }, [contact, settings, addressDetails, location]);
  const [
    createAddress,
    {
      isLoading: isLoadingCreate,
      isError: isErrorCreate,
      error: errorCreate,
      isSuccess: isSuccessCreate,
    },
  ] = useCreateAddressMutation();
  const errors = useMemo(() => {
    return isErrorCreate && (errorCreate as any)?.data;
  }, [errorCreate, isErrorCreate]);
  const handleCreateAddress = useCallback(async () => {
    await createAddress({
      country: defaultCountry,
      ...contact,
      ...settings,
      province_id: location.province.code,
      district_id: location.district.code,
      ward_id: location.ward.code,
      address_detail: addressDetails,
    });
  }, [createAddress, contact, settings, location, addressDetails]);
  useEffect(() => {
    if (isSuccessCreate) {
      router.back();
      resetLocation();
      setTypeActionLocation(null);
    }
  }, [isSuccessCreate, router]);
  if (isLoadingCreate) return <LoadingApp />;
  return (
    <SafeAreaView className='flex-1 flex-col gap-4'>
      <View>
        <Text className='font-medium px-4 py-2 text-neutral-500'>Liên hệ</Text>
        <View className='bg-white flex-col'>
          <CustomInput
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
          <CustomInput
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
                disabled={isLoadingCreate}
                onPress={() => {
                  setTypeActionLocation('add');
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
                disabled={isLoadingCreate}
                onPress={() => {
                  setTypeActionLocation('add');
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
          {errors?.errors?.district && (
            <Text className='px-4 py-2 text-red-500 font-semibold'>
              {errors?.errors?.district?.[0]}
            </Text>
          )}
          {errors?.errors?.province && (
            <Text className='px-4 py-2 text-red-500 font-semibold'>
              {errors?.errors?.province?.[0]}
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
                disabled={isLoadingCreate}
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
                disabled={isLoadingCreate}
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
              disabled={isLoadingCreate}
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
        className={`py-4 flex-row justify-center items-center gap-x-2 ${
          disabledForm ? 'bg-neutral-300' : 'bg-red-500'
        }`}
        disabled={disabledForm || isLoadingCreate}
        onPress={handleCreateAddress}
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
