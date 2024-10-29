import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import Checkbox from 'expo-checkbox';
import CustomImage from '@/components/ui/CustomImage';
import { Cart } from '@/types/types';
import { formatPrice } from '@/services/utils/format';
import Entypo from '@expo/vector-icons/Entypo';
import { TextInput } from 'react-native-gesture-handler';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import {
  useDeleteCartMutation,
  useUpdateCartMutation,
} from '@/services/redux/query/appQuery';
import Toast from 'react-native-toast-message';
import LoadingApp from '@/components/ui/LoadingApp';

type Props = {
  cart: Cart;
  selectedKeys: number[];
  handleCheck: (id: number) => void;
};
export default function CartItem({ cart, selectedKeys, handleCheck }: Props) {
  const [
    updateCart,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      error: errorUpdate,
    },
  ] = useUpdateCartMutation();
  const [deleteCart, { isLoading: isLoadingDelete }] = useDeleteCartMutation();
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(cart?.amount || 1);
  const isChangeQuantity = useMemo(() => {
    return quantity !== cart?.amount;
  }, [cart, quantity]);
  const ischeck = useMemo(() => {
    const valid = selectedKeys?.find((k) => k === cart?.option?.id);
    if (valid) return true;
    return false;
  }, [selectedKeys]);
  const handleDecreaseQuantity = useCallback(() => {
    setQuantity((prevQuantity) => {
      if (prevQuantity - 1 < 1) {
        return 1;
      }
      {
        return prevQuantity - 1;
      }
    });
  }, []);
  const handleIncreaseQuantity = useCallback(() => {
    setQuantity((prevQuantity) => {
      if (prevQuantity + 1 > cart?.option?.quantity) {
        return cart?.option?.quantity;
      }
      {
        return prevQuantity + 1;
      }
    });
  }, [cart]);
  const handleUpdateCart = useCallback(async () => {
    await updateCart({
      id: cart?.id,
      body: {
        amount: quantity,
      },
    });
  }, [updateCart, quantity]);
  const handleDeleteCart = useCallback(async () => {
    await deleteCart(cart?.id);
  }, [deleteCart]);
  useEffect(() => {
    if (isSuccessUpdate) {
      Toast.show({
        type: 'success',
        text2: 'Cập nhật giỏ hàng thành công',
        position: 'bottom',
      });
    }
    if (errorUpdate) {
      Toast.show({
        type: 'error',
        text2: (errorUpdate as any)?.data?.message,
        position: 'bottom',
      });
    }
  }, [isSuccessUpdate, errorUpdate]);
  if (isLoadingUpdate || isLoadingDelete) return <LoadingApp />;
  return (
    <View style={styles.container}>
      <Checkbox
        value={ischeck}
        onValueChange={() => handleCheck(cart?.option?.id)}
        color={ischeck ? '#ef4444' : undefined}
      />
      <View style={styles.item}>
        <View className='w-[96]px h-[80px]'>
          <CustomImage
            width={96}
            height={80}
            src={cart?.option?.images_preview?.[0]?.url}
            alt={cart?.option?.images_preview?.[0]?.alt}
          />
        </View>
        <View className='flex-1'>
          <View className='flex-row justify-between'>
            <Text className='flex-1' numberOfLines={1}>
              {cart?.option?.product?.name}
            </Text>
            <Pressable
              disabled={isPending || isLoadingUpdate || isLoadingDelete}
              className='ml-4'
              onPress={() =>
                startTransition(() => {
                  handleDeleteCart();
                })
              }
            >
              <EvilIcons name='trash' size={24} color='black' />
            </Pressable>
          </View>
          {cart?.option?.type_preview && (
            <Text className='text-neutral-500 text-xs' numberOfLines={1}>
              {cart?.option?.type_preview}
            </Text>
          )}
          {cart?.option?.version && (
            <Text className='text-neutral-500 text-xs' numberOfLines={1}>
              {cart?.option?.version}
            </Text>
          )}
          {cart?.option?.color && (
            <Text className='text-neutral-500 text-xs' numberOfLines={1}>
              {cart?.option?.color}
            </Text>
          )}
          {cart?.option?.volume && (
            <Text className='text-neutral-500 text-xs' numberOfLines={1}>
              {cart?.option?.volume}
            </Text>
          )}
          <View className='flex-1 my-2 flex-row justify-between items-center'>
            <Text className='text-red-500 font-medium' numberOfLines={1}>
              {formatPrice(cart?.option?.price_preview?.raw * cart?.amount)}
            </Text>
            <View className='flex-row items-stretch'>
              {isChangeQuantity && (
                <Pressable
                  disabled={isPending || isLoadingUpdate || isLoadingDelete}
                  className='mx-2 flex-row justify-center items-center'
                  onPress={() =>
                    startTransition(() => {
                      handleUpdateCart();
                    })
                  }
                >
                  <EvilIcons name='refresh' size={24} color='black' />
                </Pressable>
              )}
              <Pressable
                disabled={isPending || isLoadingUpdate || isLoadingDelete}
                aria-label='minus'
                className='border border-neutral-300 flex justify-center items-center py-1 px-2'
                onPress={handleDecreaseQuantity}
              >
                <Entypo name='minus' size={16} color='black' />
              </Pressable>
              <TextInput
                className='border border-neutral-300 w-max text-center px-1'
                value={quantity.toString()}
                aria-disabled
              />
              <Pressable
                disabled={isPending || isLoadingUpdate || isLoadingDelete}
                aria-label='plus'
                className='border border-neutral-300 flex justify-center items-center py-1 px-2'
                onPress={handleIncreaseQuantity}
              >
                <Entypo name='plus' size={16} color='black' />
              </Pressable>
            </View>
          </View>
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
