import CustomButton from '@/components/ui/button';
import { colors } from '@/constants/colors';
import { BASE_URL } from '@/constants/config';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/models/user';
import { getUsers } from '@/service/user_service';
import { AntDesign, Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DetailKosData,
  Fasilitas,
  Gallery,
  Kamar,
  PaketHarga,
} from '../../../models/detail_kossan';
import { getKosById } from '../../../service/kossan_service';

const DetailApartmentScreen: React.FC = () => {
  const { token } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | null>(null);
  const [selectedPaket, setSelectedPaket] = useState<keyof PaketHarga | null>(null);

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

  // mapping key ke label
  const paketLabels: Record<string, string> = {
    perharian_harga: '1 Hari',
    perbulan_harga: '1 Bulan',
    pertigabulan_harga: '3 Bulan',
    perenambulan_harga: '6 Bulan',
    pertahun_harga: '1 Tahun',
  };

  const [kosData, setKosData] = useState<DetailKosData | null>(null);
  const [visible, setVisible] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const DEFAULT_LATITUDE = -6.9915;
  const DEFAULT_LONGITUDE = 110.4225;

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getKosById(String(id))
      .then((res) => setKosData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [id]);

  const toggleCheckIn = () => {
    setShowCheckIn(!showCheckIn);
    setShowCheckOut(false);
  };

  const toggleCheckOut = () => {
    setShowCheckOut(!showCheckOut);
    setShowCheckIn(false);
  };

  const openGoogleMaps = () => {
    if (kosData?.link_maps) {
      Linking.openURL(kosData.link_maps).catch((err) => console.error("Couldn't open URL:", err));
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!kosData) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Tidak ada data kos ditemukan.</Text>
        <CustomButton onPress={() => router.back()} title="Kembali" />
      </SafeAreaView>
    );
  }

  const hasRooms = kosData.kamar && kosData.kamar.length > 0;
  const firstRoom = hasRooms ? kosData.kamar[0] : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{
              uri:
                firstRoom && firstRoom.gallery && firstRoom.gallery.length > 0
                  ? BASE_URL + firstRoom.gallery[0].url
                  : 'https://via.placeholder.com/300',
            }}
            style={styles.mainImage}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <AntDesign name="hearto" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <AntDesign name="sharealt" size={16} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Info Kos */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{kosData.nama}</Text>
          <Text style={styles.subtitle}>{kosData.daerah}</Text>
          <Text style={{ marginTop: 5 }}>{kosData.keterangan}</Text>
        </View>

        {/* Gallery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
            {hasRooms &&
              kosData.kamar.map((room) =>
                room.gallery && room.gallery.length > 0 ? (
                  room.gallery.map((img: Gallery) => (
                    <Image
                      key={img.id}
                      source={{ uri: BASE_URL + img.url }}
                      style={styles.galleryImage}
                    />
                  ))
                ) : (
                  <Text
                    key={`no-gallery-${room.id}`}
                    style={{ color: '#666', marginRight: 10 }}
                  ></Text>
                ),
              )}
            {!hasRooms && <Text style={{ color: '#666' }}>Tidak ada gambar galeri tersedia.</Text>}
          </ScrollView>
        </View>

        {/* Fasilitas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fasilitas</Text>
          {firstRoom && firstRoom.fasilitas && firstRoom.fasilitas.length > 0 ? (
            <View style={styles.facilitiesGrid}>
              {firstRoom.fasilitas.map((f: Fasilitas) => (
                <View key={f.id} style={styles.facilityGridItem}>
                  <AntDesign name="tagso" size={24} color="#999" />
                  <Text style={styles.facilityText}>{f.nama}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ color: '#666' }}>Tidak ada fasilitas tersedia.</Text>
          )}
        </View>

        {/* Map */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lokasi</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: DEFAULT_LATITUDE,
              longitude: DEFAULT_LONGITUDE,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{ latitude: DEFAULT_LATITUDE, longitude: DEFAULT_LONGITUDE }}
              title={kosData.nama}
              description={kosData.alamat}
            />
          </MapView>
          {kosData.link_maps && (
            <TouchableOpacity style={styles.openMapButton} onPress={openGoogleMaps}>
              <Text style={styles.openMapButtonText}>Buka di Google Maps</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Rooms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kamar Tersedia</Text>
          {hasRooms ? (
            kosData.kamar.map((room: Kamar) => (
              <View key={room.id} style={styles.roomItem}>
                <Image
                  source={{
                    uri: BASE_URL + room.gallery?.[0]?.url || 'https://via.placeholder.com/100',
                  }}
                  style={styles.roomImage}
                />
                <View style={styles.roomDetails}>
                  <Text style={styles.roomTitle}>{room.nama_kamar}</Text>
                  <Text style={styles.roomSubtitle}>{room.tipe_kos}</Text>
                </View>
                <Text style={styles.roomPrice}>
                  Rp{' '}
                  {room.paket_harga?.perbulan_harga?.toLocaleString('id-ID') ||
                    'Harga tidak tersedia'}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: '#666' }}>Tidak ada kamar tersedia.</Text>
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Buttons */}
      <View style={{ flex: 1 }}>
        <View style={[styles.floatingButtons, { bottom: insets.bottom }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {firstRoom && firstRoom.paket_harga?.perbulan_harga ? (
              <>
                <Text style={styles.cardPrice}>
                  Rp {firstRoom.paket_harga.perbulan_harga.toLocaleString('id-ID')}/
                </Text>
                <Text style={styles.cardMonth}>Bulan</Text>
              </>
            ) : (
              <Text style={styles.cardPrice}>Harga tidak tersedia</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (!token) {
                router.replace('/auth/login');
              } else {
                setVisible(true);
              }
            }}
            disabled={!hasRooms || !firstRoom?.paket_harga?.perbulan_harga}
          >
            <Text style={styles.buttonText}>Booking Now</Text>
          </TouchableOpacity>
        </View>

        {/* Modal Booking */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          {/* Overlay untuk menangkap tap di luar */}
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => setVisible(false)}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>

            {/* Konten modal */}
            <SafeAreaView style={styles.containerModal}>
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <Text style={styles.titleContainer}>Booking</Text>

                {/* Check In */}
                <TouchableOpacity style={styles.dateButton} onPress={toggleCheckIn}>
                  <Feather name="calendar" size={20} color="black" />
                  <Text style={styles.dateText}>{checkIn || 'Check In'}</Text>
                </TouchableOpacity>
                {showCheckIn && (
                  <Calendar
                    onDayPress={(day) => {
                      setCheckIn(day.dateString);
                      setShowCheckIn(false);
                    }}
                    markedDates={{ [checkIn]: { selected: true, selectedColor: '#4CAF50' } }}
                  />
                )}

                {/* Check Out */}
                <TouchableOpacity style={styles.dateButton} onPress={toggleCheckOut}>
                  <Feather name="calendar" size={20} color="black" />
                  <Text style={styles.dateText}>{checkOut || 'Check Out'}</Text>
                </TouchableOpacity>
                {showCheckOut && (
                  <Calendar
                    onDayPress={(day) => {
                      setCheckOut(day.dateString);
                      setShowCheckOut(false);
                    }}
                    markedDates={{ [checkOut]: { selected: true, selectedColor: '#4CAF50' } }}
                  />
                )}

                {/* Data Penghuni */}
                <Text style={styles.subtitleContainer}>Data Penghuni</Text>
                <View style={styles.form}>
                  <TextInput
                    readOnly={true}
                    style={styles.input}
                    placeholder="Nama Lengkap"
                    value={user?.nama || ''}
                  />
                  <TextInput
                    readOnly={true}
                    style={styles.input}
                    placeholder="Nomor HP"
                    value={user?.noHp || ''}
                  />
                  <TextInput
                    readOnly={true}
                    style={styles.input}
                    placeholder="Email"
                    value={user?.email || ''}
                  />
                </View>

                {/* Paket Harga */}
                <Text style={styles.subtitleContainer}>Paket Harga</Text>
                <View style={styles.chipContainer}>
                  {firstRoom &&
                    firstRoom.paket_harga &&
                    Object.entries(firstRoom.paket_harga)
                      .slice(0, -1)
                      .map(([key, value]) => {
                        const label = paketLabels[key] || key;
                        const isSelected = selectedPaket === key;
                        return (
                          <TouchableOpacity
                            key={key}
                            style={[
                              styles.chip,
                              { backgroundColor: isSelected ? colors.primary : '#e0e0e0' },
                            ]}
                            onPress={() => setSelectedPaket(key as keyof PaketHarga)}
                          >
                            <Text
                              style={[styles.chipText, { color: isSelected ? '#fff' : '#333' }]}
                            >
                              {label} - Rp {value.toLocaleString('id-ID')}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                </View>

                <Text style={styles.total}>
                  Total: Rp{' '}
                  {selectedPaket &&
                  firstRoom?.paket_harga?.[selectedPaket as keyof PaketHarga] !== undefined
                    ? firstRoom.paket_harga[selectedPaket as keyof PaketHarga].toLocaleString(
                        'id-ID',
                      )
                    : firstRoom?.paket_harga?.perbulan_harga?.toLocaleString('id-ID') ||
                      'Harga tidak tersedia'}
                </Text>

                <CustomButton
                  onPress={() => router.replace('/home/payment/payment')}
                  title="Booking Now"
                />
              </ScrollView>
            </SafeAreaView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerModal: {
    height: '70%',
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  facilityGridItem: {
    width: '33%',
    alignItems: 'center',
    marginBottom: 15,
  },
  facilityText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7EF',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  dateText: { marginLeft: 10, fontSize: 16 },
  form: { marginTop: 20 },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  titleContainer: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  subtitleContainer: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'left',
    marginVertical: 10,
  },
  button: {
    height: 54,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontFamily: 'Raleway',
    alignContent: 'center',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    color: '#FFFFFF',
  },
  total: { fontSize: 18, fontWeight: 'bold', marginVertical: 20 },
  cardPrice: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  cardMonth: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { height: 300 },
  mainImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 50,
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 50,
  },
  shareButton: {
    position: 'absolute',
    top: 50,
    right: 15,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 50,
  },
  infoContainer: { padding: 16 },
  subtitle: { fontSize: 14, color: '#666' },
  section: { backgroundColor: '#fff', padding: 16, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  gallery: { flexDirection: 'row' },
  galleryImage: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  map: { width: '100%', height: 200, borderRadius: 10 },
  openMapButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  openMapButtonText: { color: '#fff', fontWeight: 'bold' },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  roomImage: { width: 60, height: 60, borderRadius: 8 },
  roomDetails: { flex: 1, marginLeft: 10 },
  roomTitle: { fontWeight: 'bold' },
  roomSubtitle: { fontSize: 12, color: '#666' },
  roomPrice: { fontWeight: 'bold', color: '#0f172a' },
  floatingButtons: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default DetailApartmentScreen;
