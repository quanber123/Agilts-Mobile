import { useSession } from '@/contexts/SessionProvider';
import { Pressable, Text, View } from 'react-native';

export default function TabTwoScreen() {
  const { signOut } = useSession();
  return (
    <View className='flex-1 justify-center items-center'>
      <Text className='text-3xl font-bold text-red-500'>Hello world</Text>
      <Pressable className='text-3xl font-bold text-red-500' onPress={signOut}>
        <Text>Đăng xuất</Text>
      </Pressable>
    </View>
  );
}
