import { View, Text, Pressable } from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { Product, ProductOption } from '@/types/types';
import { Href, router, useLocalSearchParams } from 'expo-router';
import { useCreateCartMutation } from '@/services/redux/query/appQuery';
import { FlatList } from 'react-native-gesture-handler';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomInput } from '@/components/ui/CustomInput';
import Entypo from '@expo/vector-icons/Entypo';
import CustomImage from '@/components/ui/CustomImage';
import { AlterContext } from '@/contexts/AlterProvider';
import LoadingApp from '@/components/ui/LoadingApp';

export default function DetailsSection({ product }: { product: Product }) {
  const { product_type, type, version, color, volume } = useLocalSearchParams();
  const { setAlertModal, setIsAlertModal, setMessages } =
    useContext(AlterContext);
  const [isPending, startTransition] = useTransition();
  const [addCart, { isSuccess, isLoading, isError, error }] =
    useCreateCartMutation();
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [curType, setCurType] = useState(
    type || product?.options?.[0]?.type_preview
  );
  const [curVersion, setCurVersion] = useState(
    version || product?.options?.[0]?.version
  );
  const [curColor, setCurColor] = useState(
    color || product?.options?.[0]?.color
  );
  const handleChangeType = useCallback((t: string) => {
    router.setParams({ type: t });
    setCurType(t);
    const curV = product?.options?.find((o) => o.type_preview === t)?.version;
    const curC = product?.options?.find((o) => o.type_preview === t)?.color;
    if (curV) {
      setCurVersion(curV);
    }
    if (curC) {
      setCurColor(curC);
    }
  }, []);
  const handleChangeVersion = useCallback((v: string) => {
    router.setParams({ version: v });
    setCurVersion(v);
    const curC = product?.options?.find(
      (o) => o.type_preview === curType && o.version === v
    )?.color;
    if (curC) {
      setCurColor(curC);
    }
  }, []);
  const handleChangeColor = useCallback(
    (c: string) => {
      router.setParams({ color: c });
      setCurColor(c);
    },
    [router]
  );
  const selectedOption = useMemo(() => {
    return (
      product?.options?.find((o) => {
        return (
          o.type_preview === curType &&
          o.version === curVersion &&
          o.color === curColor
        );
      }) || product?.options?.[0]
    );
  }, [product, curType, curVersion, curColor]);
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
      if (prevQuantity + 1 > selectedOption?.quantity) {
        return selectedOption?.quantity;
      }
      {
        return prevQuantity + 1;
      }
    });
  }, [selectedOption]);
  const handleChangeQuantity = useCallback(
    (text: string) => {
      const value = text.replace(/[^0-9]/g, '');
      setQuantity(() => {
        if (Number(value) >= selectedOption?.quantity) {
          return selectedOption.quantity;
        } else if (Number(value) <= 1) {
          return 1;
        } else {
          return Number(value);
        }
      });
    },
    [selectedOption]
  );
  const listTypes = useMemo(() => {
    return Array.from(
      new Set(
        (product?.options as ProductOption[])
          ?.filter((o) => o.type_preview !== null)
          ?.map((o) => o.type_preview)
      )
    );
  }, [product?.options]);
  const listVersions = useMemo(() => {
    return Array.from(
      new Set(
        (product?.options as ProductOption[])
          ?.filter((o) => o.version !== null && o.type_preview === curType)
          ?.map((o) => o.version)
      )
    );
  }, [product?.options, curType]);
  const listColors = useMemo(() => {
    return Array.from(
      new Set(
        (product?.options as ProductOption[])
          ?.filter(
            (o) =>
              o.color !== null &&
              o.type_preview === curType &&
              o.version === curVersion
          )
          ?.map((o) => o.color)
      )
    );
  }, [product?.options, curType, curVersion]);
  const handleAddCart = useCallback(async () => {
    await addCart({
      option_id: selectedOption?.id,
      amount: quantity,
    });
  }, [selectedOption, quantity, addCart]);
  const handleOrderNow = useCallback(async () => {
    if (product_type === 'motor-cycle') {
      await AsyncStorage.setItem(
        'order_now_motor_cycle',
        JSON.stringify(selectedOption)
      );
      router.push(`/order/motor-cycle`);
    } else {
      setIsBuyNow(true);
      await addCart({
        option_id: selectedOption?.id,
        amount: quantity,
      });
    }
  }, [selectedOption, router, quantity, addCart]);
  useEffect(() => {
    if (isSuccess && isBuyNow) {
      (async () => {
        await AsyncStorage.setItem(
          'order_now_item',
          JSON.stringify([selectedOption?.id])
        );
        router.push(
          `/order/item?state=${encodeURIComponent(
            JSON.stringify([selectedOption?.id])
          )}`
        );
        setIsBuyNow(false);
      })();
    }
    if (isSuccess && !isBuyNow) {
      setAlertModal('success');
      setIsAlertModal(true);
      setMessages('Thêm giỏ hàng thành công!');
    }
    if (isError && error) {
      setAlertModal('error');
      setIsAlertModal(true);
      setMessages((error as any)?.data?.message);
    }
  }, [isSuccess, router, isError, error, selectedOption]);
  if (isPending || isLoading) return <LoadingApp />;
  return (
    <View className='flex-col'>
      <View className='w-full flex-row justify-center items-center border border-neutral-300 mb-4'>
        <CustomImage
          width={300}
          height={260}
          src={
            selectedOption
              ? selectedOption?.images_preview?.[0]?.url
              : product?.options?.[0]?.images_preview?.[0]?.url
          }
          alt={
            selectedOption
              ? selectedOption?.images_preview?.[0]?.alt
              : product?.options?.[0]?.images_preview?.[0]?.alt
          }
        />
      </View>
      {selectedOption && (
        <FlatList
          className='mb-4'
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: 'flex-start',
            gap: 20,
          }}
          data={
            selectedOption?.images_preview?.length > 4
              ? selectedOption?.images_preview?.slice(1, 3)
              : selectedOption?.images_preview
          }
          keyExtractor={(item) => item.alt}
          renderItem={({ item }) => {
            return (
              <Pressable
                className='border border-neutral-300'
                aria-label='image'
                key={item?.alt}
              >
                <CustomImage
                  src={item?.url}
                  alt={item?.alt}
                  width={100}
                  height={80}
                />
              </Pressable>
            );
          }}
        />
      )}
      <View className='flex-row justify-between'>
        <View className='flex-row gap-2'>
          <Text className='text-base font-medium'>Trạng thái:</Text>
          <Text
            className={`${
              selectedOption?.status_preview === 'Còn hàng'
                ? 'text-green-500'
                : 'text-red-500'
            } text-base font-bold`}
          >
            {selectedOption?.status_preview}
          </Text>
        </View>
        {/* <Pressable
          className={`rounded-sm bg-white p-3 ${isWishlist !== -1 ? 'text-red-500' : ''}`}
          aria-label='wishlist-btn'
         // onPress={handleAddToFavorite}
        >
          <Heart />
        </Pressable> */}
      </View>
      <Text
        className='line-clamp-2 text-base font-semibold md:text-3xl'
        numberOfLines={1}
        ellipsizeMode='tail'
      >
        {product?.name}
      </Text>
      <Text className=' text-lg font-semibold text-red-500'>
        {selectedOption?.price_preview?.preview}
      </Text>
      <View className='flex-col-row'>
        <Text className='text-lg font-bold md:text-xl'>Thông tin nhanh</Text>
        <View className='flex-col gap-1'>
          <View className='flex-row'>
            <Text
              className='font-medium text-red-500'
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              Danh mục:
            </Text>
            <FlatList
              className='ml-2'
              numColumns={3}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              data={product?.categories}
              keyExtractor={(item) =>
                item?.id ? item?.id.toString() : new Date().getTime().toString()
              }
              renderItem={({ item, index }) => {
                return (
                  <View>
                    <Pressable
                      key={item?.id}
                      onPress={() =>
                        router.push(
                          `/products/${product.type_preview}?category=${item?.id}` as Href<string>
                        )
                      }
                    >
                      <Text>{item?.name}</Text>
                    </Pressable>
                    {index !== product?.categories.length - 1 && (
                      <Text>, </Text>
                    )}
                  </View>
                );
              }}
            />
          </View>
          <View className='flex-row font-medium'>
            <Text className='text-red-500'>Loại sản phẩm:</Text>
            <Text className='ml-2'>{selectedOption?.type_preview}</Text>
          </View>
          <View className='flex-row font-medium'>
            <Text className='font-medium text-red-500'>Công ty sản xuất:</Text>
            <Text className='ml-2'>{product?.manufacturer}</Text>
          </View>
          <View className='flex-row font-medium'>
            <Text className='font-medium text-red-500'>SKU:</Text>
            <Text className='ml-2' numberOfLines={1} ellipsizeMode='tail'>
              {selectedOption?.sku}
            </Text>
          </View>
          {selectedOption?.volume && (
            <View className='flex-row gap-1 font-medium'>
              <Text className='font-medium text-red-500'>Thể tích:</Text>
              <Text>{selectedOption?.volume}</Text>
            </View>
          )}
          {selectedOption?.weight && (
            <View className='flex-row font-medium'>
              <Text className='font-medium text-red-500'>Khối lượng:</Text>
              <Text>{selectedOption?.weight}</Text>
            </View>
          )}
          {selectedOption?.length && (
            <View className='flex-row gap-1 font-medium'>
              <Text className='font-medium text-red-500'>Chiều dài:</Text>
              <Text className='ml-2'>{selectedOption?.length}</Text>
            </View>
          )}
          {selectedOption?.width && (
            <View className='flex-row gap-1 font-medium'>
              <Text className='font-medium text-red-500'>Chiều rộng:</Text>
              <Text className='ml-2'>{selectedOption?.width}</Text>
            </View>
          )}

          <View className='flex-row items-center'>
            <Text className='font-medium text-red-500'>Số lượng:</Text>
            <Text className='ml-2'>{selectedOption?.quantity}</Text>
          </View>
        </View>
      </View>
      {listTypes?.length > 0 && (
        <View className='py-2'>
          <View className='flex-col gap-y-4'>
            <Text className='text-base font-medium'>Loaị sản phẩm</Text>
            <FlatList
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: 'flex-start',
                gap: 20,
              }}
              contentContainerStyle={{ gap: 20 }}
              data={listTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                return (
                  <Pressable
                    key={item}
                    className={`border ${
                      curType === item ? 'border-red-500' : 'border-neutral-300'
                    } px-3 py-1 font-medium`}
                    onPress={() => handleChangeType(item)}
                    disabled={curType === item || isPending || isLoading}
                  >
                    <Text
                      className={`${curType === item ? 'text-red-500' : ''}`}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      )}
      {listVersions?.length > 0 && (
        <View className='py-2'>
          <View className='flex-col gap-y-4'>
            <Text className='text-base font-medium'>Phiên bản</Text>
            <FlatList
              numColumns={listVersions?.length > 3 ? 4 : 3}
              columnWrapperStyle={{
                justifyContent: 'flex-start',
                gap: 20,
              }}
              data={listVersions}
              keyExtractor={(item) =>
                item ? item : new Date().getTime().toString()
              }
              renderItem={({ item }) => {
                return (
                  <Pressable
                    key={item}
                    className={`border ${
                      curVersion === item
                        ? 'border-red-500'
                        : 'border-neutral-300'
                    } px-3 py-1 font-medium`}
                    onPress={() => handleChangeVersion(item ? item : '')}
                    disabled={curVersion === item || isPending || isLoading}
                  >
                    <Text
                      className={`${curVersion === item ? 'text-red-500' : ''}`}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
              contentContainerStyle={{ gap: 20 }}
            />
          </View>
        </View>
      )}
      {listColors?.length > 0 && (
        <View className='py-2'>
          <View className='flex-col gap-y-4'>
            <Text className='text-base font-medium'>Màu sắc</Text>
            <FlatList
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: 'flex-start',
                gap: 20,
              }}
              contentContainerStyle={{ gap: 20 }}
              data={listColors}
              keyExtractor={(item) =>
                item ? item : new Date().getTime().toString()
              }
              renderItem={({ item }) => {
                return (
                  <Pressable
                    key={item}
                    className={`border ${
                      curColor === item
                        ? 'border-red-500'
                        : 'border-neutral-300'
                    } px-3 py-1 font-medium`}
                    onPress={() => handleChangeColor(item ? item : '')}
                    disabled={curColor === item || isPending || isLoading}
                  >
                    <Text
                      className={`${curColor === item ? 'text-red-500' : ''}`}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      )}
      <View className='py-6 flex-col'>
        {product_type !== 'motor-cycle' && (
          <View className='pb-6 flex-row items-stretch justify-between'>
            <Pressable
              aria-label='minus'
              className='border border-neutral-300 flex justify-center items-center px-4'
              onPress={handleDecreaseQuantity}
            >
              <Entypo name='minus' size={24} color='black' />
            </Pressable>
            <CustomInput
              flex1={true}
              textcenter={true}
              keyboardType='numeric'
              nativeID='quantity'
              value={quantity.toString()}
              placeholder={quantity.toString()}
              onChangeText={handleChangeQuantity}
            />
            <Pressable
              aria-label='plus'
              className='border border-neutral-300 flex justify-center items-center px-4'
              onPress={handleIncreaseQuantity}
            >
              <Entypo name='plus' size={24} color='black' />
            </Pressable>
            <Pressable
              disabled={isPending || isLoading}
              onPress={() =>
                startTransition(() => {
                  handleAddCart;
                })
              }
              className='ml-4 border border-red-500 flex-row items-center justify-center px-4'
            >
              {<AntDesign name='shoppingcart' size={24} color='#ef4444' />}
              <Text className='mx-2 text-red-500 text-center font-bold'>
                Thêm giỏ hàng
              </Text>
            </Pressable>
          </View>
        )}
        <Pressable
          className='w-full flex-row justify-center items-center p-4 bg-red-500'
          disabled={isPending || isLoading}
          onPress={() =>
            startTransition(() => {
              handleOrderNow();
            })
          }
        >
          {product_type === 'motor-cycle' && (
            <AntDesign name='shoppingcart' size={24} color='white' />
          )}
          <Text className='mx-4 text-white text-center font-bold'>
            Đặt ngay
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
