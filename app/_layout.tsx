import { AuthProvider } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ToastProvider
          placement="bottom"
          offset={50} // naikkan jarak dari bawah
          swipeEnabled={true}
          duration={3000}
        >
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
                'search/search',
                'home/profile/profileuser/profileuser',
                'home/profile/tagihan/tagihan_list',

                'home/profile/pembelianproduct/pembelian_list',

                'home/profile/tagihan/tagihan_detail',
                'home/kossan/kamarlist',
                'home/kossan/kossanlist',
                'home/kossan/lokasilist',
                'home/kossan/kamarlist_filter',
                'home/product/payment_intruksi',
                'home/kossan/detail',
                'home/product/product_detail',
                'search/search_by_lokasi',
                'auth/register',
                'home/product/payment_product',
              ];
              return {
                headerShown: !hideHeaderScreens.includes(route.name),
              };
            }}
          />
        </ToastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
