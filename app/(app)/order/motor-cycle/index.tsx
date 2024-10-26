import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

export default function OrderMotorCycle() {
  return (
    <View>
      <Pressable onPress={() => router.push('/user/add-address')}>
        <Text>Test</Text>
      </Pressable>
    </View>
  );
}
