import { useSession } from '@/contexts/SessionProvider';
import { Pressable, Text, View } from 'react-native';

export default function ServicesScreen() {
  const { signOut } = useSession();
  return (
    <View className='flex-1 justify-center items-center'>
      <Text className='text-3xl font-bold text-red-500'>ServicesScreen</Text>
    </View>
  );
}
