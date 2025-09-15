import { BASE_URL } from '@/constants/config';
import { Fasilitas, Kamar } from '@/models/kossan';
import { getKos } from '@/service/kossan_service';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const KamarListFilter = () => {
  const params = useLocalSearchParams();

  // Ambil filter dari URL
  // Mapping agar sesuai tipe GetKosParams
  // Ambil filter dari URL
  const filterParams = useMemo(() => {
    const temp = {
      daerah: Array.isArray(params.daerah) ? params.daerah[0] : params.daerah || '',
      durasi: Array.isArray(params.durasi) ? params.durasi[0] : params.durasi || '',
      jenis: Array.isArray(params.jenis) ? params.jenis[0] : params.jenis || '',
      start_date: Array.isArray(params.start_date) ? params.start_date[0] : params.start_date || '',
      end_date: Array.isArray(params.end_date) ? params.end_date[0] : params.end_date || '',
    };
    // Hanya simpan key yang punya value
    const filtered: Record<string, string> = {};
    Object.entries(temp).forEach(([key, value]) => {
      if (value) filtered[key] = value;
    });
    return filtered;
  }, [params.location, params.durasi, params.jenis, params.start_date, params.end_date]);
  const [kamarList, setKamarList] = useState<Kamar[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getKos(filterParams)
      .then((res) => {
        if (res.success && res.data) {
          setKamarList(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, [filterParams]);

  const renderItem = ({ item }: { item: Kamar }) => (
    <View style={styles.card}>
      {item.gallery.length > 0 ? (
        <Image source={{ uri: BASE_URL + item.gallery[0].url }} style={styles.image} />
      ) : (
        <Image source={require('../../../assets/images/onboarding.png')} style={styles.image} />
      )}

      <View style={styles.cardBody}>
        <View style={styles.cardContent}>
          <Text style={styles.name}>{item.nama_kamar}</Text>
          <Text style={styles.location}>📍 {item.tipe_kos}</Text>

          <Text style={styles.facilityLabel}>Fasilitas:</Text>
          <View style={styles.facilitiesContainer}>
            {Array.isArray(item.fasilitas) && item.fasilitas.length > 0 ? (
              item.fasilitas.map((f: Fasilitas, idx: number) => (
                <View key={idx} style={styles.facilityBox}>
                  <Text style={styles.facilityText}>{f.nama}</Text>
                </View>
              ))
            ) : (
              <View style={styles.facilityBox}>
                <Text style={styles.facilityText}>-</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.priceDetailContainer}>
          <Text style={styles.priceLabel}>Harga:</Text>
          <Text style={styles.priceText}>
            Per Hari: Rp{' '}
            {item.paket_harga?.perharian_harga
              ? item.paket_harga.perharian_harga.toLocaleString('id-ID')
              : '-'}
          </Text>
          <Text style={styles.priceText}>
            Per Bulan: Rp{' '}
            {item.paket_harga?.perbulan_harga
              ? item.paket_harga.perbulan_harga.toLocaleString('id-ID')
              : '-'}
          </Text>

          <TouchableOpacity
            style={styles.detailButton}
            onPress={() =>
              router.push({
                pathname: '/home/kossan/detail',
                params: { idKossan: item.kos.id, idKamar: item.id.toString() },
              })
            }
          >
            <Text style={styles.detailButtonText}>Detail</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1D4D3C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ height: 70 }} />
      <Text style={styles.header}>List Kamar</Text>

      <FlatList
        data={kamarList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  facilityBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  header: {
    backgroundColor: '#1D4D3C',
    color: '#fff',
    textAlign: 'center',
    padding: 12,
    borderRadius: 12,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#A3B7A1',
  },
  image: { width: '100%', height: 180 },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
  cardContent: { flex: 1, paddingRight: 12 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  location: { color: '#fff', marginBottom: 8 },
  facilityLabel: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  facilitiesContainer: { marginBottom: 8, flexDirection: 'row' },
  facilityText: {
    color: 'black',
    fontSize: 12,
    marginLeft: 6,
    marginBottom: 2,
    textAlign: 'center',
  },
  priceDetailContainer: { alignItems: 'flex-end', minWidth: 100 },
  priceLabel: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  priceText: { color: '#fff', fontSize: 12, marginBottom: 2 },
  detailButton: {
    backgroundColor: '#1D4D3C',
    paddingVertical: 6,
    marginTop: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  detailButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});

export default KamarListFilter;
