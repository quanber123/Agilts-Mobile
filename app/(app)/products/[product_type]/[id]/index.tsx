import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useGetProductDetailQuery } from '@/services/redux/query/appQuery';
import NotFoundScreen from '@/app/+not-found';
import DetailsSection from './_components/details';
import ProductTabs from './_components/product_tabs';
import { Product } from '@/types/types';
import { ScrollView } from 'react-native-gesture-handler';
import CrosssellSection from './_components/cross-sell-section';
import UppsellSection from './_components/upsell-section';
import RelatedSection from './_components/related-section';

export default function ProductDetailsLayout() {
  const { product_type, id } = useLocalSearchParams();
  const { data, isSuccess, isError } = useGetProductDetailQuery({
    type: product_type,
    id,
  });
  if (isError) {
    return <NotFoundScreen />;
  }
  return (
    <SafeAreaView className='flex-1 px-2'>
      {isSuccess && (
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <DetailsSection product={data} />
          <ProductTabs
            description={(data as Product)?.description}
            specifications={(data as Product)?.specifications}
            video={(data as Product)?.videos_preview}
            productId={(data as Product)?.id}
            avgReview={(data as Product)?.reviews_avg_rate}
            images={(data as Product)?.images_preview}
          />
          {(data as Product)?.cross_sell?.length > 0 && (
            <CrosssellSection products={(data as Product)?.cross_sell} />
          )}
          {(data as Product)?.upsell && (
            <UppsellSection products={(data as Product)?.upsell} />
          )}
          {(data as Product)?.related_products && (
            <RelatedSection products={(data as Product)?.related_products} />
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
