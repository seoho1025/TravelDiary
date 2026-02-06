import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="select-country" options={{ headerShown: false }} />
      <Stack.Screen name="photo" options={{ headerShown: false }} />
      <Stack.Screen name="companion" options={{ headerShown: false }} />
      {/* 필요하다면 다른 스크린도 추가 */}
    </Stack>
  );
} 