import { Href, Redirect, router, Tabs } from 'expo-router';
import React, { useEffect } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSession } from '@/contexts/SessionProvider';
import { Linking, View } from 'react-native';
import { Image } from 'expo-image';
import { PaymentProvider } from '@/contexts/PaymentProvider';
import { DeliveryProvider } from '@/contexts/DeliveryProvider';

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
  useEffect(() => {
    if (user) {
      const handleDeepLink = (url: string) => {
        console.log('Received deep link:', url); // Debug log
        const route = url.replace(/.*?:\/\//, '');
        const [appPath, orderType, id] = route.split('/');

        if (appPath === 'order' && id) {
          if (orderType === 'success') {
            router.push(`/success/order/${id}` as Href<string>);
          } else if (orderType === 'cancel') {
            router.push(`/cancel/order/${id}` as Href<string>);
          }
        }
      };

      const subscription = Linking.addEventListener('url', ({ url }) => {
        handleDeepLink(url);
      });

      Linking.getInitialURL().then((url) => {
        if (url) {
          handleDeepLink(url);
        }
      });

      return () => {
        subscription.remove();
      };
    }
  }, [user]);
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
    <DeliveryProvider>
      <PaymentProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name='index'
            options={{
              title: 'Trang chủ',
              headerTitleAlign: 'center',
              headerShown: true,
              tabBarIcon: ({ color, focused }: any) => (
                <TabBarIcon
                  name={focused ? 'home' : 'home-outline'}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name='products'
            options={{
              title: 'Sản phẩm',
              tabBarIcon: ({ color, focused }: any) => (
                <TabBarIcon
                  name={focused ? 'storefront' : 'storefront-outline'}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name='stores'
            options={{
              title: 'Hệ thống cửa hàng',
              tabBarIcon: ({ color, focused }: any) => (
                <TabBarIcon
                  name={focused ? 'settings' : 'settings-outline'}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name='user'
            options={{
              title: 'Tôi',
              tabBarIcon: ({ color, focused }: any) => (
                <TabBarIcon
                  name={focused ? 'person-circle' : 'person-circle-outline'}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name='order'
            options={{
              headerShown: false,
              tabBarButton: () => null,
            }}
          />
          <Tabs.Screen
            name='delivery'
            options={{
              headerShown: false,
              tabBarButton: () => null,
            }}
          />
          <Tabs.Screen
            name='payments'
            options={{
              headerShown: false,
              tabBarButton: () => null,
            }}
          />
        </Tabs>
      </PaymentProvider>
    </DeliveryProvider>
  );
}
