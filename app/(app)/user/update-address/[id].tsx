// import { View, Text, SafeAreaView, Pressable, TextInput } from 'react-native';
// import React, {
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from 'react';
// import { FontAwesome6 } from '@expo/vector-icons';
// import {
//   useGetCSRFCookieMutation,
//   useUpdateAddressMutation,
// } from '@/services/redux/query/appQuery';
// import LoadingApp from '@/components/ui/LoadingApp';
// import { defaultCountry } from '@/constants/Config';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { LocationContext } from '../contexts/LocationProvider';
// import { UserContext } from '@/contexts/UserProvider';
// export default function UpdateAddressScreen() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const [getCsrfCookie, { isLoading: isLoadingCsrfCookie }] =
//     useGetCSRFCookieMutation();
//   const { addresses } = useContext(UserContext);
//   const { location, setLocation, setTypeActionLocation, resetLocation } =
//     useContext(LocationContext);
//   const [contact, setContact] = useState({
//     name: '',
//     phone: '',
//   });
//   const [addressDetails, setAddressDetails] = useState('');
//   const [settings, setSettings] = useState({
//     type: 0,
//     default: false,
//   });
//   const disabledForm = useMemo(() => {
//     return (
//       !contact.name ||
//       !contact.phone ||
//       !addressDetails ||
//       !location.province.name ||
//       !location.district.name ||
//       !location.ward.name
//     );
//   }, [contact, settings, addressDetails, location]);
//   const [
//     updateAddress,
//     {
//       isLoading: isLoadingUpdate,
//       isError: isErrorUpdate,
//       error: errorUpdate,
//       isSuccess: isSuccessCreate,
//     },
//   ] = useUpdateAddressMutation();
//   const errors = useMemo(() => {
//     return isErrorUpdate && (errorUpdate as any)?.data;
//   }, [errorUpdate, isErrorUpdate]);
//   const handleUpdateAddress = useCallback(async () => {
//     await getCsrfCookie(null);
//     await updateAddress({
//       body: {
//         country: defaultCountry,
//         ...contact,
//         ...settings,
//         province: location.province.name,
//         district: location.district.name,
//         ward: location.ward.name,
//         address_detail: addressDetails,
//       },
//       id: id,
//     });
//   }, [
//     getCsrfCookie,
//     updateAddress,
//     contact,
//     settings,
//     location,
//     addressDetails,
//     id,
//   ]);
//   useEffect(() => {
//     const curAddress = addresses.find((a) => {
//       return a.id === Number(id);
//     });
//     if (curAddress) {
//       setSettings({
//         type: curAddress.type,
//         default: curAddress.default,
//       });
//       setAddressDetails(curAddress.address_detail);
//       setLocation((prevLocation) => {
//         return {
//           ...prevLocation,
//           province: {
//             code: '',
//             name: curAddress?.province,
//           },
//           district: {
//             code: '',
//             name: curAddress.district,
//           },
//           ward: {
//             code: '',
//             name: curAddress.ward,
//           },
//         };
//       });
//     }
//   }, [id, addresses]);
//   useEffect(() => {
//     if (isSuccessCreate) {
//       router.push('/user/address');
//       resetLocation();
//       setTypeActionLocation(null);
//     }
//   }, [isSuccessCreate, router]);
//   if (isLoadingCsrfCookie || isLoadingUpdate) return <LoadingApp />;
//   return (
//     <SafeAreaView className='flex-1 flex-col gap-4'>
//       <View>
//         <Text className='font-medium px-4 py-2 text-neutral-500'>Liên hệ</Text>
//         <View className='bg-white flex-col'>
//           <TextInput
//             className='px-4 py-2 border-b border-neutral-200'
//             placeholder='Họ và tên'
//             value={contact.name}
//             onChangeText={(value) =>
//               setContact((prevContact) => {
//                 return { ...prevContact, name: value };
//               })
//             }
//           />
//           <TextInput
//             className='px-4 py-2'
//             placeholder='Số điện thoại'
//             keyboardType='numeric'
//             value={contact.phone}
//             onChangeText={(value) =>
//               setContact((prevContact) => {
//                 return { ...prevContact, phone: value };
//               })
//             }
//           />
//         </View>
//       </View>
//       <View>
//         <Text className='font-medium px-4 py-2 text-neutral-500'>Địa chỉ</Text>
//         <View className='bg-white flex-col'>
//           {!location.province.name &&
//             !location.district.name &&
//             !location.ward.name && (
//               <Pressable
//                 className='px-4 py-3 flex-row justify-between items-center border-b border-neutral-200'
//                 disabled={isLoadingCsrfCookie || isLoadingUpdate}
//                 onPress={() => {
//                   setTypeActionLocation('update');
//                   router.push('/user/location');
//                 }}
//               >
//                 <Text className='text-neutral-500'>
//                   Tình/Thành phố, Quận/Huyện, Phường/Xã
//                 </Text>
//                 <FontAwesome6 name='chevron-right' size={12} color='#737373' />
//               </Pressable>
//             )}
//           {location.province.name &&
//             location.district.name &&
//             location.ward.name && (
//               <Pressable
//                 className='px-4 py-3 flex-col gap-2 border-b border-neutral-200'
//                 disabled={isLoadingCsrfCookie || isLoadingUpdate}
//                 onPress={() => {
//                   setTypeActionLocation('update');
//                   router.push('/user/location');
//                 }}
//               >
//                 <Text className='text-neutral-800'>
//                   {location.province.name}
//                 </Text>
//                 <Text className='text-neutral-800'>
//                   {location.district.name}
//                 </Text>
//                 <Text className='text-neutral-800'>{location.ward.name}</Text>
//               </Pressable>
//             )}
//           {errors?.errors?.district && (
//             <Text className='px-4 py-2 text-red-500 font-semibold'>
//               {errors?.errors?.district[0]}
//             </Text>
//           )}
//           {errors?.errors?.province && (
//             <Text className='px-4 py-2 text-red-500 font-semibold'>
//               {errors?.errors?.province[0]}
//             </Text>
//           )}
//           <TextInput
//             className='px-4 py-2'
//             placeholder='Tên đường, Tòa nhà, Số nhà.'
//             value={addressDetails}
//             onChangeText={(value) => setAddressDetails(value)}
//           />
//           {errors?.errors?.address_detail && (
//             <Text className='px-4 py-2 text-red-500 font-semibold'>
//               {errors?.errors?.address_detail[0]}
//             </Text>
//           )}
//         </View>
//       </View>
//       {/* Cài đặt section*/}
//       <View>
//         <Text className='font-medium px-4 py-2 text-neutral-500'>Cài đặt</Text>
//         <View className='bg-white flex-col'>
//           <View className='px-4 py-3 flex-row justify-between items-center border-b border-neutral-200'>
//             <Text>Loại địa chỉ:</Text>
//             <View className='flex-row items-center gap-4'>
//               <Pressable
//                 className={`${
//                   settings.type === 0
//                     ? 'border border-red-500'
//                     : 'bg-neutral-200'
//                 } transition-colors px-2 py-1`}
//                 onPress={() =>
//                   setSettings((prevSettings) => {
//                     return { ...prevSettings, type: 0 };
//                   })
//                 }
//                 disabled={isLoadingCsrfCookie || isLoadingUpdate}
//               >
//                 <Text
//                   className={`text-sm ${
//                     settings.type === 0 ? 'text-red-500' : ''
//                   }`}
//                 >
//                   Nhà riêng
//                 </Text>
//               </Pressable>
//               <Pressable
//                 className={`${
//                   settings.type === 1
//                     ? 'border border-red-500'
//                     : 'bg-neutral-200'
//                 } transition-colors px-2 py-1`}
//                 onPress={() =>
//                   setSettings((prevSettings) => {
//                     return { ...prevSettings, type: 1 };
//                   })
//                 }
//                 disabled={isLoadingCsrfCookie || isLoadingUpdate}
//               >
//                 <Text
//                   className={`text-sm ${
//                     settings.type === 1 ? 'text-red-500' : ''
//                   }`}
//                 >
//                   Văn phòng
//                 </Text>
//               </Pressable>
//             </View>
//           </View>
//           <View className='px-4 py-3 flex-row justify-between items-center border-b border-neutral-200'>
//             <Text>Đặt làm địa chỉ mặc định</Text>
//             <Pressable
//               className={`w-[72px] h-[32px] ${
//                 settings.default ? 'bg-green-500' : 'bg-neutral-200'
//               } transition-colors rounded-3xl flex-row items-center px-[2px]`}
//               onPress={() =>
//                 setSettings((prevSettings) => {
//                   return { ...prevSettings, default: !settings.default };
//                 })
//               }
//               disabled={isLoadingCsrfCookie || isLoadingUpdate}
//             >
//               <Text
//                 className={`w-[36px] h-[30px] bg-white rounded-full ${
//                   settings.default ? 'translate-x-8' : 'translate-x-0'
//                 } transition-all duration-150`}
//               ></Text>
//             </Pressable>
//           </View>
//         </View>
//       </View>
//       <Pressable
//         className={`py-4 flex-row justify-center items-center gap-x-2 bg-white`}
//         disabled={isLoadingCsrfCookie || isLoadingUpdate}
//         onPress={handleUpdateAddress}
//       >
//         <Text className={`font-medium uppercase text-red-500`}>
//           Xóa địa chỉ
//         </Text>
//       </Pressable>
//       <Pressable
//         className={`py-4 flex-row justify-center items-center gap-x-2 ${
//           disabledForm ? 'bg-neutral-300' : 'bg-red-500'
//         }`}
//         disabled={isLoadingCsrfCookie || isLoadingUpdate}
//         onPress={handleUpdateAddress}
//       >
//         <Text
//           className={`font-medium uppercase ${
//             disabledForm ? 'text-neutral-500' : 'text-white'
//           }`}
//         >
//           Hoàn thành
//         </Text>
//       </Pressable>
//     </SafeAreaView>
//   );
// }

import { View, Text } from 'react-native';
import React from 'react';

export default function id() {
  return (
    <View>
      <Text>[id]</Text>
    </View>
  );
}
