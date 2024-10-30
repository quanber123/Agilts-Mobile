import { Pressable, Text, View } from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useTransition,
} from 'react';
import { Product } from '@/types/types';
import { router, useLocalSearchParams } from 'expo-router';
import { listTypes } from '@/config/products_type';
import CustomImage from './CustomImage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { UserContext } from '@/contexts/UserProvider';
import {
  useCreateWishlistMutation,
  useDeleteWishlistMutation,
} from '@/services/redux/query/appQuery';
import AntDesign from '@expo/vector-icons/AntDesign';
import { AlterContext } from '@/contexts/AlterProvider';

function SingleProduct({
  product,
  needFav = true,
}: {
  product: Product;
  needFav?: boolean;
}) {
  const { setIsAlertModal, setAlertModal, setMessages } =
    useContext(AlterContext);
  const [isPending, startTransition] = useTransition();
  const params = useLocalSearchParams();
  const { wishlist } = useContext(UserContext);
  const type = params?.type;
  const curTypeIndex = listTypes.findIndex((t) => t.key === type);
  const [
    createWishlist,
    {
      isLoading: isLoadingCreate,
      isSuccess: isSuccessCreate,
      isError: isErrorCreate,
      error: errorCreate,
    },
  ] = useCreateWishlistMutation();
  const [
    deleteWishlist,
    {
      isLoading: isLoadingDelete,
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete,
    },
  ] = useDeleteWishlistMutation();
  const color = params?.color;
  const version = params?.version;
  const volume = params?.volume;
  const selectedOption = useMemo(() => {
    return product?.options?.find(
      (o) =>
        (!curTypeIndex ||
          o.type_preview === listTypes?.[curTypeIndex]?.value) &&
        (!color || o.color === color) &&
        (!version || o.version === version) &&
        (o.volume === volume || !volume)
    );
  }, [curTypeIndex, color, version, volume, product?.options]);
  const favorite = useMemo(() => {
    return wishlist?.find((w) =>
      selectedOption
        ? w?.option?.id === selectedOption?.id
        : w?.option?.id === product?.options?.[0]?.id
    );
  }, [selectedOption, wishlist, product?.options]);
  const handleFavorite = useCallback(async () => {
    if (favorite) {
      await deleteWishlist(favorite?.id);
    } else {
      await createWishlist({
        option_id: selectedOption
          ? selectedOption?.id
          : product?.options?.[0]?.id,
      });
    }
  }, [createWishlist, deleteWishlist, selectedOption, favorite, product]);
  useEffect(() => {
    if (isSuccessCreate) {
      setAlertModal('success');
      setIsAlertModal(true);
      setMessages('Thêm sản phẩm vào danh sách ước thành công!');
    }
    if (isErrorCreate && errorCreate) {
      setAlertModal('error');
      setIsAlertModal(true);
      setMessages((errorCreate as any)?.data?.message);
    }
  }, [isSuccessCreate, isErrorCreate, errorCreate]);
  useEffect(() => {
    if (isSuccessDelete) {
      setAlertModal('success');
      setIsAlertModal(true);
      setMessages('Xóa sản phẩm vào danh sách ước thành công!');
    }
    if (isErrorDelete && errorDelete) {
      setAlertModal('error');
      setIsAlertModal(true);
      setMessages((errorDelete as any)?.data?.message);
    }
  }, [isSuccessDelete, isErrorDelete, errorDelete]);
  return (
    <View className='flex-1 max-w-[45%] p-4 border border-neutral-100'>
      <View className='relative flex h-[180px] w-full items-center justify-center overflow-hidden'>
        {needFav && (
          <View className='absolute w-max h-max right-4 top-4 z-20'>
            <Pressable
              disabled={isPending || isLoadingCreate || isLoadingDelete}
              onPress={() =>
                startTransition(() => {
                  handleFavorite();
                })
              }
            >
              <AntDesign
                name={favorite ? 'heart' : 'hearto'}
                size={18}
                color={favorite ? '#ef4444' : 'black'}
              />
            </Pressable>
          </View>
        )}
        {selectedOption?.quantity === 0 ||
          (product?.options?.[0]?.quantity === 0 && (
            <View className='absolute w-full h-full z-10 flex items-center justify-center bg-neutral-800'>
              <Text className='-rotate-2 text-white text-lg font-bold'>
                Hết hàng
              </Text>
            </View>
          ))}
        {selectedOption && (
          <Text className='absolute right-4 top-4 -rotate-2 bg-red-500 px-4 py-1 text-sm font-semibold text-white z-10'>
            {selectedOption?.type_preview}
          </Text>
        )}
        <CustomImage
          src={
            selectedOption
              ? selectedOption.images_preview?.[0].url
              : product?.images_preview?.[0]?.url
          }
          alt={
            selectedOption
              ? selectedOption.images_preview?.[0].alt
              : product?.images_preview?.[0]?.alt
          }
        />
      </View>
      <Pressable
        className='flex-col gap-y-1'
        disabled={isPending || isLoadingCreate || isLoadingDelete}
        onPress={() =>
          router.push(`/products/${product?.type_preview}/${product?.id}`)
        }
      >
        {selectedOption && (
          <Text className='text-neutral-500'>
            {selectedOption?.type_preview}
          </Text>
        )}
        <Text
          className='font-medium text-neutral-500'
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          NSX: {product?.manufacturer ? product?.manufacturer : 'N/A'}
        </Text>
        <Text className='font-medium' numberOfLines={1} ellipsizeMode='tail'>
          {product?.name}
        </Text>
        <View className='flex-row items-center gap-x-1'>
          <FontAwesome name='star' size={14} color='#ef4444' />
          <Text className='text-red-500'>
            {Number(product?.reviews_avg_rate) > 0
              ? Number(product?.reviews_avg_rate).toFixed(1)
              : 'Chưa có đánh giá'}
          </Text>
        </View>
        <Text
          className='font-medium text-base'
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {selectedOption
            ? selectedOption?.price_preview?.preview
            : `Từ: ${product?.options_min_price?.preview}`}
        </Text>
      </Pressable>
    </View>
  );
}

export default React.memo(SingleProduct);
