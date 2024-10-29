import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { AlterContext } from '@/contexts/AlterProvider';

export default function AlterModal() {
  const { alterModal, isAlertModal, messages } = useContext(AlterContext);
  return isAlertModal && messages ? (
    <SafeAreaView
      className='fixed top-0 left-0 w-full h-full justify-center items-center z-50'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <View className='bg-white h-1/4 w-11/12 justify-center items-center px-4 gap-y-4'>
        <FontAwesome6
          name={alterModal === 'success' ? 'check-circle' : 'circle-xmark'}
          size={46}
          color={alterModal === 'success' ? '#22c55e' : '#ef4444'}
        />
        <Text className='font-bold text-base text-center'>
          {messages ? String(messages) : ''}
        </Text>
      </View>
    </SafeAreaView>
  ) : (
    <View></View>
  );
}
