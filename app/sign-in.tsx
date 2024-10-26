import { useSession } from '@/contexts/SessionProvider';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useCallback, useState, useTransition } from 'react';
import LoadingApp from '@/components/ui/LoadingApp';
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomInputPassword } from '@/components/ui/CustomPassword';
import { router } from 'expo-router';
import Checkbox from 'expo-checkbox';
export default function SignInScreen() {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: true,
  });
  const {
    signIn,
    isLoadingCsrfCookie,
    isLoadingUser,
    isLoadingSession,
    errorResponse,
  } = useSession();
  const handleSignIn = useCallback(async () => {
    await signIn({ ...form });
  }, [signIn, form]);
  if (isLoadingCsrfCookie || isLoadingUser || isLoadingSession)
    return <LoadingApp />;
  return (
    <View className='flex-1 items-center justify-center bg-white px-4'>
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
          <Text className='text-center text-3xl font-bold uppercase text-red-500 tracking-[2px]'>
            Đăng nhập
          </Text>
        </View>
        <CustomInput
          nativeID='email'
          placeholder='Nhập địa chỉ email...'
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          errorValue={
            errorResponse?.type === 'login'
              ? errorResponse?.errors?.email?.[0]
              : ''
          }
        />
        <CustomInputPassword
          placeholder='Nhập mật khẩu...'
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          errorValue={
            errorResponse?.type === 'login'
              ? errorResponse?.errors?.password?.[0]
              : ''
          }
        />
        <View className='w-full flex flex-row items-center gap-x-2'>
          <Checkbox
            value={form.remember}
            onValueChange={(value) => setForm({ ...form, remember: value })}
            color={form.remember ? '#FF0000' : undefined}
          />
          <Text>Ghi nhớ tôi</Text>
        </View>
        <View className='w-full'>
          <Pressable
            className='w-full'
            onPress={() =>
              startTransition(() => {
                handleSignIn();
              })
            }
            disabled={
              isPending ||
              isLoadingCsrfCookie ||
              isLoadingCsrfCookie ||
              isLoadingUser
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
              isPending ||
              isLoadingCsrfCookie ||
              isLoadingCsrfCookie ||
              isLoadingUser
            }
            onPress={() => router.push('/forgot-password')}
          >
            <Text className='font-medium'>Quên mật khẩu?</Text>
          </Pressable>
        </View>
        <View className='w-full'>
          <Pressable
            className='w-max m-auto'
            disabled={
              isPending ||
              isLoadingCsrfCookie ||
              isLoadingCsrfCookie ||
              isLoadingUser
            }
            onPress={() => router.push('/sign-up')}
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
