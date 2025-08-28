import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={({ route }) => {
          // hide header di login dan onboarding/splash
          const hideHeaderScreens = [
            'auth/login',
            'onboarding/geststarted',
            'onboarding/onboarding',
            'onboarding/splash',
            'home/home',
            'home/main',
            'home/product/detail',
          ];
          return {
            headerShown: !hideHeaderScreens.includes(route.name),
          };
        }}
      />
    </SafeAreaProvider>
  );
}
