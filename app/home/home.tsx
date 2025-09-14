import { useAuth } from '@/context/AuthContext';
import { FilterState, useKosData } from '@/hooks/kossan';
import { Lokasi } from '@/models/lokasi';
import { User } from '@/models/user';
import { getLokasi } from '@/service/home_service';
import { getUsers } from '@/service/user_service';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import FilterModal from '@/components/ui/modal_serach';
import { colors } from '@/constants/colors';
import { Fasilitas, Kamar } from '@/models/kossan';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

// Handle card press
const handleCardPress = (itemName: string) => {
  router.push({
    pathname: '/search/search_by_lokasi',
    params: { name: itemName },
  });
};

// Render Item untuk Lokasi
const renderLokasiItem = ({ item }: { item: Lokasi }) => (
  <TouchableOpacity onPress={() => handleCardPress(item.nama)}>
    <View style={styles.card}>
      <ImageBackground
        source={require('../../assets/images/onboarding.png')}
        style={styles.image}
        imageStyle={{ borderRadius: 20 }}
      >
        <View style={styles.overlay} />
        <Text style={styles.cardTitle}>{item.nama}</Text>
      </ImageBackground>
    </View>
  </TouchableOpacity>
);

// Render Item untuk Kos
const renderKosItem = ({ item }: { item: Kamar }) => (
  <View style={styles.kosCard}>
    <Image
      source={{
        uri:
          item.gallery && item.gallery.length > 0
            ? item.gallery[0].url
            : 'https://picsum.photos/100',
      }}
      style={styles.kosImage}
    />
    <View style={styles.kosInfo}>
      <Text style={styles.kosTitle}>{item.nama_kamar}</Text>

      <View style={styles.facilityRow}>
        {Array.isArray(item.fasilitas) ? (
          item.fasilitas.slice(0, 4).map((fasilitas: Fasilitas | string, index: number) => (
            <View key={index} style={styles.facilityBadge}>
              <Text style={styles.facilityText}>
                {typeof fasilitas === 'string' ? fasilitas : fasilitas.nama}
              </Text>
            </View>
          ))
        ) : item.fasilitas ? (
          <View style={styles.facilityBadge}>
            <Text style={styles.facilityText}>
              {typeof item.fasilitas === 'string' ? item.fasilitas : item.fasilitas}
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.kosPrice}>
        Rp {item.paket_harga?.perharian_harga?.toLocaleString() ?? 0}/bulan
      </Text>
    </View>
  </View>
);

const HomeScreen = () => {
  const { token } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [lokasi, setLokasi] = useState<Lokasi[]>([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const [activeFilters, setActiveFilters] = useState<FilterState>({
    location: '',
    time: '',
    gender: '',
    facilities: [],
    minPrice: 0,
    maxPrice: 10000000,
    search: '',
    checkInDate: null,
    checkOutDate: null,
  });

  const { kosData } = useKosData(activeFilters);

  useEffect(() => {
    const fetchLokasi = async () => {
      try {
        const response = await getLokasi();
        setLokasi(response.data);
      } catch (e) {
        console.log('Error getLokasi:', e);
      }
    };
    fetchLokasi();
  }, []);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await getUsers();
        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [token]);

  const handleApplyFilter = (filters: FilterState) => {
    setActiveFilters(filters);
  };

  const renderHeader = () => (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{user?.nama || ''}</Text>
        {token && (
          <TouchableOpacity style={styles.notifButton}>
            <Icon name="notifications" size={24} color="#000" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.subtitle}>Search for available apartments</Text>
      <View style={{ height: 20 }} />

      {/* Status inactive */}
      {user?.status === 'inactive' && (
        <TouchableOpacity onPress={() => router.push('/home/profile/profileuser/profileuser')}>
          <View style={styles.containerAktif}>
            <Text style={styles.subtitle}>Akun mu belum aktif, silakan hubungi admin,</Text>
            <Text style={[styles.subtitle, { color: 'green', fontWeight: 'bold' }]}>
              Klik disini
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Search */}
      <View style={styles.containerSearch}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Select Location</Text>
          <Text style={styles.subtitle}>add dates • add guest • nightly budget</Text>
        </View>
        <TouchableOpacity style={styles.iconContainer} onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Lokasi Kos */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Lokasi Kos</Text>
        <Text style={styles.seeMore}>See more</Text>
      </View>
      <FlatList
        data={lokasi}
        renderItem={renderLokasiItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      {/* Kamar Kos Header */}
      <View style={{ height: 10 }} />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Kamar Kos Terbaru</Text>
        <Text style={styles.seeMore}>See more</Text>
      </View>
    </View>
  );

  return (
    <>
      <FlatList
        data={kosData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderKosItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ padding: 20, backgroundColor: '#F9FAFB', paddingBottom: 100 }}
      />

      {/* Filter Modal */}
      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilter={handleApplyFilter}
        initialFilters={activeFilters}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: 20, fontWeight: '600' },
  notifButton: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  containerAktif: {
    flexDirection: 'row',
    backgroundColor: '#FF000080',
    padding: 8,
  },
  containerSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textContainer: { flex: 1 },
  title: {
    fontFamily: 'Raleway',
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  subtitle: {
    fontFamily: 'Raleway',
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { marginVertical: 15, fontSize: 16, fontWeight: '500', color: '#000' },
  seeMore: { fontSize: 12, color: '#0f172a' },
  card: {
    width: 160,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 22,
  },
  image: { flex: 1, justifyContent: 'flex-end' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#fff', padding: 12, paddingBottom: 20 },

  // Kos Card
  kosCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  kosImage: { width: 90, height: 90, borderRadius: 12 },
  kosInfo: { flex: 1, paddingLeft: 12, justifyContent: 'center' },
  kosTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  facilityRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  facilityBadge: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  facilityText: { fontSize: 10, color: '#555' },
  kosPrice: { fontSize: 14, fontWeight: '700', color: 'green' },
});

export default HomeScreen;
