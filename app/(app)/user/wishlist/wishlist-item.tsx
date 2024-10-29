import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useTransition,
} from 'react';
import CustomImage from '@/components/ui/CustomImage';
import { Wishlist } from '@/types/types';
import { formatPrice } from '@/services/utils/format';
import Entypo from '@expo/vector-icons/Entypo';
import { TextInput } from 'react-native-gesture-handler';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useDeleteWishlistMutation } from '@/services/redux/query/appQuery';
import LoadingApp from '@/components/ui/LoadingApp';
import { AlterContext } from '@/contexts/AlterProvider';

type Props = {
  wishlist: Wishlist;
};
export default function WishlistItem({ wishlist }: Props) {
  const { setAlertModal, setIsAlertModal, setMessages } =
    useContext(AlterContext);
  const [
    deleteWishlist,
    {
      isLoading: isLoadingDelete,
      isSuccess: isSuccessDelete,
      error: errorDelete,
    },
  ] = useDeleteWishlistMutation();
  const [isPending, startTransition] = useTransition();
  const handleDeleteWishlist = useCallback(async () => {
    await deleteWishlist(wishlist?.id);
  }, [deleteWishlist]);
  useEffect(() => {
    if (isSuccessDelete) {
      setAlertModal('success');
      setIsAlertModal(true);
      setMessages('Cập nhật giỏ hàng thành công!');
    }
    if (errorDelete) {
      setAlertModal('error');
      setIsAlertModal(true);
      setMessages((errorDelete as any)?.data?.message);
    }
  }, [isSuccessDelete, errorDelete]);
  if (isPending || isLoadingDelete) return <LoadingApp />;
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View className='w-[96]px h-[80px]'>
          <CustomImage
            width={96}
            height={80}
            src={wishlist?.option?.images_preview?.[0]?.url}
            alt={wishlist?.option?.images_preview?.[0]?.alt}
          />
        </View>
        <View className='flex-1'>
          <View className='flex-row justify-between'>
            <Text className='flex-1' numberOfLines={1}>
              {wishlist?.option?.product?.name}
            </Text>
            <Pressable
              disabled={isPending || isLoadingDelete}
              className='ml-4'
              onPress={() =>
                startTransition(() => {
                  handleDeleteWishlist();
                })
              }
            >
              <EvilIcons name='trash' size={24} color='black' />
            </Pressable>
          </View>
          {wishlist?.option?.type_preview && (
            <Text className='text-neutral-500 text-xs' numberOfLines={1}>
              {wishlist?.option?.type_preview}
            </Text>
          )}
          {wishlist?.option?.version && (
            <Text className='text-neutral-500 text-xs' numberOfLines={1}>
              {wishlist?.option?.version}
            </Text>
          )}
          {wishlist?.option?.color && (
            <Text className='text-neutral-500 text-xs' numberOfLines={1}>
              {wishlist?.option?.color}
            </Text>
          )}
          {wishlist?.option?.volume && (
            <Text className='text-neutral-500 text-xs' numberOfLines={1}>
              {wishlist?.option?.volume}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
    gap: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
});
