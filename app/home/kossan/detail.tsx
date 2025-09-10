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
  Alert, // Pastikan ini diimpor
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

  // State baru untuk kamar yang dipilih
  const [selectedRoom, setSelectedRoom] = useState<Kamar | null>(null);

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
      .then((res) => {
        setKosData(res.data);
        // Set kamar pertama sebagai default yang dipilih jika ada
        if (res.data.kamar && res.data.kamar.length > 0) {
          setSelectedRoom(res.data.kamar[0]);
        }
      })
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

  const getAvailabilityRange = () => {
    if (
      !selectedRoom?.paket_harga?.ketersediaan ||
      selectedRoom.paket_harga.ketersediaan.length === 0
    ) {
      return { min: '', max: '' };
    }

    // Menggabungkan semua rentang ketersediaan untuk mendapatkan min dan max global
    let overallMinDate = new Date('2099-12-31'); // Tanggal jauh di masa depan
    let overallMaxDate = new Date('2000-01-01'); // Tanggal jauh di masa lalu

    selectedRoom.paket_harga.ketersediaan.forEach((availability) => {
      const start = new Date(availability.start_date);
      const end = new Date(availability.end_date);

      if (start < overallMinDate) {
        overallMinDate = start;
      }
      if (end > overallMaxDate) {
        overallMaxDate = end;
      }
    });

    return {
      min: overallMinDate.toISOString().split('T')[0],
      max: overallMaxDate.toISOString().split('T')[0],
    };
  };

  // Fungsi untuk memeriksa apakah tanggal berada dalam rentang ketersediaan yang valid
  const isDateAvailable = (dateString: string) => {
    if (!selectedRoom?.paket_harga?.ketersediaan) return false;
    const checkDate = new Date(dateString);
    checkDate.setHours(0, 0, 0, 0); // Normalisasi waktu

    return selectedRoom.paket_harga.ketersediaan.some((availability) => {
      const start = new Date(availability.start_date);
      start.setHours(0, 0, 0, 0); // Normalisasi waktu
      const end = new Date(availability.end_date);
      end.setHours(0, 0, 0, 0); // Normalisasi waktu
      return checkDate >= start && checkDate <= end;
    });
  };

  const getMarkedDates = () => {
    const markedDates: { [key: string]: any } = {};

    // Mark available dates for the selected room
    if (selectedRoom?.paket_harga?.ketersediaan) {
      selectedRoom.paket_harga.ketersediaan.forEach((availability) => {
        const start = new Date(availability.start_date);
        const end = new Date(availability.end_date);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateString = d.toISOString().split('T')[0];
          markedDates[dateString] = {
            ...markedDates[dateString], // Pertahankan properti lain jika sudah ada
            color: colors.primary, // Warna untuk tanggal yang tersedia
            textColor: 'white',
          };
        }
      });
    }

    // Highlight the range between check-in and check-out
    if (checkIn && checkOut) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0];
        markedDates[dateString] = {
          ...markedDates[dateString], // Pertahankan properti lain
          color: colors.primary, // Highlight color
          textColor: 'white',
          startingDay: d.toDateString() === startDate.toDateString(),
          endingDay: d.toDateString() === endDate.toDateString(),
        };
      }
    } else if (checkIn) {
      // Mark check-in if only check-in is selected
      markedDates[checkIn] = {
        ...markedDates[checkIn],
        selected: true,
        selectedColor: colors.primary, // Warna khusus untuk check-in
        textColor: 'white',
      };
    } else if (checkOut) {
      // Mark check-out if only check-out is selected
      markedDates[checkOut] = {
        ...markedDates[checkOut],
        selected: true,
        selectedColor: colors.primary, // Warna khusus untuk check-out
        textColor: 'white',
      };
    }

    return markedDates;
  };

  const { min: minDateAvailability, max: maxDateAvailability } = getAvailabilityRange();

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
  // Gunakan selectedRoom untuk detail utama
  const currentRoom = selectedRoom || (hasRooms ? kosData.kamar[0] : null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{
              uri:
                currentRoom && currentRoom.gallery && currentRoom.gallery.length > 0
                  ? BASE_URL + currentRoom.gallery[0].url
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

        {/* Gallery (mengikuti kamar yang dipilih) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
            {currentRoom && currentRoom.gallery && currentRoom.gallery.length > 0 ? (
              currentRoom.gallery.map((img: Gallery) => (
                <Image
                  key={img.id}
                  source={{ uri: BASE_URL + img.url }}
                  style={styles.galleryImage}
                />
              ))
            ) : (
              <Text style={{ color: '#666' }}>
                Tidak ada gambar galeri tersedia untuk kamar ini.
              </Text>
            )}
          </ScrollView>
        </View>

        {/* Fasilitas (mengikuti kamar yang dipilih) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fasilitas</Text>
          {currentRoom && currentRoom.fasilitas && currentRoom.fasilitas.length > 0 ? (
            <View style={styles.facilitiesGrid}>
              {currentRoom.fasilitas.map((f: Fasilitas) => (
                <View key={f.id} style={styles.facilityGridItem}>
                  <AntDesign name="tagso" size={24} color="#999" />
                  <Text style={styles.facilityText}>{f.nama}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ color: '#666' }}>Tidak ada fasilitas tersedia untuk kamar ini.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lokasi</Text>

          {kosData.link_maps && (
            <TouchableOpacity style={styles.openMapButton} onPress={openGoogleMaps}>
              <Text style={styles.openMapButtonText}>Buka di Google Maps</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Rooms (dapat dipilih) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kamar Tersedia</Text>
          {hasRooms ? (
            kosData.kamar.map((room: Kamar) => (
              <TouchableOpacity
                key={room.id}
                style={[styles.roomItem, selectedRoom?.id === room.id && styles.selectedRoomItem]}
                onPress={() => {
                  setSelectedRoom(room);
                  setSelectedPaket(null); // Reset paket harga saat kamar berubah
                  setCheckIn(''); // Reset check-in date
                  setCheckOut(''); // Reset check-out date
                }}
              >
                <Image
                  source={{
                    uri: BASE_URL + room.gallery?.[0]?.url || 'https://via.placeholder.com/100',
                  }}
                  style={styles.roomImage}
                />
                <View style={styles.roomDetails}>
                  <Text style={styles.roomTitle}>{room.nama_kamar}</Text>
                  <Text style={styles.roomSubtitle}>{room.tipe_kos}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                    {room.fasilitas && room.fasilitas.length > 0 ? (
                      room.fasilitas.map((f: Fasilitas) => (
                        <View
                          key={f.id}
                          style={{
                            backgroundColor: '#e0e0e0',
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 15,
                            marginRight: 5,
                            marginBottom: 5,
                          }}
                        >
                          <Text style={{ fontSize: 12, color: '#333' }}>{f.nama}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={{ color: '#666', fontSize: 12 }}>Tidak ada fasilitas</Text>
                    )}
                  </View>
                </View>
                <Text style={styles.roomPrice}>
                  Rp{' '}
                  {room.paket_harga?.perbulan_harga?.toLocaleString('id-ID') ||
                    'Harga tidak tersedia'}
                </Text>
              </TouchableOpacity>
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
            {currentRoom && currentRoom.paket_harga?.perbulan_harga ? (
              <>
                <Text style={styles.cardPrice}>
                  Rp {currentRoom.paket_harga.perbulan_harga.toLocaleString('id-ID')}/
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
            disabled={!hasRooms || !currentRoom?.paket_harga?.perbulan_harga}
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

                {/* Kamar yang dipilih di modal */}
                {currentRoom && (
                  <View style={styles.selectedRoomInModal}>
                    <Text style={styles.selectedRoomTitleModal}>{currentRoom.nama_kamar}</Text>
                    <Text style={styles.selectedRoomSubtitleModal}>{currentRoom.tipe_kos}</Text>
                  </View>
                )}

                {/* Check In */}
                <TouchableOpacity style={styles.dateButton} onPress={toggleCheckIn}>
                  <Feather name="calendar" size={20} color="black" />
                  <Text style={styles.dateText}>{checkIn || 'Check In'}</Text>
                </TouchableOpacity>
                {showCheckIn && (
                  <Calendar
                    onDayPress={(day) => {
                      if (isDateAvailable(day.dateString)) {
                        setCheckIn(day.dateString);
                        setShowCheckIn(false);
                        if (checkOut && new Date(day.dateString) >= new Date(checkOut)) {
                          setCheckOut(''); // Reset check-out jika check-in setelah atau sama dengan check-out
                        }
                      } else {
                        Alert.alert(
                          'Tanggal Tidak Tersedia',
                          'Pilih tanggal dalam rentang ketersediaan.',
                        );
                      }
                    }}
                    markedDates={getMarkedDates()}
                    markingType={'period'}
                    minDate={minDateAvailability || undefined}
                    maxDate={maxDateAvailability || undefined}
                    enableSwipeMonths={true}
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
                      // Pastikan tanggal check-out tidak kurang dari check-in
                      if (checkIn && new Date(day.dateString) < new Date(checkIn)) {
                        Alert.alert(
                          'Tanggal Tidak Valid',
                          'Tanggal Check Out tidak boleh sebelum Tanggal Check In.',
                        );
                        return;
                      }

                      if (isDateAvailable(day.dateString)) {
                        setCheckOut(day.dateString);
                        setShowCheckOut(false);
                      } else {
                        Alert.alert(
                          'Tanggal Tidak Tersedia',
                          'Pilih tanggal dalam rentang ketersediaan.',
                        );
                      }
                    }}
                    markedDates={getMarkedDates()}
                    markingType={'period'}
                    minDate={checkIn || minDateAvailability || undefined} // Check-out minimal setelah check-in
                    maxDate={maxDateAvailability || undefined}
                    enableSwipeMonths={true}
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

                {/* Paket Harga (mengikuti kamar yang dipilih) */}
                <Text style={styles.subtitleContainer}>Paket Harga</Text>
                <View style={styles.chipContainer}>
                  {currentRoom &&
                    currentRoom.paket_harga &&
                    Object.entries(currentRoom.paket_harga)
                      .slice(0, -1) // Exclude 'ketersediaan'
                      .map(([key, value]) => {
                        const label = paketLabels[key] || key;
                        const isSelected = selectedPaket === key;
                        if (typeof value === 'number') {
                          // Hanya tampilkan jika value adalah angka (harga)
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
                        }
                        return null;
                      })}
                </View>

                <Text style={styles.total}>
                  Total: Rp{' '}
                  {selectedPaket &&
                  currentRoom?.paket_harga?.[selectedPaket as keyof PaketHarga] !== undefined &&
                  typeof currentRoom?.paket_harga?.[selectedPaket as keyof PaketHarga] === 'number'
                    ? (
                        currentRoom.paket_harga[selectedPaket as keyof PaketHarga] as number
                      ).toLocaleString('id-ID')
                    : currentRoom?.paket_harga?.perbulan_harga?.toLocaleString('id-ID') ||
                      'Harga tidak tersedia'}
                </Text>

                <CustomButton
                  onPress={function () {
                    if (!selectedRoom || !selectedPaket || !checkIn || !checkOut) {
                      Alert.alert(
                        'Peringatan',
                        'Mohon lengkapi semua data booking (kamar, paket harga, tanggal check-in, dan check-out).',
                      );
                      return;
                    }

                    const hargaPaket =
                      currentRoom?.paket_harga?.[selectedPaket as keyof PaketHarga];

                    if (typeof hargaPaket !== 'number') {
                      Alert.alert('Peringatan', 'Harga paket tidak valid.');
                      return;
                    }

                    const bookingData = {
                      user_id: user?.id,
                      tanggal: new Date().toISOString().split('T')[0],
                      harga: hargaPaket,
                      quantity: 1,
                      start_order_date: checkIn,
                      end_order_date: checkOut,
                      kos_id: kosData.id,
                      kamar_id: selectedRoom.id,
                      // paket_id: selectedPaket,
                      paket_id: 1,
                    };
                    router.replace({
                      pathname: '/home/payment/payment',
                      params: bookingData,
                    });
                  }}
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
    backgroundColor: colors.primary,
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
    borderWidth: 1, // Tambahkan border
    borderColor: 'transparent', // Default transparan
  },
  selectedRoomItem: {
    borderColor: colors.primary, // Border warna primary jika dipilih
    backgroundColor: '#e6f7ef', // Latar belakang sedikit berbeda
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
  selectedRoomInModal: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  selectedRoomTitleModal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selectedRoomSubtitleModal: {
    fontSize: 14,
    color: '#666',
  },
});

export default DetailApartmentScreen;
