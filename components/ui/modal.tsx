import { router } from 'expo-router';
import React from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const VerificationDialog = ({ visible, setVisible }: Props) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {/* Icon */}
          <Image
            source={require('../../assets/images/verifikasi.png')}
            style={{ marginBottom: 20 }}
          />

          {/* Judul */}
          <Text style={styles.title}>Verifikasi Terkirim</Text>

          {/* Deskripsi */}
          <Text style={styles.message}>
            Silakan menunggu hasil verifikasi oleh admin, anda boleh menutup pesan ini
          </Text>

          {/* Tombol Tutup */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={function () {
              router.replace('/home/main');
              return setVisible(false);
            }}
          >
            <Text style={styles.closeText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    backgroundColor: '#0D6E4F',
    padding: 16,
    borderRadius: 50,
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 20 },
  closeButton: {
    backgroundColor: '#0D6E4F',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  closeText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default VerificationDialog;
