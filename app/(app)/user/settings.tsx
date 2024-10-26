import { useSession } from '@/contexts/SessionProvider';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
export default function SettingsScreen() {
  return (
    <SafeAreaView>
      <View className='flex-1 px-4 py-8 flex-col gap-y-6'>
        <Pressable className='flex-row justify-between items-center gap-x-4'>
          <View className='flex-row items-center gap-x-4'>
            <Text>Cài đặt</Text>
          </View>
          <FontAwesome6 name='chevron-right' size={16} color='black' />
        </Pressable>
        <Pressable className='flex-row justify-between items-center gap-x-4'>
          <View className='flex-row items-center gap-x-4'>
            <Text>Thông tin cá nhân</Text>
          </View>
          <FontAwesome6 name='chevron-right' size={16} color='black' />
        </Pressable>
        <Pressable className='flex-row justify-between items-center gap-x-4'>
          <View className='flex-row items-center gap-x-4'>
            <Text>Trợ giúp và hỗ trợ</Text>
          </View>
          <FontAwesome6 name='chevron-right' size={16} color='black' />
        </Pressable>
        <Pressable className='flex-row justify-between items-center gap-x-4'>
          <View className='flex-row items-center gap-x-4'>
            <Text>Mật khẩu và bảo mật</Text>
          </View>
          <FontAwesome6 name='chevron-right' size={16} color='black' />
        </Pressable>
      </View>
      <View className='py-6'>
        <Pressable className='p-4 bg-red-500 flex-row justify-center items-center gap-x-4'>
          <Feather name='log-in' size={24} color='white' />
          <Text className='text-white'>Đăng xuất</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
