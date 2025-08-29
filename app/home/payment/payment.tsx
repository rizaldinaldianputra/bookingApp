import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PaymentScreen() {
  const router = useRouter();
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [successVisible, setSuccessVisible] = useState(false);

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

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pembayaran</Text>
        {/* spacer biar title tetap di tengah */}
        <View style={{ width: 24 }} />
      </View>

      {/* Info Properti */}
      <View style={styles.propertyCard}>
        <Image
          source={{ uri: 'https://via.placeholder.com/80x80.png' }}
          style={styles.propertyImage}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.propertyName}>Gunung Pati Hills</Text>
          <Text style={styles.propertyAddress}>Jl. Seduduk, Karol Semarang</Text>
          <Text style={styles.propertyDate}>19 October 2025 - 19 November 2025</Text>
        </View>
      </View>

      {/* Rincian Pembayaran */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rincian Pembayaran</Text>
        <View style={styles.row}>
          <Text>Total 1 bulan</Text>
          <Text style={styles.bold}>Rp1.200.000,-</Text>
        </View>
        <View style={styles.row}>
          <Text>Fee</Text>
          <Text style={styles.bold}>Rp10.000,-</Text>
        </View>
      </View>

      {/* Pembayaran Transfer */}
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

      {/* Form Upload */}
      <View style={styles.section}>
        <Text>Upload Bukti Transfer</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {proofImage ? (
            <Image
              source={{ uri: proofImage }}
              style={{ width: '100%', height: 200, borderRadius: 8 }}
            />
          ) : (
            <Text style={{ color: '#999' }}>Browse a file ...</Text>
          )}
        </TouchableOpacity>

        <Text style={{ marginTop: 15 }}>Asal Bank</Text>
        <TextInput style={styles.input} placeholder="Please type here ..." />

        <Text style={{ marginTop: 15 }}>Nama Pengirim</Text>
        <TextInput style={styles.input} placeholder="Please type here ..." />
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => setSuccessVisible(true)}>
        <Text style={styles.buttonText}>Sudah Bayar</Text>
      </TouchableOpacity>

      {/* Modal Success */}
      <Modal
        visible={successVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Icon centang */}
            <View style={styles.circle}>
              <Feather name="check" size={40} color="white" />
            </View>

            {/* Text */}
            <Text style={styles.modalTitle}>Pembayaran Berhasil</Text>
            <Text style={styles.modalDesc}>
              Selamat pembayaran kamu telah berhasil dilakukan, kami akan pengecekan terlebih dahulu
            </Text>

            {/* Button status */}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
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

  uploadBox: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#0B6E4F',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 100,
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
