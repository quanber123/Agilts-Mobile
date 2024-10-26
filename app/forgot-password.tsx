import { useSession } from '@/contexts/SessionProvider';
import { Pressable, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import LoadingApp from '@/components/ui/LoadingApp';
import { CustomInput } from '@/components/ui/CustomInput';
import { router } from 'expo-router';
import { useForgotPasswordMutation } from '@/services/redux/query/appQuery';
export default function ForgotPasswordScreen() {
  const [forgotPassword, { isLoading, isSuccess, data, isError, error }] =
    useForgotPasswordMutation();
  const errorReset = useMemo(() => {
    return isError && (error as any)?.data;
  }, [isError, error]);

  const [email, setEmail] = useState('');
  const { isLoadingCsrfCookie, isLoadingUser, isLoadingSession } = useSession();
  useEffect(() => {
    if (isSuccess && data) {
      Toast.show({
        type: 'success',
        text2: data?.message,
        position: 'top',
        topOffset: 60,
      });
    }
  }, [isSuccess, data]);
  const handleForgotPassword = useCallback(async () => {
    await forgotPassword({ email: email });
  }, [email]);
  if (isLoading || isLoadingCsrfCookie || isLoadingUser || isLoadingSession)
    return <LoadingApp />;
  return (
    <View className='flex-1 items-center justify-center bg-white px-4'>
      <Toast />
      <View className='w-full py-16 px-4 shadow-lg flex flex-col justify-center gap-y-6'>
        <View className='w-full flex justify-center items-center'>
          <Image
            source={require('@/assets/images/logo.png')}
            alt='agilts-logo'
            priority='high'
            style={{ width: 56, height: 56 }}
            onError={() => console.log('error image')}
          />
        </View>
        <View className='w-full my-6'>
          <Text className='text-center text-2xl font-bold uppercase tracking-[2px]'>
            Tìm tài khoản của bạn
          </Text>
        </View>
        <CustomInput
          nativeID='email'
          placeholder='Nhập địa chỉ email...'
          value={email}
          onChangeText={(text) => setEmail(text)}
          errorValue={errorReset?.errors?.email?.[0]}
        />
        <View className='w-full'>
          <Pressable
            className='w-full'
            onPress={handleForgotPassword}
            disabled={
              isLoading ||
              isLoadingCsrfCookie ||
              isLoadingCsrfCookie ||
              isLoadingUser
            }
          >
            <Text className='py-4 rounded-sm bg-neutral-800 text-white text-center font-bold uppercase tracking-[2px]'>
              Xác nhận
            </Text>
          </Pressable>
        </View>
        <View className='w-full'>
          <Pressable
            className='w-max m-auto'
            disabled={
              isLoading ||
              isLoadingCsrfCookie ||
              isLoadingCsrfCookie ||
              isLoadingUser
            }
            onPress={() => router.push('/sign-in')}
          >
            <Text className='font-medium text-blue-500'>Về trang chủ</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
