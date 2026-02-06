import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { useColorScheme, View } from 'react-native';

SplashScreen.preventAutoHideAsync(); // 스플래시 유지

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    NotoSansKR: require('../assets/fonts/NotoSansKR-Regular.ttf'),
    NotoSansKR_Medium: require('../assets/fonts/NotoSansKR-Medium.ttf'),
    NotoSansKR_Bold: require('../assets/fonts/NotoSansKR-Bold.ttf'),
  });

  useEffect(() => {
    if (error) {
      console.error('폰트 로딩 에러:', error);
    }
  }, [error]);

  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync(); // ✅ 폰트 로딩 완료되면 스플래시 숨김
    }
  }, [loaded]);

  if (!loaded) {
    return null; // 아직 로딩 중이면 아무것도 안 그림
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="creating_folder" options={{ headerShown: false }} />
          <Stack.Screen name="creating_diary_v2" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </View>
  );
}
