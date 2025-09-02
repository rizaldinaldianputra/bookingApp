import { User } from '@/models/user';
import { getUser } from '@/session/session';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

// Data with dummy network images
const promoData = [
  { id: '1', image: { uri: 'https://picsum.photos/300/150?random=11' } },
  { id: '2', image: { uri: 'https://picsum.photos/300/150?random=12' } },
];

const nearYouData = [
  {
    id: '1',
    name: 'Hilux Village',
    subTitle: 'jalan roti bakar',
    distance: '1.8 km',
    image: { uri: 'https://picsum.photos/100?random=21' },
  },
  {
    id: '2',
    name: 'Kedaton BSB',
    distance: '1.6 km',
    subTitle: 'jalan roti bakar',
    image: { uri: 'https://picsum.photos/100?random=22' },
  },
  {
    id: '3',
    name: 'Beranda',
    subTitle: 'jalan roti bakar',
    distance: '3 km',
    image: { uri: 'https://picsum.photos/100?random=23' },
  },
];

const recommendedData = [
  {
    id: '1',
    name: 'Gunung Pati Hills',
    price: 'Rp 500.000',
    details: '1 Bathroom • 3 Bed • AC • WiFi • Couple',
    image: { uri: 'https://picsum.photos/200/300?random=31' },
  },
  {
    id: '2',
    name: 'Waringin Square',
    price: 'Rp 650.000',
    details: '2 Bathroom • 4 Bed • AC • WiFi • Family',
    image: { uri: 'https://picsum.photos/200/300?random=32' },
  },
];

// Render Item for Promo section
const renderPromoItem = ({ item }: { item: (typeof promoData)[0] }) => (
  <View style={styles.promoItemContainer}>
    <Image source={item.image} style={styles.promoImage} />
  </View>
);

// Render Item for Near You section
const renderNearYouItem = ({ item }: { item: (typeof nearYouData)[0] }) => (
  <View style={styles.nearYouCard}>
    <Image source={item.image} style={styles.nearYouImage} />
    <View style={styles.distanceBadge}>
      <Text style={styles.distanceText}>{item.distance}</Text>
    </View>
    <View>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.subTitle}>{item.subTitle}</Text>
    </View>
  </View>
);

// Render Item for Recommended section
const handleCardPress = (itemId: string) => {
  router.push(`/home/product/detail`);
};

const renderRecommendedItem = ({ item }: { item: (typeof recommendedData)[0] }) => (
  <TouchableOpacity onPress={() => handleCardPress(item.id)}>
    <View style={styles.recommendedCard}>
      <Image source={item.image} style={styles.recommendedImage} />
      <View style={styles.recommendedDetails}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDetails}>{item.details}</Text>
        <Text style={styles.cardPrice}>{item.price}/Month</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// Main Component
export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    (async () => {
      const data = await getUser();
      setUser(data);
    })();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}> {user?.nama}</Text>
        <TouchableOpacity style={styles.notifButton}>
          <Icon name="notifications" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>
        Akun mu belum diaktifasi, yuk aktivasi pada menu pengaturan
      </Text>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="#1B563A" />
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Promo Section */}
      <Text style={styles.sectionTitle}>Promo</Text>
      <FlatList
        data={promoData}
        renderItem={renderPromoItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={width * 0.8 + 20}
        decelerationRate="fast"
      />

      {/* Near from you Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Near from you</Text>
        <Text style={styles.seeMore}>See more</Text>
      </View>
      <FlatList
        data={nearYouData}
        renderItem={renderNearYouItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      {/* Recommended for you Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommended for you</Text>
        <Text style={styles.seeMore}>See more</Text>
      </View>
      <FlatList
        data={recommendedData}
        renderItem={renderRecommendedItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  greeting: { fontSize: 20, fontWeight: '600' },
  notifButton: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  subtitle: { fontSize: 12, color: '#EF4444', marginBottom: 10 },
  searchContainer: { flexDirection: 'row', marginVertical: 10, alignItems: 'center' },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    marginVertical: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeMore: { fontSize: 12, color: '#0f172a' },

  // Promo Styles
  promoItemContainer: {
    width: width * 0.8,
    marginRight: 15,
  },
  promoImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    elevation: 1,
  },

  // Card Styles
  nearYouCard: {
    justifyContent: 'space-around',
    marginRight: 15,
    width: 150,
    height: 211,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
  },
  nearYouImage: { width: '100%', height: 100, borderRadius: 10 },
  distanceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  distanceText: { color: '#fff', fontSize: 10, fontWeight: '500' },
  cardTitle: { marginTop: 5, fontSize: 14, fontWeight: '600', color: '#1F2937' },
  subTitle: { fontSize: 8, fontWeight: '400', color: colors.primary },

  // Recommended Card Styles
  recommendedCard: {
    flexDirection: 'row',
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendedImage: { width: 100, height: 100, borderRadius: 10 },
  recommendedDetails: { marginLeft: 10, flex: 1 },
  cardDetails: { fontSize: 12, color: '#6B7280', marginVertical: 2 },
  cardPrice: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
});
