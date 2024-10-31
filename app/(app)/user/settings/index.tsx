import { View, Text, SafeAreaView, Pressable } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

export default function SettingsScreen() {
  return (
    <SafeAreaView className='flex-1'>
      <View>
        <Pressable
          className='px-2 py-3 border-b border-neutral-300'
          onPress={() => router.push('/user/settings/information')}
        >
          <Text className='font-bold'>Cập nhật thông tin người dùng</Text>
        </Pressable>
        <Pressable
          className='px-2 py-3 border-b border-neutral-300'
          onPress={() => router.push('/user/settings/password')}
        >
          <Text className='font-bold'>Đổi mật khẩu</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
