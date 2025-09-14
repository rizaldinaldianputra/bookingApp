import { BASE_URL } from '@/constants/config';
import { DetailKosResponse, Kamar } from '@/models/detail_kossan'; // sesuaikan path
import { getKosById } from '@/service/kossan_service'; // sesuaikan path
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { JSX, useEffect, useState } from 'react';
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

const facilityIcons: { [key: string]: JSX.Element } = {
  WiFi: <FontAwesome name="wifi" size={16} color="#1D4D3C" />,
  Bed: <MaterialIcons name="bed" size={16} color="#1D4D3C" />,
  Parking: <FontAwesome name="car" size={16} color="#1D4D3C" />,
  AC: <Entypo name="air" size={16} color="#1D4D3C" />,
};

const KamarListScreen = () => {
  const { id, nama } = useLocalSearchParams<{ id: string; nama: string }>();
  const [kamarList, setKamarList] = useState<Kamar[]>([]);
  const [loading, setLoading] = useState(true);
  console.log('📌 PARAM ID:', id);

  useEffect(() => {
    if (id) {
      getKosById(id)
        .then((res: DetailKosResponse) => {
          if (res.success && res.data?.kamar) {
            setKamarList(res.data.kamar);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const renderItem = ({ item }: { item: Kamar }) => (
    <View style={styles.card}>
      {item.gallery.length > 0 ? (
        <Image source={{ uri: BASE_URL + item.gallery[0].url }} style={styles.image} />
      ) : (
        <Image source={require('../../../assets/images/onboarding.png')} style={styles.image} />
      )}

      <View style={styles.cardlist}>
        <View style={styles.cardContent}>
          <Text style={styles.name}>{item.nama_kamar}</Text>
          <Text style={styles.location}>📍 {item.tipe_kos}</Text>

          <Text style={styles.facilityLabel}>Fasilitas</Text>
          <View style={styles.facilitiesContainer}>
            {item.fasilitas.map((fasilitas, index) => (
              <View key={index} style={styles.facilityBox}>
                {facilityIcons[fasilitas.nama] || (
                  <Text style={{ fontSize: 12 }}>{fasilitas.nama}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.priceDetailContainer}>
          <Text style={styles.name}>Harga</Text>

          <Text style={styles.priceText}>
            from Rp{' '}
            {item.paket_harga && typeof item.paket_harga.perharian_harga === 'number'
              ? item.paket_harga.perharian_harga.toLocaleString('id-ID')
              : '-'}{' '}
            / Night
          </Text>

          <Text style={styles.priceText}>
            from Rp{' '}
            {item.paket_harga && typeof item.paket_harga.perbulan_harga === 'number'
              ? item.paket_harga.perbulan_harga.toLocaleString('id-ID')
              : '-'}{' '}
            / Month
          </Text>

          <TouchableOpacity
            style={styles.detailButton}
            onPress={() =>
              router.push({
                pathname: '/home/kossan/detail',
                params: { idKossan: id, idKamar: item.id.toString() },
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
      <Text style={styles.header}>List Kamar {nama}</Text>

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
  cardlist: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#A3B7A1',
  },
  image: { width: '100%', height: 180 },
  cardContent: { flex: 1, paddingRight: 12 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  location: { color: '#fff', marginBottom: 8 },
  priceDetailContainer: {
    flexShrink: 1,
    alignItems: 'flex-end',
  },
  priceHeader: { color: '#fff', fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  priceText: { color: '#fff', fontSize: 12, marginBottom: 2, fontWeight: '400' },
  detailButton: {
    backgroundColor: '#1D4D3C',
    paddingVertical: 6,
    marginTop: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  detailButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  facilityLabel: { color: '#fff', fontSize: 12, marginBottom: 4, fontWeight: 'bold' },
  facilitiesContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  facilityBox: {
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default KamarListScreen;
