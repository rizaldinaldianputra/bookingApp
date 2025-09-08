import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type PaymentMethodItemProps = {
  name: string;
  icon: string;
  amount: string;
  isSelected: boolean;
  onPress: () => void;
};

const PaymentMethodItem = ({ name, icon, amount, isSelected, onPress }: PaymentMethodItemProps) => (
  <TouchableOpacity
    style={[styles.paymentMethodItem, isSelected && styles.paymentMethodItemSelected]}
    onPress={onPress}
  >
    <Text style={styles.paymentMethodIcon}>{icon}</Text>
    <Text style={styles.paymentMethodName}>{name}</Text>
    <Text style={styles.paymentMethodAmount}>{amount}</Text>
  </TouchableOpacity>
);

type DetailRowProps = {
  label: string;
  value: string;
  isTotal?: boolean;
};

const DetailRow = ({ label, value, isTotal = false }: DetailRowProps) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, isTotal && styles.totalValue]}>{value}</Text>
  </View>
);

const PaymentScreen = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Go Pay');

  const paymentMethods = [
    { name: 'Go Pay', icon: 'GPay', amount: 'Rp 50.000' },
    { name: 'BCA', icon: 'BCA', amount: 'Rp 50.000' },
    { name: 'BNI', icon: 'BNI', amount: 'Rp 50.000' },
    { name: 'DANA', icon: 'DANA', amount: 'Rp 50.000' },
    { name: 'QRIS', icon: 'QRIS', amount: 'Rp 50.000' },
  ];

  const paymentDetails = {
    productName: 'Sabun Give',
    quantity: '2 pcs',
    unitPrice: 'Rp 2.500',
    subtotal: 'Rp 5.000',
    shippingCost: 'Rp 45.000',
    discountVoucher: 'Rp 10.000',
    totalPayment: 'Rp 40.000',
    paymentMethod: 'Gopay Costumer',
    transactionDate: 'Sabtu, 06 September 2025',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => console.log('Go back')}>
            <Text style={styles.backButton}>&lt;</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pembayaran</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pilih metode Pembayaran</Text>

          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map((method) => (
              <PaymentMethodItem
                key={method.name}
                name={method.name}
                icon={method.icon}
                amount={method.amount}
                isSelected={selectedPaymentMethod === method.name}
                onPress={() => setSelectedPaymentMethod(method.name)}
              />
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitleGreen}>Rincian Pembayaran</Text>
          <View style={styles.detailsContainer}>
            <DetailRow label="Nama Produk" value={paymentDetails.productName} />
            <DetailRow label="Jumlah" value={paymentDetails.quantity} />
            <DetailRow label="Harga Satuan" value={paymentDetails.unitPrice} />
            <DetailRow label="Subtotal" value={paymentDetails.subtotal} />
            <DetailRow label="Ongkos Kirim" value={paymentDetails.shippingCost} />
            <DetailRow label="Diskon/Voucher" value={paymentDetails.discountVoucher} />
            <DetailRow label="Total Pembayaran" value={paymentDetails.totalPayment} isTotal />
            <DetailRow label="Metode Pembayaran" value={paymentDetails.paymentMethod} />
            <DetailRow label="Tanggal Transaksi" value={paymentDetails.transactionDate} />
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payButtonText}>Bayar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#222',
  },
  backButton: {
    fontSize: 24,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  cardTitleGreen: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#34A853',
  },
  paymentMethodsContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  paymentMethodItemSelected: {
    backgroundColor: '#F0FDF4',
  },
  paymentMethodIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    width: 40,
    textAlign: 'center',
  },
  paymentMethodName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  paymentMethodAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#34A853',
  },
  footer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  payButton: {
    flex: 1,
    backgroundColor: '#34A853',
    paddingVertical: 15,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
