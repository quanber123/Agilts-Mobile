import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SessionProvider } from '@/contexts/SessionProvider';
import { Provider } from 'react-redux';
import { store } from '@/services/redux/store';
import { UserProvider } from '@/contexts/UserProvider';
import AlterProvider from '@/contexts/AlterProvider';
import AlterModal from '@/components/modal/AlterModal';
import { Linking } from 'react-native';
import { Href } from 'expo-router';
import ImageModal from '@/components/modal/ImageModal';
import { ImageProvider } from '@/contexts/ImageProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ImageProvider>
      <AlterProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ImageModal />
          <AlterModal />
          <Provider store={store}>
            <ThemeProvider
              value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
            >
              <SessionProvider>
                <UserProvider>
                  <Stack>
                    <Stack.Screen
                      name='(app)'
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name='sign-in'
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name='sign-up'
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name='two-factor'
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name='forgot-password'
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name='+not-found'
                      options={{ headerShown: false }}
                    />
                  </Stack>
                </UserProvider>
              </SessionProvider>
            </ThemeProvider>
          </Provider>
        </GestureHandlerRootView>
      </AlterProvider>
    </ImageProvider>
  );
}
