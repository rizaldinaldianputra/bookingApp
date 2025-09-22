import { colors } from '@/constants/colors';
import { Instruction, OrderItem, PaymentResponse } from '@/models/instruksi_payment';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react'; // Impor useEffect
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PaymentInstructionScreen = () => {
  const params = useLocalSearchParams(); // Ambil semua params
  const { data } = params;

  // PRINT HASIL PARAMS AWAL
  useEffect(() => {
    console.log('🔵 Hasil useLocalSearchParams (params):', params);
    console.log('🔵 Data string dari params.data:', data);
  }, [params, data]);

  // Pastikan untuk memeriksa apakah 'data' ada dan merupakan string sebelum JSON.parse
  // Kemudian, cast hasilnya ke PaymentResponse
  let paymentResponse: PaymentResponse | null = null;
  if (typeof data === 'string') {
    try {
      paymentResponse = JSON.parse(data) as PaymentResponse;
    } catch (e) {
      console.error('🔴 Gagal parse JSON dari params.data:', e);
    }
  }

  // PRINT HASIL PAYMENTRESPONSE SETELAH PARSE
  useEffect(() => {
    console.log('🟢 Hasil paymentResponse setelah JSON.parse:', paymentResponse);
  }, [paymentResponse]);

  // Ambil objek PaymentData dari properti 'data' di PaymentResponse
  const payment: PaymentResponse['data'] | null = paymentResponse ? paymentResponse.data : null;

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    console.error(`VA ${text} berhasil disalin ke clipboard`);
  };

  useEffect(() => {
    console.log('🟠 Hasil objek payment (paymentResponse.data):', payment);
    if (payment) {
      console.log('🟠 payment.payment_name:', payment.payment_name);
      console.log('🟠 payment.pay_code:', payment.pay_code);
      console.log('🟠 payment.amount:', payment.amount);
      console.log('🟠 payment.instructions:', payment.instructions);
      console.log('🟠 payment.order_items:', payment.order_items);
    }
  }, [payment]);

  if (!payment) {
    return (
      <View style={styles.center}>
        <Text>Data pembayaran tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{ height: 50 }}></View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Instruksi Pembayaran</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Ringkasan pembayaran */}
        <View style={styles.summaryBox}>
          <Text style={styles.paymentName}>{payment.payment_name}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.payCode}>VA: {payment.pay_code}</Text>
            <View style={{ width: 5 }}></View>
            <TouchableOpacity onPress={() => copyToClipboard(payment.pay_code)}>
              <Ionicons name="copy-outline" size={20} color="#333" />
            </TouchableOpacity>
          </View>
          <Text style={styles.amount}>Rp {Number(payment.amount).toLocaleString('id-ID')}</Text>
        </View>

        {/* Instruksi */}
        {payment.instructions?.map(
          (
            instruction: Instruction,
            idx: number, // Gunakan interface Instruction
          ) => (
            <View key={idx} style={styles.instructionBox}>
              <Text style={styles.instructionTitle}>{instruction.title}</Text>
              {instruction.steps.map((step: string, stepIdx: number) => (
                <Text key={stepIdx} style={styles.stepText}>
                  {stepIdx + 1}. {step.replace(/<[^>]*>?/gm, '')}
                </Text>
              ))}
            </View>
          ),
        )}

        {/* Opsional: Tampilkan detail order items jika diperlukan */}
        {payment.order_items && payment.order_items.length > 0 && (
          <View style={styles.instructionBox}>
            <Text style={styles.instructionTitle}>Detail Pesanan</Text>
            {payment.order_items.map(
              (
                item: OrderItem,
                itemIdx: number, // Gunakan interface OrderItem
              ) => (
                <Text key={itemIdx} style={styles.stepText}>
                  {item.name} (x{item.quantity}) - Rp {Number(item.price).toLocaleString('id-ID')}
                </Text>
              ),
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PaymentInstructionScreen;

const styles = StyleSheet.create({
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
  summaryBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    alignItems: 'center',
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  payCode: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2b3a2f',
  },
  instructionBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  instructionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2b3a2f',
  },
  stepText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 6,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
