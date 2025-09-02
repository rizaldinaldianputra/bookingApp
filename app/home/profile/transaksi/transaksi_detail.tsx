import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TransaksiDetailProps {
  no_order: string;
  tanggal: string;
  status: string;
  harga: number;
  kamar: {
    nama: string;
    lantai?: string;
    tipe?: string;
  };
  kos: {
    nama: string;
    alamat?: string;
  };
  quantity: number;
  pembayaran: Array<{ metode: string; jumlah: number }>;
}

// AppBar Component
const AppBar = ({ title }: { title: string }) => {
  const router = useRouter();
  return (
    <View style={appBarStyles.appBar}>
      <TouchableOpacity onPress={() => router.back()} style={appBarStyles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#a4a4a4ff" />
      </TouchableOpacity>
      <Text style={appBarStyles.appBarTitle}>{title}</Text>
      <View style={appBarStyles.rightPlaceholder} />
    </View>
  );
};

const appBarStyles = StyleSheet.create({
  appBar: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  appBarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  rightPlaceholder: {
    width: 40,
  },
});

export default function TransaksiDetail() {
  const { data } = useLocalSearchParams();
  const transaksi: TransaksiDetailProps = data
    ? JSON.parse(data as string)
    : {
        no_order: '',
        tanggal: '',
        status: '',
        harga: 0,
        kamar: { nama: '' },
        kos: { nama: '' },
        quantity: 0,
        pembayaran: [],
      };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      {/* AppBar */}
      <AppBar title="Transaksi Detail" />

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Transaksi saya</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.rowHeader}>
            <Text style={styles.name}>{transaksi.kos.nama}</Text>
            <View
              style={[
                styles.statusContainer,
                transaksi.status.toLowerCase() === 'booked' && styles.booked,
              ]}
            >
              <Text style={styles.statusText}>{transaksi.status}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>No Order</Text>
            <Text style={styles.value}>{transaksi.no_order}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tanggal</Text>
            <Text style={styles.value}>{transaksi.tanggal}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Kamar</Text>
            <Text style={styles.value}>
              {transaksi.kamar.nama} {transaksi.kamar.tipe ? `- ${transaksi.kamar.tipe}` : ''}
              {transaksi.kamar.lantai ? ` (Lantai ${transaksi.kamar.lantai})` : ''}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Jumlah</Text>
            <Text style={styles.value}>{transaksi.quantity}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Harga</Text>
            <Text style={styles.value}>Rp{transaksi.harga.toLocaleString('id-ID')}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Pembayaran</Text>
            <Text style={styles.value}>
              {transaksi.pembayaran.length > 0
                ? transaksi.pembayaran.map((p) => p.metode).join(', ')
                : '-'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#ddd',
  },
  booked: {
    backgroundColor: '#e0f7e9',
  },
  statusText: {
    fontSize: 12,
    color: '#34a853',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#888',
    fontSize: 14,
  },
  value: {
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'right',
  },
});
