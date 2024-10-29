import { SafeAreaView, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { UserContext } from '@/contexts/UserProvider';
import ListItem from '@/components/ui/ListItem';
import WishlistItem from './wishlist-item';
export default function CartScreen() {
  const { wishlist } = useContext(UserContext);
  return wishlist?.length > 0 ? (
    <SafeAreaView className='flex-1'>
      <ListItem
        customClass='flex-1 p-4'
        data={wishlist}
        renderItem={({ item }: any) => {
          return <WishlistItem wishlist={item} />;
        }}
      />
    </SafeAreaView>
  ) : (
    <SafeAreaView className='flex-1'>
      <View className='flex-1 justify-center items-center'>
        <Text className='text-base font-bold'>Bạn chưa có sản phẩm!</Text>
      </View>
    </SafeAreaView>
  );
}
