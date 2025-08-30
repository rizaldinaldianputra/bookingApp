import CustomButton from '@/components/ui/button';
import { colors } from '@/constants/colors';
import { AntDesign, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
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
import { Calendar } from 'react-native-calendars';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Tipe data
type RoomOption = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  image: string;
};

type Review = {
  id: string;
  name: string;
  date: string;
  rating: number;
  text: string;
  profilePic: string;
};

// Data dummy
const roomOptions: RoomOption[] = [
  {
    id: '1',
    title: 'Gunung Pati Hills',
    subtitle: '1 Bedroom',
    price: 'Rp 500.000',
    image: 'https://picsum.photos/200/300?random=1',
  },
  {
    id: '2',
    title: 'Simpang Lima Apart',
    subtitle: '2 Bedroom',
    price: 'Rp 700.000',
    image: 'https://picsum.photos/200/300?random=2',
  },
  {
    id: '3',
    title: 'Village BSB',
    subtitle: '1 Bedroom',
    price: 'Rp 700.000',
    image: 'https://picsum.photos/200/300?random=3',
  },
];

const reviews: Review[] = [
  {
    id: '1',
    name: 'Jennifer Lucia',
    date: 'Dec 16, 2012',
    rating: 5,
    text: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
    profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '2',
    name: 'Jennifer Lucia',
    date: 'Dec 12, 2012',
    rating: 5,
    text: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
    profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
];

const DetailApartmentScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const toggleCheckIn = () => {
    setShowCheckIn(!showCheckIn);
    setShowCheckOut(false);
  };

  const toggleCheckOut = () => {
    setShowCheckOut(!showCheckOut);
    setShowCheckIn(false);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://picsum.photos/200/300?random=10' }}
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

        {/* Info Apartemen */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Hilux Village Asri Tower II Orchard 2BR</Text>
          <Text style={styles.subtitle}>A SedayuCity, barat Semarang</Text>
        </View>

        {/* Gallery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
            <Image
              source={{ uri: 'https://picsum.photos/200/300?random=2' }}
              style={styles.galleryImage}
            />
            <Image
              source={{ uri: 'https://picsum.photos/200/300?random=1' }}
              style={styles.galleryImage}
            />
            <Image
              source={{ uri: 'https://picsum.photos/200/300?random=3' }}
              style={styles.galleryImage}
            />
            <Image
              source={{ uri: 'https://picsum.photos/200/300?random=5' }}
              style={styles.galleryImage}
            />
            <Image
              source={{ uri: 'https://picsum.photos/200/300?random=9' }}
              style={styles.galleryImage}
            />
          </ScrollView>
        </View>

        {/* Fasilitas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fasilitas Bersama</Text>
          <View style={styles.facilitiesRow}>
            {['Kolam', 'Laundry', 'Wi-fi', 'Dapur'].map((f, idx) => (
              <View key={idx} style={styles.facilityItem}>
                <AntDesign name="tago" size={24} color="#999" />
                <Text style={styles.facilityText}>{f}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.seeMoreButton}>
            <Text style={styles.seeMoreText}>See more</Text>
          </TouchableOpacity>
        </View>

        {/* Map */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lokasi</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: -6.9915,
              longitude: 110.4225,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{ latitude: -6.9915, longitude: 110.4225 }}
              title="Hilux Village"
              description="Lokasi Apartemen"
            />
          </MapView>
        </View>

        {/* Rooms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pilih kamar tersedia</Text>
          {roomOptions.map((room) => (
            <View key={room.id} style={styles.roomItem}>
              <Image source={{ uri: room.image }} style={styles.roomImage} />
              <View style={styles.roomDetails}>
                <Text style={styles.roomTitle}>{room.title}</Text>
                <Text style={styles.roomSubtitle}>{room.subtitle}</Text>
              </View>
              <Text style={styles.roomPrice}>{room.price}</Text>
            </View>
          ))}
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ulasan</Text>
          {reviews.map((review) => (
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
        {/* Floating Buttons */}
        <View style={[styles.floatingButtons, { bottom: insets.bottom }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.cardPrice}>Rp.500.000/</Text>
            <Text style={styles.cardMonth}>Bulan</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
            <Text style={styles.buttonText}>Booking now</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Dialog */}
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
                  markedDates={{
                    [checkIn]: { selected: true, selectedColor: '#4CAF50' },
                  }}
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
                  markedDates={{
                    [checkOut]: { selected: true, selectedColor: '#4CAF50' },
                  }}
                />
              )}

              {/* Data Penghuni */}
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

              {/* Total */}
              <Text style={styles.total}>Total: Rp5.000.000,-</Text>

              {/* Konfirmasi */}
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
    width: 101,
    height: 19,
    fontFamily: 'Raleway',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 16,
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
