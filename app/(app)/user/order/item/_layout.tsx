import { Stack } from 'expo-router';

const OrderItemLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ef4444' },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          headerTitle: 'Đơn mua phụ tùng/phụ kiện',
          headerTitleAlign: 'center',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name='[id]/index'
        options={{
          headerTitle: 'Chi tiết đơn hàng',
          headerTitleAlign: 'center',
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default OrderItemLayout;
