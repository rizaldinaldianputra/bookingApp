import CustomButton from '@/components/ui/button';
import { postTicket } from '@/service/ticket_services';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TicketForm() {
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('user_id', userId);

    if (image) {
      const fileName = image.split('/').pop() || 'photo.jpg';
      const fileType = fileName.split('.').pop();
      formData.append('image', {
        uri: image,
        name: fileName,
        type: `image/${fileType}`,
      } as any);
    }

    try {
      const res = await postTicket(formData);
      Alert.alert('Berhasil', res.message, [{ text: 'OK', onPress: () => router.back() }]);
    } catch (err: any) {
      Alert.alert('Gagal', err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Keluhan dan Saran</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Form scrollable */}
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan judul ticket"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan kategori (bug, suggestion, dsb.)"
            value={category}
            onChangeText={setCategory}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Deskripsi</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tuliskan keluhan atau saran..."
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Lampiran Gambar</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <Text style={{ color: '#888' }}>Pilih Gambar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Tombol dengan loading + disable */}
      <View style={[styles.bottomButton, { paddingBottom: insets.bottom + 10 }]}>
        {loading ? (
          <ActivityIndicator size="large" color="#0d5c42" />
        ) : (
          <CustomButton
            onPress={handleSubmit}
            title="Ajukan Ticket"
            disabled={!title || !category || !description || !image}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appBar: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  appBarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#444',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
});
