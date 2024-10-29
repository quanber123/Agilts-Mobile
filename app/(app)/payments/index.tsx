import { Text, View, SafeAreaView } from 'react-native';
import React, { useContext, useMemo } from 'react';
import { Pressable, ScrollView } from 'react-native-gesture-handler';
import ListItem from '@/components/ui/ListItem';
import { ListPayment, PaymentContext } from '@/contexts/PaymentProvider';
import { UserContext } from '@/contexts/UserProvider';
import { router } from 'expo-router';

export default function PaymentsScreen() {
  const { previousRoute } = useContext(UserContext);
  const { curPayment, setCurPayment } = useContext(PaymentContext);
  const includeValue = useMemo(() => {
    return (
      previousRoute?.toString()?.split('/')?.[
        previousRoute?.toString()?.split('/')?.length - 1
      ] || 'item'
    );
  }, [previousRoute]);
  return (
    <SafeAreaView className='flex-1'>
      <ScrollView nestedScrollEnabled={true}>
        <ListItem
          customClass='flex-1'
          data={ListPayment?.filter((p) =>
            p?.validRoute.includes(includeValue)
          )}
          renderItem={({ item }: any) => {
            return (
              <Pressable
                className='flex-row justify-between items-center p-4 border-b border-neutral-300'
                onPress={() => setCurPayment(item)}
              >
                <View className='flex-row items-center gap-4'>
                  {item?.icon}
                  <Text className='mx-2'>{item?.name}</Text>
                </View>
                {curPayment?.id === item?.id && (
                  <View className='rounded-full border border-red-500 w-4 h-4 justify-center items-center'>
                    <View className='w-2 h-2 bg-red-500 rounded-full'></View>
                  </View>
                )}
              </Pressable>
            );
          }}
        />
      </ScrollView>
      <Pressable
        className='mt-auto bg-red-500 px-4 py-3'
        onPress={() => router.push(previousRoute || '/')}
      >
        <Text className='text-center text-white font-bold'>Hoàn tất</Text>
      </Pressable>
    </SafeAreaView>
  );
}
