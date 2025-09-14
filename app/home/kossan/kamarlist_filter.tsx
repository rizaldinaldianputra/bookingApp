import { BASE_URL } from '@/constants/config';
import { Fasilitas, Kamar } from '@/models/kossan';
import { getKos } from '@/service/kossan_service';

import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const KamarListFilter = () => {
  const params = useLocalSearchParams();

  const filterParams = useMemo(
    () => ({
      location: Array.isArray(params.location) ? params.location[0] : params.location || '',
      time: Array.isArray(params.time) ? params.time[0] : params.time || '',
      gender: Array.isArray(params.gender) ? params.gender[0] : params.gender || '',
      search: Array.isArray(params.search) ? params.search[0] : params.search || '',
      checkInDate: Array.isArray(params.checkInDate)
        ? params.checkInDate[0]
        : params.checkInDate || '',
      checkOutDate: Array.isArray(params.checkOutDate)
        ? params.checkOutDate[0]
        : params.checkOutDate || '',
      idKossan: Array.isArray(params.idKossan) ? params.idKossan[0] : params.idKossan || '',
      namaKossan: Array.isArray(params.namaKossan) ? params.namaKossan[0] : params.namaKossan || '',
    }),
    [
      params.location,
      params.time,
      params.gender,
      params.search,
      params.checkInDate,
      params.checkOutDate,
      params.idKossan,
      params.namaKossan,
    ],
  );

  const [kamarList, setKamarList] = useState<Kamar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getKos({ ...filterParams })
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
                params: { idKossan: filterParams.idKossan, idKamar: item.id.toString() },
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
      <Text style={styles.header}>List Kamar {filterParams.namaKossan}</Text>

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
    backgroundColor: '#fff', // warna background
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
