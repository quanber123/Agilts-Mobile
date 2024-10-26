import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { LocationProvider } from './contexts/LocationProvider';
import { useContext } from 'react';
import { UserContext } from '@/contexts/UserProvider';
const CartButton = () => {
  const router = useRouter();
  const { cart } = useContext(UserContext);
  return (
    <Pressable className='relative' onPress={() => router.push('/user/cart')}>
      <Feather name='shopping-cart' size={24} color='white' />
      {cart?.length > 0 && (
        <Text className='absolute -top-1/3 -right-2 bg-red-500 text-white border border-white w-5 h-5 rounded-full text-sm text-center'>
          {cart?.length}
        </Text>
      )}
    </Pressable>
  );
};

const UserLayout = () => {
  return (
    <LocationProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ef4444' },
          headerTintColor: 'white',
        }}
      >
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen
          name='address'
          options={{
            headerTitle: 'Địa chỉ của tôi',
            headerTitleAlign: 'center',
            headerShown: true,
            headerRight: () => <CartButton />,
          }}
        />
        <Stack.Screen
          name='add-address/index'
          options={{
            headerTitle: 'Địa chỉ mới',
            headerTitleAlign: 'center',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name='update-address/[id]'
          options={{
            headerTitle: 'Sửa địa chỉ',
            headerTitleAlign: 'center',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name='location/index'
          options={{
            headerShown: true,
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name='cart/index'
          options={{
            headerTitle: 'Giỏ hàng',
            headerTitleAlign: 'center',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name='orders'
          options={{
            headerTitle: 'Đơn hàng',
            headerTitleAlign: 'center',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name='settings'
          options={{
            headerTitle: 'Thiết lập tài khoản',
            headerTitleAlign: 'center',
            headerShown: true,
          }}
        />
      </Stack>
    </LocationProvider>
  );
};

export default UserLayout;
