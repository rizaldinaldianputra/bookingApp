import { colors } from '@/constants/colors';
import { getTagihanById } from '@/service/transaksi_service';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Models
interface Transaksi {
  id: number;
  quantity: number;
  user_id: number;
  no_order: string;
  tanggal: string;
  start_order_date: string | null;
  end_order_date: string | null;
  kos_id: number;
  kamar_id: number;
  paket_id: number;
  harga: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Pembayaran {
  pembayaran_id: number;
  kode_pembayaran: string;
  transaksi_id: number;
  tanggal: string;
  jenis_bayar: string;
  tipe_bayar: string;
  keterangan: string | null;
  nominal: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface TagihanResponse {
  success: boolean;
  transaksi: Transaksi;
  pembayarans: Pembayaran[];
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
  backButton: { padding: 8, marginLeft: -8 },
  appBarTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  rightPlaceholder: { width: 40 },
});

export default function TransaksiDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [pembayarans, setPembayarans] = useState<Pembayaran[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      console.log('id param:', id);

      getTagihanById(id)
        .then((res: TagihanResponse) => {
          if (res.success) {
            setTransaksi(res.transaksi);
            setPembayarans(res.pembayarans);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  if (!transaksi)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Transaksi tidak ditemukan</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <AppBar title="Transaksi Detail" />

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Detail Transaksi</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.rowHeader}>
            <Text style={styles.name}>No Order: {transaksi.no_order}</Text>
            <View
              style={[
                styles.statusContainer,
                transaksi.status.toLowerCase() === 'booked' ? styles.booked : styles.unpaid,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  transaksi.status.toLowerCase() === 'booked' && styles.bookedText,
                ]}
              >
                {transaksi.status}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tanggal</Text>
            <Text style={styles.value}>
              {transaksi.tanggal ? new Date(transaksi.tanggal).toLocaleDateString('id-ID') : '-'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Jumlah</Text>
            <Text style={styles.value}>{transaksi.quantity}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Harga</Text>
            <Text style={styles.value}>Rp{Number(transaksi.harga).toLocaleString('id-ID')}</Text>
          </View>

          {/* Pembayaran */}
        </View>
        <View style={{ height: 16 }} />
        {pembayarans.length > 0 && (
          <View style={styles.card}>
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 12 }}>
                Daftar Pembayaran
              </Text>

              {pembayarans.map((p) => (
                <View key={p.pembayaran_id} style={styles.paymentCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.paymentTitle}>
                      {p.tipe_bayar.toUpperCase()} ({p.jenis_bayar})
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.primary }}>{p.status}</Text>
                  </View>

                  <Text style={styles.paymentCode}>Kode Bayar: {p.kode_pembayaran}</Text>
                  <Text style={styles.paymentDate}>
                    Tanggal: {new Date(p.tanggal).toLocaleDateString('id-ID')}
                  </Text>
                  <Text style={styles.paymentAmount}>
                    Rp{Number(p.nominal).toLocaleString('id-ID')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  paymentCard: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  paymentTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  paymentCode: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    color: '#000',
  },

  container: { padding: 16 },
  header: { marginBottom: 16 },
  headerText: { fontSize: 18, fontWeight: '600' },
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
  name: { fontSize: 16, fontWeight: '600' },
  statusContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#ddd',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { color: '#888', fontSize: 14 },
  value: { fontWeight: '500', fontSize: 14, textAlign: 'right' },
  booked: {
    backgroundColor: '#4caf50', // hijau
  },
  bookedText: {
    color: '#fff',
  },
  unpaid: {
    backgroundColor: '#ffe6e6', // merah muda
  },
  statusText: {
    fontSize: 12,
    textTransform: 'capitalize',
    color: '#e53935',
  },
});
