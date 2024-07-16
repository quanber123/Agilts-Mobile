import { useSession } from '@/contexts/SessionProvider';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { useState } from 'react';
import LoadingApp from '@/components/ui/LoadingApp';
export default function SignInScreen() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const {
    signIn,
    isLoadingCsrfCookie,
    isLoadingUser,
    isLoadingSession,
    errorResponse,
  } = useSession();
  if (isLoadingCsrfCookie || isLoadingUser || isLoadingSession)
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
          <TextInput
            style={{ paddingHorizontal: 16, paddingVertical: 8 }}
            nativeID='email'
            className='border border-neutral-300 rounded-sm'
            placeholder='Nhập địa chỉ email...'
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />
          {errorResponse?.type === 'login' && errorResponse?.errors?.email && (
            <Text className='font-bold text-red-500'>
              {errorResponse.errors.email[0]}
            </Text>
          )}
        </View>
        <View className='w-full gap-y-2'>
          <TextInput
            style={{ paddingHorizontal: 16, paddingVertical: 8 }}
            nativeID='password'
            className='border border-neutral-300 rounded-sm'
            placeholder='Nhập mật khẩu...'
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
          />
          {errorResponse?.type === 'login' &&
            errorResponse?.errors?.password && (
              <Text className='font-bold text-red-500'>
                {errorResponse.errors.password[0]}
              </Text>
            )}
        </View>
        <View className='w-full'>
          <Pressable
            className='w-full'
            onPress={async () => await signIn({ ...form })}
            disabled={
              isLoadingCsrfCookie || isLoadingCsrfCookie || isLoadingUser
            }
          >
            <Text className='py-4 rounded-sm bg-neutral-800 text-white text-center font-bold uppercase tracking-[2px]'>
              Đăng nhập
            </Text>
          </Pressable>
        </View>
        <View className='w-full'>
          <Pressable
            className='w-max m-auto'
            disabled={
              isLoadingCsrfCookie || isLoadingCsrfCookie || isLoadingUser
            }
          >
            <Text className='font-medium'>Quên mật khẩu?</Text>
          </Pressable>
        </View>
        <View className='w-full'>
          <Pressable
            className='w-max m-auto'
            disabled={
              isLoadingCsrfCookie || isLoadingCsrfCookie || isLoadingUser
            }
          >
            <Text>
              Chưa có tài khoản? <Text className='font-medium'>Đăng ký</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
