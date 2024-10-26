import { useSession } from '@/contexts/SessionProvider';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

export default function UserScreen() {
  const { user, signOut } = useSession();
  const router = useRouter();
  return (
    <SafeAreaView className='flex-1'>
      <View className='relative h-[150px] bg-red-500'>
        <View className='absolute top-12 right-4 flex-row items-center gap-x-4'>
          <Pressable onPress={() => router.push('/user/settings')}>
            <Feather name='settings' size={24} color='white' />
          </Pressable>
          <Pressable
            className='relative'
            onPress={() => router.push('/user/cart')}
          >
            <Feather name='shopping-cart' size={24} color='white' />
            <Text className='absolute -top-1/3 -right-2 bg-red-500 text-white border border-white w-5 h-5 rounded-full text-sm text-center'>
              1
            </Text>
          </Pressable>
        </View>
        <View className='absolute bottom-4 left-4 flex-row items-center gap-x-4'>
          <Ionicons name='person-circle-outline' size={56} color='#f5f5f5' />
          <View>
            <Text className='font-bold text-neutral-100'>{user?.name}</Text>
            <Text className='font-bold text-neutral-100'>{user?.email}</Text>
          </View>
        </View>
      </View>
      <Pressable
        className='p-4 border-b border-neutral-300 flex-row justify-between items-center'
        onPress={() => router.push('/user/order/motor-cycle')}
      >
        <View className='flex-row items-center gap-x-2'>
          <MaterialCommunityIcons
            name='clipboard-text-outline'
            size={24}
            color='#2563eb'
          />
          <Text>Đơn mua xe máy</Text>
        </View>
        <View className='flex-row items-center gap-x-2'>
          <FontAwesome6 name='chevron-right' size={12} color='black' />
        </View>
      </Pressable>
      <Pressable
        className='p-4 border-b border-neutral-300 flex-row justify-between items-center'
        onPress={() => router.push('/user/order/item')}
      >
        <View className='flex-row items-center gap-x-2'>
          <MaterialCommunityIcons
            name='clipboard-text-outline'
            size={24}
            color='#2563eb'
          />
          <Text>Đơn mua phụ tùng/phụ kiện</Text>
        </View>
        <View className='flex-row items-center gap-x-2'>
          <FontAwesome6 name='chevron-right' size={12} color='black' />
        </View>
      </Pressable>
      <Pressable
        className='p-4 border-b border-neutral-300 flex-row justify-between items-center'
        onPress={() => router.push('/user/address')}
      >
        <View className='w-full flex-row items-center gap-x-2'>
          <Ionicons name='location-outline' size={24} color='#eab308' />
          <Text>Thông tin người nhận</Text>
        </View>
        <FontAwesome6 name='chevron-right' size={12} color='black' />
      </Pressable>
      <Pressable
        className='p-4 border-b border-neutral-300 flex-row justify-between items-center'
        onPress={() => router.push('/user/cart')}
      >
        <View className='w-full flex-row items-center gap-x-2'>
          <Feather name='shopping-cart' size={24} color='#ea580c' />
          <Text>Giỏ hàng</Text>
        </View>
        <FontAwesome6 name='chevron-right' size={12} color='black' />
      </Pressable>
      <Pressable
        className='p-4 border-b border-neutral-300 flex-row justify-between items-center'
        onPress={() => router.push('/user/wishlist')}
      >
        <View className='w-full flex-row items-center gap-x-2'>
          <Feather name='heart' size={24} color='#ef4444' />
          <Text>Đã thích</Text>
        </View>
        <FontAwesome6 name='chevron-right' size={12} color='black' />
      </Pressable>
      <Pressable
        className='p-4 border-b border-neutral-300 flex-row justify-between items-center'
        onPress={() => router.push('/user/review')}
      >
        <View className='w-full flex-row items-center gap-x-2'>
          <Ionicons name='star-outline' size={24} color='#fde047' />
          <Text>Đánh giá của tôi</Text>
        </View>
        <FontAwesome6 name='chevron-right' size={12} color='black' />
      </Pressable>
      <Pressable
        className='p-4 border-b border-neutral-300 flex-row justify-between items-center'
        onPress={() => router.push('/user/settings')}
      >
        <View className='flex-row items-center gap-x-4'>
          <View className='items-center justify-center'>
            <Feather name='user' size={24} color='#1d4ed8' />
          </View>
          <Text>Thiết lập tài khoản</Text>
        </View>
        <FontAwesome6 name='chevron-right' size={12} color='black' />
      </Pressable>
      <Pressable
        className='p-4 border-b border-neutral-300 flex-row justify-between items-center'
        onPress={() => router.push('/')}
      >
        <View className='flex-row items-center gap-x-4'>
          <View className='items-center justify-center'>
            <Feather name='help-circle' size={24} color='#059669' />
          </View>
          <Text>Trum tâm trợ giúp</Text>
        </View>
        <FontAwesome6 name='chevron-right' size={12} color='black' />
      </Pressable>
    </SafeAreaView>
  );
}
