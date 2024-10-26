import { useSession } from '@/contexts/SessionProvider';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useCallback, useState, useTransition } from 'react';
import LoadingApp from '@/components/ui/LoadingApp';
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomInputPassword } from '@/components/ui/CustomPassword';
import { router } from 'expo-router';
export default function SignInScreen() {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const {
    signUp,
    isLoadingCsrfCookie,
    isLoadingUser,
    isLoadingSession,
    errorResponse,
  } = useSession();
  const handleSignUp = useCallback(async () => {
    await signUp({ ...form });
  }, [signUp, form]);
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
          <Text className='text-center text-3xl font-bold uppercase tracking-[2px]'>
            Đăng ký
          </Text>
        </View>
        <CustomInput
          value={form.name}
          nativeID='name'
          placeholder='Nhập tên người dùng...'
          onChangeText={(text) => setForm({ ...form, name: text })}
          errorValue={
            errorResponse?.type === 'register'
              ? errorResponse?.errors?.name?.[0]
              : ''
          }
        />
        <CustomInput
          value={form.email}
          nativeID='email'
          placeholder='Nhập địa chỉ email...'
          onChangeText={(text) => setForm({ ...form, email: text })}
          errorValue={
            errorResponse?.type === 'register'
              ? errorResponse?.errors?.email?.[0]
              : ''
          }
        />
        <CustomInputPassword
          placeholder='Nhập mật khẩu...'
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          errorValue={
            errorResponse?.type === 'register'
              ? errorResponse?.errors?.password?.[0]
              : ''
          }
        />
        <CustomInputPassword
          placeholder='Nhập lại mật khẩu...'
          value={form.password_confirmation}
          onChangeText={(text) =>
            setForm({ ...form, password_confirmation: text })
          }
          errorValue={
            errorResponse?.type === 'register'
              ? errorResponse?.errors?.confirm_password?.[0]
              : ''
          }
        />
        <View className='w-full'>
          <Pressable
            className='w-full'
            onPress={() =>
              startTransition(() => {
                handleSignUp();
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
              Đăng ký
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
            onPress={() => router.push('/sign-in')}
          >
            <Text>
              Đã có tài khoản? <Text className='font-medium'>Đăng nhập</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
