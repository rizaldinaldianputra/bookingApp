import { colors } from '@/constants/colors';
import { PaymentMethod, PaymentMethodResponse } from '@/models/payment_method';
import { createPayment, getPaymentMethods } from '@/service/payment_service';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const PaymentScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const { payload } = useLocalSearchParams();
  const transaksi = payload ? JSON.parse(payload as string) : null;
  const merchantRef = generateMerchantRef(); // Call the function here

  useEffect(() => {
    (async () => {
      try {
        const res: PaymentMethodResponse = await getPaymentMethods();
        setPaymentMethods(res.data);
        if (res.data.length > 0) {
          setSelectedMethod(res.data[0]); // simpan object pertama
        }
      } catch (err) {
        console.error('Gagal load metode pembayaran', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ height: 40 }} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pembayaran</Text>
        <View style={{ width: 24 }} />
      </View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Pilih metode Pembayaran</Text>
          {paymentMethods.map((method, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.methodBox,
                selectedMethod?.code === method.code && styles.selectedMethod,
              ]}
              onPress={() => setSelectedMethod(method)}
            >
              <View style={styles.methodLeft}>
                <Image
                  source={{ uri: method.icon_url }}
                  style={styles.methodIcon}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.methodText,
                    selectedMethod?.code === method.code && styles.selectedMethodText,
                  ]}
                >
                  {method.name}
                </Text>
              </View>
              <Text
                style={[
                  styles.priceText,
                  selectedMethod?.code === method.code && styles.selectedMethodText,
                ]}
              >
                Rp {Number(transaksi.subtotal).toLocaleString('id-ID')}
              </Text>
            </TouchableOpacity>
          ))}
          {transaksi && (
            <View style={styles.detailBox}>
              <Text style={styles.detailTitle}>Rincian Pembayaran</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Nama Produk</Text>
                <Text style={styles.detailValue}>{transaksi.nama_produk}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Jumlah</Text>
                <Text style={styles.detailValue}>{transaksi.jumlah} pcs</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Harga Satuan</Text>
                <Text style={styles.detailValue}>
                  Rp {Number(transaksi.harga_satuan).toLocaleString('id-ID')}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Subtotal</Text>
                <Text style={styles.detailValue}>
                  Rp {Number(transaksi.subtotal).toLocaleString('id-ID')}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailKeyBold}>Total Pembayaran</Text>
                <Text style={styles.detailValueBold}>
                  Rp {Number(transaksi.subtotal).toLocaleString('id-ID')}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Metode Pembayaran</Text>
                <Text style={styles.detailValue}>{selectedMethod?.name ?? '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Tanggal Transaksi</Text>
                <Text style={styles.detailValue}>{transaksi.tanggal_transaksi}</Text>
              </View>
            </View>
          )}
        </ScrollView>
      )}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async function () {
            if (!selectedMethod) return;
            const payload = {
              method: selectedMethod.code,
              customerName: transaksi.nama_user,
              customerEmail: transaksi.email,
              orderItems: [
                {
                  sku: transaksi.id_produk,
                  name: transaksi.nama_produk,
                  price: transaksi.harga_satuan,
                  quantity: transaksi.jumlah,
                },
              ],
              amount: transaksi.subtotal,
              merchantRef: merchantRef,
              expiryHours: 24,
            };

            // 🔥 log payload & url
            console.log('📦 PAYLOAD:', JSON.stringify(payload, null, 2));

            try {
              const response = await createPayment(payload);
              console.log('✅ Payment berhasil:', response);
              router.push({
                pathname: '/home/product/payment_intruksi',
                params: { data: JSON.stringify(response) },
              });
            } catch (err: any) {
              const message = err.response?.data?.message || err.message;
              console.error(message);
            }
          }}
          style={styles.payButton}
        >
          <Text style={styles.payText}>Bayar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  methodIcon: {
    width: 32,
    height: 32,
  },
  backButton: {
    padding: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#2b3a2f',
  },
  methodBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  selectedMethod: {
    backgroundColor: colors.primary,
  },
  methodText: {
    fontSize: 15,
    color: '#333',
  },
  priceText: {
    fontSize: 15,
    color: '#333',
  },
  selectedMethodText: {
    color: '#fff',
    fontWeight: '600',
  },
  detailBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    elevation: 2,
  },
  detailTitle: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#2b3a2f',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  detailKey: {
    fontSize: 13,
    color: '#444',
  },
  detailValue: {
    fontSize: 13,
    color: '#444',
  },
  detailKeyBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2b3a2f',
  },
  detailValueBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2b3a2f',
  },
  cancelText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  payText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 30,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e53935',
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  payButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
});

function generateMerchantRef(): string {
  // Generate a unique reference, e.g., using a timestamp
  return `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}
