import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSession } from '@/contexts/SessionProvider';
import { View } from 'react-native';
import { Image } from 'expo-image';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {
    user,
    isLoadingSession,
    isLoadingCsrfCookie,
    isLoadingLogin,
    isLoadingLogout,
    isLoadingUser,
  } = useSession();
  if (
    isLoadingSession ||
    isLoadingCsrfCookie ||
    isLoadingLogin ||
    isLoadingLogout ||
    isLoadingUser
  ) {
    return (
      <View className='flex-1 justify-center items-center bg-white'>
        <Image
          source={require('@/assets/images/logo.png')}
          alt='agilts-logo'
          priority='high'
          style={{ width: 56, height: 56 }}
          onError={() => console.log('error image')}
        />
      </View>
    );
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!user) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href='/sign-in' />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'code-slash' : 'code-slash-outline'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
