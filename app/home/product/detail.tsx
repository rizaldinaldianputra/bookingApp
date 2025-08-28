import { AntDesign, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
              <Text style={styles.rating}>{review.rating} ⭐</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Bottom Buttons */}
      <View style={[styles.floatingButtons, { bottom: 20 + insets.bottom }]}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#3498db' }]}>
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#2ecc71' }]}>
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  title: { fontSize: 22, fontWeight: 'bold' },
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
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default DetailApartmentScreen;
