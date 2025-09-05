import { AuthProvider } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack
          screenOptions={({ route }) => {
            const hideHeaderScreens = [
              'auth/login',
              'onboarding/geststarted',
              'onboarding/onboarding',
              'onboarding/splash',
              'home/home',
              'home/main',
              'home/product/detail',
              'home/payment/payment',
              'home/profile/transaksi/transaksi_list',
              'home/profile/transaksi/transaksi_detail',
              'home/profile/ticket/ticket_list',
              'home/profile/ticket/ticket_detail',
              'home/profile/ticket/ticket_submit',
            ];
            return {
              headerShown: !hideHeaderScreens.includes(route.name),
            };
          }}
        />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
