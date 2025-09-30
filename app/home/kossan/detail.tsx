import CustomButton from '@/components/ui/button';
import { colors } from '@/constants/colors';
import { BASE_URL } from '@/constants/config';
import { useAuth } from '@/context/AuthContext';
import { KamarDetail } from '@/models/detail_kamar_kossan';
import { User } from '@/models/user';
import { getUsers } from '@/service/user_service';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
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
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fasilitas, Gallery, PaketHarga } from '../../../models/detail_kossan';
import { getKosByIdByKamar } from '../../../service/kossan_service';

const DetailApartmentScreen: React.FC = () => {
  const { token } = useAuth();
  const { idKossan, idKamar } = useLocalSearchParams<{
    idKossan: string;
    idKamar: string;
  }>();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | null>(null);

  const [kosData, setKosData] = useState<KamarDetail | null>(null);
  const [selectedPaket, setSelectedPaket] = useState<string | null>(null);
  const [selectedHarga, setSelectedHarga] = useState<number | null>(null);

  const [visible, setVisible] = useState(false);
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [namaLengkap, setNamaLengkap] = useState('');
  const [email, setEmail] = useState('');
  const [noIdentitas, setNoIdentitas] = useState('');
  const [tanggalCheckIn, setTanggalCheckIn] = useState('');
  const [tanggalCheckOut, setTanggalCheckOut] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [availableRange, setAvailableRange] = useState<{ start: Date; end: Date } | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await getUsers();
        setUser(data.user);
        if (data.user) {
          setNamaLengkap(data.user.nama || '');
          setEmail(data.user.email || '');
          setNoIdentitas(data.user.email || '');
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [token]);

  const paketLabels: Record<string, string> = {
    perharian_harga: 'Harian',
    perbulan_harga: 'Bulanan',
    pertigabulan_harga: '3 Bulan',
    perenambulan_harga: '6 Bulan',
    pertahun_harga: 'Tahunan',
  };

  useEffect(() => {
    if (!idKossan || !idKamar) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getKosByIdByKamar(String(idKossan), String(idKamar))
      .then((res) => {
        setKosData(res.data);
        if (res.data.paket_harga?.perbulan_harga) {
          setSelectedPaket('perbulan_harga');
          setSelectedHarga(res.data.paket_harga.perbulan_harga);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [idKossan, idKamar]);

  // Perbaikan ketersediaan tanggal
  useEffect(() => {
    if (!kosData?.paket_harga?.ketersediaan) return;

    const dates: Date[] = [];
    kosData.paket_harga.ketersediaan.forEach((range) => {
      let current = new Date(range.start_date);
      const end = new Date(range.end_date);
      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });

    if (dates.length > 0) {
      const minDate = dates[0];
      const maxDate = dates[dates.length - 1];
      setAvailableRange({ start: minDate, end: maxDate });

      if (tanggalCheckIn && new Date(tanggalCheckIn) < minDate) setTanggalCheckIn('');
      if (tanggalCheckOut && new Date(tanggalCheckOut) > maxDate) setTanggalCheckOut('');
    }
  }, [kosData?.paket_harga?.ketersediaan]);

  const openGoogleMaps = () => {
    if (kosData?.kos.link_maps) {
      Linking.openURL(kosData.kos.link_maps).catch((err) =>
        console.error("Couldn't open URL:", err),
      );
    }
  };

  const checkAvailability = (checkIn: string, checkOut: string) => {
    if (!kosData?.paket_harga?.ketersediaan) return false;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    let available = false;
    kosData.paket_harga.ketersediaan.forEach((range) => {
      const rangeStart = new Date(range.start_date);
      const rangeEnd = new Date(range.end_date);

      if (start >= rangeStart && end <= rangeEnd) {
        available = true;
      }
    });

    setIsAvailable(available);
    return available;
  };

  const handleBooking = () => {
    if (!token) {
      router.replace('/auth/login');
    } else {
      if (
        !tanggalCheckIn ||
        !tanggalCheckOut ||
        !checkAvailability(tanggalCheckIn, tanggalCheckOut)
      ) {
        return;
      }

      const selectedPaketId = kosData?.paket_harga?.paket_id;
      const bookingData = {
        user_id: user?.id,
        tanggal: new Date().toISOString().split('T')[0],
        harga: selectedHarga,
        quantity: 1,
        start_order_date: tanggalCheckIn,
        end_order_date: tanggalCheckOut,
        kos_id: idKossan,
        kamar_id: idKamar,
        paket_id: selectedPaketId,
      };

      router.replace({
        pathname: '/home/payment/payment',
        params: {
          bookingData: JSON.stringify(bookingData),
          kosData: JSON.stringify(kosData),
          harga: JSON.stringify(selectedHarga),
        },
      });

      setVisible(false);
    }
  };

  const isFormValid =
    namaLengkap.trim() !== '' &&
    email.trim() !== '' &&
    noIdentitas.trim() !== '' &&
    tanggalCheckIn &&
    tanggalCheckOut &&
    isAvailable;

  const handleConfirmCheckIn = (date: Date) => {
    const checkInStr = date.toISOString().split('T')[0];
    setTanggalCheckIn(checkInStr);
    setShowCheckInPicker(false);
    if (tanggalCheckOut) checkAvailability(checkInStr, tanggalCheckOut);
  };

  const handleConfirmCheckOut = (date: Date) => {
    const checkOutStr = date.toISOString().split('T')[0];
    setTanggalCheckOut(checkOutStr);
    setShowCheckOutPicker(false);
    if (tanggalCheckIn) checkAvailability(tanggalCheckIn, checkOutStr);
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
        <Text>Tidak ada data kamar ditemukan.</Text>
        <CustomButton onPress={() => router.back()} title="Kembali" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{
              uri:
                kosData.gallery && kosData.gallery.length > 0
                  ? BASE_URL + kosData.gallery[0].url
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

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{kosData.nama_kamar}</Text>
          <Text style={styles.subtitle}>
            {kosData.jenis_kos} - {kosData.kos.daerah}
          </Text>
          <Text style={{ marginTop: 5 }}>
            {kosData.tipe_kos}, {kosData.lantai}
          </Text>
        </View>

        {/* Gallery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
            {kosData.gallery.length > 0 ? (
              kosData.gallery.map((img: Gallery) => (
                <Image
                  key={img.id}
                  source={{ uri: BASE_URL + img.url }}
                  style={styles.galleryImage}
                />
              ))
            ) : (
              <Text style={{ color: '#666' }}>Tidak ada gambar tersedia</Text>
            )}
          </ScrollView>
        </View>

        {/* Fasilitas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fasilitas</Text>
          <View style={styles.facilitiesGrid}>
            {kosData.fasilitas.map((f: Fasilitas) => (
              <View key={f.id} style={styles.facilityGridItem}>
                <AntDesign name="checkcircleo" size={20} color={colors.primary} />
                <Text style={styles.facilityText}>{f.nama}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Deskripsi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <RenderHtml contentWidth={400} source={{ html: kosData.deskripsi }} />
        </View>

        {/* Lokasi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lokasi</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.sectionsubTitle}>Link Google Maps:</Text>
            <TouchableOpacity onPress={openGoogleMaps}>
              <Text style={[styles.sectionsubTitleUrl, { color: 'blue' }]}>
                {kosData?.kos.link_maps}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Harga */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detail Harga</Text>
          <View style={styles.dropdownWrapper}>
            <Picker
              selectedValue={selectedPaket}
              onValueChange={(itemValue) => {
                setSelectedPaket(itemValue);
                const harga = kosData?.paket_harga?.[itemValue as keyof PaketHarga] as number;
                setSelectedHarga(harga || null);
              }}
            >
              {(Object.entries(kosData?.paket_harga || {}) as [string, unknown][])
                .filter(([k, v]) => k !== 'ketersediaan' && typeof v === 'number')
                .slice(1)
                .map(([key, value]) => (
                  <Picker.Item
                    key={key}
                    label={`${paketLabels[key] || key} - Rp ${(value as number).toLocaleString(
                      'id-ID',
                    )}`}
                    value={key}
                  />
                ))}
            </Picker>
          </View>
        </View>
        {kosData?.paket_harga?.ketersediaan && kosData.paket_harga.ketersediaan.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ketersediaan Tanggal</Text>
            {kosData.paket_harga.ketersediaan.map((k, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical: 2,
                }}
              >
                <Text style={{ fontSize: 14 }}>
                  {k.start_date} → {k.end_date}
                </Text>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="green"
                  style={{ marginRight: 6 }}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Bottom */}
      <View style={[styles.floatingButtons, { bottom: insets.bottom }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {selectedPaket ? (
            selectedHarga ? (
              <>
                <Text style={styles.cardPrice}>Rp {selectedHarga.toLocaleString('id-ID')}</Text>
                <Text style={styles.cardMonth}>/ {paketLabels[selectedPaket] || 'Paket'}</Text>
              </>
            ) : (
              <Text style={styles.cardPrice}>Harga tidak tersedia</Text>
            )
          ) : (
            <Text style={styles.cardPrice}>Tidak Tersedia, Silahkan Atur Filter</Text>
          )}
        </View>

        {selectedPaket && (
          <TouchableOpacity
            style={[styles.button, !isAvailable && { backgroundColor: 'gray' }]}
            onPress={() => {
              if (!token) {
                router.replace('/auth/login');
              } else {
                setVisible(true);
              }
            }}
            disabled={!isAvailable}
          >
            <Text style={styles.buttonText}>
              {isAvailable ? 'Booking Now' : 'Kamar Tidak Tersedia'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Dialog Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>Konfirmasi Pemesanan</Text>

            {/* Data Penghuni */}
            <View style={modalStyles.section}>
              <View style={modalStyles.sectionHeader}>
                <Text style={modalStyles.sectionTitle}>Data Penghuni</Text>
              </View>
              <View style={modalStyles.inputGroup}>
                <Text style={modalStyles.inputLabel}>Nama Lengkap</Text>
                <TextInput
                  style={modalStyles.textInput}
                  value={namaLengkap}
                  onChangeText={setNamaLengkap}
                  placeholder="Masukkan Nama Lengkap"
                />
              </View>

              <View style={modalStyles.inputGroup}>
                <Text style={modalStyles.inputLabel}>Email</Text>
                <TextInput
                  style={modalStyles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  placeholder="Masukkan Email"
                />
              </View>
              <View style={modalStyles.inputGroup}>
                <Text style={modalStyles.inputLabel}>No. Identitas</Text>
                <TextInput
                  style={modalStyles.textInput}
                  value={noIdentitas}
                  onChangeText={setNoIdentitas}
                  placeholder="Masukkan Nomor Identitas"
                />
              </View>
            </View>

            {/* Rentang Tanggal */}
            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>Rentang Tanggal</Text>
              <View style={modalStyles.datePickerContainer}>
                <TouchableOpacity
                  style={modalStyles.datePickerButton}
                  onPress={() => setShowCheckInPicker(true)}
                >
                  <Feather name="calendar" size={18} color={colors.primary} />
                  <Text style={modalStyles.datePickerText}>{tanggalCheckIn || 'Check-in'}</Text>
                </TouchableOpacity>
                <Text style={modalStyles.dateArrow}>→</Text>
                <TouchableOpacity
                  style={modalStyles.datePickerButton}
                  onPress={() => setShowCheckOutPicker(true)}
                >
                  <Feather name="calendar" size={18} color={colors.primary} />
                  <Text style={modalStyles.datePickerText}>{tanggalCheckOut || 'Check-out'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <DateTimePickerModal
              isVisible={showCheckInPicker}
              mode="date"
              onConfirm={handleConfirmCheckIn}
              onCancel={() => setShowCheckInPicker(false)}
              date={tanggalCheckIn ? new Date(tanggalCheckIn) : availableRange?.start || new Date()}
              minimumDate={availableRange?.start}
              maximumDate={availableRange?.end}
            />
            <DateTimePickerModal
              isVisible={showCheckOutPicker}
              mode="date"
              onConfirm={handleConfirmCheckOut}
              onCancel={() => setShowCheckOutPicker(false)}
              date={
                tanggalCheckOut ? new Date(tanggalCheckOut) : availableRange?.start || new Date()
              }
              minimumDate={availableRange?.start}
              maximumDate={availableRange?.end}
            />

            {/* Detail Pemesanan */}
            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>Detail Pemesanan</Text>
              <View style={modalStyles.detailRow}>
                <Text style={modalStyles.detailLabel}>Harga</Text>
                <Text style={modalStyles.detailValue}>
                  Rp {selectedHarga?.toLocaleString('id-ID')}
                </Text>
              </View>
              <View style={modalStyles.detailRow}>
                <Text style={modalStyles.detailLabel}>Durasi</Text>
                <Text style={modalStyles.detailValue}>
                  {selectedPaket ? paketLabels[selectedPaket] : '-'}
                </Text>
              </View>
            </View>

            <View style={modalStyles.buttonRow}>
              <CustomButton title="Bayar" onPress={handleBooking} disabled={!isFormValid} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: { position: 'relative', height: 300 },
  mainImage: { width: '100%', height: '100%' },
  backButton: { position: 'absolute', top: 20, left: 20 },
  favoriteButton: { position: 'absolute', top: 20, right: 60 },
  shareButton: { position: 'absolute', top: 20, right: 20 },
  infoContainer: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: '#666', marginTop: 2 },
  section: { padding: 16, backgroundColor: '#fff', marginBottom: 8 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  sectionsubTitle: { fontSize: 14 },
  sectionsubTitleUrl: { fontSize: 14, textDecorationLine: 'underline' },
  gallery: { flexDirection: 'row' },
  galleryImage: { width: 120, height: 120, marginRight: 8, borderRadius: 8 },
  facilitiesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  facilityGridItem: { width: '50%', flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  facilityText: { marginLeft: 8 },
  dropdownWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  floatingButtons: {
    position: 'absolute',
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: { fontSize: 20, fontWeight: 'bold' },
  cardMonth: { fontSize: 14, color: '#666', marginLeft: 4 },
  button: { padding: 14, backgroundColor: colors.primary, borderRadius: 21 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

const modalStyles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  section: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontWeight: 'bold', fontSize: 16 },
  editButtonText: { color: colors.primary },
  inputGroup: { marginTop: 8 },
  inputLabel: { marginBottom: 4 },
  textInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8 },
  datePickerContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
  },
  datePickerText: { marginLeft: 8 },
  dateArrow: { marginHorizontal: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  detailLabel: { fontSize: 14 },
  detailValue: { fontWeight: 'bold', fontSize: 14 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
});

export default DetailApartmentScreen;
