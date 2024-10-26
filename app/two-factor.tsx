import { useSession } from '@/contexts/SessionProvider';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useCallback, useState } from 'react';
import LoadingApp from '@/components/ui/LoadingApp';
import { CustomInput } from '@/components/ui/CustomInput';
import { router } from 'expo-router';
export default function TwoFactorScreen() {
  const [tab, setTab] = useState(0);
  const [code, setCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const {
    verify2Fa,
    isLoadingCsrfCookie,
    isLoadingUser,
    isLoadingSession,
    isLoadingVerify2Fa,
    errorResponse,
  } = useSession();
  const handleVerify = useCallback(async () => {
    await verify2Fa(tab === 0 ? true : false, tab === 0 ? code : recoveryCode);
  }, [verify2Fa, tab, code, recoveryCode]);
  if (
    isLoadingVerify2Fa ||
    isLoadingCsrfCookie ||
    isLoadingUser ||
    isLoadingSession
  )
    return <LoadingApp />;
  return (
    <View className='flex-1 items-center justify-center bg-white px-4'>
      <View className='w-full py-16 px-4 shadow-lg flex flex-col justify-center gap-y-4'>
        <View className='w-full flex justify-center items-center'>
          <Image
            source={require('@/assets/images/logo.png')}
            alt='agilts-logo'
            priority='high'
            style={{ width: 56, height: 56 }}
            onError={() => console.log('error image')}
          />
        </View>
        <View className='w-full'>
          <Text className='text-center text-3xl font-bold uppercase tracking-[2px]'>
            Đăng nhập
          </Text>
        </View>
        <View className='w-full gap-y-2'>
          {tab === 0 ? (
            <CustomInput
              style={{ paddingHorizontal: 16, paddingVertical: 12 }}
              nativeID='text'
              placeholder='Nhập mã xác thực ứng dụng...'
              value={code}
              onChangeText={(text) => setCode(text)}
              errorValue={
                errorResponse?.type === 'verify'
                  ? errorResponse?.errors?.code?.[0]
                  : ''
              }
            />
          ) : (
            <CustomInput
              style={{ paddingHorizontal: 16, paddingVertical: 12 }}
              nativeID='text'
              placeholder='Nhập mã khôi phục...'
              value={recoveryCode}
              onChangeText={(text) => setRecoveryCode(text)}
              errorValue={
                errorResponse?.type === 'verify'
                  ? errorResponse?.errors?.recovery_code?.[0]
                  : ''
              }
            />
          )}
        </View>
        <View>
          <Pressable onPress={() => setTab(tab === 0 ? 1 : 0)}>
            <Text className='text-blue-500 font-bold'>
              {tab === 0
                ? 'Sử dụng mã khôi phục'
                : 'Sử dụng mã xác thực ứng dụng'}
            </Text>
          </Pressable>
        </View>
        <View className='w-full'>
          <Pressable
            className='w-full'
            onPress={handleVerify}
            disabled={
              isLoadingCsrfCookie || isLoadingCsrfCookie || isLoadingUser
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
              isLoadingVerify2Fa ||
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
