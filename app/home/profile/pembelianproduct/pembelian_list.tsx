import { BASE_URL } from '@/constants/config';
import { useTransaksiProduct } from '@/hooks/product';
import { User } from '@/models/user';
import { getUsers } from '@/service/user_service';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// --- AppBar Component ---
const AppBar = ({ title }: { title: string }) => {
  const router = useRouter();
  return (
    <View style={styles.appBar}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.appBarTitle}>{title}</Text>
      <View style={styles.rightPlaceholder} />
    </View>
  );
};

export default function PembelianList() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUsers();
        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const { data, loading, error } = useTransaksiProduct(user?.id?.toString() || '');

  if (!user || loading) {
    return (
      <SafeAreaView style={styles.container}>
        <AppBar title="Pembelian saya" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <AppBar title="Pembelian saya" />
        <View style={styles.center}>
          <Text>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            item.produk?.gambar?.length > 0
              ? BASE_URL + '/' + item.produk.gambar[0].url_gambar
              : 'https://via.placeholder.com/80',
        }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.name}>{item.produk?.judul_produk ?? '-'}</Text>
        <Text style={styles.price}>Rp{Number(item.subtotal ?? 0).toLocaleString('id-ID')},-</Text>
        <View style={styles.qtyWrapper}>
          <Text style={styles.qty}>{item.jumlah ?? 0}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppBar title="Pembelian saya" />
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id_transaksi.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  appBar: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { padding: 8 },
  appBarTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  rightPlaceholder: { width: 40 },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  image: { width: 80, height: 80, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  name: { fontSize: 14, color: '#000', marginBottom: 4 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#1b5e20', marginBottom: 8 },
  qtyWrapper: {
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  qty: { fontSize: 14, fontWeight: '600', color: '#000' },
});
