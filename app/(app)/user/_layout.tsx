import { Stack } from 'expo-router';
import { LocationProvider } from './contexts/LocationProvider';
import { ProvinceProvider } from '@/contexts/ProvinceProvider';

const UserLayout = () => {
  return (
    <ProvinceProvider>
      <LocationProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#ef4444' },
            headerTintColor: 'white',
          }}
        >
          <Stack.Screen name='index' options={{ headerShown: false }} />
          <Stack.Screen
            name='addresses/index'
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
            name='wishlist/index'
            options={{
              headerTitle: 'Danh sách mong muốn',
              headerTitleAlign: 'center',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name='order/item'
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name='order/motor-cycle'
            options={{
              headerShown: false,
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
    </ProvinceProvider>
  );
};

export default UserLayout;
