import { Stack } from 'expo-router';
import { LocationProvider } from './contexts/LocationProvider';

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
          name='address/index'
          options={{
            headerTitle: 'Địa chỉ của tôi',
            headerTitleAlign: 'center',
            headerShown: true,
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
          name='order/item/index'
          options={{
            headerTitle: 'Đơn mua phụ tùng/phụ kiện',
            headerTitleAlign: 'center',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name='order/motor-cycle/index'
          options={{
            headerTitle: 'Đơn mua xe máy',
            headerTitleAlign: 'center',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name='review/index'
          options={{
            headerTitle: 'Đánh giá sản phẩm',
            headerTitleAlign: 'center',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name='settings/index'
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
