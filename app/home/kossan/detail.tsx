import CustomButton from '@/components/ui/button';
import { colors } from '@/constants/colors';
import { BASE_URL } from '@/constants/config';
import { useAuth } from '@/context/AuthContext';
import { KamarDetail } from '@/models/detail_kamar_kossan';
import { User } from '@/models/user';
import { getUsers } from '@/service/user_service';
import { AntDesign, Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

        // default pilih bulanan kalau ada
        if (res.data.paket_harga?.perbulan_harga) {
          setSelectedPaket('perbulan_harga');
          setSelectedHarga(res.data.paket_harga.perbulan_harga);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [idKossan, idKamar]);

  const openGoogleMaps = () => {
    if (kosData?.kos.link_maps) {
      Linking.openURL(kosData.kos.link_maps).catch((err) =>
        console.error("Couldn't open URL:", err),
      );
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
                .slice(1) // skip index pertama
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
      </ScrollView>

      {/* Floating Bottom */}
      <View style={[styles.floatingButtons, { bottom: insets.bottom }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {selectedHarga ? (
            <>
              <Text style={styles.cardPrice}>Rp {selectedHarga.toLocaleString('id-ID')}</Text>
              <Text style={styles.cardMonth}>/ {paketLabels[selectedPaket || ''] || 'Paket'}</Text>
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
        >
          <Text style={styles.buttonText}>Booking Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 8,
  },
  header: { height: 250 },
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
  infoContainer: { padding: 16, backgroundColor: '#fff', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  section: { backgroundColor: '#fff', padding: 16, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  sectionsubTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionsubTitleUrl: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3498DB',
  },
  gallery: { flexDirection: 'row' },
  galleryImage: { width: 100, height: 100, borderRadius: 8, marginRight: 10 },
  facilitiesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  facilityGridItem: { width: '33%', alignItems: 'center', marginBottom: 15 },
  facilityText: { marginTop: 5, fontSize: 12, textAlign: 'center' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
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
  cardPrice: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  cardMonth: { fontSize: 12, fontWeight: 'bold', color: '#0f172a', marginLeft: 4 },
  button: {
    height: 50,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

export default DetailApartmentScreen;
