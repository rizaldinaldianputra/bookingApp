import { colors } from '@/constants/colors';
import { BASE_URL } from '@/constants/config';
import { DetailKosLokasiResponse, Kos } from '@/models/kos_by_lokasi';
import { getKosByLokasi } from '@/service/kossan_service';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const KossanByLoKasi = () => {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [kosList, setKosList] = useState<Kos[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (name) {
      getKosByLokasi(name)
        .then((res: DetailKosLokasiResponse) => {
          if (res.success && Array.isArray(res.data)) {
            setKosList(res.data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [name]);

  const renderItem = ({ item }: { item: Kos }) => (
    <View style={styles.card}>
      <ImageBackground
        source={
          item.image
            ? { uri: BASE_URL + item.image }
            : require('../../../assets/images/onboarding.png')
        }
        style={styles.image}
        imageStyle={{ borderRadius: 12 }}
      >
        {/* overlay gelap biar teks lebih jelas */}
        <View style={styles.overlay} />

        {/* konten melayang di atas image */}
        <View style={styles.contentWrapper}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
              {item.nama}
            </Text>
            <Text style={styles.location} numberOfLines={1} ellipsizeMode="tail">
              📍 {item.daerah}
            </Text>
            <Text style={styles.desc} numberOfLines={2} ellipsizeMode="tail">
              {item.keterangan}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.detailButton}
            onPress={() =>
              router.push({
                pathname: '/home/kossan/kamarlist',
                params: { id: item.id.toString() },
              })
            }
          >
            <Text style={styles.detailButtonText}>Lihat Kamar</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
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
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={{ height: 10 }} />
      <Text style={styles.header}>List Kos {name}</Text>

      <FlatList
        data={kosList}
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
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: { width: '100%', height: 200, justifyContent: 'flex-end' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  contentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 12,
  },
  name: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  location: { color: '#fff', marginBottom: 4 },
  desc: { color: '#fff', marginBottom: 8, fontSize: 12 },
  detailButton: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  detailButtonText: { color: colors.primary, fontWeight: 'bold', fontSize: 12 },
});

export default KossanByLoKasi;
