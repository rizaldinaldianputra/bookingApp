import CustomButton from '@/components/ui/button';
import VerificationDialog from '@/components/ui/modal';
import { User } from '@/models/user';
import { getUsers } from '@/service/user_service';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ✅ AppBar Komponen Reusable
const AppBar = ({ title }: { title: string }) => {
  return (
    <View style={appBarStyles.appBar}>
      <TouchableOpacity onPress={() => router.back()} style={appBarStyles.backButton}>
        <Icon name="arrow-left" size={24} color="#a4a4a4ff" />
      </TouchableOpacity>
      <Text style={appBarStyles.appBarTitle}>{title}</Text>
      <View style={appBarStyles.rightPlaceholder} />
    </View>
  );
};

const EditProfileScreen = () => {
  const [fotoKtp, setFotoKtp] = useState<string | null>(null);
  const [fotoSelfie, setFotoSelfie] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // ✅ State kalender
  const [dob, setDob] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      try {
        const data = await getUsers();
        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const pickImage = async (setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin ditolak', 'Aplikasi memerlukan akses kamera');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil foto');
    }
  };

  const handleConfirmDate = (date: Date) => {
    setDob(date);
    setDatePickerVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <AppBar title="Edit Profile" />

          <ScrollView contentContainerStyle={styles.formContainer}>
            {/* Nama Lengkap */}
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                value={user?.nama || ''}
                editable={false}
                placeholderTextColor="#888"
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                value={user?.email || ''}
                editable={false}
                placeholderTextColor="#888"
              />
            </View>

            {/* Tanggal Lahir */}
            <View style={styles.inputGroup}>
              <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                <View pointerEvents="none">
                  <TextInput
                    style={styles.input}
                    value={dob ? moment(dob).format('DD/MM/YYYY') : ''}
                    editable={false}
                    placeholder="Pilih tanggal lahir"
                    placeholderTextColor="#888"
                  />
                </View>
                <Icon name="calendar" size={20} color="#888" style={styles.inputIcon} />
              </TouchableOpacity>
            </View>

            {/* Nomor KTP */}
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                value={user?.nik?.toString() || ''}
                editable={false}
                placeholderTextColor="#888"
              />
            </View>

            {/* Foto KTP */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Foto KTP*</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setFotoKtp)}>
                <Icon name="camera" size={20} color="#888" />
              </TouchableOpacity>
              {fotoKtp && (
                <Image
                  source={{ uri: fotoKtp }}
                  style={{
                    width: '100%',
                    height: 200,
                    marginTop: 10,
                    borderRadius: 8,
                  }}
                  resizeMode="cover"
                />
              )}
            </View>

            {/* Foto Selfie */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Foto Selfie*</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickImage(setFotoSelfie)}
              >
                <Icon name="camera" size={20} color="#888" />
              </TouchableOpacity>
              {fotoSelfie && (
                <Image
                  source={{ uri: fotoSelfie }}
                  style={{
                    width: '100%',
                    height: 200,
                    marginTop: 10,
                    borderRadius: 8,
                  }}
                  resizeMode="cover"
                />
              )}
            </View>

            {/* Alamat */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Alamat*</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline={true}
                numberOfLines={4}
                placeholder="Masukkan alamat Anda"
                placeholderTextColor="#888"
              />
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <CustomButton onPress={() => setModalVisible(true)} title="Verifikasi Data" />
          </View>
        </View>
      </KeyboardAvoidingView>

      <VerificationDialog visible={modalVisible} setVisible={setModalVisible} />

      {/* ✅ Kalender Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisible(false)}
        maximumDate={new Date()} // tidak bisa pilih tanggal di masa depan
      />
    </SafeAreaView>
  );
};

const appBarStyles = StyleSheet.create({
  appBar: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { padding: 8, marginLeft: -8 },
  appBarTitle: {
    fontFamily: 'Raleway',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 16,
    color: '#000000',
  },
  rightPlaceholder: { width: 40 },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  formContainer: { padding: 20, paddingBottom: 100 },
  inputGroup: { marginBottom: 15 },
  input: {
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  inputIcon: { position: 'absolute', right: 15, top: 15 },
  label: { fontSize: 14, color: '#555', marginBottom: 5 },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    padding: 15,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  footer: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
});

export default EditProfileScreen;
