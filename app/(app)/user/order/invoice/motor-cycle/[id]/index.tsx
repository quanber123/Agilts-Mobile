import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  useWindowDimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useGetInvoiceQuery } from '@/services/redux/query/appQuery';
import { useLocalSearchParams } from 'expo-router';
import RenderHTML from 'react-native-render-html';

export default function InvoiceItem() {
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams();
  const [curInvoice, setCurInvoice] = useState(0);
  const {
    data: saleData,
    isLoading: isLoadingSale,
    isSuccess: isSuccessSale,
  } = useGetInvoiceQuery({
    type: 'sale-motorcycle',
    id: id,
  });
  const {
    data: taxData,
    isLoading: isLoadingTax,
    isSuccess: isSuccessTax,
  } = useGetInvoiceQuery({
    type: 'value-added-tax-motorcycle',
    id: id,
  });
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-row justify-center items-center gap-4 py-6'>
        <Pressable onPress={() => setCurInvoice(0)}>
          <Text
            className={`text-base font-bold ${curInvoice === 0 ? 'text-blue-500' : ''} `}
          >
            Hóa đơn bán hàng
          </Text>
        </Pressable>
        <Pressable onPress={() => setCurInvoice(1)}>
          <Text
            className={`text-base font-bold ${curInvoice === 1 ? 'text-blue-500' : ''} `}
          >
            Hóa đơn giá trị gia tăng
          </Text>
        </Pressable>
      </View>
      {curInvoice === 0 ? (
        <ScrollView className='flex-1'>
          {!isLoadingSale ? (
            isSuccessSale && saleData ? (
              <RenderHTML
                contentWidth={width}
                source={{
                  html: saleData,
                }}
                renderersProps={{
                  img: {
                    enableExperimentalPercentWidth: true,
                  },
                }}
              />
            ) : (
              <View className='flex-1 justify-center items-center'>
                <Text className='text-lg font-bold'>
                  Chưa có hóa đơn hoặc không có hóa đơn.
                </Text>
              </View>
            )
          ) : (
            <View className='justify-center items-center'>
              <ActivityIndicator size='small' color='#ef4444' />
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView className='flex-1'>
          {!isLoadingTax ? (
            isSuccessTax && taxData ? (
              <RenderHTML
                contentWidth={width}
                source={{
                  html: taxData,
                }}
                renderersProps={{
                  img: {
                    enableExperimentalPercentWidth: true,
                  },
                }}
              />
            ) : (
              <View className='flex-1 justify-center items-center'>
                <Text className='text-lg font-bold'>
                  Chưa có hóa đơn hoặc không có hóa đơn.
                </Text>
              </View>
            )
          ) : (
            <View className='flex-1 justify-center items-center'>
              <ActivityIndicator size='small' color='#ef4444' />
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
