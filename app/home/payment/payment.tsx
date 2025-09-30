import { BASE_URL } from '@/constants/config';
import { postTransaksi } from '@/service/transaksi_service';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const bookingData = params.bookingData ? JSON.parse(params.bookingData as string) : null;
  const kosData = params.kosData ? JSON.parse(params.kosData as string) : null;
  const harga = params.harga ? JSON.parse(params.harga as string) : null;

  const [proofImage, setProofImage] = useState<string | null>(null);
  const [asalBank, setAsalBank] = useState('');
  const [namaPengirim, setNamaPengirim] = useState('');
  const [successVisible, setSuccessVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Izin akses galeri dibutuhkan!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProofImage(result.assets[0].uri);
    }
  };

  const handleSudahBayar = async () => {
    setIsLoading(true);
    try {
      const response = await postTransaksi(bookingData);
      if (response.success) {
        setSuccessVisible(true);

        // Nomor WhatsApp (format internasional tanpa tanda +)
        const phoneNumber = '6231232131';
        const message = encodeURIComponent('Halo, saya sudah melakukan pembayaran.'); // Pesan default
        const url = `https://wa.me/${phoneNumber}?text=${message}`;

        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Gagal membuka WhatsApp', 'Pastikan WhatsApp terinstal di perangkat Anda');
        }
      } else {
        Alert.alert('Transaksi gagal', response.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Terjadi kesalahan', 'Tidak dapat melakukan transaksi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingBottom: 100 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pembayaran</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.propertyCard}>
          <Image
            source={{
              uri:
                kosData.gallery && kosData.gallery.length > 0
                  ? BASE_URL + kosData.gallery[0].url
                  : 'https://via.placeholder.com/300',
            }}
            style={styles.propertyImage}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.propertyName}>{kosData.nama_kamar}</Text>
            <Text style={styles.propertyAddress}>{kosData.kos.daerah}</Text>
            <Text style={styles.propertyDate}>
              {bookingData.start_order_date} - {bookingData.end_order_date}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rincian Pembayaran</Text>
          <View style={styles.row}>
            <Text>Total</Text>
            <Text style={styles.bold}>Rp{harga},-</Text>
          </View>
          <View style={styles.row}>
            <Text>Fee</Text>
            <Text style={styles.bold}>Rp10.000,-</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pembayaran transfer</Text>
          <View style={styles.bankCard}>
            <Image
              source={{
                uri: 'https://www.bca.co.id/-/media/Feature/Card/List-Card/Tentang-BCA/Brand-Assets/Logo-BCA/Logo-BCA_Biru.png',
              }}
              style={styles.bankLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.bankName}>Bank Central Asia</Text>
              <Text style={styles.bankNumber}>12345678 a/n Haven</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Tombol tetap di bawah layar */}
      <View style={{ position: 'absolute', bottom: 20, left: 16, right: 16, paddingBottom: 20 }}>
        <TouchableOpacity style={styles.button} onPress={handleSudahBayar} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sudah Bayar</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={successVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.circle}>
              <Feather name="check" size={40} color="white" />
            </View>

            <Text style={styles.modalTitle}>Pembayaran Berhasil</Text>
            <Text style={styles.modalDesc}>
              Selamat pembayaran kamu telah berhasil dilakukan, kami akan pengecekan terlebih dahulu
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setSuccessVisible(false);
                router.push('/home/main');
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Status pesanan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginTop: 60,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },

  propertyCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  propertyImage: { width: 80, height: 80, borderRadius: 10 },
  propertyName: { fontSize: 16, fontWeight: 'bold' },
  propertyAddress: { fontSize: 12, color: '#555' },
  propertyDate: { fontSize: 12, color: '#777' },

  section: { marginBottom: 20 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  bold: { fontWeight: 'bold' },

  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  bankLogo: { width: 60, height: 40, marginRight: 15 },
  bankName: { fontWeight: 'bold' },
  bankNumber: { color: '#333' },

  button: {
    backgroundColor: '#0B6E4F',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '80%',
    alignItems: 'center',
  },
  circle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#0B6E4F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  modalDesc: { textAlign: 'center', color: '#666', marginBottom: 20 },
  modalButton: {
    backgroundColor: '#0B6E4F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
});
