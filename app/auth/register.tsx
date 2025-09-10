import { register } from '@/service/auth_service';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router'; // Asumsi menggunakan expo-router
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const [nama, setNama] = useState<string>('');
  const [nik, setNik] = useState<string>('');
  const [alamat, setAlamat] = useState<string>(''); // Menggunakan 'alamat' sesuai daftar field
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [gambarktp, setGambarktp] = useState<string | null>(null); // Untuk foto KTP
  const [fotoselfie, setFotoselfie] = useState<string | null>(null); // Untuk foto Selfie

  const [loading, setLoading] = useState(false);

  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);

    // Validasi sederhana sebelum mengirim
    if (!nama || !nik || !alamat || !email || !password || !gambarktp || !fotoselfie) {
      Alert.alert('Peringatan', 'Harap lengkapi semua field dan unggah semua foto.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('nik', nik);
    formData.append('alamat', alamat);
    formData.append('status', 'active'); // Sesuaikan jika ada status lain atau jika ini adalah inputan user
    formData.append('email', email);
    formData.append('password', password);

    // Untuk gambarktp
    if (gambarktp) {
      const fileName = gambarktp.split('/').pop() || 'gambarktp.jpg';
      const fileType = fileName.split('.').pop() || 'jpg';
      formData.append('gambarktp', {
        uri: gambarktp,
        name: fileName,
        type: `image/${fileType}`,
      } as any);
    }

    // Untuk fotoselfie
    if (fotoselfie) {
      const fileName = fotoselfie.split('/').pop() || 'fotoselfie.jpg';
      const fileType = fileName.split('.').pop() || 'jpg';
      formData.append('fotoselfie', {
        uri: fotoselfie,
        name: fileName,
        type: `image/${fileType}`,
      } as any);
    }

    try {
      const res = await register(formData);
      Alert.alert('Berhasil', res.message, [{ text: 'OK', onPress: () => router.back() }]);
    } catch (err: any) {
      Alert.alert('Gagal', err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
          Alert.alert(
            'Izin Diperlukan',
            'Aplikasi membutuhkan izin kamera dan galeri untuk mengunggah foto.',
          );
        }
      }
    })();
  }, []);

  const pickImage = async (setImageFn: React.Dispatch<React.SetStateAction<string | null>>) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageFn(result.assets[0].uri);
    }
  };

  const takePhoto = async (setImageFn: React.Dispatch<React.SetStateAction<string | null>>) => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageFn(result.assets[0].uri);
    }
  };

  const handleUploadPress = (
    setImageFn: React.Dispatch<React.SetStateAction<string | null>>,
    type: string,
  ) => {
    Alert.alert('Pilih Sumber Gambar', `Dari mana Anda ingin mengambil foto ${type}?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Galeri', onPress: () => pickImage(setImageFn) },
      { text: 'Kamera', onPress: () => takePhoto(setImageFn) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}>
        <Text style={styles.signUpText}>Sign Up</Text>

        <Text style={styles.sectionTitle}>Informasi Pendaftaran</Text>

        <TextInput
          style={styles.input}
          placeholder="Nama Lengkap"
          value={nama}
          onChangeText={setNama}
        />
        <TextInput
          style={styles.input}
          placeholder="NIK (Nomor Induk Kependudukan)"
          value={nik}
          onChangeText={setNik}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Alamat Lengkap"
          value={alamat}
          onChangeText={setAlamat}
          multiline
          numberOfLines={3}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.sectionTitle}>Upload Foto</Text>

        <View style={styles.uploadContainer}>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={() => handleUploadPress(setGambarktp, 'KTP')}
          >
            {gambarktp ? (
              <Image source={{ uri: gambarktp }} style={styles.uploadedImage} />
            ) : (
              <>
                <Image source={require('../../assets/images/identitas.png')} />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.uploadBox}
            onPress={() => handleUploadPress(setFotoselfie, 'Selfie')}
          >
            {fotoselfie ? (
              <Image source={{ uri: fotoselfie }} style={styles.uploadedImage} />
            ) : (
              <>
                <Image source={require('../../assets/images/foto.png')} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Tombol fixed di bawah */}
      <View style={[styles.footerButtons, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.nextButtonText}>{loading ? 'Mengirim...' : 'Daftar'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 40 },
  scrollContent: { padding: 20 },
  signUpText: { fontSize: 28, fontWeight: '500', marginBottom: 20, color: '#000' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: '#000',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  uploadContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  uploadBox: {
    width: '48%',
    height: 120,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    overflow: 'hidden',
  },
  placeholderIcon: {
    width: 50, // Sesuaikan ukuran ikon placeholder
    height: 50, // Sesuaikan ukuran ikon placeholder
    resizeMode: 'contain',
    marginBottom: 5,
  },
  uploadText: { marginTop: 5, fontSize: 12, textAlign: 'center', color: '#555' },
  uploadedImage: { width: '100%', height: '100%', borderRadius: 9, resizeMode: 'cover' },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopColor: '#eee',
  },
  backButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    borderRadius: 50,
    width: '48%',
    alignItems: 'center',
  },
  backButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  nextButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 50,
    width: '48%',
    alignItems: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
