import CustomButton from '@/components/ui/button';
import { colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { AntDesign, Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams
import React, { useEffect, useState } from 'react'; // Import useEffect
import {
  ActivityIndicator,
  Image, // Tambahkan ini untuk indikator loading
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Import model yang sudah Anda berikan
import { DetailKosData, Fasilitas, Gallery, Kamar } from '../../../models/detail_kossan';
// Import service yang sudah Anda berikan
import { BASE_URL } from '@/constants/config';
import { getKosById } from '../../../service/kossan_service';

// Data dummy untuk reviews (karena tidak ada di DetailKosData Anda)
type Review = {
  id: string;
  name: string;
  date: string;
  rating: number;
  text: string;
  profilePic: string;
};

const reviews: Review[] = [
  {
    id: '1',
    name: 'Jennifer Lucia',
    date: 'Dec 16, 2012',
    rating: 5,
    text: 'Kosnya bersih dan nyaman, fasilitas lengkap!',
    profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '2',
    name: 'Budi Santoso',
    date: 'Jan 05, 2013',
    rating: 4,
    text: 'Lokasi strategis, pemilik kos ramah.',
    profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
];

const DetailApartmentScreen: React.FC = () => {
  const { token } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>(); // Ambil ID dari URL params
  const insets = useSafeAreaInsets();

  const [kosData, setKosData] = useState<DetailKosData | null>(null);
  const [visible, setVisible] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isLoading, setIsLoading] = useState(true); // State untuk mengelola loading

  // Default coordinate jika tidak ada di data kos (sesuai model Anda)
  const DEFAULT_LATITUDE = -6.9915;
  const DEFAULT_LONGITUDE = 110.4225;

  useEffect(() => {
    if (!id) {
      console.warn('DEBUGGING: ID is missing, cannot fetch kos data.');
      setIsLoading(false); // Pastikan loading berhenti jika ID tidak ada
      return;
    }

    setIsLoading(true); // Mulai loading
    console.log('DEBUGGING: Fetching kos data for ID:', id);
    getKosById(String(id))
      .then((res) => {
        console.log('DEBUGGING: Kos data fetched successfully.');
        // console.log('DEBUGGING: Fetched Data:', JSON.stringify(res.data, null, 2)); // Log data lengkap
        setKosData(res.data); // res.data bertipe DetailKosData
      })
      .catch((err) => {
        console.error('DEBUGGING: Error fetching kos data:', err);
        // Tampilkan pesan error ke user jika perlu
      })
      .finally(() => {
        setIsLoading(false); // Selesai loading, baik sukses maupun gagal
        console.log('DEBUGGING: Fetching process finished.');
      });
  }, [id]); // Dependensi ID agar re-fetch jika ID berubah

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
      Linking.openURL(kosData.link_maps).catch((err) =>
        console.error("DEBUGGING: Couldn't open URL:", err),
      );
    } else {
      console.warn('DEBUGGING: Link maps not available.');
    }
  };

  // Tampilkan loading state
  if (isLoading) {
    console.log('DEBUGGING: Displaying loading screen.');
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Jika data sudah selesai di-fetch tapi kosData masih null (misal: ID tidak valid, atau API return null)
  if (!kosData) {
    console.log('DEBUGGING: Data fetching finished, but kosData is null. Showing "No data".');
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Tidak ada data kos ditemukan.</Text>
        <CustomButton onPress={() => router.back()} title="Kembali" />
      </SafeAreaView>
    );
  }

  // Pastikan ada kamar sebelum mengakses kamar[0]
  const hasRooms = kosData.kamar && kosData.kamar.length > 0;
  const firstRoom = hasRooms ? kosData.kamar[0] : null;

  console.log('DEBUGGING: Rendering DetailApartmentScreen with kosData:', kosData.nama);

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
                  : 'https://via.placeholder.com/300', // Gambar placeholder
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
          <Text style={styles.sectionTitle}>Fasilitas Bersama (dari kamar pertama)</Text>
          {firstRoom && firstRoom.fasilitas && firstRoom.fasilitas.length > 0 ? (
            <View style={styles.facilitiesRow}>
              {firstRoom.fasilitas.map((f: Fasilitas) => (
                <View key={f.id} style={styles.facilityItem}>
                  {/* Icon AntDesign "tago" mungkin tidak cocok untuk semua fasilitas.
                      Anda mungkin perlu mapping nama fasilitas ke icon yang sesuai.
                      Untuk saat ini, saya biarkan "tago".
                  */}
                  <AntDesign name="tagso" size={24} color="#999" />
                  <Text style={styles.facilityText}>{f.nama}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ color: '#666' }}>Tidak ada fasilitas tersedia.</Text>
          )}
          {/* Tombol "See more" dari UI dummy, bisa diimplementasikan jika ada daftar fasilitas lengkap */}
          {/* <TouchableOpacity style={styles.seeMoreButton}>
            <Text style={styles.seeMoreText}>See more</Text>
          </TouchableOpacity> */}
        </View>

        {/* Map */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lokasi</Text>
          <MapView
            style={styles.map}
            // Menggunakan koordinat default karena model tidak menyertakan lat/lng langsung
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
          {kosData.link_maps ? (
            <TouchableOpacity style={styles.openMapButton} onPress={openGoogleMaps}>
              <Text style={styles.openMapButtonText}>Buka di Google Maps</Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ marginTop: 10, color: '#666' }}>Link Google Maps tidak tersedia.</Text>
          )}
        </View>

        {/* Rooms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pilih kamar tersedia</Text>
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

        {/* Reviews (Menggunakan data dummy karena tidak ada di model DetailKosData Anda) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ulasan</Text>
          {reviews.map((review: Review) => (
            <View key={review.id} style={styles.reviewItem}>
              <Image source={{ uri: review.profilePic }} style={styles.profilePic} />
              <View style={styles.reviewContent}>
                <Text style={styles.reviewerName}>{review.name}</Text>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
              <Text style={styles.rating}>{`${review.rating} ⭐`}</Text>
            </View>
          ))}
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
            disabled={!hasRooms || !firstRoom?.paket_harga?.perbulan_harga} // Disable jika tidak ada harga
          >
            <Text style={styles.buttonText}>Booking Now</Text>
          </TouchableOpacity>
        </View>

        {/* Modal Booking */}
        <Modal
          visible={visible}
          transparent
          animationType="slide"
          onRequestClose={() => setVisible(false)}
        >
          <View style={styles.overlay}>
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPressOut={() => setVisible(false)}
            />
            <SafeAreaView style={styles.containerModal}>
              <Text style={styles.titleContainer}>Booking</Text>
              {/* Check In */}
              <TouchableOpacity style={styles.dateButton} onPress={toggleCheckIn}>
                <Feather name="calendar" size={20} color="black" />
                <Text style={styles.dateText}>{checkIn ? checkIn : 'Check In'}</Text>
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
                <Text style={styles.dateText}>{checkOut ? checkOut : 'Check Out'}</Text>
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

              {/* Data Penghuni (menggunakan nilai default dari UI dummy Anda) */}
              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="Nama Lengkap"
                  value="Muhammad Syahputra"
                />
                <TextInput style={styles.input} placeholder="Nomor HP" value="08222324xxx" />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value="muhammadsyahputra@gmail.com"
                />
              </View>

              <Text style={styles.total}>
                Total: Rp
                {firstRoom && firstRoom.paket_harga?.perbulan_harga
                  ? firstRoom.paket_harga.perbulan_harga.toLocaleString('id-ID')
                  : 'Harga tidak tersedia'}
              </Text>

              <CustomButton
                onPress={() => router.replace('/home/payment/payment')}
                title="Booking Now"
              />
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
    borderTopLeftRadius: 20, // biar ada efek bottom sheet
    borderTopRightRadius: 20,
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
  total: { fontSize: 18, fontWeight: 'bold', marginVertical: 20 },
  confirmButton: {
    backgroundColor: '#0B6E4F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  bottomSheet: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  titleContainer: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  subtitle: { fontSize: 14, color: '#666' },
  section: { backgroundColor: '#fff', padding: 16, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  gallery: { flexDirection: 'row' },
  galleryImage: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  facilitiesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  facilityItem: { alignItems: 'center' },
  facilityText: { fontSize: 12, marginTop: 5, color: '#666' },
  seeMoreButton: { alignSelf: 'flex-start', marginTop: 10 },
  seeMoreText: { color: 'blue', fontSize: 14 },
  map: { width: '100%', height: 200, borderRadius: 10 },
  openMapButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  openMapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
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
  roomTitle: { fontSize: 16, fontWeight: 'bold' },
  roomSubtitle: { fontSize: 12, color: '#666' },
  roomPrice: { fontSize: 16, fontWeight: 'bold', color: 'green' },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profilePic: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  reviewContent: { flex: 1 },
  reviewerName: { fontWeight: 'bold' },
  reviewText: { fontSize: 14, color: '#333', marginTop: 5 },
  rating: { fontWeight: 'bold', color: 'orange' },
  floatingButtons: {
    width: '100%',
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default DetailApartmentScreen;
