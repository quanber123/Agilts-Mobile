import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

export default function OrderMotorCycle() {
  return (
    <View>
      <Pressable
        onPress={() =>
          router.push({
            pathname: '/user/add-address',
            params: { previousRoute: '/products' },
          })
        }
      >
        <Text>Test</Text>
      </Pressable>
    </View>
  );
}
