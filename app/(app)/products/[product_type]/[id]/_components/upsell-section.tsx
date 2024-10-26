import React from 'react';
import { View, Dimensions, Text } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import SingleProduct from '@/components/ui/SingleProduct';
import { Product } from '@/types/types';

const windowDimensions = Dimensions.get('screen');

export default function TestScreen({ products }: { products: Product[] }) {
  const baseOptions = {
    parallaxScrollingOffset: 220,
    parallaxScrollingScale: 1,
    parallaxAdjacentItemScale: 1,
  };

  return (
    <View className='flex-1 my-6'>
      <Text className='text-lg font-bold'>Sản phẩm bán thêm</Text>
      <Carousel
        width={windowDimensions.width}
        defaultIndex={1}
        height={300}
        data={products}
        mode='parallax'
        modeConfig={baseOptions}
        renderItem={({ item }) => (
          <SingleProduct needFav={false} product={item} />
        )}
      ></Carousel>
    </View>
  );
}
